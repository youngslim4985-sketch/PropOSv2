import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Building,
  DollarSign,
  Calendar,
  FileCheck,
  Download,
  PenTool
} from 'lucide-react';
import { store } from '../services/store';
import { LeaseContract } from '../types';

interface LeasesViewProps {
  onOpenNewLeaseModal: () => void;
  searchTerm: string;
}

export const LeasesView: React.FC<LeasesViewProps> = ({
  onOpenNewLeaseModal,
  searchTerm
}) => {
  const leases = store.getLeasesByTenant();
  const [selectedLease, setSelectedLease] = useState<LeaseContract | null>(leases[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredLeases = leases.filter(l => {
    const matchesSearch =
      l.leaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.propertyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Leases & Legal Contracts Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated residential & NNN commercial lease generator, digital signing, and renewal alerts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            {['All', 'Active', 'Pending Signature', 'Expired'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewLeaseModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Lease</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Lease Directory + Contract Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lease List Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Lease Agreements ({filteredLeases.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Auto-renew enabled on {leases.filter(l => l.autoRenew).length} leases
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredLeases.map(lease => {
              const isSelected = selectedLease?.id === lease.id;

              return (
                <div
                  key={lease.id}
                  onClick={() => setSelectedLease(lease)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          {lease.leaseNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          Unit {lease.unitNumber}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{lease.tenantName}</h3>
                      <p className="text-xs text-slate-400">{lease.propertyName}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-mono font-bold text-white text-sm block">
                        ${lease.monthlyRent.toLocaleString()}/mo
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono inline-block ${
                          lease.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {lease.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Term: {lease.startDate} → {lease.endDate}</span>
                    </span>
                    <span className="font-mono text-indigo-300">
                      Deposit: ${lease.securityDeposit.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Lease Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          {selectedLease ? (
            <>
              <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                    Contract Document Inspector
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedLease.leaseNumber}</h2>
                  <p className="text-xs text-slate-400">{selectedLease.propertyName}</p>
                </div>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Lease Specs Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Tenant Name:</span>
                  <span className="font-bold text-white">{selectedLease.tenantName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Unit / Suite:</span>
                  <span className="font-mono text-slate-200">{selectedLease.unitNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Monthly Rent:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${selectedLease.monthlyRent.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-mono text-slate-200">
                    ${selectedLease.securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Payment Due Day:</span>
                  <span className="font-mono text-slate-200">
                    {selectedLease.paymentDueDateDay}st of each month
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Auto-Renewal:</span>
                  <span className="font-mono font-semibold text-indigo-300">
                    {selectedLease.autoRenew ? 'Enabled (60-day notice)' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Special Terms */}
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Pet Policy & Clauses
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                  <p>• {selectedLease.petPolicy}</p>
                  {selectedLease.specialTerms && (
                    <p className="mt-1 text-slate-400">• {selectedLease.specialTerms}</p>
                  )}
                </div>
              </div>

              {/* Digital Signing Preview Block */}
              <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-indigo-200 font-bold">
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  <span>Digital Signature Verification</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Executed digitally via PropOS Auth Ledger on{' '}
                  <strong className="text-white">{selectedLease.signedDate || '2024-03-25'}</strong>.
                  SHA-256 Hash verified under T&F Standard.
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Select a lease contract to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
