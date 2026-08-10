export type TenantId = 'tenant-apex' | 'tenant-skyline' | 'tenant-harbor';

export type UserRole = 
  | 'Super Admin'
  | 'Property Manager'
  | 'Leasing Agent'
  | 'Maintenance Lead'
  | 'Financial Auditor';

export interface TenantOrg {
  id: TenantId;
  name: string;
  code: string;
  portfolioSize: number;
  plan: 'Enterprise' | 'Professional' | 'Growth';
  logoUrl?: string;
  primaryContact: string;
  email: string;
  currency: string;
}

export type PropertyType = 'Multi-Family' | 'Commercial Office' | 'Retail Plaza' | 'Industrial Park' | 'Mixed-Use';
export type PropertyStatus = 'Active' | 'Under Maintenance' | 'Acquisition' | 'In Development';

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: '1BR' | '2BR' | '3BR' | 'Studio' | 'Commercial Suite' | 'Retail Bay';
  sqft: number;
  marketRent: number;
  currentRent: number;
  status: 'Occupied' | 'Vacant' | 'Maintenance' | 'Notice Given';
  tenantId?: string;
  tenantName?: string;
  leaseEndDate?: string;
  floor: number;
}

export interface Property {
  id: string;
  tenantOrgId: TenantId;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  zip: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  status: PropertyStatus;
  yearBuilt: number;
  imageUrl: string;
  managerName: string;
  amenities: string[];
  units: PropertyUnit[];
}

export type TenantStatus = 'Active' | 'Pending Approval' | 'Past' | 'Lead';

export interface TenantProfile {
  id: string;
  tenantOrgId: TenantId;
  fullName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  moveInDate: string;
  leaseEndDate: string;
  monthlyRent: number;
  depositPaid: number;
  balance: number; // positive = credit, negative = unpaid
  status: TenantStatus;
  creditScore?: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export interface CrmLead {
  id: string;
  tenantOrgId: TenantId;
  applicantName: string;
  email: string;
  phone: string;
  desiredProperty: string;
  desiredUnitType: string;
  targetMoveIn: string;
  budgetMin: number;
  budgetMax: number;
  stage: 'New Inquiry' | 'Tour Scheduled' | 'Application Submitted' | 'Background Check' | 'Approved' | 'Lease Issued';
  createdAt: string;
  assignedAgent: string;
}

export type LeaseStatus = 'Active' | 'Pending Signature' | 'Expired' | 'Terminated' | 'Upcoming';

export interface LeaseContract {
  id: string;
  tenantOrgId: TenantId;
  leaseNumber: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentDueDateDay: number; // e.g. 1st of month
  status: LeaseStatus;
  signedDate?: string;
  autoRenew: boolean;
  petPolicy: string;
  specialTerms?: string;
  documentUrl?: string;
}

export type TransactionType = 'Rent Income' | 'Late Fee' | 'Maintenance Expense' | 'Utility Expense' | 'Management Fee' | 'Vendor Payment';
export type TransactionStatus = 'Completed' | 'Pending' | 'Overdue' | 'Failed';
export type FinancialCategory = 'Income' | 'Expense';

export interface FinancialTransaction {
  id: string;
  tenantOrgId: TenantId;
  transactionNumber: string;
  date: string;
  propertyId?: string;
  propertyName?: string;
  unitNumber?: string;
  type: TransactionType;
  category: FinancialCategory;
  amount: number;
  payerOrPayee: string;
  description: string;
  status: TransactionStatus;
  method: 'ACH Direct' | 'Credit Card' | 'Wire' | 'Check' | 'Auto-Debit';
  invoiceNumber?: string;
}

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Awaiting Parts' | 'Resolved' | 'Closed';
export type TicketCategory = 'Plumbing' | 'HVAC' | 'Electrical' | 'Structural' | 'Appliance' | 'Landscaping' | 'Security';

export interface MaintenanceTicket {
  id: string;
  tenantOrgId: TenantId;
  ticketNumber: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedVendor?: string;
  estimatedCost?: number;
  actualCost?: number;
  slaDueDate: string;
  aiTriageSummary?: string;
}

export interface PropertyDocument {
  id: string;
  tenantOrgId: TenantId;
  title: string;
  category: 'Lease Agreement' | 'Inspection Report' | 'Insurance Policy' | 'Vendor Contract' | 'Financial Audit' | 'Property Title';
  propertyId?: string;
  propertyName?: string;
  uploadedAt: string;
  fileSize: string;
  uploadedBy: string;
  summary?: string;
  extractedTerms?: {
    key: string;
    value: string;
  }[];
}

export interface DomainEvent {
  event_id: string;
  event_type: 'PropertyCreated' | 'UnitUpdated' | 'TenantOnboarded' | 'LeaseSigned' | 'PaymentReceived' | 'WorkOrderCreated' | 'WorkOrderUpdated' | 'DocumentUploaded' | 'AIOperationExecuted' | 'OpportunityDiscovered' | 'OpportunityScored' | 'BuyBoxUpdated' | 'OfferGenerated' | 'PropertyAcquiredFromPipeline';
  aggregate_id: string;
  tenant_id: TenantId;
  occurred_at: string;
  actor_id: string;
  actor_role: UserRole;
  correlation_id: string;
  schema_version: number;
  payload: Record<string, any>;
}

export type AcquisitionPropertyType = 'single_family' | 'duplex' | 'triplex' | 'fourplex' | 'commercial' | 'multi_family';
export type OpportunityClassification = '🔥 Exceptional' | '🟢 Strong Buy Candidate' | '🟡 Investigate' | '🟠 Weak' | '🔴 Pass';
export type OpportunityRecommendation = 'BUY' | 'INVESTIGATE' | 'PASS';
export type PipelineStage = 'New Discovered' | 'Under Review' | 'Offer Sent' | 'Under Contract' | 'Acquired' | 'Passed';

export interface BuyBoxStrategy {
  id: string;
  tenantOrgId: TenantId;
  name: string;
  isActive: boolean;
  markets: string[];
  propertyTypes: AcquisitionPropertyType[];
  priceMin: number;
  priceMax: number;
  bedroomsMin: number;
  bathroomsMin: number;
  minCapRate: number;
  minCashFlow: number;
  minCashOnCash: number;
  maxPriceToRentRatio: number;
  minOpportunityScore: number;
  financing: {
    downPaymentPercent: number;
    interestRate: number;
    loanTermYears: number;
    closingCostPercent: number;
    defaultRehabCost: number;
    vacancyRatePercent: number;
    managementFeePercent: number;
  };
  createdAt: string;
}

export interface OpportunityScore {
  priceDiscount: number; // max 20
  cashFlow: number; // max 20
  capRate: number; // max 20
  rentPotential: number; // max 15
  marketStrength: number; // max 10
  propertyCondition: number; // max 10
  daysOnMarket: number; // max 5
  totalScore: number; // 0-100
  classification: OpportunityClassification;
  recommendation: OpportunityRecommendation;
}

export interface AcquisitionOpportunity {
  id: string;
  tenantOrgId: TenantId;
  address: string;
  city: string;
  state: string;
  zip: string;
  market: string;
  propertyType: AcquisitionPropertyType;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  daysOnMarket: number;
  status: 'Active' | 'Pending' | 'Price Drop' | 'Under Offer';
  isNewOpportunity: boolean;
  discoveredAt: string;
  imageUrl: string;
  listingUrl?: string;
  source: 'RentCast' | 'ATTOM' | 'Public Records' | 'MLS Feed';
  listPrice: number;
  estimatedValue: number; // ARV / Market Valuation
  estimatedRent: number;
  priceDiscountAmount: number;
  priceDiscountPercent: number;
  financials: {
    grossRentAnnual: number;
    estimatedExpensesAnnual: number;
    noi: number;
    capRate: number;
    monthlyDebtService: number;
    monthlyCashFlow: number;
    cashOnCash: number;
    equityRequired: number;
    priceToRentRatio: number;
    dscr: number;
  };
  underwritingInputs?: {
    customPrice?: number;
    customRent?: number;
    rehabCost?: number;
    downPaymentPercent?: number;
    interestRate?: number;
    loanTermYears?: number;
  };
  opportunityScore: OpportunityScore;
  aiAnalysis: {
    reasonsToBuy: string[];
    warnings: string[];
    summary: string;
    comparables: {
      address: string;
      price: number;
      rent: number;
      sqft: number;
      distanceMiles: number;
    }[];
  };
  isSaved: boolean;
  pipelineStage: PipelineStage;
  userNotes?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  suggestedActions?: {
    label: string;
    actionType: 'create_notice' | 'filter_delinquency' | 'view_property' | 'triage_ticket';
    payload?: any;
  }[];
}
