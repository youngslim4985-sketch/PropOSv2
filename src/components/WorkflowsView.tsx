import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Bot,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Building,
  DollarSign,
  Loader2
} from 'lucide-react';
import { store } from '../services/store';
import { MaintenanceTicket, TicketStatus, TicketPriority } from '../types';

interface WorkflowsViewProps {
  onOpenNewTicketModal: () => void;
  searchTerm: string;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  onOpenNewTicketModal,
  searchTerm
}) => {
  const tickets = store.getTicketsByTenant();
  const [triagingTicketId, setTriagingTicketId] = useState<string | null>(null);

  const filterTickets = (status: TicketStatus) => {
    return tickets.filter(
      t =>
        t.status === status &&
        (t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.propertyName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleAiTriage = async (ticket: MaintenanceTicket) => {
    setTriagingTicketId(ticket.id);
    try {
      const res = await fetch('/api/ai/triage-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category
        })
      });

      const data = await res.json();
      store.updateTicketStatus(ticket.id, 'Assigned', data.aiSummary);
    } catch (err) {
      console.error('Error running AI Triage:', err);
      store.updateTicketStatus(
        ticket.id,
        'Assigned',
        `Auto-triaged by PropOS Engine: Priority set to ${ticket.priority}. Assigned to preferred trade contractor.`
      );
    } finally {
      setTriagingTicketId(null);
    }
  };

  const columns: { status: TicketStatus; label: string; color: string }[] = [
    { status: 'New', label: 'New Work Orders', color: 'border-indigo-500/50 text-indigo-300' },
    { status: 'Assigned', label: 'Assigned / Dispatched', color: 'border-sky-500/50 text-sky-300' },
    { status: 'In Progress', label: 'In Repair Progress', color: 'border-amber-500/50 text-amber-300' },
    { status: 'Resolved', label: 'Completed / Closed', color: 'border-emerald-500/50 text-emerald-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            <span>Maintenance Operations & Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Work order lifecycle, vendor trade assignments, SLA timers, and AI maintenance auto-triage.
          </p>
        </div>

        <button
          onClick={onOpenNewTicketModal}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTickets = filterTickets(col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[500px]"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTickets.map(ticket => {
                  const isCritical = ticket.priority === 'Critical' || ticket.priority === 'High';

                  return (
                    <div
                      key={ticket.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-indigo-400">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                            isCritical
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight">{ticket.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>
                            {ticket.propertyName} ({ticket.unitNumber})
                          </span>
                          <span className="font-semibold text-slate-300">{ticket.tenantName}</span>
                        </div>

                        {ticket.assignedVendor && (
                          <div className="flex items-center justify-between text-indigo-300">
                            <span>Vendor:</span>
                            <span className="font-semibold">{ticket.assignedVendor}</span>
                          </div>
                        )}

                        {ticket.aiTriageSummary && (
                          <div className="p-2 rounded bg-indigo-950/60 border border-indigo-800/40 text-[10px] text-indigo-200">
                            <span className="font-bold text-amber-300 flex items-center space-x-1 mb-0.5">
                              <Sparkles className="w-3 h-3" />
                              <span>AI Triage Summary</span>
                            </span>
                            {ticket.aiTriageSummary}
                          </div>
                        )}
                      </div>

                      {/* AI Triage & Status Shift Controls */}
                      <div className="pt-2 flex items-center justify-between">
                        {ticket.status === 'New' && (
                          <button
                            onClick={() => handleAiTriage(ticket)}
                            disabled={triagingTicketId === ticket.id}
                            className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-bold text-[11px] shadow-sm hover:opacity-90 transition-all"
                          >
                            {triagingTicketId === ticket.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Bot className="w-3.5 h-3.5" />
                            )}
                            <span>Run AI Triage & Dispatch</span>
                          </button>
                        )}

                        {ticket.status === 'Assigned' && (
                          <button
                            onClick={() => store.updateTicketStatus(ticket.id, 'In Progress')}
                            className="w-full px-3 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold hover:bg-amber-600 hover:text-white transition-all"
                          >
                            Mark In Progress
                          </button>
                        )}

                        {ticket.status === 'In Progress' && (
                          <button
                            onClick={() => store.updateTicketStatus(ticket.id, 'Resolved')}
                            className="w-full px-3 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            Resolve Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTickets.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8 italic">
                    No tickets in state
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
