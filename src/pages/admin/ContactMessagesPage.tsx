import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Clock, CheckCircle, RefreshCw, Search, ChevronDown } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

const STATUS_CONFIG = {
  unread:  { label: 'Unread',  bg: 'bg-red-100',    text: 'text-red-700'    },
  read:    { label: 'Read',    bg: 'bg-amber-100',   text: 'text-amber-700'  },
  replied: { label: 'Replied', bg: 'bg-green-100',   text: 'text-green-700'  },
};

const SUBJECT_LABELS: Record<string, string> = {
  product:  'Product Inquiry',
  order:    'Order Status',
  return:   'Returns & Refunds',
  shipping: 'Shipping',
  feedback: 'Feedback',
  other:    'Other',
  General:  'General',
};

export const ContactMessagesPage: React.FC = () => {
  const [messages, setMessages]   = useState<ContactMessage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selected, setSelected]   = useState<ContactMessage | null>(null);
  const [updating, setUpdating]   = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error('Failed to fetch contact messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: status as any } : m));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = messages.filter(m => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all:     messages.length,
    unread:  messages.filter(m => m.status === 'unread').length,
    read:    messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2723]">Contact Messages</h1>
          <p className="text-sm text-[#7A6A5E] mt-1">
            {counts.unread > 0 ? `${counts.unread} unread message${counts.unread > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-[#8A5A36] text-white text-sm rounded-lg hover:bg-[#6E4223] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'unread', 'read', 'replied'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filterStatus === s
                ? 'bg-[#8A5A36] text-white'
                : 'bg-white border border-[#E3DCCE] text-[#4A3E38] hover:bg-[#FAF8F5]'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              filterStatus === s ? 'bg-white/20 text-white' : 'bg-[#F5EFE9] text-[#8A5A36]'
            }`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7C70]" />
        <input
          type="text"
          placeholder="Search name, email, subject…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-[#E3DCCE] rounded-lg text-sm focus:outline-none focus:border-[#8A5A36] bg-white"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#E3DCCE] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#8A5A36] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Mail className="w-10 h-10 text-[#D4C4B0] mx-auto mb-3" />
              <p className="text-sm text-[#8C7C70]">No messages found</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F5EFE9]">
              {filtered.map(msg => {
                const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.unread;
                return (
                  <li
                    key={msg.id}
                    onClick={() => {
                      setSelected(msg);
                      if (msg.status === 'unread') updateStatus(msg.id, 'read');
                    }}
                    className={`p-4 cursor-pointer transition-colors hover:bg-[#FAF8F5] ${
                      selected?.id === msg.id ? 'bg-[#FDF6EF] border-l-4 border-[#8A5A36]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm font-semibold text-[#2D2723] truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>
                        {msg.name}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#8C7C70] truncate mb-1">{msg.email}</p>
                    <p className="text-xs text-[#8A5A36] font-medium">{SUBJECT_LABELS[msg.subject] || msg.subject}</p>
                    <p className="text-xs text-[#8C7C70] mt-1 line-clamp-1">{msg.message}</p>
                    <p className="text-[10px] text-[#B8A99A] mt-1.5">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 space-y-6">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-[#2D2723]">{selected.name}</h2>
                  <p className="text-sm text-[#7A6A5E]">{selected.email}</p>
                </div>
                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C7C70]">Status:</span>
                  <div className="relative">
                    <select
                      value={selected.status}
                      disabled={updating === selected.id}
                      onChange={e => updateStatus(selected.id, e.target.value)}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#8A5A36] bg-white cursor-pointer"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[#8C7C70]" />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[#8A5A36] shrink-0" />
                  <span className="text-[#2D2723]">{selected.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-[#8A5A36] shrink-0" />
                  <span className="text-[#2D2723]">{SUBJECT_LABELS[selected.subject] || selected.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#8A5A36] shrink-0" />
                  <span className="text-[#7A6A5E]">
                    {new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-[#FAF8F5] rounded-lg p-5 border border-[#EBE3D7]">
                <p className="text-xs font-semibold text-[#8C7C70] uppercase tracking-wider mb-3">Message</p>
                <p className="text-sm text-[#2D2723] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Reply Link */}
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] || selected.subject} - Nestania Support`}
                  onClick={() => updateStatus(selected.id, 'replied')}
                  className="inline-flex items-center gap-2 bg-[#8A5A36] hover:bg-[#6E4223] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
                {selected.status !== 'replied' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'replied')}
                    disabled={updating === selected.id}
                    className="inline-flex items-center gap-2 border border-[#8A5A36] text-[#8A5A36] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#FAF0E6] transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E3DCCE] flex items-center justify-center h-80">
              <div className="text-center">
                <Mail className="w-12 h-12 text-[#D4C4B0] mx-auto mb-3" />
                <p className="text-sm text-[#8C7C70]">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
