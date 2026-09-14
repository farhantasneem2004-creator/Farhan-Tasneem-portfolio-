import React, { useState } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  FolderOpen
} from 'lucide-react';
import type { GalleryCategory, GalleryAlbum, GalleryImage } from '../../types.js';

interface GallerySectionProps {
  categories?: GalleryCategory[];
  albums?: GalleryAlbum[];
  images?: GalleryImage[];
  accentColor?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  categories = [],
  albums = [],
  images = [],
  accentColor = '#e5a93c'
}) => {
  const visibleImages = (images || []).filter((i) => i && i.visible);
  const visibleCategories = (categories || []).filter((c) => c && c.visible);
  const visibleAlbums = (albums || []).filter((a) => a && a.visible);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (visibleImages.length === 0) return null;

  // Filter logic
  const filteredImages = visibleImages.filter((img) => {
    const categoryMatch = selectedCategory === 'all' || img.categoryId === selectedCategory;
    const albumMatch = selectedAlbum === 'all' || img.albumId === selectedAlbum;
    return categoryMatch && albumMatch;
  });

  const activeLightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <section id="gallery" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Visual Journal & Photography
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Personal Gallery & Moments
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
            Moments, university competitions, street architecture, and visual memories captured through the lens.
          </p>
        </div>

        {/* Filters Controls */}
        <div className="space-y-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedAlbum('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'all' && selectedAlbum === 'all'
                  ? 'bg-amber-500/20 text-white border border-amber-500/50'
                  : 'bg-[#12151b] text-[#9ca3af] hover:text-white border border-[#222732]'
              }`}
              style={
                selectedCategory === 'all' && selectedAlbum === 'all'
                  ? { backgroundColor: `${accentColor}25`, borderColor: `${accentColor}70` }
                  : {}
              }
            >
              All Photos ({visibleImages.length})
            </button>

            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedAlbum('all');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-white border border-amber-500/50'
                    : 'bg-[#12151b] text-[#9ca3af] hover:text-white border border-[#222732]'
                }`}
                style={
                  selectedCategory === cat.id
                    ? { backgroundColor: `${accentColor}25`, borderColor: `${accentColor}70` }
                    : {}
                }
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Album Selector Chips */}
          {visibleAlbums.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1a202c]">
              <span className="text-xs text-[#6b7280] flex items-center gap-1 mr-1">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Albums:</span>
              </span>
              {visibleAlbums.map((alb) => (
                <button
                  key={alb.id}
                  onClick={() => {
                    setSelectedAlbum(selectedAlbum === alb.id ? 'all' : alb.id);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    selectedAlbum === alb.id
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60'
                      : 'bg-[#151922] text-[#8692a6] hover:text-white border border-[#222938]'
                  }`}
                >
                  {alb.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid (Responsive Masonry-like layout) */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#222732] rounded-xl text-[#6b7280]">
            No photographs found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => {
              const album = visibleAlbums.find((a) => a.id === img.albumId);
              const category = visibleCategories.find((c) => c.id === img.categoryId);

              return (
                <div
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-xl overflow-hidden bg-[#11141c] border border-[#1f2533] cursor-pointer shadow-lg hover:border-[#353f54] transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0c0e12]">
                    <img
                      src={img.url}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12]/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Quick Expand Icon */}
                    <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Bottom overlay details */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block mb-1" style={{ color: accentColor }}>
                          {category.name}
                        </span>
                      )}
                      <h4 className="font-semibold text-sm text-white line-clamp-1 mb-1">
                        {img.title}
                      </h4>
                      {img.caption && (
                        <p className="text-xs text-[#9ca3af] line-clamp-2 leading-relaxed">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom info strip */}
                  {(img.location || img.date || album) && (
                    <div className="px-4 py-2 bg-[#0e1118] border-t border-[#1c2230] flex items-center justify-between text-[11px] text-[#6b7280]">
                      {img.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400/80" style={{ color: accentColor }} />
                          <span>{img.location}</span>
                        </span>
                      ) : (
                        <span>{album ? album.title : ''}</span>
                      )}
                      {img.date && <span>{img.date}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            {/* Lightbox Meta */}
            <div className="mt-4 text-center max-w-2xl px-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                {activeLightboxImage.title}
              </h3>
              {activeLightboxImage.caption && (
                <p className="text-sm text-[#9ca3af] leading-relaxed mb-2">
                  {activeLightboxImage.caption}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-xs text-[#6b7280]">
                {activeLightboxImage.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" style={{ color: accentColor }} />
                    <span>{activeLightboxImage.location}</span>
                  </span>
                )}
                {activeLightboxImage.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeLightboxImage.date}</span>
                  </span>
                )}
                <span>
                  {lightboxIndex! + 1} / {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
