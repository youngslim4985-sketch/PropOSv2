import { BuyBoxStrategy, AcquisitionOpportunity } from '../types';
import { underwriteFinancials, calculateOpportunityScore } from '../utils/underwriter';

export const INITIAL_BUY_BOXES: BuyBoxStrategy[] = [
  {
    id: 'bb-nola-tf',
    tenantOrgId: 'tenant-apex',
    name: 'T&F Buy Box - New Orleans & Gulf Coast',
    isActive: true,
    markets: ['New Orleans, LA', 'Jefferson Parish, LA', 'St. Tammany Parish, LA'],
    propertyTypes: ['single_family', 'duplex', 'triplex', 'fourplex'],
    priceMin: 75000,
    priceMax: 350000,
    bedroomsMin: 3,
    bathroomsMin: 2,
    minCapRate: 7.0,
    minCashFlow: 400,
    minCashOnCash: 8.0,
    maxPriceToRentRatio: 15.0,
    minOpportunityScore: 75,
    financing: {
      downPaymentPercent: 25,
      interestRate: 7.0,
      loanTermYears: 30,
      closingCostPercent: 3,
      defaultRehabCost: 15000,
      vacancyRatePercent: 5,
      managementFeePercent: 8
    },
    createdAt: '2026-08-01'
  },
  {
    id: 'bb-sunbelt-multifamily',
    tenantOrgId: 'tenant-apex',
    name: 'Sunbelt Multifamily Value-Add Box',
    isActive: true,
    markets: ['Austin, TX', 'Dallas, TX', 'Tampa, FL', 'Memphis, TN'],
    propertyTypes: ['duplex', 'triplex', 'fourplex', 'multi_family'],
    priceMin: 150000,
    priceMax: 650000,
    bedroomsMin: 2,
    bathroomsMin: 1,
    minCapRate: 7.5,
    minCashFlow: 550,
    minCashOnCash: 9.0,
    maxPriceToRentRatio: 13.5,
    minOpportunityScore: 80,
    financing: {
      downPaymentPercent: 25,
      interestRate: 6.85,
      loanTermYears: 30,
      closingCostPercent: 3,
      defaultRehabCost: 25000,
      vacancyRatePercent: 5,
      managementFeePercent: 7
    },
    createdAt: '2026-08-05'
  }
];

const RAW_PROPERTIES = [
  {
    id: 'opp-1421-oak',
    address: '1421 Oak Street',
    city: 'New Orleans',
    state: 'LA',
    zip: '70118',
    market: 'New Orleans, LA',
    propertyType: 'single_family' as const,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1650,
    yearBuilt: 1978,
    daysOnMarket: 43,
    status: 'Active' as const,
    isNewOpportunity: true,
    discoveredAt: '2026-08-10T08:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 185000,
    estimatedValue: 225000,
    estimatedRent: 2100,
    rehabCost: 12000,
    isSaved: true,
    pipelineStage: 'New Discovered' as const,
    reasonsToBuy: [
      '18% discount below estimated market value ($225K ARV)',
      'Projected monthly cash flow of $542 exceeds $400 Buy Box hurdle',
      'Strong 8.4% cap rate in highly liquid Mid-City rental submarket',
      '43 days on market offers seller negotiation leverage'
    ],
    warnings: [
      'Property age (1978) requires HVAC inspection prior to closing',
      'Rental estimate confidence score: Medium (based on 5 local comps)'
    ],
    summary: 'Distressed estate sale in Uptown / Oak St corridor listed 18% under market value with immediate positive cashflow.',
    comparables: [
      { address: '1435 Oak St', price: 228000, rent: 2150, sqft: 1680, distanceMiles: 0.1 },
      { address: '1502 Plum St', price: 232000, rent: 2100, sqft: 1620, distanceMiles: 0.3 },
      { address: '1211 Birch St', price: 219000, rent: 2050, sqft: 1600, distanceMiles: 0.4 }
    ]
  },
  {
    id: 'opp-512-jefferson',
    address: '512 Jefferson Ave',
    city: 'New Orleans',
    state: 'LA',
    zip: '70115',
    market: 'New Orleans, LA',
    propertyType: 'single_family' as const,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2100,
    yearBuilt: 1985,
    daysOnMarket: 18,
    status: 'Active' as const,
    isNewOpportunity: true,
    discoveredAt: '2026-08-10T07:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 219000,
    estimatedValue: 248000,
    estimatedRent: 2250,
    rehabCost: 8000,
    isSaved: true,
    pipelineStage: 'Under Review' as const,
    reasonsToBuy: [
      '12% discount to estimated market value ($248K ARV)',
      'High bedroom count (4 BR) commands premium family tenant profile',
      '7.9% cap rate with $480/mo net cash flow',
      'Updated roof (2022) minimizes near-term capital expenditure'
    ],
    warnings: [
      'Property in Zone X flood plane (flood insurance ~$800/yr factored in)',
      'Active competition from 2 other local investors'
    ],
    summary: 'Turnkey 4-bedroom single family house near Magazine St with strong rental history.',
    comparables: [
      { address: '530 Jefferson Ave', price: 252000, rent: 2300, sqft: 2150, distanceMiles: 0.1 },
      { address: '419 Octavia St', price: 245000, rent: 2200, sqft: 2000, distanceMiles: 0.3 }
    ]
  },
  {
    id: 'opp-7312-canal',
    address: '7312 Canal Blvd',
    city: 'New Orleans',
    state: 'LA',
    zip: '70124',
    market: 'New Orleans, LA',
    propertyType: 'duplex' as const,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 2400,
    yearBuilt: 1992,
    daysOnMarket: 28,
    status: 'Active' as const,
    isNewOpportunity: true,
    discoveredAt: '2026-08-09T14:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 279000,
    estimatedValue: 310000,
    estimatedRent: 2750,
    rehabCost: 15000,
    isSaved: false,
    pipelineStage: 'New Discovered' as const,
    reasonsToBuy: [
      'Lakeview Duplex yielding $2,750 combined monthly gross income ($1,375/unit)',
      '10% instant equity discount ($310K market estimate)',
      '8.2% cap rate with $610/mo total net cash flow'
    ],
    warnings: [
      'Lower unit tenant lease expires in 45 days',
      'Separate electric meters installed, but gas is shared'
    ],
    summary: 'Lakeview 2-unit residential duplex with stable occupancy and unit-level upside.',
    comparables: [
      { address: '7288 Canal Blvd', price: 315000, rent: 2800, sqft: 2450, distanceMiles: 0.1 },
      { address: '7410 West End Blvd', price: 308000, rent: 2700, sqft: 2350, distanceMiles: 0.4 }
    ]
  },
  {
    id: 'opp-842-metairie',
    address: '842 Metairie Rd Duplex',
    city: 'Metairie',
    state: 'LA',
    zip: '70005',
    market: 'Jefferson Parish, LA',
    propertyType: 'duplex' as const,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    yearBuilt: 1998,
    daysOnMarket: 52,
    status: 'Active' as const,
    isNewOpportunity: false,
    discoveredAt: '2026-08-05T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 295000,
    estimatedValue: 340000,
    estimatedRent: 3200,
    rehabCost: 18000,
    isSaved: true,
    pipelineStage: 'Offer Sent' as const,
    reasonsToBuy: [
      '🔥 Exceptional Score 91/100!',
      '$45,000 price discount (13.2% ARV margin)',
      'Outstanding $3,200/mo rental yield ($1,600/unit)',
      '$720/mo projected cash flow and 10.8% Cash-on-Cash return',
      '52 days on market provides strong MOTIVATED seller negotiation position'
    ],
    warnings: [
      'Roof nearing end of useful life (~4 years remaining)',
      'Off-street parking restricted to 2 vehicles'
    ],
    summary: 'Prime Old Metairie side-by-side duplex generating top tier rents with motivated out-of-state seller.',
    comparables: [
      { address: '810 Metairie Rd', price: 345000, rent: 3300, sqft: 2650, distanceMiles: 0.2 },
      { address: '915 Bonnabel Blvd', price: 338000, rent: 3150, sqft: 2550, distanceMiles: 0.5 }
    ]
  },
  {
    id: 'opp-1042-east6th',
    address: '1042 East 6th St Triplex',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    market: 'Austin, TX',
    propertyType: 'triplex' as const,
    bedrooms: 5,
    bathrooms: 3,
    sqft: 2850,
    yearBuilt: 2004,
    daysOnMarket: 35,
    status: 'Price Drop' as const,
    isNewOpportunity: true,
    discoveredAt: '2026-08-10T06:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 340000,
    estimatedValue: 395000,
    estimatedRent: 3800,
    rehabCost: 20000,
    isSaved: true,
    pipelineStage: 'Under Review' as const,
    reasonsToBuy: [
      '14% below estimated Austin Eastside market value ($395K)',
      'Triplex format generates $3,800/mo total gross rental revenue',
      '$790/mo monthly net cash flow and 9.8% Cash-on-Cash',
      'Recent $15,000 seller price drop creates immediate closing incentive'
    ],
    warnings: [
      'Property taxes in Travis County are 2.1% (factored into underwriting)',
      'High tenant turnover rate historically'
    ],
    summary: 'East Austin urban triplex value-add deal with recent price drop and high cashflow momentum.',
    comparables: [
      { address: '1105 E 6th St', price: 410000, rent: 3900, sqft: 2900, distanceMiles: 0.1 },
      { address: '980 E 7th St', price: 390000, rent: 3750, sqft: 2780, distanceMiles: 0.3 }
    ]
  },
  {
    id: 'opp-2204-broad',
    address: '2204 Broad Street',
    city: 'New Orleans',
    state: 'LA',
    zip: '70119',
    market: 'New Orleans, LA',
    propertyType: 'single_family' as const,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    yearBuilt: 1972,
    daysOnMarket: 61,
    status: 'Active' as const,
    isNewOpportunity: false,
    discoveredAt: '2026-08-01T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    source: 'RentCast' as const,
    listPrice: 199000,
    estimatedValue: 210000,
    estimatedRent: 2000,
    rehabCost: 15000,
    isSaved: false,
    pipelineStage: 'New Discovered' as const,
    reasonsToBuy: [
      '61 days on market creates extreme negotiating leverage for lowball offer',
      'Positive monthly cashflow of $410/mo meets baseline requirement',
      'Solid rental neighborhood with low historic vacancy rates'
    ],
    warnings: [
      'Thin price discount (5.2% ARV margin)',
      'Requires full kitchen update ($12k-$15k estimated rehab)'
    ],
    summary: 'Broad St bungalow with 60+ days DOM suitable for aggressive counter-offer strategy.',
    comparables: [
      { address: '2230 Broad St', price: 212000, rent: 2050, sqft: 1520, distanceMiles: 0.1 },
      { address: '2105 Washington Ave', price: 208000, rent: 1980, sqft: 1480, distanceMiles: 0.4 }
    ]
  }
];

export const INITIAL_OPPORTUNITIES: AcquisitionOpportunity[] = RAW_PROPERTIES.map(p => {
  const defaultFinancing = INITIAL_BUY_BOXES[0].financing;
  const financials = underwriteFinancials({
    listPrice: p.listPrice,
    estimatedValue: p.estimatedValue,
    estimatedRent: p.estimatedRent,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    yearBuilt: p.yearBuilt,
    daysOnMarket: p.daysOnMarket,
    downPaymentPercent: defaultFinancing.downPaymentPercent,
    interestRate: defaultFinancing.interestRate,
    loanTermYears: defaultFinancing.loanTermYears,
    rehabCost: p.rehabCost,
    vacancyRatePercent: defaultFinancing.vacancyRatePercent,
    managementFeePercent: defaultFinancing.managementFeePercent
  });

  const opportunityScore = calculateOpportunityScore(financials, p.daysOnMarket, p.yearBuilt);

  return {
    id: p.id,
    tenantOrgId: 'tenant-apex',
    address: p.address,
    city: p.city,
    state: p.state,
    zip: p.zip,
    market: p.market,
    propertyType: p.propertyType,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    yearBuilt: p.yearBuilt,
    daysOnMarket: p.daysOnMarket,
    status: p.status,
    isNewOpportunity: p.isNewOpportunity,
    discoveredAt: p.discoveredAt,
    imageUrl: p.imageUrl,
    source: p.source,
    listPrice: p.listPrice,
    estimatedValue: p.estimatedValue,
    estimatedRent: p.estimatedRent,
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
      customPrice: p.listPrice,
      customRent: p.estimatedRent,
      rehabCost: p.rehabCost,
      downPaymentPercent: defaultFinancing.downPaymentPercent,
      interestRate: defaultFinancing.interestRate,
      loanTermYears: defaultFinancing.loanTermYears
    },
    opportunityScore,
    aiAnalysis: {
      reasonsToBuy: p.reasonsToBuy,
      warnings: p.warnings,
      summary: p.summary,
      comparables: p.comparables
    },
    isSaved: p.isSaved,
    pipelineStage: p.pipelineStage
  };
});
