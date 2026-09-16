import React, { useState } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  MoveUp,
  MoveDown,
  Layers,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Upload,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Sliders,
  Type,
  Image as ImageIcon,
  Palette,
  Maximize2,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import type { LandingPageElement, Breakpoint, LandingPageLayout } from '../../../types.js';
import { api } from '../../../api.js';

interface PropertiesPanelProps {
  selectedElement: LandingPageElement | null;
  layout: LandingPageLayout;
  breakpoint: Breakpoint;
  isOpen: boolean;
  onToggleOpen: () => void;
  onUpdateElement: (updated: LandingPageElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  onCopyDesktopToDevice: (id: string, targetBp: Breakpoint) => void;
  onUpdateLayout: (updated: Partial<LandingPageLayout>) => void;
  accentColor: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  layout,
  breakpoint,
  isOpen,
  onToggleOpen,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveLayer,
  onCopyDesktopToDevice,
  onUpdateLayout,
  accentColor
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'content'>('layout');
  const [isUploading, setIsUploading] = useState(false);

  // If collapsed, show minimal vertical tab
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        title="Expand Properties Inspector"
        className="w-10 bg-[#0e1117] border-l border-[#1b202c] hover:bg-[#151924] flex flex-col items-center py-4 gap-3 text-[#9ca3af] hover:text-white transition-all cursor-pointer shrink-0 z-20"
      >
        <Sliders className="w-4 h-4 text-amber-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider [writing-mode:vertical-rl] text-[#6b7280] hover:text-[#d1d5db]">
          Properties
        </span>
      </button>
    );
  }

  // If no element selected, show canvas properties
  if (!selectedElement) {
    const canvasHeightKey =
      breakpoint === 'desktop'
        ? 'canvasHeightDesktop'
        : breakpoint === 'tablet'
        ? 'canvasHeightTablet'
        : 'canvasHeightMobile';

    return (
      <aside className="w-72 lg:w-80 bg-[#0e1117] border-l border-[#1b202c] p-4 flex flex-col gap-6 overflow-y-auto shrink-0 select-none text-xs text-[#d1d5db]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b202c]">
          <div>
            <h3 className="font-semibold text-sm text-white">Canvas Settings</h3>
            <p className="text-[11px] text-[#6b7280]">Default landing viewport</p>
          </div>
          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1c2230] transition-colors"
            title="Collapse Properties Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#9ca3af] mb-1.5 font-medium">Canvas Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={layout.backgroundColor || '#0c0e12'}
                onChange={(e) => onUpdateLayout({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded border border-[#242b3b] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={layout.backgroundColor || '#0c0e12'}
                onChange={(e) => onUpdateLayout({ backgroundColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#9ca3af] font-medium capitalize">{breakpoint} Height</label>
              <span className="text-white font-mono">{layout[canvasHeightKey]}px</span>
            </div>
            <input
              type="range"
              min="500"
              max="2000"
              step="20"
              value={layout[canvasHeightKey]}
              onChange={(e) => onUpdateLayout({ [canvasHeightKey]: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="pt-4 border-t border-[#1b202c]">
            <h4 className="font-medium text-white mb-2">Design Presets</h4>
            <div className="flex flex-wrap gap-1.5">
              {['#0c0e12', '#08090c', '#11141c', '#000000'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onUpdateLayout({ backgroundColor: color })}
                  className="w-6 h-6 rounded-md border border-[#2b3345]"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#141822] border border-[#222938] text-[#9ca3af] leading-relaxed">
            💡 <strong className="text-white">Tip:</strong> Click any element on the preview canvas to drag, resize, rotate, or edit text directly!
          </div>
        </div>
      </aside>
    );
  }

  const bpProps = selectedElement[breakpoint] || selectedElement.desktop;

  // Helper to update active breakpoint properties
  const updateBpProp = (updates: Partial<typeof bpProps>) => {
    onUpdateElement({
      ...selectedElement,
      [breakpoint]: {
        ...bpProps,
        ...updates
      }
    });
  };

  // Helper to update root element properties
  const updateRootProp = (updates: Partial<LandingPageElement>) => {
    onUpdateElement({
      ...selectedElement,
      ...updates
    });
  };

  // Alignment helpers
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const canvasWidth = breakpoint === 'desktop' ? 1440 : breakpoint === 'tablet' ? 768 : 390;
    const canvasHeight =
      breakpoint === 'desktop'
        ? layout.canvasHeightDesktop
        : breakpoint === 'tablet'
        ? layout.canvasHeightTablet
        : layout.canvasHeightMobile;

    switch (alignment) {
      case 'left':
        updateBpProp({ x: 20 });
        break;
      case 'center':
        updateBpProp({ x: Math.round((canvasWidth - bpProps.width) / 2) });
        break;
      case 'right':
        updateBpProp({ x: Math.round(canvasWidth - bpProps.width - 20) });
        break;
      case 'top':
        updateBpProp({ y: 40 });
        break;
      case 'middle':
        updateBpProp({ y: Math.round((canvasHeight - bpProps.height) / 2) });
        break;
      case 'bottom':
        updateBpProp({ y: Math.round(canvasHeight - bpProps.height - 40) });
        break;
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await api.uploadFile(file);
      updateRootProp({ imageUrl: res.url });
      // If updating hero image element, automatically synchronize with site settings
      if (
        selectedElement &&
        (selectedElement.id === 'elem-hero-image' ||
          selectedElement.name?.toLowerCase().includes('hero') ||
          selectedElement.type === 'image')
      ) {
        api.updateSettings({ heroImage: res.url }).catch(console.error);
      }
    } catch (err) {
      console.error('Failed uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <aside className="w-80 bg-[#0e1117] border-l border-[#1b202c] flex flex-col shrink-0 select-none text-xs text-[#d1d5db] overflow-hidden">
      
      {/* Header: Element Title & Quick Actions */}
      <div className="p-3 border-b border-[#1b202c] bg-[#12151e] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={selectedElement.name}
            onChange={(e) => updateRootProp({ name: e.target.value })}
            className="bg-transparent font-semibold text-white text-sm focus:outline-none focus:bg-[#1a2130] px-1.5 py-0.5 rounded border border-transparent focus:border-[#2f394d] truncate flex-1 min-w-0"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1c2230] text-amber-400 font-medium capitalize">
              {selectedElement.type}
            </span>
            <button
              type="button"
              onClick={onToggleOpen}
              className="p-1 rounded text-[#9ca3af] hover:text-white hover:bg-[#1c2230] transition-colors"
              title="Collapse Properties Panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1b202c]">
          <button
            type="button"
            onClick={() => updateRootProp({ locked: !selectedElement.locked })}
            title={selectedElement.locked ? 'Unlock element' : 'Lock element'}
            className={`p-1.5 rounded-md border ${
              selectedElement.locked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-[#161a24] text-[#9ca3af] border-[#222938] hover:text-white'
            }`}
          >
            {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => updateBpProp({ visible: !bpProps.visible })}
            title={bpProps.visible ? 'Hide element' : 'Show element'}
            className={`p-1.5 rounded-md border ${
              !bpProps.visible
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-[#161a24] text-[#9ca3af] border-[#222938] hover:text-white'
            }`}
          >
            {bpProps.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => onMoveLayer(selectedElement.id, 'front')}
            title="Bring to Front"
            className="p-1.5 rounded-md bg-[#161a24] text-[#9ca3af] border border-[#222938] hover:text-white"
          >
            <MoveUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onMoveLayer(selectedElement.id, 'back')}
            title="Send to Back"
            className="p-1.5 rounded-md bg-[#161a24] text-[#9ca3af] border border-[#222938] hover:text-white"
          >
            <MoveDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDuplicateElement(selectedElement.id)}
            title="Duplicate Element"
            className="p-1.5 rounded-md bg-[#161a24] text-[#9ca3af] border border-[#222938] hover:text-white"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteElement(selectedElement.id)}
            title="Delete Element"
            className="p-1.5 rounded-md bg-[#161a24] text-red-400 border border-[#222938] hover:bg-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breakpoint Sync Notice */}
        {breakpoint !== 'desktop' && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-[#9ca3af]">
            <span>Active: <strong className="text-white capitalize">{breakpoint}</strong></span>
            <button
              type="button"
              onClick={() => onCopyDesktopToDevice(selectedElement.id, breakpoint)}
              className="text-amber-400 hover:underline"
            >
              Copy from Desktop
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1b202c] bg-[#10131b]">
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
            activeTab === 'layout'
              ? 'border-amber-400 text-white bg-[#141822]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Position & Size
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
            activeTab === 'content'
              ? 'border-amber-400 text-white bg-[#141822]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
            activeTab === 'style'
              ? 'border-amber-400 text-white bg-[#141822]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Style
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        
        {/* ======================================================== */}
        {/* TAB 1: POSITION, SIZE, & ALIGNMENT                       */}
        {/* ======================================================== */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Alignment Buttons */}
            <div>
              <label className="block text-[#9ca3af] mb-1.5 font-medium">Quick Align to Canvas</label>
              <div className="grid grid-cols-6 gap-1 bg-[#131620] p-1 rounded-lg border border-[#202636]">
                <button
                  type="button"
                  onClick={() => handleAlign('left')}
                  title="Align Left"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('center')}
                  title="Center Horizontally"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('right')}
                  title="Align Right"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('top')}
                  title="Align Top"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('middle')}
                  title="Center Vertically"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <AlignVerticalSpaceAround className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('bottom')}
                  title="Align Bottom"
                  className="p-1.5 rounded hover:bg-[#1f2637] flex justify-center text-[#9ca3af] hover:text-white"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Coordinates & Dimensions */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-mono text-[11px]">X Position (px)</label>
                <input
                  type="number"
                  value={bpProps.x}
                  onChange={(e) => updateBpProp({ x: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] mb-1 font-mono text-[11px]">Y Position (px)</label>
                <input
                  type="number"
                  value={bpProps.y}
                  onChange={(e) => updateBpProp({ y: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] mb-1 font-mono text-[11px]">Width (px)</label>
                <input
                  type="number"
                  min="10"
                  value={bpProps.width}
                  onChange={(e) => updateBpProp({ width: Math.max(10, Number(e.target.value)) })}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] mb-1 font-mono text-[11px]">Height (px)</label>
                <input
                  type="number"
                  min="10"
                  value={bpProps.height}
                  onChange={(e) => updateBpProp({ height: Math.max(10, Number(e.target.value)) })}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#9ca3af] font-medium">Rotation</label>
                <span className="text-white font-mono">{bpProps.rotation || 0}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={bpProps.rotation || 0}
                onChange={(e) => updateBpProp({ rotation: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#9ca3af] font-medium">Opacity</label>
                <span className="text-white font-mono">{Math.round((bpProps.opacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((bpProps.opacity ?? 1) * 100)}
                onChange={(e) => updateBpProp({ opacity: Number(e.target.value) / 100 })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#9ca3af] font-medium">Corner Radius</label>
                <span className="text-white font-mono">{bpProps.borderRadius ?? 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bpProps.borderRadius ?? 0}
                onChange={(e) => updateBpProp({ borderRadius: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CONTENT & ATTRIBUTES                              */}
        {/* ======================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            
            {/* Primary Text Content */}
            {(selectedElement.type === 'heading' ||
              selectedElement.type === 'text' ||
              selectedElement.type === 'button' ||
              selectedElement.type === 'badge') && (
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Primary Text Content</label>
                {selectedElement.type === 'text' ? (
                  <textarea
                    rows={4}
                    value={selectedElement.content || ''}
                    onChange={(e) => updateRootProp({ content: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) => updateRootProp({ content: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                )}
              </div>
            )}

            {/* Accent Text Content for Split Headings */}
            {selectedElement.type === 'heading' && (
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">
                  Accent Text (e.g. TASNEEM)
                </label>
                <input
                  type="text"
                  value={selectedElement.accentContent || ''}
                  onChange={(e) => updateRootProp({ accentContent: e.target.value })}
                  placeholder="Optional accent line"
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Image URL & Upload */}
            {selectedElement.type === 'image' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Image URL / Path</label>
                  <input
                    type="text"
                    value={selectedElement.imageUrl || ''}
                    onChange={(e) => updateRootProp({ imageUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Upload File</label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-[#2f394d] hover:border-amber-400 bg-[#131722] cursor-pointer text-xs transition-all">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Image Fit</label>
                  <select
                    value={selectedElement.imageCrop || 'cover'}
                    onChange={(e) => updateRootProp({ imageCrop: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                  >
                    <option value="cover">Cover (fill & crop)</option>
                    <option value="contain">Contain (fit whole image)</option>
                    <option value="fill">Fill (stretch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Image Position</label>
                  <select
                    value={selectedElement.imagePosition || 'center top'}
                    onChange={(e) => updateRootProp({ imagePosition: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                  >
                    <option value="center top">Center Top</option>
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="center bottom">Center Bottom</option>
                  </select>
                </div>
              </div>
            )}

            {/* Button Actions & Variants */}
            {selectedElement.type === 'button' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Button Action</label>
                  <select
                    value={selectedElement.buttonAction || 'view_work'}
                    onChange={(e) => updateRootProp({ buttonAction: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                  >
                    <option value="view_work">Scroll to Projects ("View My Work")</option>
                    <option value="download_cv">Download CV</option>
                    <option value="contact">Scroll to Contact</option>
                    <option value="custom_url">External URL Link</option>
                  </select>
                </div>

                {selectedElement.buttonAction === 'custom_url' && (
                  <div>
                    <label className="block text-[#9ca3af] mb-1 font-medium">Target URL</label>
                    <input
                      type="text"
                      value={selectedElement.linkUrl || ''}
                      onChange={(e) => updateRootProp({ linkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Button Variant</label>
                  <select
                    value={selectedElement.buttonVariant || 'primary'}
                    onChange={(e) => updateRootProp({ buttonVariant: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                  >
                    <option value="primary">Primary (Solid Accent Gold)</option>
                    <option value="secondary">Secondary (Dark Slate)</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Icon Name</label>
                  <input
                    type="text"
                    value={selectedElement.iconName || ''}
                    onChange={(e) => updateRootProp({ iconName: e.target.value })}
                    placeholder="ArrowRight, Download, Sparkles..."
                    className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Shape Options */}
            {selectedElement.type === 'decorative_shape' && (
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Shape Preset</label>
                <select
                  value={selectedElement.shapeType || 'rectangle'}
                  onChange={(e) => updateRootProp({ shapeType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                >
                  <option value="glow">Ambient Glow Gradient</option>
                  <option value="frame">Geometric Accent Frame</option>
                  <option value="rectangle">Solid Rectangle</option>
                  <option value="circle">Circle / Pill</option>
                </select>
              </div>
            )}

            {/* Feature Strip or Social Links Items */}
            {(selectedElement.type === 'feature_strip' || selectedElement.type === 'social_links') && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[#9ca3af] font-medium">Items List</label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedElement.items || [];
                      updateRootProp({
                        items: [
                          ...current,
                          {
                            id: `item_${Date.now()}`,
                            label: 'New Item',
                            icon: 'Sparkles',
                            url: 'https://'
                          }
                        ]
                      });
                    }}
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedElement.items || []).map((it, idx) => (
                    <div key={it.id} className="p-2 rounded bg-[#141822] border border-[#202737] space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={it.label}
                          onChange={(e) => {
                            const updated = [...(selectedElement.items || [])];
                            updated[idx] = { ...it, label: e.target.value };
                            updateRootProp({ items: updated });
                          }}
                          className="flex-1 px-2 py-0.5 bg-[#0f131a] border border-[#273042] rounded text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (selectedElement.items || []).filter((_, i) => i !== idx);
                            updateRootProp({ items: updated });
                          }}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TYPOGRAPHY, COLORS, & BORDERS                     */}
        {/* ======================================================== */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            
            {/* Typography Controls */}
            {(selectedElement.type === 'heading' ||
              selectedElement.type === 'text' ||
              selectedElement.type === 'button' ||
              selectedElement.type === 'badge') && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[#9ca3af] font-medium">Font Size</label>
                    <span className="text-white font-mono">{bpProps.fontSize || 16}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={bpProps.fontSize || 16}
                    onChange={(e) => updateBpProp({ fontSize: Number(e.target.value) })}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#9ca3af] mb-1 font-medium">Font Weight</label>
                    <select
                      value={bpProps.fontWeight || '400'}
                      onChange={(e) => updateBpProp({ fontWeight: e.target.value })}
                      className="w-full px-2 py-1 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                    >
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">ExtraBold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#9ca3af] mb-1 font-medium">Text Align</label>
                    <select
                      value={bpProps.textAlign || 'left'}
                      onChange={(e) => updateBpProp({ textAlign: e.target.value as any })}
                      className="w-full px-2 py-1 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#9ca3af] mb-1 font-medium">Transform</label>
                    <select
                      value={selectedElement.textTransform || 'none'}
                      onChange={(e) => updateRootProp({ textTransform: e.target.value as any })}
                      className="w-full px-2 py-1 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs"
                    >
                      <option value="none">None</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#9ca3af] mb-1 font-medium">Letter Spacing</label>
                    <input
                      type="number"
                      value={bpProps.letterSpacing || 0}
                      onChange={(e) => updateBpProp({ letterSpacing: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Colors */}
            <div className="space-y-3 pt-2 border-t border-[#1b202c]">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Primary / Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.color || '#ffffff'}
                    onChange={(e) => updateRootProp({ color: e.target.value })}
                    className="w-8 h-8 rounded border border-[#242b3b] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedElement.color || '#ffffff'}
                    onChange={(e) => updateRootProp({ color: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              {selectedElement.type === 'heading' && (
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Accent Line Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.accentColor || accentColor}
                      onChange={(e) => updateRootProp({ accentColor: e.target.value })}
                      className="w-8 h-8 rounded border border-[#242b3b] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.accentColor || accentColor}
                      onChange={(e) => updateRootProp({ accentColor: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.backgroundColor || '#141822'}
                    onChange={(e) => updateRootProp({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded border border-[#242b3b] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedElement.backgroundColor || ''}
                    placeholder="transparent"
                    onChange={(e) => updateRootProp({ backgroundColor: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-[#141822] border border-[#242b3b] rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Borders */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1b202c]">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Border Width</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={selectedElement.borderWidth || 0}
                    onChange={(e) => updateRootProp({ borderWidth: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-[#141822] border border-[#242b3b] rounded-lg text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">Border Color</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={selectedElement.borderColor || '#2e3544'}
                      onChange={(e) => updateRootProp({ borderColor: e.target.value })}
                      className="w-7 h-7 rounded border border-[#242b3b] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.borderColor || '#2e3544'}
                      onChange={(e) => updateRootProp({ borderColor: e.target.value })}
                      className="w-full px-1.5 py-1 bg-[#141822] border border-[#242b3b] rounded text-white text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
};
