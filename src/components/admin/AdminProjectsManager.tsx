import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, Star, ExternalLink, X } from 'lucide-react';
import type { Project } from '../../types.js';
import { api } from '../../api.js';

interface AdminProjectsManagerProps {
  projects?: Project[];
  onProjectsUpdated: () => void;
  accentColor?: string;
}

export const AdminProjectsManager: React.FC<AdminProjectsManagerProps> = ({
  projects = [],
  onProjectsUpdated,
  accentColor = '#e5a93c'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    mainImage: '',
    additionalImages: [],
    technologies: [],
    category: 'Full-Stack Web App',
    githubUrl: '',
    liveDemoUrl: '',
    date: '2026',
    featured: false,
    displayOrder: (projects?.length || 0) + 1,
    visible: true
  });
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      shortDescription: '',
      detailedDescription: '',
      mainImage: '/src/assets/images/efuture_cup_project_1789381795595.jpg',
      additionalImages: [],
      technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      category: 'Full-Stack Web App',
      githubUrl: '',
      liveDemoUrl: '',
      date: '2026',
      featured: false,
      displayOrder: (projects?.length || 0) + 1,
      visible: true
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      shortDescription: project.shortDescription,
      detailedDescription: project.detailedDescription,
      mainImage: project.mainImage,
      additionalImages: project.additionalImages || [],
      technologies: project.technologies || [],
      category: project.category,
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      date: project.date,
      featured: project.featured,
      displayOrder: project.displayOrder,
      visible: project.visible
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, mainImage: url }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, formData);
      } else {
        await api.createProject(formData);
      }
      setModalOpen(false);
      onProjectsUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"?`)) return;
    try {
      await api.deleteProject(id);
      onProjectsUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Projects & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Manage software projects, featured engineering case studies, tech tags, and repository links.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(projects || []).map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl bg-[#11141c] border border-[#1f2533] p-5 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-[#0a0c10] border border-[#1d222f]">
                <img
                  src={proj.mainImage || '/src/assets/images/efuture_cup_project_1789381795595.jpg'}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {proj.featured && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>FEATURED</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-amber-400" style={{ color: accentColor }}>
                  {proj.category}
                </span>
                <span className="text-[11px] font-mono text-[#6b7280]">{proj.date}</span>
              </div>

              <h3 className="font-bold text-base text-white mb-2">{proj.name}</h3>
              <p className="text-xs text-[#848ea0] line-clamp-2 mb-4 leading-relaxed">
                {proj.shortDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(proj.technologies || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181d28] text-[#9ca3af]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1c2230]">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${proj.visible ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {proj.visible ? 'Published' : 'Draft/Hidden'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded text-[#9ca3af] hover:text-white hover:bg-[#1a202d]"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.name)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f2533] mb-6">
              <h3 className="font-bold text-lg text-white">
                {editingProject ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#9ca3af] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. eFuture Cup Manager"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Tournament Management / Web App"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Main Display Image (URL or Upload)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.mainImage}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181c25] border border-[#2a3244] text-xs text-white cursor-pointer hover:border-amber-500/50">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Short Summary Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise overview displayed on cards..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Detailed Case Study / Overview
                </label>
                <textarea
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="In-depth explanation of system features, architecture, bracket management..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                  Technologies (Press Enter to add tag)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(formData.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#181c26] text-xs font-mono text-white border border-[#262f40]"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="Type technology name and press Enter..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#1f2533]">
                <label className="flex items-center gap-2 text-xs text-[#cbd5e1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Featured Case Study (Large Editorial Layout)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#cbd5e1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Visible on Public Portfolio</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f2533]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#9ca3af] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  {loading ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
