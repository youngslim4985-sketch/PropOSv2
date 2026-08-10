import React from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Wrench,
  FileCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  ArrowDownRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { store } from '../services/store';
import { ActiveTab } from './Navigation';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewPropertyModal: () => void;
  onOpenNewLeaseModal: () => void;
  onOpenNewPaymentModal: () => void;
  onOpenNewTicketModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenNewPropertyModal,
  onOpenNewLeaseModal,
  onOpenNewPaymentModal,
  onOpenNewTicketModal
}) => {
  const activeOrg = store.getActiveTenantOrg();
  const properties = store.getPropertiesByTenant();
  const leases = store.getLeasesByTenant();
  const transactions = store.getTransactionsByTenant();
  const tickets = store.getTicketsByTenant();
  const events = store.getEventsByTenant();

  // Calculations
  const totalUnits = properties.reduce((acc, p) => acc + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((acc, p) => acc + p.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const totalMonthlyRevenue = properties.reduce((acc, p) => acc + p.monthlyRevenue, 0);

  const completedIncome = transactions
    .filter(t => t.category === 'Income' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.category === 'Expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netOperatingIncome = completedIncome - totalExpenses;

  const overdueRentCount = transactions.filter(
    t => t.type === 'Rent Income' && t.status === 'Overdue'
  ).length;

  const openTicketsCount = tickets.filter(
    t => t.status === 'New' || t.status === 'In Progress' || t.status === 'Assigned'
  ).length;

  const criticalTicketsCount = tickets.filter(
    t => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Resolved'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-semibold uppercase tracking-wider border border-indigo-500/30">
                Tenant: {activeOrg.name} ({activeOrg.code})
              </span>
              <span className="text-xs text-slate-400">
                Portfolio: {properties.length} Properties • {totalUnits} Units
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Property Operations Command Center
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Real-time multi-tenant telemetry, NOI tracking, automated lease control, and AI triage.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewPropertyModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </button>

            <button
              onClick={onOpenNewLeaseModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Issue Lease</span>
            </button>

            <button
              onClick={onOpenNewPaymentModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Log Payment</span>
            </button>

            <button
              onClick={onOpenNewTicketModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>New Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>PropOS AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Portfolio Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Monthly Rent Roll
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono">
              ${totalMonthlyRevenue.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>98.2% Collected Rate</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Occupancy Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Portfolio Occupancy
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono">{occupancyRate}%</p>
            <p className="text-xs text-slate-400 mt-1">
              {occupiedUnits} of {totalUnits} Units Occupied
            </p>
          </div>
        </div>

        {/* Metric 3: Net Operating Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Net Operating Income (NOI)
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono">
              ${netOperatingIncome.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Income: ${completedIncome.toLocaleString()} | Exp: ${totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Metric 4: Operations & Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Maintenance
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-black text-white font-mono">{openTicketsCount}</p>
              <span className="text-xs text-slate-400">Tickets Open</span>
            </div>
            {criticalTicketsCount > 0 ? (
              <div className="flex items-center space-x-1 mt-1 text-xs text-rose-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{criticalTicketsCount} High Priority / Urgent</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All SLAs On Schedule</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Financial Bar & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Performance Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Revenue Roll & Financial Analytics</span>
              </h2>
              <p className="text-xs text-slate-400">
                Monthly income collection vs maintenance expenses breakdown
              </p>
            </div>
            <button
              onClick={() => setActiveTab('financials')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Detailed Ledger →
            </button>
          </div>

          {/* Simple Visual SVG Chart */}
          <div className="pt-2">
            <div className="h-44 w-full bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex items-end justify-between space-x-4">
              {[
                { month: 'Mar', revenue: 42000, expense: 3200 },
                { month: 'Apr', revenue: 48000, expense: 4100 },
                { month: 'May', revenue: 51000, expense: 2900 },
                { month: 'Jun', revenue: 52500, expense: 6200 },
                { month: 'Jul', revenue: 54000, expense: 3800 },
                { month: 'Aug (Current)', revenue: totalMonthlyRevenue, expense: totalExpenses }
              ].map((item, idx) => {
                const maxVal = 60000;
                const revHeight = Math.round((item.revenue / maxVal) * 120);
                const expHeight = Math.round((item.expense / maxVal) * 120);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group">
                    <div className="flex items-end space-x-1.5 h-32 w-full justify-center">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}px` }}
                        className="w-4 sm:w-6 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md group-hover:brightness-125 transition-all relative"
                        title={`Revenue: $${item.revenue.toLocaleString()}`}
                      ></div>
                      {/* Expense Bar */}
                      <div
                        style={{ height: `${expHeight}px` }}
                        className="w-2.5 sm:w-4 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md group-hover:brightness-125 transition-all"
                        title={`Expense: $${item.expense.toLocaleString()}`}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 text-center truncate">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
                <span>Gross Collected Rent</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
                <span>Maintenance Expenses</span>
              </div>
            </div>
          </div>

          {/* Properties Summary Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {properties.map(prop => (
              <div
                key={prop.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3"
              >
                <img
                  src={prop.imageUrl}
                  alt={prop.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">{prop.name}</h3>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {prop.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {prop.city}, {prop.state}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-emerald-400 font-mono font-semibold">
                      ${prop.monthlyRevenue.toLocaleString()}/mo
                    </span>
                    <span className="text-slate-400 font-mono">
                      {prop.occupiedUnits}/{prop.totalUnits} Units ({Math.round((prop.occupiedUnits / prop.totalUnits) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Insights & Overdue/Alert Feed */}
        <div className="space-y-6">
          {/* AI Operational Insight Box */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/50 rounded-2xl p-5 shadow-lg relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                  PropOS AI Operations Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Gemini 3.6 Flash
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              &quot;Portfolio performance is optimal with <strong className="text-indigo-300">92% occupancy</strong>. Note: <strong className="text-rose-300">Unit 101B ($2,800)</strong> has reached 9 days overdue status. Recommended action: Issue automated payment reminder via PropOS AI Assistant.&quot;
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-900/60 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('ai')}
                className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center space-x-1"
              >
                <span>Launch AI Assistant</span>
                <Bot className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Overdue Rent & Expiry Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Critical Operational Alerts</span>
            </h3>

            {overdueRentCount > 0 ? (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-rose-200">
                    {overdueRentCount} Overdue Rent Payments ($2,800)
                  </p>
                  <p className="text-rose-300/80 text-[11px] mt-0.5">
                    Samantha Chen (Unit 101B) - August Rent unpaid.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No overdue payments detected.</p>
            )}

            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Upcoming Lease Expirations (Next 90 Days)
              </p>
              {leases.map(lease => (
                <div
                  key={lease.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-200">{lease.tenantName}</p>
                    <p className="text-[10px] text-slate-400">
                      {lease.propertyName} ({lease.unitNumber})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Expires {lease.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Domain Events Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Domain Event Stream (Audit Log)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Immutable ledger of property creation, lease signing, and transaction events
            </p>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Full Event Inspector →
          </button>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {events.slice(0, 5).map(evt => (
            <div
              key={evt.event_id}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                  {evt.event_type}
                </span>
                <div>
                  <span className="font-medium text-slate-200">
                    {evt.payload.propertyName || evt.payload.tenantName || evt.payload.title || evt.aggregate_id}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Actor: {evt.actor_role} ({evt.actor_id}) • Correlation: {evt.correlation_id}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {new Date(evt.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
