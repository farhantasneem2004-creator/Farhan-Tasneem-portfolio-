import React, { useState } from 'react';
import { Mail, Check, Trash2, MailOpen, X, Reply } from 'lucide-react';
import type { ContactMessage } from '../../types.js';
import { api } from '../../api.js';

interface AdminMessagesManagerProps {
  messages?: ContactMessage[];
  onMessagesUpdated: () => void;
  accentColor?: string;
}

export const AdminMessagesManager: React.FC<AdminMessagesManagerProps> = ({
  messages = [],
  onMessagesUpdated,
  accentColor = '#e5a93c'
}) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await api.markMessageRead(msg.id, !msg.read);
      onMessagesUpdated();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: !msg.read });
      }
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from "${name}"?`)) return;
    try {
      await api.deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      onMessagesUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      await api.markMessageRead(msg.id, true);
      onMessagesUpdated();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Contact Inquiries & Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Review client inquiries, collaboration requests, and commissioning notes submitted via the portfolio.
          </p>
        </div>
      </div>

      {(!messages || messages.length === 0) ? (
        <div className="p-12 text-center rounded-xl bg-[#11141c] border border-dashed border-[#242c3d]">
          <Mail className="w-8 h-8 text-[#6b7280] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">Inbox Empty</h3>
          <p className="text-xs text-[#848ea0]">No messages have been submitted through the contact form yet.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-[#11141c] border border-[#1f2533] overflow-hidden">
          <div className="divide-y divide-[#1b212f]">
            {(messages || []).map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  msg.read ? 'hover:bg-[#131722]' : 'bg-[#141824] hover:bg-[#181d2c]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`text-sm ${msg.read ? 'text-[#cbd5e1]' : 'font-bold text-white'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-[#6b7280]">({msg.email})</span>
                    {!msg.read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                        NEW
                      </span>
                    )}
                  </div>

                  {msg.subject && (
                    <div className="text-xs font-semibold text-amber-400/90 mb-1" style={{ color: accentColor }}>
                      {msg.subject}
                    </div>
                  )}

                  <p className="text-xs text-[#848ea0] line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <span className="text-[11px] font-mono text-[#6b7280]">{msg.date}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(msg);
                    }}
                    className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1f2638]"
                    title={msg.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {msg.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id, msg.name);
                    }}
                    className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#1f2533]">
              <div>
                <h3 className="font-bold text-lg text-white mb-1">
                  {selectedMessage.subject || 'Direct Inquiry'}
                </h3>
                <div className="text-xs text-[#9ca3af]">
                  From <span className="font-semibold text-white">{selectedMessage.name}</span> ({selectedMessage.email})
                </div>
                <div className="text-[11px] font-mono text-[#6b7280] mt-1">{selectedMessage.date}</div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-[#9ca3af] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#1f2533] text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1f2533]">
              <button
                onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
