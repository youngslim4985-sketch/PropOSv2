import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Building,
  FileText,
  Copy,
  Download,
  Percent,
  Sliders,
  Send,
  Check
} from 'lucide-react';
import { AcquisitionOpportunity } from '../types';
import { store } from '../services/store';

interface DealUnderwriterViewProps {
  opportunity: AcquisitionOpportunity;
  onBack: () => void;
}

export const DealUnderwriterView: React.FC<DealUnderwriterViewProps> = ({ opportunity, onBack }) => {
  const [purchasePrice, setPurchasePrice] = useState<number>(
    opportunity.underwritingInputs?.customPrice || opportunity.listPrice
  );
  const [estimatedRent, setEstimatedRent] = useState<number>(
    opportunity.underwritingInputs?.customRent || opportunity.estimatedRent
  );
  const [rehabCost, setRehabCost] = useState<number>(
    opportunity.underwritingInputs?.rehabCost || 15000
  );
  const [downPaymentPct, setDownPaymentPct] = useState<number>(
    opportunity.underwritingInputs?.downPaymentPercent || 25
  );
  const [interestRate, setInterestRate] = useState<number>(
    opportunity.underwritingInputs?.interestRate || 7.0
  );
  const [loanTermYears, setLoanTermYears] = useState<number>(
    opportunity.underwritingInputs?.loanTermYears || 30
  );

  const [activeTab, setActiveTab] = useState<'underwriting' | 'memo' | 'loi' | 'comps'>('underwriting');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    reasonsToBuy?: string[];
    warnings?: string[];
    investmentMemo?: string;
    letterOfIntent?: string;
  } | null>(null);

  const [copiedLoi, setCopiedLoi] = useState<boolean>(false);

  // Apply adjustments live
  const handleRecalculate = (
    newPrice = purchasePrice,
    newRent = estimatedRent,
    newRehab = rehabCost,
    newDown = downPaymentPct,
    newRate = interestRate,
    newTerm = loanTermYears
  ) => {
    store.updateOpportunityUnderwriting(opportunity.id, {
      customPrice: newPrice,
      customRent: newRent,
      rehabCost: newRehab,
      downPaymentPercent: newDown,
      interestRate: newRate,
      loanTermYears: newTerm
    });
  };

  const handleRunAiUnderwrite = async () => {
    setIsGeneratingAi(true);
    try {
      const activeBuyBox = store.getBuyBoxesByTenant()[0];
      const res = await fetch('/api/ai/underwrite-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: opportunity,
          buyBox: activeBuyBox,
          userTweaks: {
            customPrice: purchasePrice,
            customRent: estimatedRent,
            rehabCost,
            downPaymentPercent: downPaymentPct,
            interestRate,
            loanTermYears
          }
        })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      console.error('AI Underwrite error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyLoi = () => {
    const textToCopy = aiResult?.letterOfIntent || defaultLoiText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLoi(true);
    setTimeout(() => setCopiedLoi(false), 3000);
  };

  const defaultLoiText = `LETTER OF INTENT TO PURCHASE REAL ESTATE\n\nDate: ${new Date().toLocaleDateString()}\nTo: Seller / Listing Agent of ${opportunity.address}\n\nBuyer: PropOS Acquisition Fund LLC (or Assigns)\nProperty: ${opportunity.address}, ${opportunity.city}, ${opportunity.state} ${opportunity.zip}\n\n1. PURCHASE PRICE: $${purchasePrice.toLocaleString()}\n2. EARNEST MONEY DEPOSIT: $${Math.round(purchasePrice * 0.02).toLocaleString()} held in escrow upon mutual execution.\n3. FINANCING CONTINGENCY: Conventional mortgage with ${downPaymentPct}% down payment at ${interestRate}% interest.\n4. ESTIMATED REHAB CREDIT: $${rehabCost.toLocaleString()}\n5. INSPECTION & FEASIBILITY: 10-day feasibility & property inspection period.\n6. TARGET CLOSING: On or before 30 calendar days from contract execution.\n\nSubmitted by PropOS Acquisition Intelligence Platform.`;

  const fin = opportunity.financials;
  const score = opportunity.opportunityScore;

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Finder
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              store.updateOpportunityPipelineStage(opportunity.id, 'Offer Sent');
              setActiveTab('loi');
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Issue Offer LOI
          </button>
        </div>
      </div>

      {/* Main Deal Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Summary */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                RENTCAST VERIFIED LISTING
              </span>
              <span className="text-xs text-slate-400">{opportunity.source} • {opportunity.daysOnMarket} Days DOM</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{opportunity.address}</h1>
            <p className="text-slate-400 text-sm">
              {opportunity.city}, {opportunity.state} {opportunity.zip} • {opportunity.propertyType.toUpperCase()} • {opportunity.bedrooms} Beds, {opportunity.bathrooms} Baths, {opportunity.sqft} sqft (Built {opportunity.yearBuilt})
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">List Price</span>
                <span className="text-lg font-black text-white">${opportunity.listPrice.toLocaleString()}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Market ARV</span>
                <span className="text-lg font-black text-emerald-400">${opportunity.estimatedValue.toLocaleString()}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Monthly Rent</span>
                <span className="text-lg font-black text-white">${opportunity.estimatedRent.toLocaleString()}/mo</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Equity Margin</span>
                <span className="text-lg font-black text-amber-400">{opportunity.priceDiscountPercent}%</span>
              </div>
            </div>
          </div>

          {/* Opportunity Score Gauge Card */}
          <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700 flex flex-col justify-between items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">T&F Opportunity Score</span>

            <div className="my-2 relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-8 border-emerald-500/30 flex items-center justify-center bg-slate-900 shadow-inner">
                <span className="text-3xl font-black text-emerald-400">{score.totalScore}</span>
                <span className="text-xs font-bold text-slate-500">/100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-base font-extrabold text-white">{score.classification}</div>
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                RECOMMENDATION: {score.recommendation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab('underwriting')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'underwriting'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" /> Live Underwriting Workstation
        </button>

        <button
          onClick={() => setActiveTab('memo')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'memo'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> AI Investment Memo
        </button>

        <button
          onClick={() => setActiveTab('loi')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'loi'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" /> Formal Purchase LOI
        </button>

        <button
          onClick={() => setActiveTab('comps')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'comps'
              ? 'border-emerald-500 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" /> Rental & Sale Comps
        </button>
      </div>

      {/* TAB 1: Live Underwriting Workstation */}
      {activeTab === 'underwriting' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Financial Calculator Inputs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-600" /> Adjust Underwriting Assumptions
            </h3>

            {/* Offer / Purchase Price */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Purchase / Offer Price: ${purchasePrice.toLocaleString()}
              </label>
              <input
                type="range"
                min={50000}
                max={500000}
                step={5000}
                value={purchasePrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  setPurchasePrice(val);
                  handleRecalculate(val, estimatedRent, rehabCost, downPaymentPct, interestRate, loanTermYears);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Estimated Monthly Rent */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Underwritten Rent: ${estimatedRent.toLocaleString()}/mo
              </label>
              <input
                type="range"
                min={1000}
                max={6000}
                step={50}
                value={estimatedRent}
                onChange={e => {
                  const val = Number(e.target.value);
                  setEstimatedRent(val);
                  handleRecalculate(purchasePrice, val, rehabCost, downPaymentPct, interestRate, loanTermYears);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Estimated Rehab Cost */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Estimated Rehab Budget: ${rehabCost.toLocaleString()}
              </label>
              <input
                type="range"
                min={0}
                max={60000}
                step={2500}
                value={rehabCost}
                onChange={e => {
                  const val = Number(e.target.value);
                  setRehabCost(val);
                  handleRecalculate(purchasePrice, estimatedRent, val, downPaymentPct, interestRate, loanTermYears);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Down Payment % */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Down Payment: {downPaymentPct}% (${((purchasePrice * downPaymentPct) / 100).toLocaleString()})
              </label>
              <input
                type="range"
                min={15}
                max={50}
                step={5}
                value={downPaymentPct}
                onChange={e => {
                  const val = Number(e.target.value);
                  setDownPaymentPct(val);
                  handleRecalculate(purchasePrice, estimatedRent, rehabCost, val, interestRate, loanTermYears);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Interest Rate % */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mortgage Interest Rate: {interestRate}%
              </label>
              <input
                type="range"
                min={4.5}
                max={10.0}
                step={0.125}
                value={interestRate}
                onChange={e => {
                  const val = Number(e.target.value);
                  setInterestRate(val);
                  handleRecalculate(purchasePrice, estimatedRent, rehabCost, downPaymentPct, val, loanTermYears);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleRunAiUnderwrite}
              disabled={isGeneratingAi}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {isGeneratingAi ? 'Analyzing Deal with Gemini 3.6...' : 'Run Gemini 3.6 Deal Analysis'}
            </button>
          </div>

          {/* Right: Detailed Underwritten Returns & Score Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Returns Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Underwritten Pro Forma Financial Metrics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">Cap Rate</span>
                  <span className="text-2xl font-black text-emerald-950">{fin.capRate}%</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">Net Return on Cost</span>
                </div>

                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">Monthly Cash Flow</span>
                  <span className="text-2xl font-black text-emerald-950">${fin.monthlyCashFlow}/mo</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">${fin.monthlyCashFlow * 12}/yr Net</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-600 block">Cash-on-Cash Return</span>
                  <span className="text-2xl font-black text-slate-900">{fin.cashOnCash}%</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Annual Cash Return</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-600 block">Total Equity Required</span>
                  <span className="text-2xl font-black text-slate-900">${fin.equityRequired.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Down + Closing + Rehab</span>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 border-b pb-1">INCOME & NOI</div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gross Annual Rent:</span>
                    <span className="font-semibold text-slate-900">${fin.grossRentAnnual.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Est. Annual Expenses (32%):</span>
                    <span className="font-semibold text-slate-700">-${fin.estimatedExpensesAnnual.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Net Operating Income (NOI):</span>
                    <span className="text-emerald-600">${fin.noi.toLocaleString()}/yr</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 border-b pb-1">DEBT & COVERAGE</div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly Debt Service (P&I):</span>
                    <span className="font-semibold text-slate-900">${fin.monthlyDebtService}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price to Rent Ratio:</span>
                    <span className="font-semibold text-slate-800">{fin.priceToRentRatio}x</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Debt Coverage Ratio (DSCR):</span>
                    <span className="text-emerald-600">{fin.dscr}x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Component Breakdown Matrix */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Score Sub-Component Factor Breakdown</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Total: {score.totalScore}/100
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block font-medium">Price Discount</span>
                  <span className="text-base font-bold text-slate-900">{score.priceDiscount} / 20 pts</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(score.priceDiscount / 20) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block font-medium">Monthly Cash Flow</span>
                  <span className="text-base font-bold text-slate-900">{score.cashFlow} / 20 pts</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(score.cashFlow / 20) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block font-medium">Cap Rate Yield</span>
                  <span className="text-base font-bold text-slate-900">{score.capRate} / 20 pts</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(score.capRate / 20) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block font-medium">Days on Market</span>
                  <span className="text-base font-bold text-slate-900">{score.daysOnMarket} / 5 pts</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(score.daysOnMarket / 5) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI "Why Should I Care?" Rationale */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">"Why Should I Care?" — AI Underwriter Conclusion</h3>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                {(aiResult?.reasonsToBuy || opportunity.aiAnalysis.reasonsToBuy).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {(aiResult?.warnings || opportunity.aiAnalysis.warnings).length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Risk Warnings & Due Diligence Items:</span>
                  {(aiResult?.warnings || opportunity.aiAnalysis.warnings).map((warn, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Investment Memorandum */}
      {activeTab === 'memo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Executive Investment Memorandum</h3>
              <p className="text-xs text-slate-500">Formal deal committee investment memo ready for partners or lenders.</p>
            </div>
            <button
              onClick={handleRunAiUnderwrite}
              disabled={isGeneratingAi}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Regenerate Memo
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
            {aiResult?.investmentMemo ||
              `### EXECUTIVE INVESTMENT MEMORANDUM\n**Property Name / Address:** ${opportunity.address}, ${opportunity.city}, ${opportunity.state} ${opportunity.zip}\n**Target Market:** ${opportunity.market}\n**Property Type:** ${opportunity.propertyType.toUpperCase()} (${opportunity.bedrooms} BR / ${opportunity.bathrooms} BA, ${opportunity.sqft} sqft)\n\n**TRANSACTION OVERVIEW:**\n- List Price: $${opportunity.listPrice.toLocaleString()}\n- Underwritten Offer Price: $${purchasePrice.toLocaleString()}\n- Estimated ARV: $${opportunity.estimatedValue.toLocaleString()}\n- Equity Discount: $${(opportunity.estimatedValue - purchasePrice).toLocaleString()} (${opportunity.priceDiscountPercent}% margin)\n\n**PRO FORMA FINANCIAL ANALYSIS:**\n- Estimated Monthly Rent: $${estimatedRent.toLocaleString()}/mo\n- Gross Annual Revenue: $${(estimatedRent * 12).toLocaleString()}/yr\n- Underwritten NOI: $${fin.noi.toLocaleString()}/yr\n- Cap Rate: ${fin.capRate}%\n- Debt Service (P&I): $${fin.monthlyDebtService}/mo (${interestRate}%, ${downPaymentPct}% Down)\n- Projected Monthly Cash Flow: $${fin.monthlyCashFlow}/mo\n- Cash-on-Cash Return: ${fin.cashOnCash}%\n\n**INVESTMENT THESIS & RECOMMENDATION:**\nStrong candidate matching T&F Buy Box hurdles. Recommended for immediate acquisition and formal purchase LOI submission.`}
          </div>
        </div>
      )}

      {/* TAB 3: Formal Purchase Letter of Intent (LOI) */}
      {activeTab === 'loi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Formal Letter of Intent (LOI)</h3>
              <p className="text-xs text-slate-500">Ready-to-issue legal purchase offer template formatted for listing brokers.</p>
            </div>
            <button
              onClick={handleCopyLoi}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            >
              {copiedLoi ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              {copiedLoi ? 'Copied to Clipboard!' : 'Copy Formal LOI'}
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap shadow-inner">
            {aiResult?.letterOfIntent || defaultLoiText}
          </div>
        </div>
      )}

      {/* TAB 4: Rental & Sale Comps */}
      {activeTab === 'comps' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">RentCast Verified Comparable Properties</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <th className="p-3">Comparable Address</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">SqFt</th>
                  <th className="p-3">Sale Price</th>
                  <th className="p-3">Est. Rent</th>
                  <th className="p-3">$/SqFt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunity.aiAnalysis.comparables.map((comp, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{comp.address}</td>
                    <td className="p-3 text-slate-600">{comp.distanceMiles} mi</td>
                    <td className="p-3 text-slate-600">{comp.sqft} sqft</td>
                    <td className="p-3 font-bold text-slate-900">${comp.price.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-600">${comp.rent.toLocaleString()}/mo</td>
                    <td className="p-3 text-slate-600">${Math.round(comp.price / comp.sqft)}/sqft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
