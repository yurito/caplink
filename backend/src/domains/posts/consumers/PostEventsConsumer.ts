import amqp, { type ChannelModel } from 'amqplib'
import { pubsub } from '../../../infra/pubsub.js'
import { Post } from '../core/entities/Post.js'
import { resolveEventTopic, type PostEventType } from './resolveEventTopic.js'
import { getPostEventsQueueOptions } from './getPostEventsQueueOptions.js'

const EXCHANGE = 'posts.events'

type PostEventMessage = {
  type: PostEventType
  post: {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
  }
}

export async function startPostEventsConsumer(amqpUrl: string): Promise<void> {
  let connection: ChannelModel | undefined
  let connecting: Promise<void> | undefined

  const scheduleReconnect = (delayMs: number): void => {
    connection = undefined
    connecting = undefined
    setTimeout(() => void connect(), delayMs)
  }

  const connect = async (): Promise<void> => {
    // Single-flight: never open two connections concurrently.
    if (connecting) return connecting

    connecting = (async () => {
      // Defensively close a stale connection before opening a new one.
      if (connection) {
        const stale = connection
        connection = undefined
        await stale.close().catch(() => undefined)
      }

      const conn = await amqp.connect(amqpUrl)
      connection = conn
      const channel = await conn.createChannel()
      await channel.assertExchange(EXCHANGE, 'fanout', { durable: true })

      const { name, ...queueOptions } = getPostEventsQueueOptions()
      const { queue } = await channel.assertQueue(name, queueOptions)
      await channel.bindQueue(queue, EXCHANGE, '')

      await channel.consume(queue, (msg) => {
        if (!msg) return
        const event = JSON.parse(msg.content.toString()) as PostEventMessage
        const post = new Post({
          id: event.post.id,
          title: event.post.title,
          description: event.post.description,
          createdAt: new Date(event.post.createdAt),
          updatedAt: new Date(event.post.updatedAt),
        })
        pubsub.publish(resolveEventTopic(event.type), { post })
        channel.ack(msg)
      })

      // Reconnect on drop. Because these fire only after a successful connect,
      // the retry loop below (in catch) covers failures during connect itself.
      conn.on('close', () => scheduleReconnect(1_000))
      // 'error' is normally followed by 'close'; clearing the guard is enough here.
      conn.on('error', () => { connection = undefined })
    })()

    try {
      await connecting
    } catch {
      // A failed connect attempt must not kill the consumer: retry with backoff.
      scheduleReconnect(2_000)
    }

    return connecting
  }

  await connect()
}
