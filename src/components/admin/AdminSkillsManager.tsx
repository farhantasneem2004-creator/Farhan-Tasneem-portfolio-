import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Wrench } from 'lucide-react';
import type { Skill } from '../../types.js';
import { api } from '../../api.js';

interface AdminSkillsManagerProps {
  skills?: Skill[];
  onSkillsUpdated: () => void;
  accentColor?: string;
}

export const AdminSkillsManager: React.FC<AdminSkillsManagerProps> = ({
  skills = [],
  onSkillsUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    level: 'Proficient',
    percentage: 80,
    description: '',
    visible: true,
    order: (skills?.length || 0) + 1
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Programming',
    'Web Development',
    'Problem Solving',
    'Algorithms & Data Structures',
    'Creative Skills',
    'Technical Illustration',
    'Tools & Environment'
  ];

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Programming',
      level: 'Proficient',
      percentage: 80,
      description: '',
      visible: true,
      order: (skills?.length || 0) + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      percentage: skill.percentage,
      description: skill.description || '',
      visible: skill.visible,
      order: skill.order
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill.id, formData);
      } else {
        await api.createSkill(formData);
      }
      setModalOpen(false);
      onSkillsUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove skill "${name}"?`)) return;
    try {
      await api.deleteSkill(id);
      onSkillsUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      await api.updateSkill(skill.id, { visible: !skill.visible });
      onSkillsUpdated();
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
            Skills & Proficiencies
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Manage computing frameworks, algorithms, problem-solving proficiencies, and creative capabilities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills List Table */}
      <div className="rounded-xl bg-[#11141c] border border-[#1f2533] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cbd5e1]">
            <thead className="bg-[#0e1118] text-[#848ea0] uppercase tracking-wider font-semibold border-b border-[#1c2230]">
              <tr>
                <th className="py-3.5 px-4">Skill Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Proficiency</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d28]">
              {(skills || []).map((skill) => (
                <tr key={skill.id} className="hover:bg-[#141824] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{skill.name}</div>
                    {skill.description && (
                      <div className="text-[11px] text-[#6b7280] line-clamp-1">{skill.description}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#181d28] border border-[#252c3c] text-[#9ca3af]">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-medium" style={{ color: accentColor }}>
                        {skill.percentage}%
                      </span>
                      <span className="text-[#6b7280]">({skill.level})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleVisibility(skill)}
                      className={`p-1.5 rounded-md text-xs cursor-pointer ${
                        skill.visible ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-zinc-500 hover:bg-zinc-800'
                      }`}
                      title={skill.visible ? 'Visible on site' : 'Hidden from public'}
                    >
                      {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1f2638] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingSkill ? 'Edit Skill' : 'Create New Skill'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#9ca3af] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. C / C++, React, Git"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Level Descriptor
                  </label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Proficient / Advanced"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#9ca3af] mb-1">
                  <span>Proficiency Percentage</span>
                  <span className="font-mono text-amber-400">{formData.percentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Contextual Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Core language utilized for data structures and algorithmic competition."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
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
                  <span>Show on public portfolio</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                    style={{ backgroundColor: accentColor }}
                  >
                    {loading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
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
