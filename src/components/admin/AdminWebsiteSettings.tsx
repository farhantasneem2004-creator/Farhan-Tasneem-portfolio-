import React, { useState, useRef } from 'react';
import { Save, CheckCircle2, Sliders, Palette, ShieldCheck, Sun, Sparkles, Upload, Image as ImageIcon, Box, Download, FolderArchive } from 'lucide-react';
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

  // Favicon state & ref
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const lightingPresets = [
    { id: 'cinematic-gold', label: 'Cinematic Amber Gold', color: '#e5a93c', bg: '#1c170d' },
    { id: 'cyber-cyan', label: 'Cyber Tech Cyan', color: '#06b6d4', bg: '#081a24' },
    { id: 'radiant-amber', label: 'Radiant Solar Amber', color: '#f59e0b', bg: '#1f1606' },
    { id: 'deep-violet', label: 'Ultraviolet Cyber', color: '#8b5cf6', bg: '#170e28' },
    { id: 'emerald-glow', label: 'Deep Matrix Emerald', color: '#10b981', bg: '#081c14' }
  ];

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, faviconUrl: res.url }));
    } catch (err: any) {
      alert('Favicon upload failed: ' + err.message);
    } finally {
      setUploadingFavicon(false);
    }
  };

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

      {/* ========================================================= */}
      {/* 3D ATMOSPHERE & LIGHTING CONFIGURATION                     */}
      {/* ========================================================= */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-5">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" style={{ color: formData.lightingGlowColor || formData.accentColor }} />
            <span>Interactive 3D Atmosphere & Lighting System</span>
          </h3>
          <p className="text-xs text-[#848ea0] mt-1">
            Control the overall page lighting ambiance, glow color, and enable real-time 3D lighting reflections around project, skill, and certification object cards.
          </p>
        </div>

        {/* Lighting Mood Presets */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#9ca3af]">Atmospheric Lighting Mood:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {lightingPresets.map((preset) => {
              const isActive = (formData.lightingMode || 'cinematic-gold') === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      lightingMode: preset.id as any,
                      lightingGlowColor: preset.color
                    })
                  }
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'border-white/50 bg-[#1a202d] shadow-md shadow-black/40'
                      : 'border-[#222938] bg-[#141822] hover:border-[#354157]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.color, boxShadow: `0 0 8px ${preset.color}80` }}
                    />
                    <span className="text-xs font-semibold text-white truncate">{preset.label}</span>
                  </div>
                  <div className="text-[10px] text-[#6b7280] font-mono">{preset.color}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Lighting Glow Color */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#1a202c]">
          <div className="flex items-center gap-2.5">
            <label className="text-xs text-[#9ca3af]">Custom Lighting Color:</label>
            <input
              type="color"
              value={formData.lightingGlowColor || formData.accentColor || '#e5a93c'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lightingMode: 'custom',
                  lightingGlowColor: e.target.value
                })
              }
              className="w-8 h-8 rounded bg-transparent cursor-pointer border-0"
            />
            <input
              type="text"
              value={formData.lightingGlowColor || formData.accentColor || '#e5a93c'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lightingMode: 'custom',
                  lightingGlowColor: e.target.value
                })
              }
              className="w-28 px-2.5 py-1.5 rounded bg-[#0c0e12] border border-[#232938] text-white text-xs font-mono"
            />
          </div>

          {/* Lighting Intensity Slider */}
          <div className="flex items-center gap-3 flex-1 min-w-[220px]">
            <label className="text-xs text-[#9ca3af] shrink-0">
              Intensity: {Math.round((formData.lightingIntensity ?? 1) * 100)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.1"
              value={formData.lightingIntensity ?? 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lightingIntensity: parseFloat(e.target.value)
                })
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Enable 3D Lighting around Cards/Objects Toggle */}
        <label className="flex items-center gap-3 p-3.5 rounded-lg bg-[#141822] border border-[#222938] cursor-pointer">
          <input
            type="checkbox"
            checked={formData.enableObject3DLighting !== false}
            onChange={(e) =>
              setFormData({
                ...formData,
                enableObject3DLighting: e.target.checked
              })
            }
            className="w-4 h-4 rounded text-amber-500"
          />
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>Enable Interactive 3D Lighting & Tilt on Object Cards</span>
            </div>
            <div className="text-[11px] text-[#848ea0] mt-0.5">
              Adds realistic specular lighting reflections, soft rim glow, and subtle cursor tilt to projects, skills, certificates, and services.
            </div>
          </div>
        </label>
      </div>

      {/* ========================================================= */}
      {/* BACKGROUND DOODLES & CFC ATMOSPHERIC WATERMARKS           */}
      {/* ========================================================= */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Background Technical Doodles & CFC Watermarks</span>
          </h3>
          <p className="text-xs text-[#848ea0] mt-1">
            Add ambient technical sketches (code brackets, coordinate grids, algorithmic nodes) and faint CFC / CSE atmospheric typography in the background.
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.showBackgroundDoodles !== false}
            onChange={(e) => setFormData({ ...formData, showBackgroundDoodles: e.target.checked })}
            className="w-4 h-4 rounded text-amber-500"
          />
          <span className="text-xs font-medium text-[#e5e7eb]">
            Show ambient background doodles and watermark typography
          </span>
        </label>

        {formData.showBackgroundDoodles !== false && (
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-medium text-[#9ca3af]">
              Atmospheric Background Keywords (e.g. CFC, ALGORITHMS, CSE, LOGIC, DATA STRUCTURES):
            </label>
            <input
              type="text"
              value={formData.backgroundDoodleKeywords ?? 'CFC • ALGORITHMS • LOGIC • CSE • SYSTEMS • DATA STRUCTURES'}
              onChange={(e) => setFormData({ ...formData, backgroundDoodleKeywords: e.target.value })}
              placeholder="CFC • ALGORITHMS • LOGIC • CSE • SYSTEMS"
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
            />
            <p className="text-[11px] text-[#6b7280]">
              These words float at ultra-faint opacity in the background layer behind your sections to add technical depth.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* FAVICON & BROWSER FILE ICON CONFIGURATION                 */}
      {/* ========================================================= */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Website Browser Tab Icon (Favicon / File Icon)</span>
          </h3>
          <p className="text-xs text-[#848ea0] mt-1">
            Change the icon displayed on browser tabs, bookmarks, and mobile shortcuts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Favicon Preview */}
          <div className="w-14 h-14 rounded-xl bg-[#0c0e12] border border-[#232938] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {formData.faviconUrl ? (
              <img
                src={formData.faviconUrl}
                alt="Favicon preview"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-[#4b5563]" />
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.faviconUrl || ''}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                placeholder="https://.../favicon.png or upload below"
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
              />
              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                disabled={uploadingFavicon}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#181e2b] border border-[#293448] text-[#e5e7eb] hover:text-white cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingFavicon ? 'Uploading...' : 'Upload Icon'}</span>
              </button>
              <input
                ref={faviconInputRef}
                type="file"
                accept=".ico,.png,.svg,.jpg,.webp"
                onChange={handleFaviconUpload}
                className="hidden"
              />
            </div>
            <p className="text-[11px] text-[#6b7280]">
              Supported formats: .ico, .png, .svg, .webp. Recommended size: 64x64 or 128x128 px.
            </p>
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

      {/* Full Source Code & Project Backup Section */}
      <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-amber-400" />
            <span>Download Project Source Code (.ZIP)</span>
          </h3>
          <p className="text-xs text-[#848ea0] mt-1">
            Package and download this entire project, including React components, Express server, public assets, and database directly to your PC.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0c0e12] border border-[#1f2533] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">Full Application Archive</div>
            <div className="text-[11px] text-[#6b7280]">
              Excludes bulky node_modules and build artifacts for an optimized, clean download. Extract and run <code className="text-amber-400 font-mono">npm install && npm run dev</code>.
            </div>
          </div>

          <button
            type="button"
            onClick={() => api.downloadProjectZip()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] hover:brightness-110 cursor-pointer shadow whitespace-nowrap shrink-0 transition-all"
            style={{ backgroundColor: formData.accentColor || '#e5a93c' }}
          >
            <Download className="w-4 h-4" />
            <span>Download Project (.ZIP)</span>
          </button>
        </div>
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
