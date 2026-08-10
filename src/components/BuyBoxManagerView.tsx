import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Check, Play, Trash2, Layers, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { store } from '../services/store';
import { BuyBoxStrategy, AcquisitionPropertyType } from '../types';

interface BuyBoxManagerViewProps {
  onRunScanForBuyBox: (buyBoxId: string) => void;
}

export const BuyBoxManagerView: React.FC<BuyBoxManagerViewProps> = ({ onRunScanForBuyBox }) => {
  const [buyBoxes, setBuyBoxes] = useState<BuyBoxStrategy[]>(store.getBuyBoxesByTenant());
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('Custom Strategy Buy Box');
  const [markets, setMarkets] = useState<string>('New Orleans, LA, Jefferson Parish, LA');
  const [propertyTypes, setPropertyTypes] = useState<AcquisitionPropertyType[]>(['single_family', 'duplex']);
  const [priceMin, setPriceMin] = useState<number>(75000);
  const [priceMax, setPriceMax] = useState<number>(350000);
  const [minCapRate, setMinCapRate] = useState<number>(7.0);
  const [minCashFlow, setMinCashFlow] = useState<number>(400);
  const [minCashOnCash, setMinCashOnCash] = useState<number>(8.0);
  const [minScore, setMinScore] = useState<number>(75);

  const handleToggleActive = (id: string) => {
    store.toggleBuyBoxActive(id);
    setBuyBoxes([...store.getBuyBoxesByTenant()]);
  };

  const handleCreateBuyBox = (e: React.FormEvent) => {
    e.preventDefault();
    const marketArray = markets.split(',').map(m => m.trim()).filter(Boolean);
    store.addBuyBox({
      name,
      isActive: true,
      markets: marketArray,
      propertyTypes,
      priceMin,
      priceMax,
      bedroomsMin: 3,
      bathroomsMin: 2,
      minCapRate,
      minCashFlow,
      minCashOnCash,
      maxPriceToRentRatio: 15,
      minOpportunityScore: minScore,
      financing: {
        downPaymentPercent: 25,
        interestRate: 7.0,
        loanTermYears: 30,
        closingCostPercent: 3,
        defaultRehabCost: 15000,
        vacancyRatePercent: 5,
        managementFeePercent: 8
      }
    });

    setBuyBoxes([...store.getBuyBoxesByTenant()]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            STRATEGY ENGINE
          </span>
          <h1 className="text-2xl font-black mt-1">Acquisition Buy Box Strategies</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure your target acquisition profiles. PropOS continuously evaluates listings against these exact parameters.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Create Buy Box Strategy
        </button>
      </div>

      {/* Buy Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buyBoxes.map(box => (
          <div
            key={box.id}
            className={`bg-white rounded-2xl border ${
              box.isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
            } p-6 shadow-sm flex flex-col justify-between space-y-5`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{box.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">Created {box.createdAt}</span>
                </div>

                <button
                  onClick={() => handleToggleActive(box.id)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${
                    box.isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {box.isActive && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  {box.isActive ? 'ACTIVE STRATEGY' : 'PAUSED'}
                </button>
              </div>

              {/* Strategy Parameters */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase block tracking-wider">Target Markets</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {box.markets.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 font-medium block">Price Window</span>
                    <span className="font-bold text-slate-900">
                      ${(box.priceMin / 1000).toFixed(0)}k - ${(box.priceMax / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Hurdle Cap Rate</span>
                    <span className="font-bold text-emerald-600">{box.minCapRate}% Min</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Hurdle Cash Flow</span>
                    <span className="font-bold text-emerald-600">${box.minCashFlow}/mo</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Cash-on-Cash</span>
                    <span className="font-bold text-slate-900">{box.minCashOnCash}% Min</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Min Score Cutoff</span>
                    <span className="font-bold text-amber-600">{box.minOpportunityScore}/100</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Financing Default</span>
                    <span className="font-bold text-slate-800">{box.financing.downPaymentPercent}% Down @ {box.financing.interestRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onRunScanForBuyBox(box.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                Run RentCast Scan for Box
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Buy Box Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Create New Acquisition Buy Box</h3>

            <form onSubmit={handleCreateBuyBox} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Strategy Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Markets (comma-separated)</label>
                <input
                  type="text"
                  value={markets}
                  onChange={e => setMarkets(e.target.value)}
                  placeholder="e.g. New Orleans, LA, Austin, TX"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={e => setPriceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Cap Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={minCapRate}
                    onChange={e => setMinCapRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Cash Flow ($/mo)</label>
                  <input
                    type="number"
                    step="50"
                    value={minCashFlow}
                    onChange={e => setMinCashFlow(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Score Cutoff</label>
                  <input
                    type="number"
                    value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-600"
                >
                  Save Strategy Buy Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
