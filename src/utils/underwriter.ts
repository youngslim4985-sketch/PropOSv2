import {
  AcquisitionOpportunity,
  BuyBoxStrategy,
  OpportunityScore,
  OpportunityClassification,
  OpportunityRecommendation
} from '../types';

export interface UnderwritingInputParams {
  listPrice: number;
  estimatedValue: number; // ARV
  estimatedRent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  daysOnMarket: number;
  downPaymentPercent?: number; // default e.g. 25%
  interestRate?: number; // default e.g. 7.0%
  loanTermYears?: number; // default e.g. 30
  closingCostPercent?: number; // default e.g. 3%
  rehabCost?: number; // default e.g. 15000
  vacancyRatePercent?: number; // default e.g. 5%
  propertyTaxRatePercent?: number; // default e.g. 1.25%
  insuranceRatePercent?: number; // default e.g. 0.8%
  maintenanceRatePercent?: number; // default e.g. 5%
  managementFeePercent?: number; // default e.g. 8%
}

export function calculateMonthlyMortgage(principal: number, annualInterestRate: number, loanTermYears: number): number {
  if (principal <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) return 0;
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return Math.round(payment);
}

export function underwriteFinancials(params: UnderwritingInputParams) {
  const purchasePrice = params.listPrice;
  const estimatedValue = params.estimatedValue > 0 ? params.estimatedValue : purchasePrice;
  const monthlyRent = params.estimatedRent;

  const downPaymentPct = params.downPaymentPercent ?? 25;
  const interestRate = params.interestRate ?? 7.0;
  const loanTermYears = params.loanTermYears ?? 30;
  const closingCostPct = params.closingCostPercent ?? 3;
  const rehabCost = params.rehabCost ?? 15000;

  const vacancyPct = params.vacancyRatePercent ?? 5;
  const taxPct = params.propertyTaxRatePercent ?? 1.25;
  const insPct = params.insuranceRatePercent ?? 0.8;
  const maintPct = params.maintenanceRatePercent ?? 5;
  const mgmtPct = params.managementFeePercent ?? 8;

  const downPaymentAmount = purchasePrice * (downPaymentPct / 100);
  const loanAmount = purchasePrice - downPaymentAmount;
  const closingCosts = purchasePrice * (closingCostPct / 100);
  const equityRequired = downPaymentAmount + closingCosts + rehabCost;

  const monthlyDebtService = calculateMonthlyMortgage(loanAmount, interestRate, loanTermYears);

  const grossRentAnnual = monthlyRent * 12;
  const vacancyAnnual = grossRentAnnual * (vacancyPct / 100);
  const effectiveGrossIncome = grossRentAnnual - vacancyAnnual;

  const propertyTaxesAnnual = purchasePrice * (taxPct / 100);
  const insuranceAnnual = purchasePrice * (insPct / 100);
  const maintenanceAnnual = grossRentAnnual * (maintPct / 100);
  const managementAnnual = grossRentAnnual * (mgmtPct / 100);

  const totalOperatingExpensesAnnual = propertyTaxesAnnual + insuranceAnnual + maintenanceAnnual + managementAnnual;
  const noi = effectiveGrossIncome - totalOperatingExpensesAnnual;

  const capRate = purchasePrice > 0 ? Number(((noi / purchasePrice) * 100).toFixed(2)) : 0;
  const annualDebtService = monthlyDebtService * 12;
  const annualCashFlow = noi - annualDebtService;
  const monthlyCashFlow = Math.round(annualCashFlow / 12);

  const cashOnCash = equityRequired > 0 ? Number(((annualCashFlow / equityRequired) * 100).toFixed(2)) : 0;
  const priceToRentRatio = grossRentAnnual > 0 ? Number((purchasePrice / grossRentAnnual).toFixed(2)) : 0;
  const dscr = annualDebtService > 0 ? Number((noi / annualDebtService).toFixed(2)) : 0;

  const priceDiscountAmount = Math.max(0, estimatedValue - purchasePrice);
  const priceDiscountPercent = estimatedValue > 0 ? Number(((priceDiscountAmount / estimatedValue) * 100).toFixed(1)) : 0;

  return {
    purchasePrice,
    estimatedValue,
    priceDiscountAmount,
    priceDiscountPercent,
    grossRentAnnual,
    estimatedExpensesAnnual: Math.round(totalOperatingExpensesAnnual),
    noi: Math.round(noi),
    capRate,
    monthlyDebtService,
    monthlyCashFlow,
    cashOnCash,
    equityRequired: Math.round(equityRequired),
    priceToRentRatio,
    dscr,
    loanAmount: Math.round(loanAmount),
    downPaymentAmount: Math.round(downPaymentAmount)
  };
}

export function calculateOpportunityScore(
  financials: ReturnType<typeof underwriteFinancials>,
  daysOnMarket: number,
  yearBuilt: number,
  targetBuyBox?: Partial<BuyBoxStrategy>
): OpportunityScore {
  // 1. Price Discount Score (Max 20 pts)
  // Discount >= 20% -> 20 pts. 0% -> 0 pts.
  const discountPct = financials.priceDiscountPercent;
  let priceDiscountScore = Math.min(20, Math.round((discountPct / 20) * 20));
  if (priceDiscountScore < 0) priceDiscountScore = 0;

  // 2. Cash Flow Score (Max 20 pts)
  // Target: $400/mo = 15 pts. $600+/mo = 20 pts.
  const monthlyCF = financials.monthlyCashFlow;
  let cashFlowScore = 0;
  if (monthlyCF >= 700) cashFlowScore = 20;
  else if (monthlyCF >= 500) cashFlowScore = 18;
  else if (monthlyCF >= 400) cashFlowScore = 15;
  else if (monthlyCF >= 250) cashFlowScore = 10;
  else if (monthlyCF >= 100) cashFlowScore = 5;
  else cashFlowScore = 0;

  // 3. Cap Rate Score (Max 20 pts)
  // Target: 8%+ = 20 pts, 7% = 16 pts, 6% = 12 pts, <4% = 2 pts
  const capRate = financials.capRate;
  let capRateScore = 0;
  if (capRate >= 8.5) capRateScore = 20;
  else if (capRate >= 7.5) capRateScore = 17;
  else if (capRate >= 6.5) capRateScore = 14;
  else if (capRate >= 5.5) capRateScore = 10;
  else if (capRate >= 4.5) capRateScore = 6;
  else capRateScore = 2;

  // 4. Rent Potential Score (Max 15 pts)
  // Price to Rent ratio: < 10x = 15 pts, 10-12x = 12 pts, 12-15x = 9 pts, >18x = 3 pts
  const p2r = financials.priceToRentRatio;
  let rentPotentialScore = 0;
  if (p2r <= 9.0) rentPotentialScore = 15;
  else if (p2r <= 11.0) rentPotentialScore = 13;
  else if (p2r <= 13.0) rentPotentialScore = 10;
  else if (p2r <= 15.0) rentPotentialScore = 7;
  else rentPotentialScore = 3;

  // 5. Market Strength Score (Max 10 pts)
  // Default strong demand score: 8 pts
  const marketStrengthScore = 8;

  // 6. Property Condition Score (Max 10 pts)
  // Year built & general condition
  let propertyConditionScore = 6;
  if (yearBuilt >= 2000) propertyConditionScore = 10;
  else if (yearBuilt >= 1980) propertyConditionScore = 8;
  else if (yearBuilt >= 1960) propertyConditionScore = 6;
  else propertyConditionScore = 5;

  // 7. Days on Market / Negotiating Leverage Score (Max 5 pts)
  // 40+ days on market = 5 pts (leverage!), 15-39 = 3 pts, <15 = 2 pts
  let daysOnMarketScore = 2;
  if (daysOnMarket >= 45) daysOnMarketScore = 5;
  else if (daysOnMarket >= 30) daysOnMarketScore = 4;
  else if (daysOnMarket >= 15) daysOnMarketScore = 3;

  const totalScore = Math.min(
    100,
    priceDiscountScore +
      cashFlowScore +
      capRateScore +
      rentPotentialScore +
      marketStrengthScore +
      propertyConditionScore +
      daysOnMarketScore
  );

  let classification: OpportunityClassification = '🔴 Pass';
  let recommendation: OpportunityRecommendation = 'PASS';

  if (totalScore >= 90) {
    classification = '🔥 Exceptional';
    recommendation = 'BUY';
  } else if (totalScore >= 80) {
    classification = '🟢 Strong Buy Candidate';
    recommendation = 'BUY';
  } else if (totalScore >= 70) {
    classification = '🟡 Investigate';
    recommendation = 'INVESTIGATE';
  } else if (totalScore >= 60) {
    classification = '🟠 Weak';
    recommendation = 'INVESTIGATE';
  } else {
    classification = '🔴 Pass';
    recommendation = 'PASS';
  }

  return {
    priceDiscount: priceDiscountScore,
    cashFlow: cashFlowScore,
    capRate: capRateScore,
    rentPotential: rentPotentialScore,
    marketStrength: marketStrengthScore,
    propertyCondition: propertyConditionScore,
    daysOnMarket: daysOnMarketScore,
    totalScore,
    classification,
    recommendation
  };
}
