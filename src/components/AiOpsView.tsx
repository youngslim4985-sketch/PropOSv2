import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Building,
  FileText,
  DollarSign,
  Wrench,
  Loader2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { store } from '../services/store';
import { AiChatMessage } from '../types';

export const AiOpsView: React.FC = () => {
  const activeOrg = store.getActiveTenantOrg();
  const properties = store.getPropertiesByTenant();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello! I am PropOS AI Operations Assistant powered by Gemini 3.6 Flash.
I am configured with full multi-tenant context for **${activeOrg.name}**. How can I assist with your property operations today?`,
      suggestedActions: [
        { label: 'Draft Overdue Rent Notice', actionType: 'create_notice' },
        { label: 'Analyze Portfolio NOI', actionType: 'filter_delinquency' }
      ]
    }
  ]);

  const quickPrompts = [
    'Draft a 5-day formal notice to pay or quit for Samantha Chen (Unit 101B, $2,800 overdue).',
    'Calculate net operating income (NOI) trends across Austin properties and highlight risk areas.',
    'Draft a 3% commercial NNN annual rent escalation notice for Nexus AI Systems (Suite 300).',
    'Create a tenant communication template regarding summer HVAC thermostat optimization.'
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            orgName: activeOrg.name,
            portfolioSize: activeOrg.portfolioSize,
            occupancyRate: '92%',
            delinquency: 2800
          }
        })
      });

      const data = await res.json();

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.reply || 'I processed your request.',
        suggestedActions: data.suggestedActions
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Ops error:', err);
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'I ran into an issue connecting to the AI operational server. Please try again or check server logs.'
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>PropOS AI Assistant (Gemini 3.6 Flash)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Server-side AI operations center for lease drafting, delinquency notices, NOI analysis, and maintenance advice.
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-xs border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse mr-1" />
          <span>Active Context: {activeOrg.code}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Prompts Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Operational Quick Prompts</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click any standard task to generate instant AI documents and analysis
            </p>
          </div>

          <div className="space-y-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={loading}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 text-xs text-slate-200 transition-all space-y-1 group"
              >
                <p className="font-semibold text-slate-100 group-hover:text-indigo-300 leading-snug">
                  {p}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Console (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[600px]">
          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {chatHistory.map(msg => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 border border-indigo-500/30 text-indigo-400'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[82%] space-y-1.5 ${isUser ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {isUser ? 'You' : 'PropOS AI Assistant'}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap relative group shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}

                      {!isUser && (
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="absolute top-2 right-2 p-1 rounded bg-slate-900/80 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy response text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs text-indigo-300 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Gemini 3.6 Flash analyzing property records...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask PropOS AI about rent roll, lease drafting, maintenance triage..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
