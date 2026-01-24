# [ADR-001] Use PostgreSQL with Drizzle ORM

## Status
Accepted | 2026-01-22

## Context and Problem Statement
We need a persistent storage solution for user sessions, project history, and tasks that supports relational data and complex queries.

## Decision Drivers
- Type safety and developer experience
- Replit native database support
- Scalability for future features
- Migration management

## Considered Options
1. PostgreSQL with Drizzle ORM
2. MongoDB (NoSQL)
3. SQLite (Local file)

## Decision Outcome
**Chosen:** PostgreSQL with Drizzle ORM

**Rationale:**
- Drizzle provides best-in-class TypeScript integration
- PostgreSQL is the native database service on Replit
- Relational structure fits user/session/project data model perfectly

## Consequences
### Positive
- Type-safe database queries
- Automatic schema synchronization with `db:push`
- High reliability and ACID compliance
### Negative
- Requires database connection management
- Schema changes require careful coordination
