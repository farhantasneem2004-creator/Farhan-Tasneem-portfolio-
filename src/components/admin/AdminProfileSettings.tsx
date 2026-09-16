import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import type { SiteSettings } from '../../types.js';
import { api } from '../../api.js';

interface AdminProfileSettingsProps {
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
  accentColor?: string;
}

export const AdminProfileSettings: React.FC<AdminProfileSettingsProps> = ({
  settings,
  onSettingsUpdated,
  accentColor = '#e5a93c'
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      const updatedData = { ...formData, aboutPhoto: url };
      setFormData(updatedData);
      // Auto-save and sync to public website immediately
      const updated = await api.updateSettings(updatedData);
      onSettingsUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
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
            Profile & Biography Information
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Configure primary titles, editorial biographies, location, and creative focus.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile configuration updated successfully! Changes are live on the website.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Hero Section Copy */}
        <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-5">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>Landing & Hero Typography</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={formData.heroEyebrow}
                onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Primary Display Name
              </label>
              <input
                type="text"
                value={formData.heroHeadingFirst}
                onChange={(e) => setFormData({ ...formData, heroHeadingFirst: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Accent Display Name
              </label>
              <input
                type="text"
                value={formData.heroHeadingAccent}
                onChange={(e) => setFormData({ ...formData, heroHeadingAccent: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              Professional Subtitle / Role
            </label>
            <input
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              Hero Introduction Description
            </label>
            <textarea
              rows={3}
              value={formData.heroDescription}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>
        </div>

        {/* About Section Copy */}
        <div className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-5">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>About Section & Narrative Content</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              About Heading
            </label>
            <input
              type="text"
              value={formData.aboutHeading}
              onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              Short Biography
            </label>
            <textarea
              rows={2}
              value={formData.aboutShortBio}
              onChange={(e) => setFormData({ ...formData, aboutShortBio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              Detailed Biography
            </label>
            <textarea
              rows={4}
              value={formData.aboutDetailedBio}
              onChange={(e) => setFormData({ ...formData, aboutDetailedBio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.aboutLocation}
                onChange={(e) => setFormData({ ...formData, aboutLocation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Current Focus
              </label>
              <input
                type="text"
                value={formData.aboutCurrentFocus}
                onChange={(e) => setFormData({ ...formData, aboutCurrentFocus: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              Interests & Creative Disciplines (comma separated)
            </label>
            <input
              type="text"
              value={formData.aboutInterests}
              onChange={(e) => setFormData({ ...formData, aboutInterests: e.target.value })}
              placeholder="e.g. Competitive Programming, Full-Stack Architecture, Poetry, Technical Illustration"
              className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* About photo upload/url */}
          <div className="pt-2 border-t border-[#1c2230]">
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
              About Editorial Photo (URL or Upload)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.aboutPhoto}
                onChange={(e) => setFormData({ ...formData, aboutPhoto: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#181c25] border border-[#2a3244] text-xs text-white cursor-pointer hover:border-amber-500/50">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAboutPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
