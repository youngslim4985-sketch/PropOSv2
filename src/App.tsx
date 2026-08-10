import React, { useState } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { TenantsCrmView } from './components/TenantsCrmView';
import { LeasesView } from './components/LeasesView';
import { AccountingView } from './components/AccountingView';
import { WorkflowsView } from './components/WorkflowsView';
import { DocumentsView } from './components/DocumentsView';
import { AiOpsView } from './components/AiOpsView';
import { AuditEventsView } from './components/AuditEventsView';
import { GovernanceView } from './components/GovernanceView';
import { Modals } from './components/Modals';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal visibility states
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
  const [showNewLeaseModal, setShowNewLeaseModal] = useState(false);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenNewPropertyModal={() => setShowNewPropertyModal(true)}
            onOpenNewLeaseModal={() => setShowNewLeaseModal(true)}
            onOpenNewPaymentModal={() => setShowNewPaymentModal(true)}
            onOpenNewTicketModal={() => setShowNewTicketModal(true)}
          />
        )}

        {activeTab === 'properties' && (
          <PropertiesView
            onOpenNewPropertyModal={() => setShowNewPropertyModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'tenants' && (
          <TenantsCrmView
            onOpenNewTenantModal={() => setShowNewTenantModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'leases' && (
          <LeasesView
            onOpenNewLeaseModal={() => setShowNewLeaseModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'financials' && (
          <AccountingView
            onOpenNewPaymentModal={() => setShowNewPaymentModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'workflows' && (
          <WorkflowsView
            onOpenNewTicketModal={() => setShowNewTicketModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsView
            onOpenUploadDocModal={() => setShowUploadDocModal(true)}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'ai' && <AiOpsView />}

        {activeTab === 'audit' && <AuditEventsView searchTerm={searchTerm} />}

        {activeTab === 'governance' && <GovernanceView />}
      </main>

      {/* Global Modals */}
      <Modals
        showNewPropertyModal={showNewPropertyModal}
        setShowNewPropertyModal={setShowNewPropertyModal}
        showNewLeaseModal={showNewLeaseModal}
        setShowNewLeaseModal={setShowNewLeaseModal}
        showNewPaymentModal={showNewPaymentModal}
        setShowNewPaymentModal={setShowNewPaymentModal}
        showNewTicketModal={showNewTicketModal}
        setShowNewTicketModal={setShowNewTicketModal}
        showNewTenantModal={showNewTenantModal}
        setShowNewTenantModal={setShowNewTenantModal}
        showUploadDocModal={showUploadDocModal}
        setShowUploadDocModal={setShowUploadDocModal}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-mono">
          <div>
            PropOS-v2 • Multi-Tenant Property Operations Platform • T&F Standard Compliant
          </div>
          <div className="flex items-center space-x-4">
            <span>Server: Express + Gemini 3.6 Flash</span>
            <span>RLS Active</span>
            <button
              onClick={() => setActiveTab('governance')}
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              tf-standard-kit Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
