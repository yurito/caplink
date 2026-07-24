# Acme — Technical Test Case

[![Tests](https://img.shields.io/github/actions/workflow/status/yurito/caplink/tests.yml?branch=main&label=tests)](https://github.com/yurito/caplink/actions/workflows/tests.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/yurito/caplink/tests.yml?branch=main&label=build)](https://github.com/yurito/caplink/actions/workflows/tests.yml)
[![Lint](https://img.shields.io/github/actions/workflow/status/yurito/caplink/tests.yml?branch=main&label=lint)](https://github.com/yurito/caplink/actions/workflows/tests.yml)

Welcome to Acme — a realtime collaborative post platform built with a modern GraphQL stack.

## Overview

Acme is a fully-featured platform where users can create and edit posts with live updates across all active sessions. The application leverages a GraphQL realtime backplane with RabbitMQ for cross-replica synchronization.

## Challenge Summary

This codebase was deliberately seeded with bugs across multiple layers:

- Backend domain logic
- Dependency injection wiring
- Realtime/RabbitMQ infrastructure
- Frontend components

**Your mission:** Identify and fix all bugs, then document your findings.

## Solution Report

For a comprehensive analysis of all bugs identified and fixes applied, please refer to the detailed correction report:

👉 **[View Complete Correction Report](./docs/RELATORIO-CORRECOES.md)**

The report includes:

- Detailed bug descriptions per layer
- Root cause analysis
- Implementation of fixes
- Verification steps
- Test results
