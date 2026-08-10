import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Building,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Send,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { store } from '../services/store';
import { TenantProfile, CrmLead } from '../types';

interface TenantsCrmViewProps {
  onOpenNewTenantModal: () => void;
  searchTerm: string;
}

export const TenantsCrmView: React.FC<TenantsCrmViewProps> = ({
  onOpenNewTenantModal,
  searchTerm
}) => {
  const tenants = store.getTenantsByTenant();
  const leads = store.getLeadsByTenant();
  const properties = store.getPropertiesByTenant();

  const [activeTabSub, setActiveTabSub] = useState<'roster' | 'crm'>('roster');
  const [selectedTenant, setSelectedTenant] = useState<TenantProfile | null>(tenants[0] || null);

  const filteredTenants = tenants.filter(
    t =>
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pipelineStages: CrmLead['stage'][] = [
    'New Inquiry',
    'Tour Scheduled',
    'Application Submitted',
    'Background Check',
    'Approved'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Tenant & CRM Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active resident profiles, credit verifications, communication histories, and prospect pipeline.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTabSub('roster')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTabSub === 'roster'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Residents ({tenants.length})
            </button>
            <button
              onClick={() => setActiveTabSub('crm')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTabSub === 'crm'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leasing Leads ({leads.length})
            </button>
          </div>

          <button
            onClick={onOpenNewTenantModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Tenant</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'roster' ? (
        /* Resident Roster View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tenant List Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Resident Directory
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {filteredTenants.length} Profiles Listed
              </span>
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredTenants.map(t => {
                const isSelected = selectedTenant?.id === t.id;
                const isDelinquent = t.balance < 0;

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTenant(t)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-white">{t.fullName}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                            Unit {t.unitNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Building className="w-3 h-3 text-slate-500" />
                            <span>{t.propertyName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{t.email}</span>
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-white text-xs block">
                          ${t.monthlyRent.toLocaleString()}/mo
                        </span>
                        {isDelinquent ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Past Due ${Math.abs(t.balance).toLocaleString()}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Account Paid</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Tenant Profile Detail (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            {selectedTenant ? (
              <>
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                      Resident Master File
                    </span>
                    {selectedTenant.creditScore && (
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Credit Score: {selectedTenant.creditScore}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {selectedTenant.fullName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedTenant.propertyName} • Unit {selectedTenant.unitNumber}
                  </p>
                </div>

                {/* Contact & Terms Box */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono font-semibold text-white">{selectedTenant.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono font-semibold text-white">{selectedTenant.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Move-In Date:</span>
                    <span className="font-mono text-slate-200">{selectedTenant.moveInDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Lease Expiration:</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {selectedTenant.leaseEndDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Deposit Held:</span>
                    <span className="font-mono text-slate-200">
                      ${selectedTenant.depositPaid.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Emergency Contact
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-slate-200">
                      {selectedTenant.emergencyContact.name} ({selectedTenant.emergencyContact.relationship})
                    </p>
                    <p className="text-slate-400 font-mono">{selectedTenant.emergencyContact.phone}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedTenant.notes && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Management Notes
                    </p>
                    <p className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800 p-3 rounded-xl italic">
                      &quot;{selectedTenant.notes}&quot;
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-400">Select a resident to inspect master file.</p>
            )}
          </div>
        </div>
      ) : (
        /* CRM Lead Pipeline View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Prospect Lead Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              Track applicant inquiries, tour schedules, credit checks, and lease issuance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);

              return (
                <div
                  key={stage}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-bold text-indigo-300">{stage}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="bg-slate-900 border border-slate-800/80 rounded-lg p-3 space-y-1 hover:border-indigo-500/50 transition-all text-xs"
                      >
                        <p className="font-bold text-white">{lead.applicantName}</p>
                        <p className="text-[10px] text-slate-400">{lead.desiredProperty}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                          <span>
                            Budget: ${lead.budgetMin.toLocaleString()}-${lead.budgetMax.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <p className="text-[10px] text-slate-600 text-center py-4 italic">
                        No leads in stage
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
