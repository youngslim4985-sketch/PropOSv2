import {
  TenantId,
  UserRole,
  TenantOrg,
  Property,
  PropertyUnit,
  TenantProfile,
  CrmLead,
  LeaseContract,
  FinancialTransaction,
  MaintenanceTicket,
  PropertyDocument,
  DomainEvent
} from '../types';

import {
  INITIAL_TENANT_ORGS,
  INITIAL_PROPERTIES,
  INITIAL_TENANTS,
  INITIAL_LEADS,
  INITIAL_LEASES,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  INITIAL_DOCUMENTS,
  INITIAL_EVENTS
} from '../data/initialData';

const STORAGE_KEYS = {
  ACTIVE_TENANT: 'propos_active_tenant_id',
  ACTIVE_ROLE: 'propos_active_role',
  TENANTS_ORGS: 'propos_tenant_orgs',
  PROPERTIES: 'propos_properties',
  TENANTS: 'propos_tenants',
  LEADS: 'propos_leads',
  LEASES: 'propos_leases',
  TRANSACTIONS: 'propos_transactions',
  TICKETS: 'propos_tickets',
  DOCUMENTS: 'propos_documents',
  EVENTS: 'propos_events'
};

function loadStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving to localStorage key "${key}":`, e);
  }
}

export class PropOSStore {
  activeTenantId: TenantId;
  activeRole: UserRole;
  tenantOrgs: TenantOrg[];
  properties: Property[];
  tenants: TenantProfile[];
  leads: CrmLead[];
  leases: LeaseContract[];
  transactions: FinancialTransaction[];
  tickets: MaintenanceTicket[];
  documents: PropertyDocument[];
  events: DomainEvent[];

  private listeners: (() => void)[] = [];

  constructor() {
    this.activeTenantId = loadStored<TenantId>(STORAGE_KEYS.ACTIVE_TENANT, 'tenant-apex');
    this.activeRole = loadStored<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'Super Admin');
    this.tenantOrgs = loadStored<TenantOrg[]>(STORAGE_KEYS.TENANTS_ORGS, INITIAL_TENANT_ORGS);
    this.properties = loadStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    this.tenants = loadStored<TenantProfile[]>(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    this.leads = loadStored<CrmLead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    this.leases = loadStored<LeaseContract[]>(STORAGE_KEYS.LEASES, INITIAL_LEASES);
    this.transactions = loadStored<FinancialTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    this.tickets = loadStored<MaintenanceTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
    this.documents = loadStored<PropertyDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.events = loadStored<DomainEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  setActiveTenant(id: TenantId) {
    this.activeTenantId = id;
    saveStored(STORAGE_KEYS.ACTIVE_TENANT, id);
    this.notify();
  }

  setActiveRole(role: UserRole) {
    this.activeRole = role;
    saveStored(STORAGE_KEYS.ACTIVE_ROLE, role);
    this.notify();
  }

  getActiveTenantOrg(): TenantOrg {
    return this.tenantOrgs.find(t => t.id === this.activeTenantId) || this.tenantOrgs[0];
  }

  // Filter helpers by tenant
  getPropertiesByTenant(): Property[] {
    return this.properties.filter(p => p.tenantOrgId === this.activeTenantId);
  }

  getTenantsByTenant(): TenantProfile[] {
    return this.tenants.filter(t => t.tenantOrgId === this.activeTenantId);
  }

  getLeadsByTenant(): CrmLead[] {
    return this.leads.filter(l => l.tenantOrgId === this.activeTenantId);
  }

  getLeasesByTenant(): LeaseContract[] {
    return this.leases.filter(l => l.tenantOrgId === this.activeTenantId);
  }

  getTransactionsByTenant(): FinancialTransaction[] {
    return this.transactions.filter(t => t.tenantOrgId === this.activeTenantId);
  }

  getTicketsByTenant(): MaintenanceTicket[] {
    return this.tickets.filter(t => t.tenantOrgId === this.activeTenantId);
  }

  getDocumentsByTenant(): PropertyDocument[] {
    return this.documents.filter(d => d.tenantOrgId === this.activeTenantId);
  }

  getEventsByTenant(): DomainEvent[] {
    return this.events.filter(e => e.tenant_id === this.activeTenantId);
  }

  // Emit Event helper
  private emitEvent(
    eventType: DomainEvent['event_type'],
    aggregateId: string,
    payload: Record<string, any>
  ): DomainEvent {
    const event: DomainEvent = {
      event_id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      event_type: eventType,
      aggregate_id: aggregateId,
      tenant_id: this.activeTenantId,
      occurred_at: new Date().toISOString(),
      actor_id: 'usr-current-session',
      actor_role: this.activeRole,
      correlation_id: `req-${Math.random().toString(36).substring(2, 9)}`,
      schema_version: 1,
      payload
    };

    this.events = [event, ...this.events];
    saveStored(STORAGE_KEYS.EVENTS, this.events);
    return event;
  }

  // Actions
  addProperty(property: Omit<Property, 'id' | 'tenantOrgId'>) {
    const newProp: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      tenantOrgId: this.activeTenantId
    };

    this.properties = [newProp, ...this.properties];
    saveStored(STORAGE_KEYS.PROPERTIES, this.properties);

    this.emitEvent('PropertyCreated', newProp.id, {
      propertyName: newProp.name,
      address: `${newProp.address}, ${newProp.city}`,
      totalUnits: newProp.totalUnits,
      monthlyRevenue: newProp.monthlyRevenue
    });

    this.notify();
    return newProp;
  }

  addUnitToProperty(propertyId: string, unit: Omit<PropertyUnit, 'id' | 'propertyId'>) {
    const propIndex = this.properties.findIndex(p => p.id === propertyId);
    if (propIndex === -1) return;

    const prop = this.properties[propIndex];
    const newUnit: PropertyUnit = {
      ...unit,
      id: `u-${propertyId}-${unit.unitNumber}`,
      propertyId
    };

    const updatedUnits = [...prop.units, newUnit];
    const updatedProp: Property = {
      ...prop,
      units: updatedUnits,
      totalUnits: updatedUnits.length,
      occupiedUnits: updatedUnits.filter(u => u.status === 'Occupied').length
    };

    this.properties[propIndex] = updatedProp;
    saveStored(STORAGE_KEYS.PROPERTIES, this.properties);

    this.emitEvent('UnitUpdated', newUnit.id, {
      propertyId,
      unitNumber: newUnit.unitNumber,
      status: newUnit.status,
      rent: newUnit.marketRent
    });

    this.notify();
  }

  addTenantProfile(profile: Omit<TenantProfile, 'id' | 'tenantOrgId'>) {
    const newTenant: TenantProfile = {
      ...profile,
      id: `t-${Date.now()}`,
      tenantOrgId: this.activeTenantId
    };

    this.tenants = [newTenant, ...this.tenants];
    saveStored(STORAGE_KEYS.TENANTS, this.tenants);

    this.emitEvent('TenantOnboarded', newTenant.id, {
      fullName: newTenant.fullName,
      email: newTenant.email,
      propertyName: newTenant.propertyName,
      unitNumber: newTenant.unitNumber
    });

    this.notify();
    return newTenant;
  }

  addLeaseContract(lease: Omit<LeaseContract, 'id' | 'tenantOrgId' | 'leaseNumber'>) {
    const newLease: LeaseContract = {
      ...lease,
      id: `lease-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      leaseNumber: `${this.getActiveTenantOrg().code}-LSE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    };

    this.leases = [newLease, ...this.leases];
    saveStored(STORAGE_KEYS.LEASES, this.leases);

    this.emitEvent('LeaseSigned', newLease.id, {
      leaseNumber: newLease.leaseNumber,
      tenantName: newLease.tenantName,
      propertyName: newLease.propertyName,
      unitNumber: newLease.unitNumber,
      monthlyRent: newLease.monthlyRent,
      startDate: newLease.startDate,
      endDate: newLease.endDate
    });

    this.notify();
    return newLease;
  }

  addFinancialTransaction(tx: Omit<FinancialTransaction, 'id' | 'tenantOrgId' | 'transactionNumber'>) {
    const newTx: FinancialTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      transactionNumber: `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    this.transactions = [newTx, ...this.transactions];
    saveStored(STORAGE_KEYS.TRANSACTIONS, this.transactions);

    this.emitEvent('PaymentReceived', newTx.id, {
      transactionNumber: newTx.transactionNumber,
      payerOrPayee: newTx.payerOrPayee,
      amount: newTx.amount,
      category: newTx.category,
      type: newTx.type,
      status: newTx.status
    });

    this.notify();
    return newTx;
  }

  addTicket(ticket: Omit<MaintenanceTicket, 'id' | 'tenantOrgId' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      ticketNumber: `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: now,
      updatedAt: now
    };

    this.tickets = [newTicket, ...this.tickets];
    saveStored(STORAGE_KEYS.TICKETS, this.tickets);

    this.emitEvent('WorkOrderCreated', newTicket.id, {
      ticketNumber: newTicket.ticketNumber,
      propertyName: newTicket.propertyName,
      unitNumber: newTicket.unitNumber,
      priority: newTicket.priority,
      category: newTicket.category,
      title: newTicket.title
    });

    this.notify();
    return newTicket;
  }

  updateTicketStatus(ticketId: string, status: MaintenanceTicket['status'], aiSummary?: string) {
    const index = this.tickets.findIndex(t => t.id === ticketId);
    if (index === -1) return;

    const current = this.tickets[index];
    const updated: MaintenanceTicket = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
      ...(aiSummary ? { aiTriageSummary: aiSummary } : {})
    };

    this.tickets[index] = updated;
    saveStored(STORAGE_KEYS.TICKETS, this.tickets);

    this.emitEvent('WorkOrderUpdated', ticketId, {
      ticketNumber: updated.ticketNumber,
      previousStatus: current.status,
      newStatus: status,
      aiTriageSummary: aiSummary
    });

    this.notify();
  }

  addDocument(doc: Omit<PropertyDocument, 'id' | 'tenantOrgId' | 'uploadedAt'>) {
    const newDoc: PropertyDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    this.documents = [newDoc, ...this.documents];
    saveStored(STORAGE_KEYS.DOCUMENTS, this.documents);

    this.emitEvent('DocumentUploaded', newDoc.id, {
      title: newDoc.title,
      category: newDoc.category,
      propertyName: newDoc.propertyName
    });

    this.notify();
    return newDoc;
  }

  resetToDefaults() {
    localStorage.clear();
    this.activeTenantId = 'tenant-apex';
    this.activeRole = 'Super Admin';
    this.tenantOrgs = INITIAL_TENANT_ORGS;
    this.properties = INITIAL_PROPERTIES;
    this.tenants = INITIAL_TENANTS;
    this.leads = INITIAL_LEADS;
    this.leases = INITIAL_LEASES;
    this.transactions = INITIAL_TRANSACTIONS;
    this.tickets = INITIAL_TICKETS;
    this.documents = INITIAL_DOCUMENTS;
    this.events = INITIAL_EVENTS;

    saveStored(STORAGE_KEYS.ACTIVE_TENANT, this.activeTenantId);
    saveStored(STORAGE_KEYS.ACTIVE_ROLE, this.activeRole);
    saveStored(STORAGE_KEYS.TENANTS_ORGS, this.tenantOrgs);
    saveStored(STORAGE_KEYS.PROPERTIES, this.properties);
    saveStored(STORAGE_KEYS.TENANTS, this.tenants);
    saveStored(STORAGE_KEYS.LEADS, this.leads);
    saveStored(STORAGE_KEYS.LEASES, this.leases);
    saveStored(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    saveStored(STORAGE_KEYS.TICKETS, this.tickets);
    saveStored(STORAGE_KEYS.DOCUMENTS, this.documents);
    saveStored(STORAGE_KEYS.EVENTS, this.events);

    this.notify();
  }
}

export const store = new PropOSStore();
