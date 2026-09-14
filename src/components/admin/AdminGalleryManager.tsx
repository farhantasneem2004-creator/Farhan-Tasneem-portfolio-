import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Camera, Upload, FolderPlus, X, Image as ImageIcon } from 'lucide-react';
import type { GalleryCategory, GalleryAlbum, GalleryImage } from '../../types.js';
import { api } from '../../api.js';

interface AdminGalleryManagerProps {
  categories?: GalleryCategory[];
  albums?: GalleryAlbum[];
  images?: GalleryImage[];
  onGalleryUpdated: () => void;
  accentColor?: string;
}

export const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({
  categories = [],
  albums = [],
  images = [],
  onGalleryUpdated,
  accentColor = '#e5a93c'
}) => {
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  const [formData, setFormData] = useState<Omit<GalleryImage, 'id'>>({
    title: '',
    caption: '',
    url: '',
    thumbnailUrl: '',
    categoryId: (categories || [])[0]?.id || 'cat_photography',
    albumId: (albums || [])[0]?.id || 'alb_dhaka',
    location: '',
    date: '2026',
    order: (images?.length || 0) + 1,
    visible: true
  });

  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenCreatePhoto = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      caption: '',
      url: '/src/assets/images/workspace_editorial_1789381777509.jpg',
      thumbnailUrl: '',
      categoryId: (categories || [])[0]?.id || 'cat_photography',
      albumId: (albums || [])[0]?.id || 'alb_dhaka',
      location: 'Dhaka, Bangladesh',
      date: '2026',
      order: (images?.length || 0) + 1,
      visible: true
    });
    setPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (img: GalleryImage) => {
    setEditingImage(img);
    setFormData({
      title: img.title,
      caption: img.caption || '',
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || '',
      categoryId: img.categoryId,
      albumId: img.albumId || '',
      location: img.location || '',
      date: img.date || '',
      order: img.order,
      visible: img.visible
    });
    setPhotoModalOpen(true);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, url }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingImage) {
        await api.updateGalleryImage(editingImage.id, formData);
      } else {
        await api.createGalleryImage(formData);
      }
      setPhotoModalOpen(false);
      onGalleryUpdated();
    } catch (err: any) {
      alert('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    if (!confirm(`Delete photograph "${title}"?`)) return;
    try {
      await api.deleteGalleryImage(id);
      onGalleryUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;
    try {
      await api.createGalleryAlbum({
        title: albumTitle.trim(),
        description: albumDesc.trim(),
        coverImage: '',
        order: albums.length + 1,
        visible: true
      });
      setAlbumTitle('');
      setAlbumDesc('');
      setAlbumModalOpen(false);
      onGalleryUpdated();
    } catch (err: any) {
      alert('Create album failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Personal Gallery & Photographic Works
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Manage personal photography, university memories, competition moments, and album groupings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlbumModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#161b25] border border-[#252d3e] hover:border-amber-500/50"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" style={{ color: accentColor }} />
            <span>New Album</span>
          </button>

          <button
            onClick={handleOpenCreatePhoto}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Albums bar */}
      <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533]">
        <span className="text-xs font-semibold text-white block mb-2">Active Photo Albums ({(albums || []).length})</span>
        <div className="flex flex-wrap gap-2">
          {(albums || []).map((a) => (
            <div
              key={a.id}
              className="px-3 py-1.5 rounded-lg bg-[#161b25] border border-[#222938] text-xs flex items-center gap-2"
            >
              <span className="font-medium text-[#e5e7eb]">{a.title}</span>
              <span className="text-[10px] text-[#6b7280]">
                ({(images || []).filter((img) => img.albumId === a.id).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(images || []).map((img) => {
          const cat = (categories || []).find((c) => c.id === img.categoryId);
          const alb = (albums || []).find((a) => a.id === img.albumId);

          return (
            <div
              key={img.id}
              className="rounded-xl bg-[#11141c] border border-[#1f2533] overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-[#0a0c10]">
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                    {cat?.name || 'Photography'}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm text-white line-clamp-1 mb-1">{img.title}</h3>
                  {img.caption && (
                    <p className="text-xs text-[#848ea0] line-clamp-2 mb-2">{img.caption}</p>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                    <span>{alb ? alb.title : 'No Album'}</span>
                    <span>{img.date}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#0d1016] border-t border-[#1c2230] flex items-center justify-between">
                <span className={`text-[11px] ${img.visible ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {img.visible ? 'Visible' : 'Hidden'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditPhoto(img)}
                    className="p-1.5 rounded text-[#9ca3af] hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(img.id, img.title)}
                    className="p-1.5 rounded text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">
                {editingImage ? 'Edit Photograph Details' : 'Upload Photograph'}
              </h3>
              <button onClick={() => setPhotoModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dhaka Streetscape at Dusk"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Image URL or Local Upload *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181c25] border border-[#2a3244] text-xs text-white cursor-pointer hover:border-amber-500/50">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Album</label>
                  <select
                    value={formData.albumId}
                    onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="">No Album</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1">Date / Year</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Atmospheric note or context behind the photograph..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2533]">
                <button type="button" onClick={() => setPhotoModalOpen(false)} className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  {loading ? 'Saving...' : 'Save Photograph'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Modal */}
      {albumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-[#232938] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2533]">
              <h3 className="font-bold text-base text-white">Create New Album</h3>
              <button onClick={() => setAlbumModalOpen(false)} className="p-1.5 text-[#9ca3af] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="e.g. University Competitions 2026"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  placeholder="Collection description..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2533]">
                <button type="button" onClick={() => setAlbumModalOpen(false)} className="px-3 py-1.5 rounded-lg text-xs text-[#9ca3af]">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12]"
                  style={{ backgroundColor: accentColor }}
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
