export interface GovernanceDoc {
  id: string;
  title: string;
  filename: string;
  category: 'Architecture' | 'Security' | 'Governance' | 'Roadmap' | 'ADR';
  summary: string;
  markdownContent: string;
}

export const GOVERNANCE_DOCS: GovernanceDoc[] = [
  {
    id: 'doc-arch',
    title: 'PropOS System Architecture',
    filename: 'ARCHITECTURE.md',
    category: 'Architecture',
    summary: 'Layered event-driven multi-tenant platform design specification.',
    markdownContent: `# PropOS Architecture

## Purpose
PropOS is a multi-tenant property operations platform built on the **T&F Engineering Standard**.
The architecture separates application interfaces, domain services, shared platform capabilities, persistence, and infrastructure.

## Architectural Layers

### Layer 1 — Applications
User-facing web, mobile, admin, and gateway interfaces (\`app/web\`, \`app/api\`, \`app/admin\`, \`app/gateway\`).

### Layer 2 — Domain Services
Business logic services:
- Auth, Tenants, Properties, Units, Tenants-CRM
- Leases, Contracts, Accounting, Documents
- Workflows, Notifications, Payments, AI, Search, Event-Store, Reporting

### Layer 3 — Shared Platform
Reusable utilities: Events, Validation, Auth, Types, SDK, UI tokens.

### Layer 4 — Persistence & Multi-Tenancy
- **Tenant Isolation**: Every tenant-owned resource MUST have an explicit tenant boundary (\`tenant_id\`).
- Database Row-Level Security (RLS) enforcement.

### Layer 5 — Event-Driven Core
Domain mutations emit immutable domain events (\`PropertyCreated\`, \`LeaseSigned\`, \`PaymentReceived\`, \`WorkOrderCreated\`).`
  },
  {
    id: 'doc-sec',
    title: 'Security & Data Isolation Policy',
    filename: 'SECURITY.md',
    category: 'Security',
    summary: 'Defense-in-depth security principles, tenant boundaries, and auditability.',
    markdownContent: `# PropOS Security Policy

## Core Principles
PropOS enforces defense-in-depth across Application, API, Database, and Infrastructure boundaries.

1. **Multi-Tenancy Isolation**: All database queries must enforce tenant isolation via \`tenant_id\`.
2. **Explicit Authorization**: Identity -> Tenant Membership -> Role -> Permission -> Resource Ownership.
3. **Secrets Handling**: Zero credentials in source code. Environment variables managed via secure vaults.
4. **Auditable Operations**: All security-critical events (lease signing, payment, user permission updates) emit immutable audit events.
5. **AI Guardrails**: Gemini API keys strictly reside on server routes (\`/api/ai/*\`), never exposed to browser context.`
  },
  {
    id: 'doc-adr-0001',
    title: 'ADR-0001: Layered Event-Driven Architecture',
    filename: 'docs/adr/0001-layered-event-driven.md',
    category: 'ADR',
    summary: 'Decision record adopting layered event-driven model for PropOS-v2.',
    markdownContent: `# ADR-0001: Use Layered Event-Driven Architecture

## Status
Accepted

## Context
PropOS must scale to support high-volume property management across diverse property types while maintaining strict multi-tenant boundaries and audit compliance.

## Decision
PropOS adopts a 5-layer event-driven architecture combined with an immutable Event Store.

## Consequences
- **Positive**: Strict tenant boundaries, audit compliance, decouples domain logic, testable services.
- **Related Standard**: T&F Standard Kit.`
  },
  {
    id: 'doc-roadmap',
    title: 'PropOS Strategic Roadmap',
    filename: 'ROADMAP.md',
    category: 'Roadmap',
    summary: '8-phase evolution from Foundation to Multi-Tenant AI Operations.',
    markdownContent: `# PropOS Strategic Roadmap

- [x] **Phase 0 — Foundation**: Repository blueprint & T&F Standard Kit setup.
- [x] **Phase 1 — Multi-Tenancy**: Auth, tenant switching, role permissions, event log.
- [x] **Phase 2 — Property Operations**: Multi-family & commercial property unit management, lease engine, tenant CRM.
- [x] **Phase 3 — Financial Operations**: Rent roll ledger, payment recording, automated invoices.
- [x] **Phase 4 — Workflow Engine**: Maintenance ticket triage, SLA countdowns, priority dispatch.
- [x] **Phase 5 — AI Intelligence**: Gemini 3.6 Flash server integration for lease summaries, ticket triage, operational assistant.
- [ ] **Phase 6 — Advanced Analytics**: Predictive occupancy models & automated NNN reconciliation.`
  }
];
