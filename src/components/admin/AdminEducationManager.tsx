import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, X } from 'lucide-react';
import type { Education } from '../../types.js';
import { api } from '../../api.js';

interface AdminEducationManagerProps {
  education?: Education[];
  onEducationUpdated: () => void;
  accentColor?: string;
}

export const AdminEducationManager: React.FC<AdminEducationManagerProps> = ({
  education = [],
  onEducationUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    degree: 'B.Sc. in Computer Science & Engineering',
    institution: '',
    department: 'Department of Computer Science & Engineering',
    startYear: '2023',
    endYear: '2027',
    current: true,
    description: '',
    grade: '',
    order: (education?.length || 0) + 1,
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingEdu(null);
    setFormData({
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: '',
      department: 'Department of Computer Science & Engineering',
      startYear: '2023',
      endYear: '2027',
      current: true,
      description: '',
      grade: '',
      order: (education?.length || 0) + 1,
      visible: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      department: edu.department || '',
      startYear: edu.startYear,
      endYear: edu.endYear || '',
      current: edu.current,
      description: edu.description,
      grade: edu.grade || '',
      order: edu.order,
      visible: edu.visible
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEdu) {
        await api.updateEducation(editingEdu.id, formData);
      } else {
        await api.createEducation(formData);
      }
      setModalOpen(false);
      onEducationUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete education record "${name}"?`)) return;
    try {
      await api.deleteEducation(id);
      onEducationUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Education & Academic History
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Manage academic degrees, university departments, and graduation timelines.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Record</span>
        </button>
      </div>

      <div className="space-y-4">
        {(education || []).map((edu) => (
          <div
            key={edu.id}
            className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base text-white">{edu.degree}</h3>
                <span className="text-xs text-amber-400" style={{ color: accentColor }}>
                  {edu.institution}
                </span>
              </div>
              <div className="text-xs text-[#6b7280] mb-2 font-mono">
                {edu.startYear} - {edu.current ? 'Present' : edu.endYear} {edu.department ? `• ${edu.department}` : ''}
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">{edu.description}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleOpenEdit(edu)}
                className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(edu.id, edu.degree)}
                className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingEdu ? 'Edit Academic Entry' : 'Add Academic Entry'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Degree Name *</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Start Year</label>
                  <input
                    type="text"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">End Year</label>
                  <input
                    type="text"
                    disabled={formData.current}
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
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
                <span>Currently enrolled in this program</span>
              </label>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Description / Focus</label>
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
                  {loading ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
