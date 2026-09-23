import React from 'react';
import {
  FolderGit2,
  Wrench,
  Camera,
  Mail,
  Award,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import type { AdminStats } from '../../api.js';
import type { ContactMessage } from '../../types.js';

interface AdminDashboardOverviewProps {
  stats?: AdminStats | null;
  recentMessages?: ContactMessage[];
  messages?: ContactMessage[];
  skills?: any[];
  projects?: any[];
  experiences?: any[];
  certifications?: any[];
  services?: any[];
  galleryImages?: any[];
  settings?: any;
  onNavigate: (tab: any) => void;
  accentColor?: string;
  onMarkMessageRead?: (id: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  recentMessages,
  messages,
  skills = [],
  projects = [],
  galleryImages = [],
  onNavigate,
  accentColor = '#e5a93c',
  onMarkMessageRead
}) => {
  const safeMessages = Array.isArray(messages) ? messages : (Array.isArray(recentMessages) ? recentMessages : []);
  const unreadCount = safeMessages.filter((m) => !m.read).length;

  const statCards = [
    {
      title: 'Projects',
      count: stats?.projectsCount ?? (Array.isArray(projects) ? projects.length : 0),
      icon: <FolderGit2 className="w-5 h-5 text-sky-400" />,
      tab: 'projects',
      desc: 'Engineering case studies'
    },
    {
      title: 'Skills & Tools',
      count: stats?.skillsCount ?? (Array.isArray(skills) ? skills.length : 0),
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      tab: 'skills',
      desc: 'Competency matrix items'
    },
    {
      title: 'Gallery Photos',
      count: stats?.galleryImagesCount ?? (Array.isArray(galleryImages) ? galleryImages.length : 0),
      icon: <Camera className="w-5 h-5 text-emerald-400" />,
      tab: 'gallery',
      desc: 'Visual journal records'
    },
    {
      title: 'Inquiries',
      count: stats?.unreadMessagesCount ?? unreadCount,
      total: stats?.totalMessagesCount ?? safeMessages.length,
      icon: <Mail className="w-5 h-5 text-rose-400" />,
      tab: 'messages',
      desc: 'Unread client notes'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            System Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Real-time control center for Farhan Tasneem's portfolio and personal database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('cv-builder')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow"
            style={{ backgroundColor: accentColor }}
          >
            <span>Open CV Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={() => onNavigate(card.tab)}
            className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#9ca3af]">{card.title}</span>
              <div className="p-2 rounded-lg bg-[#171b26]">{card.icon}</div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display font-bold text-3xl text-white group-hover:text-amber-300 transition-colors">
                {card.count}
              </span>
              {card.total !== undefined && (
                <span className="text-xs text-[#6b7280]">/ {card.total} total</span>
              )}
            </div>
            <span className="text-[11px] text-[#6b7280] block">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Quick Access Actions */}
      <div>
        <h3 className="text-xs uppercase tracking-wider font-semibold text-[#848ea0] mb-3">
          Quick Workflows
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#12151d] border border-[#202736] hover:border-amber-500/40 text-xs font-medium text-[#e5e7eb] hover:text-white transition-all text-left"
          >
            <Plus className="w-4 h-4 text-amber-400" style={{ color: accentColor }} />
            <span>Add New Project</span>
          </button>

          <button
            onClick={() => onNavigate('gallery')}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#12151d] border border-[#202736] hover:border-amber-500/40 text-xs font-medium text-[#e5e7eb] hover:text-white transition-all text-left"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#12151d] border border-[#202736] hover:border-amber-500/40 text-xs font-medium text-[#e5e7eb] hover:text-white transition-all text-left"
          >
            <Wrench className="w-4 h-4 text-sky-400" />
            <span>Configure Hero</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#12151d] border border-[#202736] hover:border-amber-500/40 text-xs font-medium text-[#e5e7eb] hover:text-white transition-all text-left"
          >
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>Change Accent Color</span>
          </button>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="rounded-xl bg-[#11141c] border border-[#1f2533] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-400" />
            <h3 className="font-semibold text-sm text-white">Recent Messages & Inquiries</h3>
          </div>
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            style={{ color: accentColor }}
          >
            <span>View all inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(!safeMessages || safeMessages.length === 0) ? (
          <div className="text-center py-8 text-xs text-[#6b7280]">
            No messages received yet.
          </div>
        ) : (
          <div className="divide-y divide-[#1c2230]">
            {safeMessages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${msg.read ? 'text-[#9ca3af]' : 'text-white font-bold'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[11px] text-[#6b7280]">({msg.email})</span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black">
                        NEW
                      </span>
                    )}
                  </div>
                  {msg.subject && (
                    <div className="text-xs font-medium text-[#cbd5e1] mb-0.5">{msg.subject}</div>
                  )}
                  <p className="text-xs text-[#848ea0] line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#6b7280] font-mono">{msg.date}</span>
                  {!msg.read && onMarkMessageRead && (
                    <button
                      onClick={() => onMarkMessageRead(msg.id)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-[#1a202d] text-[#cbd5e1] hover:text-white"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
