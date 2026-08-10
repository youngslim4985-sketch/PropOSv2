import React, { useState } from 'react';
import {
  Search,
  Filter,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  PlusCircle,
  Eye
} from 'lucide-react';
import { store } from '../services/store';
import { AcquisitionOpportunity, AcquisitionPropertyType } from '../types';

interface OpportunityFinderViewProps {
  onSelectOpportunityForUnderwriting: (opp: AcquisitionOpportunity) => void;
  onNavigateToBuyBox: () => void;
}

export const OpportunityFinderView: React.FC<OpportunityFinderViewProps> = ({
  onSelectOpportunityForUnderwriting,
  onNavigateToBuyBox
}) => {
  const [selectedMarket, setSelectedMarket] = useState<string>('All Markets');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [minCashFlow, setMinCashFlow] = useState<number>(0);
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'cashFlow' | 'capRate' | 'discount' | 'dom'>('score');
  const [showOnlyNew, setShowOnlyNew] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const buyBoxes = store.getBuyBoxesByTenant();
  const activeBuyBox = buyBoxes.find(b => b.isActive) || buyBoxes[0];
  const opportunities = store.getOpportunitiesByTenant();

  const handleRunScan = () => {
    setIsScanning(true);
    setScanMessage('Connecting to RentCast Sale-Listings API & Market Data Feed...');
    setTimeout(() => {
      const newOpp = store.runMarketScan(activeBuyBox?.id);
      setIsScanning(false);
      setScanMessage(`🚨 Scan Complete! Discovered new opportunity at ${newOpp.address} (${newOpp.opportunityScore.totalScore}/100 Score).`);
      setTimeout(() => setScanMessage(null), 7000);
    }, 1200);
  };

  const filteredOpportunities = opportunities
    .filter(opp => {
      if (selectedMarket !== 'All Markets' && opp.market !== selectedMarket) return false;
      if (selectedPropertyType !== 'All Types' && opp.propertyType !== selectedPropertyType) return false;
      if (showOnlyNew && !opp.isNewOpportunity) return false;
      if (opp.financials.capRate < minCapRate) return false;
      if (opp.financials.monthlyCashFlow < minCashFlow) return false;
      if (opp.opportunityScore.totalScore < minScore) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAddress = opp.address.toLowerCase().includes(q);
        const matchesCity = opp.city.toLowerCase().includes(q);
        const matchesZip = opp.zip.toLowerCase().includes(q);
        if (!matchesAddress && !matchesCity && !matchesZip) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.opportunityScore.totalScore - a.opportunityScore.totalScore;
      if (sortBy === 'cashFlow') return b.financials.monthlyCashFlow - a.financials.monthlyCashFlow;
      if (sortBy === 'capRate') return b.financials.capRate - a.financials.capRate;
      if (sortBy === 'discount') return b.priceDiscountPercent - a.priceDiscountPercent;
      if (sortBy === 'dom') return b.daysOnMarket - a.daysOnMarket;
      return 0;
    });

  const newOpportunitiesCount = opportunities.filter(o => o.isNewOpportunity).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE ACQUISITION ENGINE
              </span>
              <span className="text-xs text-slate-400">RentCast API Connected</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Opportunity Finder & Market Scanner</h1>
            <p className="text-slate-400 text-sm mt-1">
              Continuously searching markets for target properties, calculating underwritten returns, and scoring opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning RentCast API...' : 'Run Market Discovery Scan'}
            </button>
            <button
              onClick={onNavigateToBuyBox}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm border border-slate-700 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              Configure Buy Box
            </button>
          </div>
        </div>

        {/* Scan Message Alert */}
        {scanMessage && (
          <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              {scanMessage}
            </span>
            <button onClick={() => setScanMessage(null)} className="text-xs text-slate-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* Active Strategy Snapshot */}
        {activeBuyBox && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block">Active Buy Box</span>
              <span className="font-semibold text-emerald-400 truncate block">{activeBuyBox.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Target Markets</span>
              <span className="font-medium text-slate-200 truncate block">{activeBuyBox.markets.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Price Range</span>
              <span className="font-medium text-slate-200">
                ${(activeBuyBox.priceMin / 1000).toFixed(0)}k - ${(activeBuyBox.priceMax / 1000).toFixed(0)}k
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Hurdle Cap Rate</span>
              <span className="font-semibold text-emerald-400">{activeBuyBox.minCapRate}% Min</span>
            </div>
            <div>
              <span className="text-slate-400 block">Hurdle Cash Flow</span>
              <span className="font-semibold text-emerald-400">${activeBuyBox.minCashFlow}/mo</span>
            </div>
            <div>
              <span className="text-slate-400 block">Min Score Cutoff</span>
              <span className="font-semibold text-amber-400">{activeBuyBox.minOpportunityScore}/100</span>
            </div>
          </div>
        )}
      </div>

      {/* New Opportunities Highlights Bar */}
      {newOpportunitiesCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>TODAY'S NEW OPPORTUNITIES ({newOpportunitiesCount})</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                  Discovered via Recent Scan
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                New listings discovered in your target markets that match or exceed your T&F Buy Box hurdles.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOnlyNew(!showOnlyNew)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showOnlyNew
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {showOnlyNew ? 'Showing New Only' : 'Filter New Discovered'}
          </button>
        </div>
      )}

      {/* Filter & Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search address, city, or zip..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Market filter */}
          <div>
            <select
              value={selectedMarket}
              onChange={e => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="All Markets">All Target Markets</option>
              <option value="New Orleans, LA">New Orleans, LA</option>
              <option value="Jefferson Parish, LA">Jefferson Parish, LA</option>
              <option value="Austin, TX">Austin, TX</option>
              <option value="Tampa, FL">Tampa, FL</option>
            </select>
          </div>

          {/* Property Type filter */}
          <div>
            <select
              value={selectedPropertyType}
              onChange={e => setSelectedPropertyType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="All Types">All Property Types</option>
              <option value="single_family">Single Family</option>
              <option value="duplex">Duplex (2-Unit)</option>
              <option value="triplex">Triplex (3-Unit)</option>
              <option value="fourplex">Fourplex (4-Unit)</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Min Cap Rate */}
          <div>
            <select
              value={minCapRate}
              onChange={e => setMinCapRate(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value={0}>Min Cap Rate: Any</option>
              <option value={6.5}>Min 6.5% Cap Rate</option>
              <option value={7.5}>Min 7.5% Cap Rate</option>
              <option value={8.5}>Min 8.5% Cap Rate</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium text-slate-800"
            >
              <option value="score">Sort: Opportunity Score</option>
              <option value="cashFlow">Sort: Highest Cash Flow</option>
              <option value="capRate">Sort: Highest Cap Rate</option>
              <option value="discount">Sort: Highest Price Discount</option>
              <option value="dom">Sort: Longest Days on Market</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No properties matched your search filter</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your price, market, or cap rate filters, or trigger a live Market Discovery Scan.
            </p>
            <button
              onClick={handleRunScan}
              className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-sm hover:bg-emerald-600"
            >
              Run Discovery Scan
            </button>
          </div>
        ) : (
          filteredOpportunities.map(opp => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Image & Badges Overlay */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={opp.imageUrl}
                  alt={opp.address}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Score Pill Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-slate-950/90 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
                  <span>{opp.opportunityScore.classification}</span>
                  <span className="text-emerald-400 font-extrabold">{opp.opportunityScore.totalScore}/100</span>
                </div>

                {/* New Badge */}
                {opp.isNewOpportunity && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black shadow-md flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" />
                    <span>NEW</span>
                  </div>
                )}

                {/* Bookmark Toggle */}
                <button
                  onClick={() => store.toggleSaveOpportunity(opp.id)}
                  className="absolute bottom-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow transition-all"
                  title={opp.isSaved ? 'Saved to Watchlist' : 'Save Property'}
                >
                  {opp.isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-slate-300" />
                  )}
                </button>

                {/* Days on Market */}
                <div className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-slate-900/80 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{opp.daysOnMarket} Days DOM</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors">
                      {opp.address}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {opp.city}, {opp.state} {opp.zip} • {opp.bedrooms} Beds, {opp.bathrooms} Baths ({opp.sqft} sqft)
                  </p>

                  {/* Pricing Comparison */}
                  <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">List Price</span>
                        <span className="text-lg font-black text-slate-900">${opp.listPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Estimated Value (ARV)</span>
                        <span className="text-sm font-bold text-slate-700">${opp.estimatedValue.toLocaleString()}</span>
                        {opp.priceDiscountPercent > 0 && (
                          <span className="text-xs font-semibold text-emerald-600 block">
                            {opp.priceDiscountPercent}% Discount (${opp.priceDiscountAmount.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Underwritten Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Cap Rate</span>
                      <span className="text-sm font-black text-emerald-900">{opp.financials.capRate}%</span>
                    </div>

                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Monthly Cash Flow</span>
                      <span className="text-sm font-black text-emerald-900">${opp.financials.monthlyCashFlow}/mo</span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-extrabold text-slate-600 block">Cash-on-Cash</span>
                      <span className="text-sm font-bold text-slate-900">{opp.financials.cashOnCash}%</span>
                    </div>
                  </div>

                  {/* Reasons Preview */}
                  {opp.aiAnalysis.reasonsToBuy.length > 0 && (
                    <div className="space-y-1 mb-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-emerald-500" /> Key Acquisition Highlights:
                      </div>
                      <div className="line-clamp-2 text-slate-600 pl-4 list-disc">
                        • {opp.aiAnalysis.reasonsToBuy[0]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectOpportunityForUnderwriting(opp)}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Deep Underwrite & LOI
                  </button>
                  <button
                    onClick={() => {
                      store.updateOpportunityPipelineStage(opp.id, 'Under Review');
                      onSelectOpportunityForUnderwriting(opp);
                    }}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                  >
                    Add to Pipeline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
