import React from 'react';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Magnet,
  Eye,
  Edit3,
  Plus,
  History,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import type { Breakpoint } from '../../../types.js';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  breakpoint: Breakpoint;
  onBreakpointChange: (bp: Breakpoint) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  isPreview: boolean;
  onTogglePreview: () => void;
  onAddElement: () => void;
  onOpenVersions: () => void;
  onResetLayout: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  hasUnsavedChanges: boolean;
  accentColor: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  breakpoint,
  onBreakpointChange,
  zoom,
  onZoomChange,
  snapEnabled,
  onToggleSnap,
  isPreview,
  onTogglePreview,
  onAddElement,
  onOpenVersions,
  onResetLayout,
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  hasUnsavedChanges,
  accentColor
}) => {
  return (
    <header className="h-16 bg-[#0e1117] border-b border-[#1b202c] px-4 flex items-center justify-between gap-3 select-none shrink-0 z-30 shadow-md">
      
      {/* Left Section: History & Mode */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`p-2 rounded-lg border transition-all ${
            canUndo
              ? 'bg-[#151923] text-white border-[#242b3b] hover:bg-[#1b212f] active:scale-95'
              : 'bg-[#10131a] text-[#4b5563] border-[#181d28] cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`p-2 rounded-lg border transition-all ${
            canRedo
              ? 'bg-[#151923] text-white border-[#242b3b] hover:bg-[#1b212f] active:scale-95'
              : 'bg-[#10131a] text-[#4b5563] border-[#181d28] cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#242b3b] mx-1.5" />

        {/* Snap toggle */}
        <button
          type="button"
          onClick={onToggleSnap}
          title={`Magnet Snapping: ${snapEnabled ? 'Enabled' : 'Disabled'}`}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
            snapEnabled
              ? 'bg-[#1a2130] text-amber-400 border-amber-500/30'
              : 'bg-[#12161f] text-[#6b7280] border-[#1f2635] hover:text-[#9ca3af]'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Snap: {snapEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Preview / Edit Mode Switcher */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
            isPreview
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-[#151923] text-[#d1d5db] border-[#242b3b] hover:bg-[#1b212f]'
          }`}
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Back to Editor</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </>
          )}
        </button>
      </div>

      {/* Center Section: Responsive Breakpoint Presets & Zoom */}
      <div className="flex items-center gap-2">
        {/* Device Switcher */}
        <div className="flex items-center bg-[#131620] p-1 rounded-xl border border-[#202636]">
          <button
            type="button"
            onClick={() => onBreakpointChange('desktop')}
            title="Desktop View (1440px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'desktop'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
            <span className="text-[10px] text-[#6b7280] hidden lg:inline">1440</span>
          </button>

          <button
            type="button"
            onClick={() => onBreakpointChange('tablet')}
            title="Tablet View (768px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'tablet'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
            <span className="text-[10px] text-[#6b7280] hidden lg:inline">768</span>
          </button>

          <button
            type="button"
            onClick={() => onBreakpointChange('mobile')}
            title="Mobile View (390px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'mobile'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
            <span className="text-[10px] text-[#6b7280] hidden lg:inline">390</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden xl:flex items-center bg-[#131620] px-2 py-1 rounded-xl border border-[#202636] text-xs">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.4, Number((zoom - 0.1).toFixed(2))))}
            title="Zoom Out"
            className="p-1 text-[#9ca3af] hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center text-[#d1d5db] font-mono text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(1.5, Number((zoom + 0.1).toFixed(2))))}
            title="Zoom In"
            className="p-1 text-[#9ca3af] hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            title="Reset 100%"
            className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-[#1c2230] text-[#9ca3af] hover:text-white"
          >
            100%
          </button>
        </div>
      </div>

      {/* Right Section: Add Element, History, Reset, Save, Publish */}
      <div className="flex items-center gap-2">
        {/* Add Element Button */}
        <button
          type="button"
          onClick={onAddElement}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1a2130] hover:bg-[#222b3e] border border-[#2c374e] transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Add Element</span>
        </button>

        {/* Version History Button */}
        <button
          type="button"
          onClick={onOpenVersions}
          title="Version History & Restore"
          className="p-2 rounded-lg bg-[#131620] text-[#9ca3af] hover:text-white border border-[#202636] hover:bg-[#1a202d] transition-all"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Reset Layout */}
        <button
          type="button"
          onClick={onResetLayout}
          title="Reset to Default Layout"
          className="p-2 rounded-lg bg-[#131620] text-[#9ca3af] hover:text-red-400 border border-[#202636] hover:bg-[#1a202d] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#242b3b] mx-1" />

        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#e5e7eb] bg-[#161a24] hover:bg-[#1d2331] border border-[#2b3345] transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-[#9ca3af]" />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          {hasUnsavedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
          )}
        </button>

        {/* Publish Changes */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-[#0c0e12] shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {isPublishing ? (
            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-black" />
          )}
          <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
        </button>
      </div>

    </header>
  );
};
