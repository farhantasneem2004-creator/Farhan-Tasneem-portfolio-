import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  LayoutPanelLeft,
  Wrench,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Feather,
  Camera,
  FileText,
  Mail,
  Share2,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import type { SiteSettings } from '../../types.js';

export type AdminTab =
  | 'overview'
  | 'landing-page-editor'
  | 'profile'
  | 'hero'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'services'
  | 'gallery'
  | 'cv-builder'
  | 'messages'
  | 'social-links'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  settings: SiteSettings;
  unreadCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  onViewPublicSite,
  settings,
  unreadCount,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(currentTab === 'landing-page-editor');
  const accent = settings.accentColor || '#e5a93c';
  const isEditor = currentTab === 'landing-page-editor';

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'landing-page-editor', label: 'Landing Page Editor', icon: <LayoutPanelLeft className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile & Bio', icon: <User className="w-4 h-4" /> },
    { id: 'hero', label: 'Hero & Imagery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills & Proficiencies', icon: <Wrench className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects & Case Studies', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'experience', label: 'Career Timeline', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Education & Academics', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'services', label: 'Creative Offerings', icon: <Feather className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Albums', icon: <Camera className="w-4 h-4" /> },
    { id: 'cv-builder', label: 'Curriculum Vitae Builder', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'messages',
      label: 'Contact Inquiries',
      icon: <Mail className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { id: 'social-links', label: 'Social Channels', icon: <Share2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Website Settings & Accent', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#e5e7eb] flex flex-col lg:flex-row">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0d1016] border-b border-[#1b202c]">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-lg text-white">Farhan</span>
          <span className="font-display font-extrabold text-lg" style={{ color: accent }}>
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="p-2 rounded-lg bg-[#141822] text-[#9ca3af] hover:text-white border border-[#222938]"
            title="Preview Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-[#141822] text-[#9ca3af] hover:text-white border border-[#222938]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#0c0f15] border-r border-[#1a1f2c] flex flex-col justify-between transform transition-all duration-300 ease-in-out lg:static ${
          desktopSidebarCollapsed ? 'lg:w-16' : 'lg:w-72'
        } ${
          mobileSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand & Public Link */}
        <div>
          <div className={`p-4 border-b border-[#181d28] flex items-center ${desktopSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!desktopSidebarCollapsed && (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-xl text-white">Farhan</span>
                  <span className="font-display font-extrabold text-xl" style={{ color: accent }}>
                    Tasneem
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] block mt-0.5">
                  Control Studio v2.4
                </span>
              </div>
            )}

            {desktopSidebarCollapsed && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border border-[#242b3b]"
                style={{ backgroundColor: `${accent}15`, color: accent }}
                title="Farhan Admin Control Studio"
              >
                FT
              </div>
            )}

            <div className="flex items-center gap-1">
              {!desktopSidebarCollapsed && (
                <button
                  onClick={onViewPublicSite}
                  className="p-2 rounded-lg text-[#9ca3af] hover:text-white bg-[#131720] border border-[#202634] hover:border-amber-500/40 transition-colors"
                  title="View Public Portfolio"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              {/* Desktop Sidebar Collapse Toggle */}
              <button
                type="button"
                onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-lg text-[#9ca3af] hover:text-white bg-[#131720] border border-[#202634] hover:border-amber-500/40 transition-colors"
                title={desktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icon Rail'}
              >
                {desktopSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-amber-400" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={desktopSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    desktopSidebarCollapsed
                      ? 'justify-center p-3'
                      : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'text-white bg-[#181d28] font-semibold border border-[#283144] shadow-sm'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#121620]'
                  }`}
                  style={
                    isActive
                      ? {
                          borderLeftWidth: desktopSidebarCollapsed ? '1px' : '3px',
                          borderLeftColor: accent
                        }
                      : {}
                  }
                >
                  <div className={`flex items-center ${desktopSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <span style={{ color: isActive ? accent : undefined }}>{item.icon}</span>
                    {!desktopSidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!desktopSidebarCollapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                      {item.badge}
                    </span>
                  )}
                  {desktopSidebarCollapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 lg:p-3 border-t border-[#181d28] space-y-2">
          {!desktopSidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#10131b] border border-[#1d222f]">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                  FT
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-medium text-white block truncate">Farhan Tasneem</span>
                  <span className="text-[10px] text-[#6b7280] block truncate">farhantasneem2004@gmail.com</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Admin</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300 border border-amber-500/30 cursor-pointer"
                title="Farhan Tasneem (Admin)"
              >
                FT
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-w-0 ${isEditor ? 'p-0 overflow-hidden h-screen flex flex-col' : 'p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen'}`}>
        {isEditor ? (
          children
        ) : (
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        )}
      </main>

    </div>
  );
};
