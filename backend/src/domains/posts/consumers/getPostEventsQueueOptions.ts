export type PostEventsQueueOptions = {
  name: string
  exclusive: boolean
  autoDelete: boolean
}

// Queue options for this instance's binding to the posts.events exchange.
// An anonymous ('') exclusive auto-delete queue means every backend replica
// gets its OWN queue bound to the fanout exchange, so each replica receives a
// copy of every event (fan-out). A shared named queue would instead round-robin
// events across replicas, so clients on other replicas would miss realtime updates.
export function getPostEventsQueueOptions(): PostEventsQueueOptions {
  return { name: '', exclusive: true, autoDelete: true }
}
