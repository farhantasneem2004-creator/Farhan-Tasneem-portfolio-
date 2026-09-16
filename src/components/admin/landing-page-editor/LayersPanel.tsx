import React, { useState } from 'react';
import {
  Layers,
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Box,
  Square,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import type { LandingPageElement, Breakpoint } from '../../../types.js';

interface LayersPanelProps {
  elements: LandingPageElement[];
  selectedElementId: string | null;
  breakpoint: Breakpoint;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectElement: (id: string) => void;
  onUpdateElement: (updated: LandingPageElement) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  accentColor: string;
}

const getLayerIcon = (type: string) => {
  switch (type) {
    case 'heading':
      return <Heading className="w-3.5 h-3.5 text-amber-400" />;
    case 'text':
      return <Type className="w-3.5 h-3.5 text-blue-400" />;
    case 'button':
      return <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />;
    case 'image':
      return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
    case 'badge':
      return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
    case 'social_links':
      return <Share2 className="w-3.5 h-3.5 text-sky-400" />;
    case 'decorative_shape':
      return <Square className="w-3.5 h-3.5 text-amber-500/80" />;
    case 'feature_strip':
      return <Box className="w-3.5 h-3.5 text-indigo-400" />;
    default:
      return <Layers className="w-3.5 h-3.5 text-gray-400" />;
  }
};

export const LayersPanel: React.FC<LayersPanelProps> = ({
  elements,
  selectedElementId,
  breakpoint,
  isOpen,
  onToggleOpen,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onMoveLayer,
  accentColor
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort layers top to bottom (highest z-index / order on top)
  const sortedLayers = [...elements]
    .sort((a, b) => {
      const zA = a[breakpoint]?.zIndex ?? a.order;
      const zB = b[breakpoint]?.zIndex ?? b.order;
      return zB - zA;
    })
    .filter((layer) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        layer.name?.toLowerCase().includes(q) ||
        layer.type?.toLowerCase().includes(q) ||
        layer.content?.toLowerCase().includes(q)
      );
    });

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        title="Expand Layers Panel"
        className="w-10 bg-[#0e1117] border-r border-[#1b202c] hover:bg-[#151924] flex flex-col items-center py-4 gap-3 text-[#9ca3af] hover:text-white transition-all cursor-pointer shrink-0 z-20"
      >
        <Layers className="w-4 h-4 text-amber-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider [writing-mode:vertical-rl] text-[#6b7280] hover:text-[#d1d5db]">
          Layers ({elements.length})
        </span>
      </button>
    );
  }

  return (
    <aside className="w-64 bg-[#0e1117] border-r border-[#1b202c] flex flex-col shrink-0 select-none text-xs text-[#d1d5db] z-20">
      
      {/* Header */}
      <div className="p-3 border-b border-[#1b202c] bg-[#12151e] flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Layers ({elements.length})</span>
        </div>
        <button
          type="button"
          onClick={onToggleOpen}
          className="p-1 rounded text-[#9ca3af] hover:text-white hover:bg-[#1c2230] transition-colors"
          title="Collapse Layers Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search filter */}
      <div className="p-2 border-b border-[#1b202c] bg-[#0c0f15]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Filter layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-[#141822] border border-[#222938] rounded-lg text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-amber-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.map((layer) => {
          const isSelected = layer.id === selectedElementId;
          const isVisible = layer[breakpoint]?.visible ?? true;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectElement(layer.id)}
              className={`group flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-[#1a2130] text-white border-amber-500/40 shadow-sm'
                  : 'bg-[#11141d] text-[#9ca3af] border-transparent hover:bg-[#151924] hover:text-[#e5e7eb]'
              }`}
            >
              {/* Left: Icon & Label */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getLayerIcon(layer.type)}
                <span className="truncate text-xs font-medium">{layer.name}</span>
              </div>

              {/* Right: Quick actions (Lock, Eye, Up/Down, Delete) */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                {/* Lock toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement({ ...layer, locked: !layer.locked });
                  }}
                  title={layer.locked ? 'Unlock' : 'Lock'}
                  className={`p-1 rounded hover:bg-[#202737] ${
                    layer.locked ? 'text-amber-400' : 'text-[#6b7280]'
                  }`}
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const bpProps = layer[breakpoint] || layer.desktop;
                    onUpdateElement({
                      ...layer,
                      [breakpoint]: { ...bpProps, visible: !isVisible }
                    });
                  }}
                  title={isVisible ? 'Hide Layer' : 'Show Layer'}
                  className={`p-1 rounded hover:bg-[#202737] ${
                    !isVisible ? 'text-red-400' : 'text-[#6b7280]'
                  }`}
                >
                  {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'up');
                  }}
                  title="Move Up"
                  className="p-1 rounded hover:bg-[#202737] text-[#6b7280] hover:text-white"
                >
                  <MoveUp className="w-3 h-3" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'down');
                  }}
                  title="Move Down"
                  className="p-1 rounded hover:bg-[#202737] text-[#6b7280] hover:text-white"
                >
                  <MoveDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
};
