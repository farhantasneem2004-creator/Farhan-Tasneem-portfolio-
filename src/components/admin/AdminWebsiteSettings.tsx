import React, { useState } from 'react';
import { Save, CheckCircle2, Sliders, Palette, ShieldCheck } from 'lucide-react';
import type { SiteSettings } from '../../types.js';
import { api } from '../../api.js';

interface AdminWebsiteSettingsProps {
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
}

export const AdminWebsiteSettings: React.FC<AdminWebsiteSettingsProps> = ({
  settings,
  onSettingsUpdated
}) => {
  const [formData, setFormData] = useState<SiteSettings>({
    ...settings,
    sectionVisibility: settings?.sectionVisibility || {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      certifications: true,
      services: true,
      gallery: true,
      contact: true
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
        sectionVisibility: settings.sectionVisibility || prev.sectionVisibility
      }));
    }
  }, [settings]);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [credMessage, setCredMessage] = useState<string | null>(null);

  const accentPalette = [
    { label: 'Amber Gold (Default)', hex: '#e5a93c' },
    { label: 'Warm Ochre', hex: '#d97706' },
    { label: 'Terracotta Rust', hex: '#c2410c' },
    { label: 'Minimal Emerald', hex: '#10b981' },
    { label: 'Steel Cyan', hex: '#06b6d4' },
    { label: 'Architect Sky', hex: '#0284c7' },
    { label: 'Deep Indigo', hex: '#6366f1' },
    { label: 'Editorial Rose', hex: '#f43f5e' }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateCredentials({ currentPassword, newPassword });
      setCredMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setCredMessage(null), 3000);
    } catch (err: any) {
      alert('Password update failed: ' + err.message);
    }
  };

  const toggleSection = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...(prev.sectionVisibility || {}),
        [key]: !((prev.sectionVisibility as any)?.[key] ?? true)
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            System & Atmosphere Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Configure site accent colors, public section visibility, CV download permissions, and security.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: formData.accentColor || '#e5a93c' }}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website settings and color scheme updated live!</span>
        </div>
      )}

      {/* Accent Color Palette Switcher */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: formData.accentColor }} />
          <span>Accent Color Configuration</span>
        </h3>
        <p className="text-xs text-[#848ea0]">
          The website uses a deep charcoal canvas with off-white typography and one subtle accent color. Choose a curated swatch or specify a custom hex code.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accentPalette.map((item) => (
            <button
              key={item.hex}
              onClick={() => setFormData({ ...formData, accentColor: item.hex })}
              className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                formData.accentColor?.toLowerCase() === item.hex.toLowerCase()
                  ? 'border-white/50 bg-[#191e2b]'
                  : 'border-[#222938] bg-[#141822] hover:border-[#354157]'
              }`}
            >
              <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: item.hex }} />
              <span className="text-xs font-medium text-[#e5e7eb] truncate">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs text-[#9ca3af]">Custom Hex Code:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.accentColor || '#e5a93c'}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              className="w-8 h-8 rounded bg-transparent cursor-pointer border-0"
            />
            <input
              type="text"
              value={formData.accentColor}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              className="w-28 px-2.5 py-1.5 rounded bg-[#0c0e12] border border-[#232938] text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Public Section Toggles */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" style={{ color: formData.accentColor }} />
          <span>Public Section Visibility Toggles</span>
        </h3>
        <p className="text-xs text-[#848ea0]">
          Toggle visibility of any section on the public website.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'about', label: 'About Me Section' },
            { key: 'skills', label: 'Skills & Proficiencies' },
            { key: 'projects', label: 'Projects & Case Studies' },
            { key: 'experience', label: 'Experience Timeline' },
            { key: 'education', label: 'Education & Academics' },
            { key: 'certifications', label: 'Certifications Section' },
            { key: 'services', label: 'Creative Services' },
            { key: 'gallery', label: 'Photography Gallery' },
            { key: 'contact', label: 'Contact Form & Details' }
          ].map(({ key, label }) => {
            const isVisible = (formData?.sectionVisibility as any)?.[key] ?? true;
            return (
              <label
                key={key}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  isVisible
                    ? 'bg-[#151a24] border-amber-500/40'
                    : 'bg-[#12151b] border-[#222732] opacity-60'
                }`}
              >
                <span className="text-xs font-medium text-white">{label}</span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => toggleSection(key as any)}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* CV Public Download Toggle */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <h3 className="font-semibold text-sm text-white">Public Curriculum Vitae Permission</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.publicCvDownload}
            onChange={(e) => setFormData({ ...formData, publicCvDownload: e.target.checked })}
            className="w-4 h-4 rounded text-amber-500"
          />
          <span className="text-xs font-medium text-[#e5e7eb]">
            Allow public visitors to download the Curriculum Vitae via Navbar and Hero CTA buttons
          </span>
        </label>
      </div>

      {/* Security Credentials Update */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Admin Security Credentials</span>
        </h3>

        {credMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
            {credMessage}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1">
              Current Security Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1">
              New Security Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#181d28] border border-[#262f40] text-white hover:border-amber-500/50"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
};
