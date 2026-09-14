import React, { useState } from 'react';
import { Save, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import type { SiteSettings } from '../../types.js';
import { api } from '../../api.js';

interface AdminHeroSettingsProps {
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
  accentColor?: string;
}

export const AdminHeroSettings: React.FC<AdminHeroSettingsProps> = ({
  settings,
  onSettingsUpdated,
  accentColor = '#e5a93c'
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save hero settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, heroImage: url }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Hero Imagery & Visual Frame
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Customize the personal hero portrait, positioning, geometric framing, and atmospheric badge.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hero visual configuration saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form controls */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-5">
            <h3 className="font-semibold text-sm text-white">Portrait Image Source</h3>
            
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Image URL or Local Upload
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
                />
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#181c25] border border-[#2a3244] text-xs text-white cursor-pointer hover:border-amber-500/50">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                  Object Position Focus
                </label>
                <select
                  value={formData.heroImagePosition}
                  onChange={(e) => setFormData({ ...formData, heroImagePosition: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                >
                  <option value="center">Center</option>
                  <option value="top">Top (Headshot focus)</option>
                  <option value="50% 25%">Upper 25%</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                  Frame Style
                </label>
                <select
                  value={formData.heroImageStyle}
                  onChange={(e) => setFormData({ ...formData, heroImageStyle: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                >
                  <option value="standard">Standard Seamless Edge</option>
                  <option value="framed">Double Padded Border Frame</option>
                  <option value="circle">Rounded Architecture</option>
                </select>
              </div>
            </div>

            {/* Decorative background element toggle */}
            <div className="pt-4 border-t border-[#1c2230] space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.heroBgElement}
                  onChange={(e) => setFormData({ ...formData, heroBgElement: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0c0e12] border-[#2a3244] text-amber-500 focus:ring-0"
                />
                <span className="text-xs font-medium text-[#e5e7eb]">
                  Enable Geometric Decorative Frame & Accent Brackets Behind Portrait
                </span>
              </label>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                  Vertical Ribbon Badge Text
                </label>
                <input
                  type="text"
                  value={formData.heroBadgeText}
                  onChange={(e) => setFormData({ ...formData, heroBadgeText: e.target.value })}
                  placeholder="Build • Learn • Create"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533]">
            <span className="text-xs uppercase tracking-wider text-[#6b7280] font-semibold block mb-4">
              Real-time Portrait Preview
            </span>

            <div className="relative mx-auto aspect-[3/4] max-w-[280px] rounded-xl overflow-hidden border border-[#222732] bg-[#0c0e12] shadow-2xl">
              {formData.heroBgElement && (
                <div
                  className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 z-10"
                  style={{ borderColor: accentColor }}
                />
              )}
              <img
                src={formData.heroImage || '/src/assets/images/farhan_hero_portrait_1789381757896.jpg'}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                style={{ objectPosition: formData.heroImagePosition || 'center' }}
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0e12] to-transparent pointer-events-none" />
            </div>

            <div className="text-center mt-4">
              <span className="text-xs text-[#848ea0] font-mono">
                Badge: {formData.heroBadgeText}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
