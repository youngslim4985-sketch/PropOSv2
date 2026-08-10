import React, { useState } from 'react';
import { X, Building2, FileText, DollarSign, Wrench, UserPlus, Upload } from 'lucide-react';
import { store } from '../services/store';
import { PropertyType, PropertyStatus, TicketCategory, TicketPriority } from '../types';

interface ModalsProps {
  showNewPropertyModal: boolean;
  setShowNewPropertyModal: (v: boolean) => void;

  showNewLeaseModal: boolean;
  setShowNewLeaseModal: (v: boolean) => void;

  showNewPaymentModal: boolean;
  setShowNewPaymentModal: (v: boolean) => void;

  showNewTicketModal: boolean;
  setShowNewTicketModal: (v: boolean) => void;

  showNewTenantModal: boolean;
  setShowNewTenantModal: (v: boolean) => void;

  showUploadDocModal: boolean;
  setShowUploadDocModal: (v: boolean) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showNewPropertyModal,
  setShowNewPropertyModal,
  showNewLeaseModal,
  setShowNewLeaseModal,
  showNewPaymentModal,
  setShowNewPaymentModal,
  showNewTicketModal,
  setShowNewTicketModal,
  showNewTenantModal,
  setShowNewTenantModal,
  showUploadDocModal,
  setShowUploadDocModal
}) => {
  // New Property Form State
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<PropertyType>('Multi-Family');
  const [propAddress, setPropAddress] = useState('');
  const [propCity, setPropCity] = useState('Austin');
  const [propState, setPropState] = useState('TX');
  const [propZip, setPropZip] = useState('78701');
  const [propTotalUnits, setPropTotalUnits] = useState(12);
  const [propMonthlyRevenue, setPropMonthlyRevenue] = useState(28000);
  const [propManager, setPropManager] = useState('Sarah Jenkins');

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProperty({
      name: propName || 'New Property Complex',
      type: propType,
      address: propAddress || '100 Main St',
      city: propCity,
      state: propState,
      zip: propZip,
      totalUnits: Number(propTotalUnits),
      occupiedUnits: 0,
      monthlyRevenue: Number(propMonthlyRevenue),
      status: 'Active',
      yearBuilt: 2024,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      managerName: propManager,
      amenities: ['EV Charging', 'Smart Lock Access', 'Fitness Lounge'],
      units: []
    });
    setShowNewPropertyModal(false);
    setPropName('');
    setPropAddress('');
  };

  // New Lease Form State
  const properties = store.getPropertiesByTenant();
  const tenants = store.getTenantsByTenant();
  const [leaseTenantName, setLeaseTenantName] = useState('');
  const [leasePropId, setLeasePropId] = useState(properties[0]?.id || '');
  const [leaseUnitNum, setLeaseUnitNum] = useState('101A');
  const [leaseRent, setLeaseRent] = useState(2400);
  const [leaseStart, setLeaseStart] = useState('2026-09-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-08-31');

  const handleCreateLease = (e: React.FormEvent) => {
    e.preventDefault();
    const selProp = properties.find(p => p.id === leasePropId) || properties[0];
    store.addLeaseContract({
      propertyId: selProp?.id || 'prop-101',
      propertyName: selProp?.name || 'Property Complex',
      unitId: `u-${leaseUnitNum}`,
      unitNumber: leaseUnitNum,
      tenantId: `t-${Date.now()}`,
      tenantName: leaseTenantName || 'New Tenant',
      startDate: leaseStart,
      endDate: leaseEnd,
      monthlyRent: Number(leaseRent),
      securityDeposit: Number(leaseRent),
      paymentDueDateDay: 1,
      status: 'Active',
      signedDate: new Date().toISOString().split('T')[0],
      autoRenew: true,
      petPolicy: 'Standard Pet Agreement',
      specialTerms: 'Generated via PropOS Contract Engine'
    });
    setShowNewLeaseModal(false);
    setLeaseTenantName('');
  };

  // New Payment Form State
  const [payAmount, setPayAmount] = useState(2400);
  const [payPayer, setPayPayer] = useState('Alex Rivera');
  const [payDesc, setPayDesc] = useState('August Rent Payment - ACH');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    store.addFinancialTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'Rent Income',
      category: 'Income',
      amount: Number(payAmount),
      payerOrPayee: payPayer,
      description: payDesc,
      status: 'Completed',
      method: 'ACH Direct',
      invoiceNumber: `INV-${Date.now().toString().substring(7)}`
    });
    setShowNewPaymentModal(false);
  };

  // New Maintenance Ticket Form State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>('HVAC');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('High');
  const [ticketTenant, setTicketTenant] = useState('Alex Rivera');
  const [ticketDesc, setTicketDesc] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const selProp = properties[0];
    store.addTicket({
      propertyId: selProp?.id || 'prop-101',
      propertyName: selProp?.name || 'The Grandview',
      unitNumber: '101A',
      tenantName: ticketTenant,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'New',
      title: ticketTitle || 'Maintenance Request',
      description: ticketDesc || 'Issue reported by tenant.',
      slaDueDate: new Date(Date.now() + 86400000).toISOString()
    });
    setShowNewTicketModal(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  // New Tenant Form State
  const [tenantFullName, setTenantFullName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantRent, setTenantRent] = useState(2200);

  const handleOnboardTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const selProp = properties[0];
    store.addTenantProfile({
      fullName: tenantFullName || 'Jane Doe',
      email: tenantEmail || 'jane@example.com',
      phone: tenantPhone || '(512) 555-0100',
      propertyId: selProp?.id || 'prop-101',
      propertyName: selProp?.name || 'The Grandview',
      unitNumber: '202A',
      moveInDate: new Date().toISOString().split('T')[0],
      leaseEndDate: '2027-08-31',
      monthlyRent: Number(tenantRent),
      depositPaid: Number(tenantRent),
      balance: 0,
      status: 'Active',
      creditScore: 760,
      emergencyContact: { name: 'Emergency Contact', phone: '(512) 555-9999', relationship: 'Family' }
    });
    setShowNewTenantModal(false);
    setTenantFullName('');
    setTenantEmail('');
  };

  // Upload Document Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<any>('Lease Agreement');

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    store.addDocument({
      title: docTitle || 'Executed Document.pdf',
      category: docCategory,
      propertyName: properties[0]?.name || 'Property',
      fileSize: '3.4 MB',
      uploadedBy: 'Current Manager',
      summary: 'Uploaded via PropOS Document Center.'
    });
    setShowUploadDocModal(false);
    setDocTitle('');
  };

  return (
    <>
      {/* 1. Add Property Modal */}
      {showNewPropertyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Add Property to Portfolio</span>
              </h3>
              <button onClick={() => setShowNewPropertyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Heights Residences"
                  value={propName}
                  onChange={e => setPropName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Property Type</label>
                  <select
                    value={propType}
                    onChange={e => setPropType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Retail Plaza">Retail Plaza</option>
                    <option value="Industrial Park">Industrial Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Units</label>
                  <input
                    type="number"
                    value={propTotalUnits}
                    onChange={e => setPropTotalUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Congress Ave"
                  value={propAddress}
                  onChange={e => setPropAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={propCity}
                    onChange={e => setPropCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={propState}
                    onChange={e => setPropState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Revenue ($)</label>
                  <input
                    type="number"
                    value={propMonthlyRevenue}
                    onChange={e => setPropMonthlyRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPropertyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                >
                  Create Property & Log Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Issue Lease Modal */}
      {showNewLeaseModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Issue & Sign Lease Agreement</span>
              </h3>
              <button onClick={() => setShowNewLeaseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLease} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tenant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={leaseTenantName}
                  onChange={e => setLeaseTenantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Property</label>
                  <select
                    value={leasePropId}
                    onChange={e => setLeasePropId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit Number</label>
                  <input
                    type="text"
                    value={leaseUnitNum}
                    onChange={e => setLeaseUnitNum(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    value={leaseRent}
                    onChange={e => setLeaseRent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaseStart}
                    onChange={e => setLeaseStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaseEnd}
                    onChange={e => setLeaseEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewLeaseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                >
                  Issue Lease Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Log Payment Modal */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Record Ledger Payment</span>
              </h3>
              <button onClick={() => setShowNewPaymentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Payer / Resident Name</label>
                <input
                  type="text"
                  required
                  value={payPayer}
                  onChange={e => setPayPayer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={payDesc}
                  onChange={e => setPayDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <span>Create Maintenance Work Order</span>
              </h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water leak under bathroom vanity"
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Structural">Structural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  placeholder="Provide detailed observations for vendor dispatch..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Onboard Tenant Modal */}
      {showNewTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <span>Onboard Resident Profile</span>
              </h3>
              <button onClick={() => setShowNewTenantModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardTenant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={tenantFullName}
                  onChange={e => setTenantFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={tenantEmail}
                    onChange={e => setTenantEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="(512) 555-0199"
                    value={tenantPhone}
                    onChange={e => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTenantModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                >
                  Onboard Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Upload Doc Modal */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Upload Document</span>
              </h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fire Safety Certificate 2026.pdf"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Lease Agreement">Lease Agreement</option>
                  <option value="Inspection Report">Inspection Report</option>
                  <option value="Insurance Policy">Insurance Policy</option>
                  <option value="Vendor Contract">Vendor Contract</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
