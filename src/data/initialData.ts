import {
  TenantOrg,
  Property,
  TenantProfile,
  CrmLead,
  LeaseContract,
  FinancialTransaction,
  MaintenanceTicket,
  PropertyDocument,
  DomainEvent
} from '../types';

export const INITIAL_TENANT_ORGS: TenantOrg[] = [
  {
    id: 'tenant-apex',
    name: 'Apex Property Management Group',
    code: 'APEX',
    portfolioSize: 142,
    plan: 'Enterprise',
    primaryContact: 'Sarah Jenkins (VP Ops)',
    email: 'sjenkins@apexproperties.com',
    currency: '$'
  },
  {
    id: 'tenant-skyline',
    name: 'Skyline Residential Capital',
    code: 'SKYR',
    portfolioSize: 85,
    plan: 'Professional',
    primaryContact: 'Marcus Vance (Director)',
    email: 'mvance@skylineres.com',
    currency: '$'
  },
  {
    id: 'tenant-harbor',
    name: 'Harbor Commercial & Mixed Realty',
    code: 'HCMR',
    portfolioSize: 54,
    plan: 'Growth',
    primaryContact: 'Elena Rostova (Managing Director)',
    email: 'erostova@harborrealty.com',
    currency: '$'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-101',
    tenantOrgId: 'tenant-apex',
    name: 'The Grandview At Ridge',
    type: 'Multi-Family',
    address: '450 Ridgeview Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    totalUnits: 24,
    occupiedUnits: 22,
    monthlyRevenue: 52800,
    status: 'Active',
    yearBuilt: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    managerName: 'David Thorne',
    amenities: ['Rooftop Deck', 'EV Charging', 'Fitness Center', 'Pet Wash Station', 'Smart Locks'],
    units: [
      { id: 'u-101-1A', propertyId: 'prop-101', unitNumber: '101A', type: '1BR', sqft: 750, marketRent: 2100, currentRent: 2100, status: 'Occupied', tenantId: 't-101', tenantName: 'Alex Rivera', leaseEndDate: '2027-03-31', floor: 1 },
      { id: 'u-101-1B', propertyId: 'prop-101', unitNumber: '101B', type: '2BR', sqft: 1100, marketRent: 2800, currentRent: 2800, status: 'Occupied', tenantId: 't-102', tenantName: 'Samantha Chen', leaseEndDate: '2026-11-15', floor: 1 },
      { id: 'u-101-2A', propertyId: 'prop-101', unitNumber: '201A', type: '2BR', sqft: 1150, marketRent: 2950, currentRent: 0, status: 'Vacant', floor: 2 },
      { id: 'u-101-2B', propertyId: 'prop-101', unitNumber: '201B', type: '1BR', sqft: 800, marketRent: 2200, currentRent: 2200, status: 'Occupied', tenantId: 't-103', tenantName: 'Jordan Miller', leaseEndDate: '2026-09-30', floor: 2 },
      { id: 'u-101-3A', propertyId: 'prop-101', unitNumber: '301A', type: '3BR', sqft: 1450, marketRent: 3600, currentRent: 3500, status: 'Notice Given', tenantId: 't-104', tenantName: 'Liam O\'Connor', leaseEndDate: '2026-08-31', floor: 3 }
    ]
  },
  {
    id: 'prop-102',
    tenantOrgId: 'tenant-apex',
    name: 'Midtown Tech Center',
    type: 'Commercial Office',
    address: '880 Silicon Way',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    totalUnits: 12,
    occupiedUnits: 10,
    monthlyRevenue: 118000,
    status: 'Active',
    yearBuilt: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    managerName: 'Rachel Green',
    amenities: ['Fiber Internet', 'Conference Suites', 'Secure Access', 'Subterranean Parking', 'LEED Gold'],
    units: [
      { id: 'u-102-300', propertyId: 'prop-102', unitNumber: 'Suite 300', type: 'Commercial Suite', sqft: 4500, marketRent: 18000, currentRent: 18000, status: 'Occupied', tenantId: 't-201', tenantName: 'Nexus AI Systems', leaseEndDate: '2028-12-31', floor: 3 },
      { id: 'u-102-400', propertyId: 'prop-102', unitNumber: 'Suite 400', type: 'Commercial Suite', sqft: 6000, marketRent: 25000, currentRent: 24500, status: 'Occupied', tenantId: 't-202', tenantName: 'Veritas Fintech LLC', leaseEndDate: '2027-06-30', floor: 4 }
    ]
  },
  {
    id: 'prop-201',
    tenantOrgId: 'tenant-skyline',
    name: 'Skyline Park Residences',
    type: 'Multi-Family',
    address: '1200 Lakeview Terrace',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    totalUnits: 36,
    occupiedUnits: 34,
    monthlyRevenue: 78200,
    status: 'Active',
    yearBuilt: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    managerName: 'Carlos Mendez',
    amenities: ['Mountain Views', 'Heated Pool', 'Ski Storage', 'Dog Park', 'Co-Working Lounge'],
    units: [
      { id: 'u-201-101', propertyId: 'prop-201', unitNumber: 'Unit 101', type: '1BR', sqft: 780, marketRent: 2250, currentRent: 2250, status: 'Occupied', tenantId: 't-301', tenantName: 'Hannah Abbott', leaseEndDate: '2027-01-31', floor: 1 },
      { id: 'u-201-102', propertyId: 'prop-201', unitNumber: 'Unit 102', type: '2BR', sqft: 1200, marketRent: 3100, currentRent: 3100, status: 'Occupied', tenantId: 't-302', tenantName: 'Derek & Chloe Vance', leaseEndDate: '2026-10-31', floor: 1 }
    ]
  },
  {
    id: 'prop-301',
    tenantOrgId: 'tenant-harbor',
    name: 'Harbor Walk Retail Galleria',
    type: 'Retail Plaza',
    address: '700 Waterfront Dr',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    totalUnits: 10,
    occupiedUnits: 8,
    monthlyRevenue: 64000,
    status: 'Active',
    yearBuilt: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=800&q=80',
    managerName: 'Kaitlyn Wu',
    amenities: ['Waterfront Promenade', 'High Foot Traffic', 'Outdoor Seating', 'Dedicated Freight Loading'],
    units: [
      { id: 'u-301-B1', propertyId: 'prop-301', unitNumber: 'Bay 1', type: 'Retail Bay', sqft: 2200, marketRent: 8500, currentRent: 8500, status: 'Occupied', tenantId: 't-401', tenantName: 'Artisan Espresso Bar', leaseEndDate: '2029-04-30', floor: 1 }
    ]
  }
];

export const INITIAL_TENANTS: TenantProfile[] = [
  {
    id: 't-101',
    tenantOrgId: 'tenant-apex',
    fullName: 'Alex Rivera',
    email: 'arivera@example.com',
    phone: '(512) 890-1122',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '101A',
    moveInDate: '2024-04-01',
    leaseEndDate: '2027-03-31',
    monthlyRent: 2100,
    depositPaid: 2100,
    balance: 0,
    status: 'Active',
    creditScore: 780,
    emergencyContact: { name: 'Maria Rivera', phone: '(512) 890-9988', relationship: 'Mother' },
    notes: 'Prompt auto-debit payments. Requests quiet floor preference.'
  },
  {
    id: 't-102',
    tenantOrgId: 'tenant-apex',
    fullName: 'Samantha Chen',
    email: 'schen@example.com',
    phone: '(512) 766-3344',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '101B',
    moveInDate: '2023-11-15',
    leaseEndDate: '2026-11-15',
    monthlyRent: 2800,
    depositPaid: 2800,
    balance: -2800, // overdue rent
    status: 'Active',
    creditScore: 710,
    emergencyContact: { name: 'David Chen', phone: '(512) 766-0011', relationship: 'Brother' },
    notes: 'Awaiting ACH transfer confirmation for August rent.'
  },
  {
    id: 't-103',
    tenantOrgId: 'tenant-apex',
    fullName: 'Jordan Miller',
    email: 'jmiller@example.com',
    phone: '(512) 441-9087',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '201B',
    moveInDate: '2024-10-01',
    leaseEndDate: '2026-09-30',
    monthlyRent: 2200,
    depositPaid: 2200,
    balance: 0,
    status: 'Active',
    creditScore: 745,
    emergencyContact: { name: 'Patricia Miller', phone: '(512) 441-2200', relationship: 'Spouse' }
  },
  {
    id: 't-201',
    tenantOrgId: 'tenant-apex',
    fullName: 'Nexus AI Systems (Rep: Dr. Aris Thorne)',
    email: 'athorne@nexusai.io',
    phone: '(512) 990-4400',
    propertyId: 'prop-102',
    propertyName: 'Midtown Tech Center',
    unitNumber: 'Suite 300',
    moveInDate: '2023-01-01',
    leaseEndDate: '2028-12-31',
    monthlyRent: 18000,
    depositPaid: 36000,
    balance: 0,
    status: 'Active',
    creditScore: 820,
    emergencyContact: { name: 'Legal Desk', phone: '(512) 990-4401', relationship: 'Corporate Legal' },
    notes: 'Key enterprise tenant. High power draw setup approved in server room.'
  }
];

export const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'lead-01',
    tenantOrgId: 'tenant-apex',
    applicantName: 'Evelyn Taylor',
    email: 'e.taylor@techhub.com',
    phone: '(512) 332-9011',
    desiredProperty: 'The Grandview At Ridge',
    desiredUnitType: '2BR',
    targetMoveIn: '2026-09-15',
    budgetMin: 2700,
    budgetMax: 3200,
    stage: 'Application Submitted',
    createdAt: '2026-08-01',
    assignedAgent: 'Leasing Specialist - Maya Lin'
  },
  {
    id: 'lead-02',
    tenantOrgId: 'tenant-apex',
    applicantName: 'Apex Robotics Inc.',
    email: 'facilities@apexrobotics.co',
    phone: '(512) 555-0199',
    desiredProperty: 'Midtown Tech Center',
    desiredUnitType: 'Commercial Suite',
    targetMoveIn: '2026-11-01',
    budgetMin: 15000,
    budgetMax: 22000,
    stage: 'Tour Scheduled',
    createdAt: '2026-08-05',
    assignedAgent: 'Commercial Director - Marcus Vance'
  }
];

export const INITIAL_LEASES: LeaseContract[] = [
  {
    id: 'lease-801',
    tenantOrgId: 'tenant-apex',
    leaseNumber: 'APX-LSE-2024-801',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitId: 'u-101-1A',
    unitNumber: '101A',
    tenantId: 't-101',
    tenantName: 'Alex Rivera',
    startDate: '2024-04-01',
    endDate: '2027-03-31',
    monthlyRent: 2100,
    securityDeposit: 2100,
    paymentDueDateDay: 1,
    status: 'Active',
    signedDate: '2024-03-25',
    autoRenew: true,
    petPolicy: 'Allowed (1 Cat max, $300 pet deposit on file)',
    specialTerms: 'Includes assigned parking space #14 and storage locker #2.'
  },
  {
    id: 'lease-802',
    tenantOrgId: 'tenant-apex',
    leaseNumber: 'APX-LSE-2023-802',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitId: 'u-101-1B',
    unitNumber: '101B',
    tenantId: 't-102',
    tenantName: 'Samantha Chen',
    startDate: '2023-11-15',
    endDate: '2026-11-15',
    monthlyRent: 2800,
    securityDeposit: 2800,
    paymentDueDateDay: 1,
    status: 'Active',
    signedDate: '2023-11-10',
    autoRenew: false,
    petPolicy: 'No pets allowed.',
    specialTerms: 'Standard residential lease terms.'
  },
  {
    id: 'lease-901',
    tenantOrgId: 'tenant-apex',
    leaseNumber: 'APX-COM-2023-901',
    propertyId: 'prop-102',
    propertyName: 'Midtown Tech Center',
    unitId: 'u-102-300',
    unitNumber: 'Suite 300',
    tenantId: 't-201',
    tenantName: 'Nexus AI Systems',
    startDate: '2023-01-01',
    endDate: '2028-12-31',
    monthlyRent: 18000,
    securityDeposit: 36000,
    paymentDueDateDay: 1,
    status: 'Active',
    signedDate: '2022-12-15',
    autoRenew: true,
    petPolicy: 'N/A Commercial',
    specialTerms: 'NNN lease agreement with 3% annual rent escalation on anniversary.'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-501',
    tenantOrgId: 'tenant-apex',
    transactionNumber: 'TXN-2026-0801',
    date: '2026-08-01',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '101A',
    type: 'Rent Income',
    category: 'Income',
    amount: 2100,
    payerOrPayee: 'Alex Rivera',
    description: 'August 2026 Rent - Auto Debit ACH',
    status: 'Completed',
    method: 'ACH Direct',
    invoiceNumber: 'INV-2026-08-101A'
  },
  {
    id: 'tx-502',
    tenantOrgId: 'tenant-apex',
    transactionNumber: 'TXN-2026-0802',
    date: '2026-08-01',
    propertyId: 'prop-102',
    propertyName: 'Midtown Tech Center',
    unitNumber: 'Suite 300',
    type: 'Rent Income',
    category: 'Income',
    amount: 18000,
    payerOrPayee: 'Nexus AI Systems',
    description: 'August 2026 Commercial Rent Payment',
    status: 'Completed',
    method: 'Wire',
    invoiceNumber: 'INV-2026-08-300'
  },
  {
    id: 'tx-503',
    tenantOrgId: 'tenant-apex',
    transactionNumber: 'TXN-2026-0803',
    date: '2026-08-02',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '101B',
    type: 'Rent Income',
    category: 'Income',
    amount: 2800,
    payerOrPayee: 'Samantha Chen',
    description: 'August 2026 Rent Payment',
    status: 'Overdue',
    method: 'ACH Direct',
    invoiceNumber: 'INV-2026-08-101B'
  },
  {
    id: 'tx-504',
    tenantOrgId: 'tenant-apex',
    transactionNumber: 'TXN-2026-0804',
    date: '2026-08-03',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '301A',
    type: 'Maintenance Expense',
    category: 'Expense',
    amount: 450,
    payerOrPayee: 'Austin Premier Plumbing LLC',
    description: 'Emergency leak repair in unit 301A bathroom stack',
    status: 'Completed',
    method: 'Auto-Debit',
    invoiceNumber: 'VND-INV-9902'
  }
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'ticket-101',
    tenantOrgId: 'tenant-apex',
    ticketNumber: 'TKT-2026-0041',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '101B',
    tenantName: 'Samantha Chen',
    category: 'HVAC',
    priority: 'High',
    status: 'In Progress',
    title: 'AC Unit blowing lukewarm air in master bedroom',
    description: 'Resident reports temperature inside unit is 81°F despite thermostat set to 72°F. Condenser fan running continuously.',
    createdAt: '2026-08-09T14:30:00Z',
    updatedAt: '2026-08-10T09:15:00Z',
    assignedVendor: 'CoolBreeze HVAC Services',
    estimatedCost: 380,
    slaDueDate: '2026-08-10T18:00:00Z',
    aiTriageSummary: 'High priority HVAC complaint during peak summer temperatures. Recommended immediate technician dispatch to inspect R-410A refrigerant charge and capacitor.'
  },
  {
    id: 'ticket-102',
    tenantOrgId: 'tenant-apex',
    ticketNumber: 'TKT-2026-0042',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    unitNumber: '201B',
    tenantName: 'Jordan Miller',
    category: 'Plumbing',
    priority: 'Low',
    status: 'New',
    title: 'Kitchen faucet aerator slow drip',
    description: 'Minor drip when handle is fully shut. Not an emergency, but resident requests repair during next regular maintenance visit.',
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-08-10T08:00:00Z',
    slaDueDate: '2026-08-13T17:00:00Z',
    aiTriageSummary: 'Low priority minor plumbing maintenance. Recommended batching with weekly property walkthrough.'
  },
  {
    id: 'ticket-103',
    tenantOrgId: 'tenant-apex',
    ticketNumber: 'TKT-2026-0039',
    propertyId: 'prop-102',
    propertyName: 'Midtown Tech Center',
    unitNumber: 'Suite 300',
    tenantName: 'Nexus AI Systems',
    category: 'Electrical',
    priority: 'Critical',
    status: 'Assigned',
    title: 'Sub-panel breaker tripping on Server Rack Line 4',
    description: 'Facilities manager reported intermittent trip on 50A breaker. Critical impact on backup server power supply.',
    createdAt: '2026-08-10T10:12:00Z',
    updatedAt: '2026-08-10T10:20:00Z',
    assignedVendor: 'Vanguard Industrial Electric',
    estimatedCost: 1200,
    slaDueDate: '2026-08-10T14:00:00Z',
    aiTriageSummary: 'CRITICAL COMMERCIAL SLA: Electrical load trip affecting primary tenant operations. Immediate 2-hour dispatch triggered under Master Service Agreement.'
  }
];

export const INITIAL_DOCUMENTS: PropertyDocument[] = [
  {
    id: 'doc-001',
    tenantOrgId: 'tenant-apex',
    title: 'Master Residential Lease - Grandview 101A.pdf',
    category: 'Lease Agreement',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    uploadedAt: '2024-03-25',
    fileSize: '2.4 MB',
    uploadedBy: 'David Thorne (Manager)',
    summary: 'Standard 36-month lease with $2,100 monthly rent, 1 cat allowance, parking space #14 included, 60-day notice for non-renewal.',
    extractedTerms: [
      { key: 'Tenant', value: 'Alex Rivera' },
      { key: 'Monthly Rent', value: '$2,100 USD' },
      { key: 'Security Deposit', value: '$2,100 USD' },
      { key: 'Lease Term', value: 'April 1, 2024 - March 31, 2027' },
      { key: 'Late Fee Policy', value: '5% of monthly rent after 5th of the month' },
      { key: 'Pet Deposit', value: '$300 non-refundable' }
    ]
  },
  {
    id: 'doc-002',
    tenantOrgId: 'tenant-apex',
    title: 'NNN Commercial Lease - Midtown Tech Suite 300.pdf',
    category: 'Lease Agreement',
    propertyId: 'prop-102',
    propertyName: 'Midtown Tech Center',
    uploadedAt: '2022-12-15',
    fileSize: '5.1 MB',
    uploadedBy: 'Rachel Green (Commercial Dir)',
    summary: 'Triple Net (NNN) commercial lease for 4,500 sqft suite. Base rent $18,000/mo with 3% annual escalation and 2x deposit on file.',
    extractedTerms: [
      { key: 'Tenant', value: 'Nexus AI Systems' },
      { key: 'Base Rent', value: '$18,000 USD/month' },
      { key: 'Annual Escalation', value: '3% compounding annually' },
      { key: 'CAM Fees', value: 'Pro-rata share of operating expenses (28.4%)' },
      { key: 'Term', value: '60 months (Ends Dec 31, 2028)' }
    ]
  },
  {
    id: 'doc-003',
    tenantOrgId: 'tenant-apex',
    title: 'Annual Fire & Structural Safety Inspection 2026.pdf',
    category: 'Inspection Report',
    propertyId: 'prop-101',
    propertyName: 'The Grandview At Ridge',
    uploadedAt: '2026-06-12',
    fileSize: '8.7 MB',
    uploadedBy: 'City Fire Marshal Office',
    summary: 'Passed with zero major code violations. Sprinkler flow test verified at 120 PSI. Emergency egress lighting tested.'
  }
];

export const INITIAL_EVENTS: DomainEvent[] = [
  {
    event_id: 'evt-2026-0001',
    event_type: 'PropertyCreated',
    aggregate_id: 'prop-101',
    tenant_id: 'tenant-apex',
    occurred_at: '2026-08-01T08:00:00Z',
    actor_id: 'usr-admin-01',
    actor_role: 'Super Admin',
    correlation_id: 'req-init-001',
    schema_version: 1,
    payload: {
      propertyName: 'The Grandview At Ridge',
      units: 24,
      address: '450 Ridgeview Blvd, Austin TX'
    }
  },
  {
    event_id: 'evt-2026-0002',
    event_type: 'LeaseSigned',
    aggregate_id: 'lease-801',
    tenant_id: 'tenant-apex',
    occurred_at: '2026-08-01T09:30:00Z',
    actor_id: 'usr-agent-02',
    actor_role: 'Leasing Agent',
    correlation_id: 'req-lse-9912',
    schema_version: 1,
    payload: {
      tenantName: 'Alex Rivera',
      unitNumber: '101A',
      monthlyRent: 2100,
      termMonths: 36
    }
  },
  {
    event_id: 'evt-2026-0003',
    event_type: 'PaymentReceived',
    aggregate_id: 'tx-501',
    tenant_id: 'tenant-apex',
    occurred_at: '2026-08-01T10:00:00Z',
    actor_id: 'system-payment-gateway',
    actor_role: 'Financial Auditor',
    correlation_id: 'req-pay-8812',
    schema_version: 1,
    payload: {
      payer: 'Alex Rivera',
      amount: 2100,
      method: 'ACH Direct',
      invoice: 'INV-2026-08-101A'
    }
  },
  {
    event_id: 'evt-2026-0004',
    event_type: 'WorkOrderCreated',
    aggregate_id: 'ticket-101',
    tenant_id: 'tenant-apex',
    occurred_at: '2026-08-09T14:30:00Z',
    actor_id: 't-102',
    actor_role: 'Property Manager',
    correlation_id: 'req-tkt-1002',
    schema_version: 1,
    payload: {
      ticketNumber: 'TKT-2026-0041',
      category: 'HVAC',
      priority: 'High',
      title: 'AC Unit blowing lukewarm air in master bedroom'
    }
  }
];
