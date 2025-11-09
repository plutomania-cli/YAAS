# Overview

This is a **YAAS (Young African and Successful)** agentic automation platform built on the Mastra framework. The project demonstrates how to build AI-powered workflows and agents using TypeScript, with integrations for Slack, Telegram, and various AI model providers. It showcases event-driven automations triggered by webhooks or scheduled cron jobs, with durable execution powered by Inngest.

The platform is designed to create automated workflows that can be triggered via third-party services (Slack, Telegram) or time-based events, featuring agent-based reasoning, tool execution, and multi-step workflow orchestration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Framework
- **Mastra Framework**: All-in-one TypeScript framework for building AI agents and workflows
- **Runtime**: Node.js v20.9.0+, ES2022 modules with bundler module resolution
- **Type Safety**: Full TypeScript with strict mode enabled

## AI & Agent Layer
- **Multi-Provider Model Support**: Unified interface supporting 40+ AI providers (OpenAI, Anthropic, Google, xAI, OpenRouter)
- **Agent Architecture**: Autonomous agents with LLM reasoning, tool execution, and memory management
- **Agent Networks**: Multi-agent coordination with routing agents delegating to specialized agents/workflows
- **Memory System**: Three-tier memory (working memory, conversation history, semantic recall) with thread and resource scoping

## Workflow Engine
- **Graph-Based Workflows**: Explicit step-by-step orchestration with branching, parallel execution, and conditional logic
- **Suspend/Resume**: Human-in-the-loop capabilities with workflow snapshots persisted to storage
- **Streaming Support**: Real-time incremental responses from both agents and workflows
- **Step Composition**: Agents and tools can be composed as workflow steps or called within step execution

## Durability & Execution
- **Inngest Integration**: Durable workflow execution with automatic retries and step memoization
- **Event-Driven**: Workflows triggered by webhooks (Slack, Telegram) or cron schedules
- **Snapshot System**: Complete workflow state serialization for pause/resume functionality
- **Error Handling**: Configurable retry policies at workflow and step levels

## Data & Storage
- **Storage Adapters**: Pluggable storage with support for LibSQL, PostgreSQL, Upstash Redis
- **Vector Search**: Semantic recall using vector embeddings for RAG-based memory retrieval
- **Schema Validation**: Zod schemas for input/output validation across agents, tools, and workflows

## API & Integration Layer
- **Custom API Routes**: Hono-based HTTP endpoints for webhook handlers and custom routes
- **Trigger System**: Webhook handlers for third-party connectors (Slack, Telegram, Linear example)
- **MCP Support**: Model Context Protocol integration for external tool/data sources
- **AI SDK Integration**: Compatible with Vercel AI SDK v4 (legacy) and v5

## Logging & Observability
- **Pino Logger**: Production-ready structured logging with customizable log levels
- **Mastra Logger**: Framework-level logging abstraction with debug/info/warn/error levels
- **Real-time Monitoring**: Event streaming for workflow and agent execution tracking

## Development Experience
- **Mastra Playground**: Built-in UI for testing agents and visualizing workflow graphs (separate from Replit UI)
- **Hot Reload**: Development mode with automatic refresh on code changes
- **TypeScript Tooling**: Prettier for formatting, strict type checking

## Deployment Architecture
- **Replit-Optimized**: Custom build output in `.mastra/output/` for Replit deployment
- **Static Assets**: Public HTML interface served alongside API endpoints
- **Environment Config**: Centralized .env management for API keys and service credentials

## Key Design Patterns
- **Backwards Compatibility**: Uses `generateLegacy()` and `streamLegacy()` for Replit Playground UI compatibility
- **Provider Agnostic**: No vendor lock-in - switch AI providers without code changes
- **Type-Safe Composition**: Zod schemas ensure type safety across step boundaries
- **Event-Driven Architecture**: Webhook triggers activate workflows, Inngest handles orchestration

# External Dependencies

## AI Model Providers
- **OpenAI**: GPT-4o, GPT-4o-mini models via `@ai-sdk/openai`
- **Google Gemini**: Gemini models via `@ai-sdk/google` and `@google/generative-ai`
- **OpenRouter**: Multi-provider gateway via `@openrouter/ai-sdk-provider`
- **Anthropic, xAI, others**: Accessible through Mastra's unified model router

## Workflow & Orchestration
- **Inngest**: Durable workflow execution platform (`inngest`, `@mastra/inngest`, `@inngest/realtime`)
- **Inngest CLI**: Local development and deployment tooling

## Storage & Databases
- **LibSQL**: SQLite-based storage adapter (`@mastra/libsql`)
- **PostgreSQL**: Postgres adapter with pgvector support (`@mastra/pg`, `@types/pg`)
- **Upstash**: Redis and vector storage (via `@mastra/upstash`, not in package.json but documented)

## Communication Platforms
- **Slack**: Webhook and API integration via `@slack/web-api`
- **Telegram**: Bot API integration via webhook triggers
- **WhatsApp**: Business API integration (example in docs)

## Utility & Tooling
- **Zod**: Schema validation and type inference
- **Cheerio**: HTML parsing for web scraping tools
- **Exa**: Search API integration (`exa-js`)
- **Node Fetch**: HTTP client for external API calls
- **Pino**: Production logging
- **TSX**: TypeScript execution for development
- **Prettier**: Code formatting
- **Vercel AI SDK**: Core AI primitives (`ai` package)

## Development Tools
- **Mastra CLI**: Project scaffolding and build tooling (`mastra` package)
- **TypeScript**: Type checking and compilation
- **ts-node**: TypeScript execution in Node.js

## Configuration
- **Dotenv**: Environment variable management
- All API keys and service credentials managed via `.env` file