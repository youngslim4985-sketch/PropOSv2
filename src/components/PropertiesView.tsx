import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Home,
  CheckCircle,
  XCircle,
  DollarSign,
  Layers,
  Search,
  Filter,
  User,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { store } from '../services/store';
import { Property, PropertyType, PropertyStatus, PropertyUnit } from '../types';

interface PropertiesViewProps {
  onOpenNewPropertyModal: () => void;
  searchTerm: string;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  onOpenNewPropertyModal,
  searchTerm
}) => {
  const properties = store.getPropertiesByTenant();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [filterType, setFilterType] = useState<string>('All');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);

  // New unit form state
  const [unitNumber, setUnitNumber] = useState('');
  const [unitType, setUnitType] = useState<PropertyUnit['type']>('2BR');
  const [unitSqft, setUnitSqft] = useState(950);
  const [unitMarketRent, setUnitMarketRent] = useState(2500);
  const [unitFloor, setUnitFloor] = useState(1);

  const filteredProperties = properties.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !unitNumber) return;

    store.addUnitToProperty(selectedProperty.id, {
      unitNumber,
      type: unitType,
      sqft: Number(unitSqft),
      marketRent: Number(unitMarketRent),
      currentRent: 0,
      status: 'Vacant',
      floor: Number(unitFloor)
    });

    setShowAddUnitModal(false);
    setUnitNumber('');
    // refresh selected property reference
    const updated = store.getPropertiesByTenant().find(p => p.id === selectedProperty.id);
    if (updated) setSelectedProperty(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Property & Unit Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage multi-family complexes, commercial suites, unit inventories, and occupancy specs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Property Type Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            {['All', 'Multi-Family', 'Commercial Office', 'Retail Plaza'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === t
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewPropertyModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Property Grid + Selected Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Property Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProperties.map(prop => {
              const isSelected = selectedProperty?.id === prop.id;
              const occPct = Math.round((prop.occupiedUnits / prop.totalUnits) * 100);

              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className={`bg-slate-900 rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-36 w-full">
                    <img
                      src={prop.imageUrl}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 text-[10px] font-mono font-semibold border border-slate-700/80 backdrop-blur-sm">
                        {prop.type}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white drop-shadow-sm">{prop.name}</h3>
                        <p className="text-[11px] text-slate-300 flex items-center space-x-1 drop-shadow-sm">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>
                            {prop.address}, {prop.city}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-slate-400">
                        Units: <strong className="text-slate-200">{prop.occupiedUnits}/{prop.totalUnits}</strong>
                      </div>
                      <div className="text-emerald-400 font-mono font-semibold">
                        ${prop.monthlyRevenue.toLocaleString()}/mo
                      </div>
                    </div>

                    {/* Progress Bar for Occupancy */}
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Occupancy</span>
                        <span>{occPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${occPct}%` }}
                          className={`h-full rounded-full ${
                            occPct > 85 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>Manager: {prop.managerName}</span>
                      </span>
                      <span className="font-mono text-indigo-400">Built {prop.yearBuilt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Unit Directory Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          {selectedProperty ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                    Property Unit Directory
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedProperty.name}</h2>
                  <p className="text-xs text-slate-400">
                    {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUnitModal(true)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Unit</span>
                </button>
              </div>

              {/* Amenities tags */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Property Amenities & Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProperty.amenities.map(a => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Unit Specs ({selectedProperty.units.length} Units Listed)
                  </p>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {selectedProperty.units.map(unit => (
                    <div
                      key={unit.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">
                            {unit.unitNumber}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                            {unit.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {unit.sqft} sqft
                          </span>
                        </div>

                        {unit.tenantName ? (
                          <p className="text-[11px] text-indigo-300 font-medium">
                            Tenant: {unit.tenantName} (Lease ends {unit.leaseEndDate})
                          </p>
                        ) : (
                          <p className="text-[11px] text-emerald-400 font-medium">
                            Ready for Lease
                          </p>
                        )}
                      </div>

                      <div className="text-right space-y-1">
                        <span className="font-mono font-bold text-white block">
                          ${unit.marketRent.toLocaleString()}/mo
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block ${
                            unit.status === 'Occupied'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : unit.status === 'Vacant'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          }`}
                        >
                          {unit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Select a property to view unit breakdown.</p>
          )}
        </div>
      </div>

      {/* Add Unit Modal */}
      {showAddUnitModal && selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Add Unit to {selectedProperty.name}
              </h3>
              <button
                onClick={() => setShowAddUnitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Unit / Suite Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 402B or Suite 210"
                  value={unitNumber}
                  onChange={e => setUnitNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit Layout</label>
                  <select
                    value={unitType}
                    onChange={e => setUnitType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  >
                    <option value="Studio">Studio</option>
                    <option value="1BR">1 Bedroom</option>
                    <option value="2BR">2 Bedroom</option>
                    <option value="3BR">3 Bedroom</option>
                    <option value="Commercial Suite">Commercial Suite</option>
                    <option value="Retail Bay">Retail Bay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Square Feet</label>
                  <input
                    type="number"
                    value={unitSqft}
                    onChange={e => setUnitSqft(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Market Rent ($/mo)
                  </label>
                  <input
                    type="number"
                    value={unitMarketRent}
                    onChange={e => setUnitMarketRent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={unitFloor}
                    onChange={e => setUnitFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
