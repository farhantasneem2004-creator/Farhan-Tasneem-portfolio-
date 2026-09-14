import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Briefcase } from 'lucide-react';
import type { Experience } from '../../types.js';
import { api } from '../../api.js';

interface AdminExperienceManagerProps {
  experiences?: Experience[];
  onExperiencesUpdated: () => void;
  accentColor?: string;
}

export const AdminExperienceManager: React.FC<AdminExperienceManagerProps> = ({
  experiences = [],
  onExperiencesUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    position: '',
    organization: '',
    location: '',
    type: 'Full-time',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    skills: [],
    order: (experiences?.length || 0) + 1,
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({
      position: '',
      organization: '',
      location: '',
      type: 'Full-time',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: [],
      skills: [],
      order: (experiences?.length || 0) + 1,
      visible: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      position: exp.position,
      organization: exp.organization,
      location: exp.location || '',
      type: exp.type,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.description,
      responsibilities: exp.responsibilities || [],
      skills: exp.skills || [],
      order: exp.order,
      visible: exp.visible
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingExp) {
        await api.updateExperience(editingExp.id, formData);
      } else {
        await api.createExperience(formData);
      }
      setModalOpen(false);
      onExperiencesUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete experience "${name}"?`)) return;
    try {
      await api.deleteExperience(id);
      onExperiencesUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Career Timeline & Experience
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Maintain authentic professional roles. If empty, the public experience section is automatically hidden.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      {(!experiences || experiences.length === 0) ? (
        <div className="p-8 rounded-xl bg-[#11141c] border border-dashed border-[#262f40] text-center">
          <Briefcase className="w-8 h-8 text-[#6b7280] mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white mb-1">No Career Experience Added</h4>
          <p className="text-xs text-[#848ea0] max-w-md mx-auto mb-4">
            The public website currently hides the Experience section cleanly to prevent displaying fake entries. Add verified roles when available.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#181c25] border border-[#2a3344] text-white hover:border-amber-500/50"
          >
            Add First Role
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(experiences || []).map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-white">{exp.position}</h3>
                  <span className="text-xs font-medium text-amber-400" style={{ color: accentColor }}>
                    @{exp.organization}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#161b25] text-[#9ca3af]">
                    {exp.type}
                  </span>
                </div>
                <div className="text-xs text-[#6b7280] mb-2 font-mono">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} {exp.location ? `• ${exp.location}` : ''}
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed line-clamp-2">{exp.description}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.position)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingExp ? 'Edit Experience' : 'Add Experience Role'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. Jun 2024"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 disabled:opacity-40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#cbd5e1] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span>Currently working in this role</span>
              </label>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Description</label>
                <textarea
                  rows={3}
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
                  {loading ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
