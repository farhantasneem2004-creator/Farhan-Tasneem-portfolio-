import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Share2, ExternalLink } from 'lucide-react';
import type { SocialLink } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';
import { api } from '../../api.js';

interface AdminSocialLinksManagerProps {
  socialLinks?: SocialLink[];
  onSocialLinksUpdated: () => void;
  accentColor?: string;
}

export const AdminSocialLinksManager: React.FC<AdminSocialLinksManagerProps> = ({
  socialLinks = [],
  onSocialLinksUpdated,
  accentColor = '#e5a93c'
}) => {
  const [links, setLinks] = useState<SocialLink[]>([...(socialLinks || [])]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState<Omit<SocialLink, 'id'>>({
    platform: 'GitHub',
    url: '',
    label: '',
    icon: 'Github',
    order: (links?.length || 0) + 1,
    visible: true
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setLinks([...(socialLinks || [])]);
  }, [socialLinks]);

  const platforms = ['GitHub', 'LinkedIn', 'Fiverr', 'Facebook', 'Instagram', 'YouTube', 'X', 'Custom'];

  const handleOpenCreate = () => {
    setEditingLink(null);
    setFormData({
      platform: 'GitHub',
      url: 'https://github.com/',
      label: 'GitHub Profile',
      icon: 'Github',
      order: (links?.length || 0) + 1,
      visible: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (l: SocialLink) => {
    setEditingLink(l);
    setFormData({
      platform: l.platform,
      url: l.url,
      label: l.label,
      icon: l.icon || l.platform,
      order: l.order,
      visible: l.visible
    });
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updated: SocialLink[];
      if (editingLink) {
        updated = links.map((l) => (l.id === editingLink.id ? { ...l, ...formData } : l));
      } else {
        const newLink: SocialLink = {
          id: `soc_${Date.now()}`,
          ...formData
        };
        updated = [...links, newLink];
      }
      await api.updateSocialLinks(updated);
      setLinks(updated);
      setModalOpen(false);
      onSocialLinksUpdated();
    } catch (err: any) {
      alert('Failed to save social links: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social channel?')) return;
    try {
      const updated = links.filter((l) => l.id !== id);
      await api.updateSocialLinks(updated);
      setLinks(updated);
      onSocialLinksUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleToggleVisible = async (id: string) => {
    try {
      const updated = links.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l));
      await api.updateSocialLinks(updated);
      setLinks(updated);
      onSocialLinksUpdated();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Social Channels & Public Profiles
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Configure dynamic social links (GitHub, LinkedIn, Fiverr, Facebook, Instagram, YouTube, X).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Channel</span>
        </button>
      </div>

      <div className="rounded-xl bg-[#11141c] border border-[#1f2533] overflow-hidden">
        <div className="divide-y divide-[#1b212f]">
          {(links || []).map((link) => (
            <div key={link.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-[#161b25] text-amber-400 border border-[#232a3a]" style={{ color: accentColor }}>
                  <DynamicIcon name={link.platform} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    <span>{link.label || link.platform}</span>
                    <span className="text-xs text-[#6b7280]">({link.platform})</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#848ea0] hover:text-white truncate block flex items-center gap-1 font-mono mt-0.5"
                  >
                    <span>{link.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleVisible(link.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                    link.visible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {link.visible ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleOpenEdit(link)}
                  className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingLink ? 'Edit Social Channel' : 'Add Social Channel'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => {
                    const plat = e.target.value;
                    setFormData({
                      ...formData,
                      platform: plat,
                      label: `${plat} Profile`
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Profile URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Display Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. GitHub Profile / LinkedIn"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2533]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  {saving ? 'Saving...' : 'Save Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
