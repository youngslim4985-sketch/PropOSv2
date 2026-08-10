import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Send,
  Building2,
  CheckCircle2,
  Flame,
  FileCheck,
  Plus,
  Eye,
  Check
} from 'lucide-react';
import { store } from '../services/store';
import { AcquisitionOpportunity, PipelineStage } from '../types';

interface AcquisitionPipelineViewProps {
  onSelectOpportunityForUnderwriting: (opp: AcquisitionOpportunity) => void;
}

export const AcquisitionPipelineView: React.FC<AcquisitionPipelineViewProps> = ({
  onSelectOpportunityForUnderwriting
}) => {
  const [opportunities, setOpportunities] = useState<AcquisitionOpportunity[]>(
    store.getOpportunitiesByTenant()
  );
  const [onboardedSuccess, setOnboardedSuccess] = useState<string | null>(null);

  const stages: PipelineStage[] = [
    'New Discovered',
    'Under Review',
    'Offer Sent',
    'Under Contract',
    'Acquired'
  ];

  const handleStageChange = (oppId: string, newStage: PipelineStage) => {
    store.updateOpportunityPipelineStage(oppId, newStage);
    setOpportunities([...store.getOpportunitiesByTenant()]);
  };

  const handleOnboardToPortfolio = (oppId: string) => {
    const newProp = store.onboardPropertyFromOpportunity(oppId);
    if (newProp) {
      setOpportunities([...store.getOpportunitiesByTenant()]);
      setOnboardedSuccess(`🎉 ${newProp.name} successfully onboarded into PropOS Operational Portfolio with ${newProp.totalUnits} units created!`);
      setTimeout(() => setOnboardedSuccess(null), 8000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            DEAL PIPELINE
          </span>
          <h1 className="text-2xl font-black mt-1">Acquisition Pipeline Tracker</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Track deals from initial RentCast discovery through underwriting, LOI submission, contract execution, and portfolio onboarding.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {onboardedSuccess && (
        <div className="p-4 bg-emerald-900/90 border border-emerald-500 text-emerald-100 rounded-xl text-sm font-semibold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            {onboardedSuccess}
          </span>
          <button onClick={() => setOnboardedSuccess(null)} className="text-xs text-emerald-300 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Pipeline Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageOpps = opportunities.filter(o => o.pipelineStage === stage);

          return (
            <div key={stage} className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 min-w-[260px] flex flex-col">
              {/* Stage Header */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{stage}</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full">
                  {stageOpps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {stageOpps.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-300 rounded-xl">
                    No deals in this stage
                  </div>
                ) : (
                  stageOpps.map(opp => (
                    <div
                      key={opp.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{opp.address}</h4>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] shrink-0">
                          {opp.opportunityScore.totalScore}/100
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium space-y-0.5">
                        <div className="flex justify-between">
                          <span>List Price:</span>
                          <span className="font-bold text-slate-900">${opp.listPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cap Rate:</span>
                          <span className="font-bold text-emerald-600">{opp.financials.capRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cash Flow:</span>
                          <span className="font-bold text-emerald-600">${opp.financials.monthlyCashFlow}/mo</span>
                        </div>
                      </div>

                      {/* Move Stage Selector */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <select
                          value={opp.pipelineStage}
                          onChange={e => handleStageChange(opp.id, e.target.value as PipelineStage)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-medium focus:outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => onSelectOpportunityForUnderwriting(opp)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="View Underwriting"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Onboard Button if Acquired */}
                      {stage === 'Acquired' && (
                        <button
                          onClick={() => handleOnboardToPortfolio(opp.id)}
                          className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Building2 className="w-3 h-3" /> Onboard to PropOS Portfolio
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
