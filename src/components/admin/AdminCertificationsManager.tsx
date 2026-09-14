import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, X } from 'lucide-react';
import type { Certification } from '../../types.js';
import { api } from '../../api.js';

interface AdminCertificationsManagerProps {
  certifications?: Certification[];
  onCertificationsUpdated: () => void;
  accentColor?: string;
}

export const AdminCertificationsManager: React.FC<AdminCertificationsManagerProps> = ({
  certifications = [],
  onCertificationsUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    certificateImage: '',
    certificatePdf: '',
    order: (certifications?.length || 0) + 1,
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuer: '',
      date: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      certificateImage: '',
      certificatePdf: '',
      order: (certifications?.length || 0) + 1,
      visible: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      description: cert.description || '',
      certificateImage: cert.certificateImage || '',
      certificatePdf: cert.certificatePdf || '',
      order: cert.order,
      visible: cert.visible
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCert) {
        await api.updateCertification(editingCert.id, formData);
      } else {
        await api.createCertification(formData);
      }
      setModalOpen(false);
      onCertificationsUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certification "${name}"?`)) return;
    try {
      await api.deleteCertification(id);
      onCertificationsUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Certifications & Verified Credentials
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Manage verified certificates. If none exist, the public section stays cleanly hidden.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {(!certifications || certifications.length === 0) ? (
        <div className="p-8 rounded-xl bg-[#11141c] border border-dashed border-[#262f40] text-center">
          <Award className="w-8 h-8 text-[#6b7280] mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white mb-1">No Certifications Recorded</h4>
          <p className="text-xs text-[#848ea0] max-w-md mx-auto mb-4">
            Per strict instructions, no fake certifications have been generated. Add verified credentials when available.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#181c25] border border-[#2a3344] text-white hover:border-amber-500/50"
          >
            Add First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(certifications || []).map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-sm text-white">{cert.name}</h3>
                <div className="text-xs text-amber-400" style={{ color: accentColor }}>
                  {cert.issuer}
                </div>
                <div className="text-[11px] text-[#6b7280] font-mono mt-1">{cert.date}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id, cert.name)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingCert ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Issuer Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Date Issued</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Verification Credential URL</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2533]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  {loading ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
