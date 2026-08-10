import React, { useState } from 'react';
import {
  History,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Code2,
  X,
  FileCode
} from 'lucide-react';
import { store } from '../services/store';
import { DomainEvent } from '../types';

interface AuditEventsViewProps {
  searchTerm: string;
}

export const AuditEventsView: React.FC<AuditEventsViewProps> = ({ searchTerm }) => {
  const events = store.getEventsByTenant();
  const [selectedEvent, setSelectedEvent] = useState<DomainEvent | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');

  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.aggregate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.correlation_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.event_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = eventTypeFilter === 'All' || e.event_type === eventTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Immutable Domain Event Store & Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of all mutations, actor roles, correlation IDs, and payload schema v1 snapshots.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto">
          {['All', 'PropertyCreated', 'LeaseSigned', 'PaymentReceived', 'WorkOrderCreated'].map(t => (
            <button
              key={t}
              onClick={() => setEventTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                eventTypeFilter === t
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Event Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Domain Event Log ({filteredEvents.length} Events Recorded)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Auditable Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Event ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Aggregate ID</th>
                <th className="py-3 px-3">Actor & Role</th>
                <th className="py-3 px-3">Correlation ID</th>
                <th className="py-3 px-3">Occurred At</th>
                <th className="py-3 px-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.map(evt => (
                <tr key={evt.event_id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 text-indigo-400 font-bold">{evt.event_id}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                      {evt.event_type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{evt.aggregate_id}</td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="text-white font-sans font-semibold block">{evt.actor_role}</span>
                    <span className="text-[10px] text-slate-500">{evt.actor_id}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{evt.correlation_id}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(evt.occurred_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[11px] font-sans font-semibold transition-all inline-flex items-center space-x-1"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Inspect JSON</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {selectedEvent.event_id} ({selectedEvent.event_type})
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
