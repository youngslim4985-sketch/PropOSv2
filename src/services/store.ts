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
  DomainEvent,
  BuyBoxStrategy,
  AcquisitionOpportunity,
  PipelineStage
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

import { INITIAL_BUY_BOXES, INITIAL_OPPORTUNITIES } from '../data/acquisitionData';
import { underwriteFinancials, calculateOpportunityScore } from '../utils/underwriter';

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
  EVENTS: 'propos_events',
  BUY_BOXES: 'propos_buy_boxes',
  OPPORTUNITIES: 'propos_opportunities'
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
  buyBoxes: BuyBoxStrategy[];
  opportunities: AcquisitionOpportunity[];

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
    this.buyBoxes = loadStored<BuyBoxStrategy[]>(STORAGE_KEYS.BUY_BOXES, INITIAL_BUY_BOXES);
    this.opportunities = loadStored<AcquisitionOpportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
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

  getBuyBoxesByTenant(): BuyBoxStrategy[] {
    return this.buyBoxes.filter(b => b.tenantOrgId === this.activeTenantId);
  }

  getOpportunitiesByTenant(): AcquisitionOpportunity[] {
    return this.opportunities.filter(o => o.tenantOrgId === this.activeTenantId);
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

  // Acquisition Actions
  addBuyBox(box: Omit<BuyBoxStrategy, 'id' | 'tenantOrgId' | 'createdAt'>) {
    const newBox: BuyBoxStrategy = {
      ...box,
      id: `bb-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.buyBoxes = [newBox, ...this.buyBoxes];
    saveStored(STORAGE_KEYS.BUY_BOXES, this.buyBoxes);

    this.emitEvent('BuyBoxUpdated', newBox.id, {
      buyBoxName: newBox.name,
      markets: newBox.markets,
      priceRange: `$${newBox.priceMin.toLocaleString()} - $${newBox.priceMax.toLocaleString()}`,
      minCapRate: newBox.minCapRate
    });

    this.notify();
    return newBox;
  }

  toggleBuyBoxActive(boxId: string) {
    const idx = this.buyBoxes.findIndex(b => b.id === boxId);
    if (idx !== -1) {
      this.buyBoxes[idx].isActive = !this.buyBoxes[idx].isActive;
      saveStored(STORAGE_KEYS.BUY_BOXES, this.buyBoxes);
      this.notify();
    }
  }

  toggleSaveOpportunity(oppId: string) {
    const idx = this.opportunities.findIndex(o => o.id === oppId);
    if (idx !== -1) {
      this.opportunities[idx].isSaved = !this.opportunities[idx].isSaved;
      saveStored(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
      this.notify();
    }
  }

  updateOpportunityPipelineStage(oppId: string, pipelineStage: PipelineStage) {
    const idx = this.opportunities.findIndex(o => o.id === oppId);
    if (idx !== -1) {
      const opp = this.opportunities[idx];
      opp.pipelineStage = pipelineStage;
      saveStored(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);

      if (pipelineStage === 'Offer Sent') {
        this.emitEvent('OfferGenerated', opp.id, {
          address: opp.address,
          listPrice: opp.listPrice,
          offerPrice: opp.underwritingInputs?.customPrice || opp.listPrice
        });
      }

      this.notify();
    }
  }

  updateOpportunityUnderwriting(
    oppId: string,
    tweaks: {
      customPrice?: number;
      customRent?: number;
      rehabCost?: number;
      downPaymentPercent?: number;
      interestRate?: number;
      loanTermYears?: number;
    }
  ) {
    const idx = this.opportunities.findIndex(o => o.id === oppId);
    if (idx === -1) return;

    const opp = this.opportunities[idx];
    const newPrice = tweaks.customPrice ?? opp.underwritingInputs?.customPrice ?? opp.listPrice;
    const newRent = tweaks.customRent ?? opp.underwritingInputs?.customRent ?? opp.estimatedRent;

    const financials = underwriteFinancials({
      listPrice: newPrice,
      estimatedValue: opp.estimatedValue,
      estimatedRent: newRent,
      bedrooms: opp.bedrooms,
      bathrooms: opp.bathrooms,
      sqft: opp.sqft,
      yearBuilt: opp.yearBuilt,
      daysOnMarket: opp.daysOnMarket,
      downPaymentPercent: tweaks.downPaymentPercent ?? opp.underwritingInputs?.downPaymentPercent ?? 25,
      interestRate: tweaks.interestRate ?? opp.underwritingInputs?.interestRate ?? 7.0,
      loanTermYears: tweaks.loanTermYears ?? opp.underwritingInputs?.loanTermYears ?? 30,
      rehabCost: tweaks.rehabCost ?? opp.underwritingInputs?.rehabCost ?? 15000
    });

    const score = calculateOpportunityScore(financials, opp.daysOnMarket, opp.yearBuilt);

    this.opportunities[idx] = {
      ...opp,
      listPrice: newPrice,
      estimatedRent: newRent,
      priceDiscountAmount: financials.priceDiscountAmount,
      priceDiscountPercent: financials.priceDiscountPercent,
      financials: {
        grossRentAnnual: financials.grossRentAnnual,
        estimatedExpensesAnnual: financials.estimatedExpensesAnnual,
        noi: financials.noi,
        capRate: financials.capRate,
        monthlyDebtService: financials.monthlyDebtService,
        monthlyCashFlow: financials.monthlyCashFlow,
        cashOnCash: financials.cashOnCash,
        equityRequired: financials.equityRequired,
        priceToRentRatio: financials.priceToRentRatio,
        dscr: financials.dscr
      },
      underwritingInputs: {
        ...opp.underwritingInputs,
        ...tweaks
      },
      opportunityScore: score
    };

    saveStored(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);

    this.emitEvent('OpportunityScored', opp.id, {
      address: opp.address,
      newScore: score.totalScore,
      classification: score.classification,
      capRate: financials.capRate,
      monthlyCashFlow: financials.monthlyCashFlow
    });

    this.notify();
  }

  runMarketScan(buyBoxId?: string) {
    // Generate a newly discovered market opportunity
    const timestamp = new Date().toISOString();
    const mockNewOpportunity: AcquisitionOpportunity = {
      id: `opp-scan-${Date.now()}`,
      tenantOrgId: this.activeTenantId,
      address: `${100 + Math.floor(Math.random() * 900)} St Charles Ave`,
      city: 'New Orleans',
      state: 'LA',
      zip: '70130',
      market: 'New Orleans, LA',
      propertyType: 'duplex',
      bedrooms: 4,
      bathrooms: 2,
      sqft: 2250,
      yearBuilt: 1995,
      daysOnMarket: 2,
      status: 'Active',
      isNewOpportunity: true,
      discoveredAt: timestamp,
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      source: 'RentCast',
      listPrice: 205000,
      estimatedValue: 245000,
      estimatedRent: 2400,
      priceDiscountAmount: 40000,
      priceDiscountPercent: 16.3,
      financials: {
        grossRentAnnual: 28800,
        estimatedExpensesAnnual: 9200,
        noi: 19600,
        capRate: 9.56,
        monthlyDebtService: 1022,
        monthlyCashFlow: 611,
        cashOnCash: 11.2,
        equityRequired: 65000,
        priceToRentRatio: 7.1,
        dscr: 1.6
      },
      opportunityScore: {
        priceDiscount: 16,
        cashFlow: 18,
        capRate: 20,
        rentPotential: 15,
        marketStrength: 8,
        propertyCondition: 8,
        daysOnMarket: 5,
        totalScore: 90,
        classification: '🔥 Exceptional',
        recommendation: 'BUY'
      },
      aiAnalysis: {
        reasonsToBuy: [
          'Freshly listed (2 days on market) in prime Uptown Corridor',
          'High cap rate 9.56% exceeds minimum Buy Box hurdle',
          '$611/mo monthly net cash flow with strong tenant demand',
          'Est. Market Value $245K provides $40K equity buffer'
        ],
        warnings: [
          'High demand item - immediate offer submission recommended'
        ],
        summary: 'Newly discovered duplex listed overnight via RentCast live feed.',
        comparables: [
          { address: '112 St Charles Ave', price: 248000, rent: 2450, sqft: 2300, distanceMiles: 0.1 }
        ]
      },
      isSaved: true,
      pipelineStage: 'New Discovered'
    };

    this.opportunities = [mockNewOpportunity, ...this.opportunities];
    saveStored(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);

    this.emitEvent('OpportunityDiscovered', mockNewOpportunity.id, {
      source: 'RentCast Scan Engine',
      address: mockNewOpportunity.address,
      score: mockNewOpportunity.opportunityScore.totalScore,
      capRate: mockNewOpportunity.financials.capRate,
      cashFlow: mockNewOpportunity.financials.monthlyCashFlow
    });

    this.notify();
    return mockNewOpportunity;
  }

  onboardPropertyFromOpportunity(opportunityId: string) {
    const opp = this.opportunities.find(o => o.id === opportunityId);
    if (!opp) return null;

    const unitCount = opp.propertyType === 'single_family' ? 1 : opp.propertyType === 'duplex' ? 2 : opp.propertyType === 'triplex' ? 3 : opp.propertyType === 'fourplex' ? 4 : 8;

    const newUnits: PropertyUnit[] = Array.from({ length: unitCount }, (_, i) => ({
      id: `u-${opp.id}-${i + 1}`,
      propertyId: `prop-acq-${opp.id}`,
      unitNumber: unitCount === 1 ? '101' : `Unit ${i + 1}`,
      type: opp.bedrooms > 2 ? '3BR' : '2BR',
      sqft: Math.round(opp.sqft / unitCount),
      marketRent: Math.round(opp.estimatedRent / unitCount),
      currentRent: Math.round(opp.estimatedRent / unitCount),
      status: 'Vacant',
      floor: 1
    }));

    const newProperty: Property = {
      id: `prop-acq-${opp.id}`,
      tenantOrgId: this.activeTenantId,
      name: `${opp.address} (${opp.propertyType.toUpperCase()})`,
      type: opp.propertyType === 'single_family' ? 'Multi-Family' : opp.propertyType === 'commercial' ? 'Commercial Office' : 'Multi-Family',
      address: opp.address,
      city: opp.city,
      state: opp.state,
      zip: opp.zip,
      totalUnits: unitCount,
      occupiedUnits: 0,
      monthlyRevenue: opp.estimatedRent,
      status: 'Active',
      yearBuilt: opp.yearBuilt,
      imageUrl: opp.imageUrl,
      managerName: 'Acquisition Operations Team',
      amenities: ['Off-Street Parking', 'Updated HVAC', 'Keyless Entry', 'Sub-metered Utilities'],
      units: newUnits
    };

    this.properties = [newProperty, ...this.properties];
    saveStored(STORAGE_KEYS.PROPERTIES, this.properties);

    // Update opportunity stage
    this.updateOpportunityPipelineStage(opportunityId, 'Acquired');

    this.emitEvent('PropertyAcquiredFromPipeline', newProperty.id, {
      opportunityId,
      propertyName: newProperty.name,
      address: `${newProperty.address}, ${newProperty.city}`,
      purchasePrice: opp.listPrice,
      underwrittenCapRate: opp.financials.capRate,
      unitsCreated: unitCount
    });

    this.notify();
    return newProperty;
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
    this.buyBoxes = INITIAL_BUY_BOXES;
    this.opportunities = INITIAL_OPPORTUNITIES;

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
    saveStored(STORAGE_KEYS.BUY_BOXES, this.buyBoxes);
    saveStored(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);

    this.notify();
  }
}

export const store = new PropOSStore();
