import React from 'react';
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  Wrench,
  FolderKanban,
  Bot,
  History,
  ShieldCheck,
  LayoutDashboard,
  Search,
  ChevronDown,
  Layers,
  Sparkles,
  Building
} from 'lucide-react';
import { store } from '../services/store';
import { TenantId, UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'properties'
  | 'tenants'
  | 'leases'
  | 'financials'
  | 'workflows'
  | 'documents'
  | 'ai'
  | 'audit'
  | 'governance';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm
}) => {
  const activeOrg = store.getActiveTenantOrg();
  const activeRole = store.activeRole;
  const [tenantDropdownOpen, setTenantDropdownOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const roles: UserRole[] = [
    'Super Admin',
    'Property Manager',
    'Leasing Agent',
    'Maintenance Lead',
    'Financial Auditor'
  ];

  const handleTenantSelect = (id: TenantId) => {
    store.setActiveTenant(id);
    setTenantDropdownOpen(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    store.setActiveRole(role);
    setRoleDropdownOpen(false);
  };

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties & Units', icon: Building2 },
    { id: 'tenants', label: 'Tenants & CRM', icon: Users },
    { id: 'leases', label: 'Leases & Contracts', icon: FileText },
    { id: 'financials', label: 'Accounting & Rent Roll', icon: DollarSign },
    { id: 'workflows', label: 'Maintenance & Operations', icon: Wrench },
    { id: 'documents', label: 'Document Intelligence', icon: FolderKanban },
    { id: 'ai', label: 'PropOS AI Assistant', icon: Bot },
    { id: 'audit', label: 'Audit Log & Events', icon: History },
    { id: 'governance', label: 'T&F Governance & ADRs', icon: ShieldCheck }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      {/* Top Banner / Tenant & Role Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80 py-2">
          {/* Logo & Product Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">PropOS</span>
                <span className="text-[10px] uppercase tracking-wider font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.4 Production
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  T&F Standard Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Property Operations Infrastructure
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search properties, tenants, leases, tickets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right Selectors: Multi-Tenant Switcher & Role Selector */}
          <div className="flex items-center space-x-3">
            {/* Multi-tenant Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setTenantDropdownOpen(!tenantDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-xs font-medium text-slate-200"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline font-mono text-[11px] text-indigo-300 font-semibold uppercase">
                  [{activeOrg.code}]
                </span>
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{activeOrg.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {tenantDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Select Multi-Tenant Boundary
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Enforces database RLS & domain isolation (\`tenant_id\`)
                    </p>
                  </div>
                  <div className="space-y-1">
                    {store.tenantOrgs.map(org => (
                      <button
                        key={org.id}
                        onClick={() => handleTenantSelect(org.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          org.id === activeOrg.id
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-[10px] text-indigo-400 font-bold">
                              {org.code}
                            </span>
                            <span className="truncate">{org.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {org.portfolioSize} Units • {org.plan} Plan
                          </span>
                        </div>
                        {org.id === activeOrg.id && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setTenantDropdownOpen(false);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-xs font-medium text-indigo-200 hover:bg-indigo-900/60 transition-all"
              >
                <span className="text-slate-400 text-[10px] uppercase font-mono">Role:</span>
                <span className="font-semibold text-indigo-300">{activeRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2">
                  <div className="px-3 py-1.5 border-b border-slate-800 mb-1">
                    <p className="text-[11px] font-semibold text-slate-400">Switch User Role</p>
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        r === activeRole
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'ai' && (
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
