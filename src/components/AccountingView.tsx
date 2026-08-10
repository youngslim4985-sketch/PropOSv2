import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  FileSpreadsheet,
  Filter,
  Search
} from 'lucide-react';
import { store } from '../services/store';
import { FinancialTransaction, FinancialCategory } from '../types';

interface AccountingViewProps {
  onOpenNewPaymentModal: () => void;
  searchTerm: string;
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  onOpenNewPaymentModal,
  searchTerm
}) => {
  const transactions = store.getTransactionsByTenant();
  const tenants = store.getTenantsByTenant();
  const properties = store.getPropertiesByTenant();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredTxs = transactions.filter(t => {
    const matchesSearch =
      t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.payerOrPayee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalIncome = transactions
    .filter(t => t.category === 'Income' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.category === 'Expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            <span>Financial Accounting & Rent Roll</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            General ledger, rent collections, vendor disbursements, ACH direct settlements, and financial reporting.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Exporting PropOS General Ledger to CSV...')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewPaymentModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Gross Collected Income</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">
            ${totalIncome.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Rent & Commercial Income</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Operating Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">
            ${totalExpenses.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-400 font-medium">Maintenance & Vendor Expenses</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Net Operating Cash Flow</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">
            ${netIncome.toLocaleString()}
          </p>
          <span className="text-[11px] text-indigo-300 font-medium">Net Realized Cash Position</span>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Transaction Ledger ({filteredTxs.length})
            </h2>
            <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              {['All', 'Income', 'Expense'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Payer / Payee</th>
                <th className="py-3 px-3">Type & Description</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3 text-right">Amount ($)</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTxs.map(tx => {
                const isIncome = tx.category === 'Income';

                return (
                  <tr key={tx.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-indigo-400">{tx.transactionNumber}</td>
                    <td className="py-3 px-3 text-slate-300">{tx.date}</td>
                    <td className="py-3 px-3 text-white font-sans font-bold">{tx.payerOrPayee}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="text-slate-200 font-semibold">{tx.type}</span>
                      <span className="text-slate-400 block text-[11px] truncate max-w-xs">
                        {tx.description}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{tx.method}</td>
                    <td
                      className={`py-3 px-3 text-right font-bold text-sm ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono inline-block ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
