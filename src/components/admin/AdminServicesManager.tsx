import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Feather, X } from 'lucide-react';
import type { Service } from '../../types.js';
import { api } from '../../api.js';

interface AdminServicesManagerProps {
  services?: Service[];
  onServicesUpdated: () => void;
  accentColor?: string;
}

export const AdminServicesManager: React.FC<AdminServicesManagerProps> = ({
  services = [],
  onServicesUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    icon: 'Feather',
    ctaText: 'Commission / Inquire',
    externalUrl: '',
    order: (services?.length || 0) + 1,
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: '',
      shortDescription: '',
      detailedDescription: '',
      icon: 'Feather',
      ctaText: 'Commission / Inquire',
      externalUrl: '',
      order: (services?.length || 0) + 1,
      visible: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      shortDescription: svc.shortDescription,
      detailedDescription: svc.detailedDescription,
      icon: svc.icon || 'Feather',
      ctaText: svc.ctaText || 'Commission / Inquire',
      externalUrl: svc.externalUrl || '',
      order: svc.order,
      visible: svc.visible
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingService) {
        await api.updateService(editingService.id, formData);
      } else {
        await api.createService(formData);
      }
      setModalOpen(false);
      onServicesUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete service "${name}"?`)) return;
    try {
      await api.deleteService(id);
      onServicesUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Specialized & Creative Offerings
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Configure custom poetry commissions, technical / machinery illustrations, and short script writing offerings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(services || []).map((svc) => (
          <div
            key={svc.id}
            className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-amber-400" style={{ color: accentColor }}>
                  {svc.name}
                </span>
                <span className={`text-[11px] ${svc.visible ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {svc.visible ? 'Live' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-[#cbd5e1] mb-2 font-medium">{svc.shortDescription}</p>
              <p className="text-xs text-[#848ea0] line-clamp-3 leading-relaxed mb-4">
                {svc.detailedDescription}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1c2230]">
              <span className="text-[11px] text-[#6b7280]">CTA: {svc.ctaText}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(svc)}
                  className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(svc.id, svc.name)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingService ? 'Edit Creative Offering' : 'Add Creative Offering'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Custom Poetry / Technical Illustration"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">CTA Action Button Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1f2533]">
                <label className="flex items-center gap-2 text-xs text-[#cbd5e1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Show on public services section</span>
                </label>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af]">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                    style={{ backgroundColor: accentColor }}
                  >
                    {loading ? 'Saving...' : 'Save Offering'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
