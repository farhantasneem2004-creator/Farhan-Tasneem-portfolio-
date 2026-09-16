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
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  SlidersHorizontal,
  Hand,
  MousePointer
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
  onFitToScreen: () => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  isPreview: boolean;
  onTogglePreview: () => void;
  layersOpen: boolean;
  onToggleLayers: () => void;
  propertiesOpen: boolean;
  onToggleProperties: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  isPanMode: boolean;
  onTogglePanMode: () => void;
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
  onFitToScreen,
  snapEnabled,
  onToggleSnap,
  isPreview,
  onTogglePreview,
  layersOpen,
  onToggleLayers,
  propertiesOpen,
  onToggleProperties,
  isZenMode,
  onToggleZenMode,
  isPanMode,
  onTogglePanMode,
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
    <header className="h-14 bg-[#0c0f15] border-b border-[#1b202c] px-3 sm:px-4 flex items-center justify-between gap-2 select-none shrink-0 z-30 shadow-md">
      
      {/* Left Section: History, Tool modes, Snap */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#131620] p-0.5 rounded-lg border border-[#202636]">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-md transition-all ${
              canUndo
                ? 'text-white hover:bg-[#1f2737] active:scale-95'
                : 'text-[#4b5563] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-md transition-all ${
              canRedo
                ? 'text-white hover:bg-[#1f2737] active:scale-95'
                : 'text-[#4b5563] cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pointer vs Hand (Pan) tool */}
        <div className="hidden sm:flex items-center bg-[#131620] p-0.5 rounded-lg border border-[#202636]">
          <button
            type="button"
            onClick={() => isPanMode && onTogglePanMode()}
            title="Select & Move Tool (V)"
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              !isPanMode
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => !isPanMode && onTogglePanMode()}
            title="Pan Canvas Tool (H / Hold Space)"
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              isPanMode
                ? 'bg-[#1f2737] text-amber-400 shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Magnet Snap */}
        <button
          type="button"
          onClick={onToggleSnap}
          title={`Magnet Snapping: ${snapEnabled ? 'Enabled' : 'Disabled'}`}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
            snapEnabled
              ? 'bg-[#1a2130] text-amber-400 border-amber-500/30'
              : 'bg-[#12161f] text-[#6b7280] border-[#1f2635] hover:text-[#9ca3af]'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">{snapEnabled ? 'Snap ON' : 'Snap OFF'}</span>
        </button>
      </div>

      {/* Center Section: Device Presets & Zoom Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Device Switcher */}
        <div className="flex items-center bg-[#131620] p-0.5 rounded-xl border border-[#202636]">
          <button
            type="button"
            onClick={() => onBreakpointChange('desktop')}
            title="Desktop View (1440px)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'desktop'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => onBreakpointChange('tablet')}
            title="Tablet View (768px)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'tablet'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => onBreakpointChange('mobile')}
            title="Mobile View (390px)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === 'mobile'
                ? 'bg-[#1f2737] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* ALWAYS-VISIBLE Zoom Controls */}
        <div className="flex items-center bg-[#131620] px-1.5 py-0.5 rounded-xl border border-[#202636] text-xs">
          {/* Zoom Out (-) button */}
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.25, Number((zoom - 0.1).toFixed(2))))}
            title="Zoom Out (Ctrl+-)"
            aria-label="Zoom Out"
            className="p-1 text-[#9ca3af] hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Current Zoom Percentage */}
          <button
            type="button"
            onClick={onFitToScreen}
            title="Current Zoom • Click to Fit to Screen"
            className="px-1.5 py-0.5 text-center text-[#d1d5db] font-mono text-[11px] hover:text-amber-400 hover:bg-[#1a2130] rounded transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          {/* Zoom In (+) button */}
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2.0, Number((zoom + 0.1).toFixed(2))))}
            title="Zoom In (Ctrl++)"
            aria-label="Zoom In"
            className="p-1 text-[#9ca3af] hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-[1px] bg-[#242b3b] mx-0.5" />

          {/* Fit to screen button */}
          <button
            type="button"
            onClick={onFitToScreen}
            title="Fit to Screen (Ctrl+0)"
            className="px-1.5 py-1 rounded-md text-[10px] bg-[#1a2130] text-amber-300 hover:bg-[#222b3e] flex items-center gap-1 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Fit</span>
          </button>

          {/* Actual Size (100%) button */}
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            title="Actual Size 100% (Ctrl+1)"
            className={`px-1.5 py-1 rounded-md text-[10px] flex items-center gap-1 transition-colors ${
              Math.abs(zoom - 1) < 0.02
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#1a2130]'
            }`}
          >
            100%
          </button>
        </div>
      </div>

      {/* Right Section: Panels Toggles, Add Element, Save, Publish */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        
        {/* Toggle Layers Panel Button */}
        <button
          type="button"
          onClick={onToggleLayers}
          title={layersOpen ? 'Hide Layers' : 'Show Layers'}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
            layersOpen
              ? 'bg-[#1a2130] text-amber-400 border-amber-500/30'
              : 'bg-[#121620] text-[#9ca3af] border-[#202636] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Layers</span>
        </button>

        {/* Toggle Properties Panel Button */}
        <button
          type="button"
          onClick={onToggleProperties}
          title={propertiesOpen ? 'Hide Properties Inspector' : 'Show Properties Inspector'}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
            propertiesOpen
              ? 'bg-[#1a2130] text-amber-400 border-amber-500/30'
              : 'bg-[#121620] text-[#9ca3af] border-[#202636] hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Inspector</span>
        </button>

        {/* Focus / Canvas-Only Mode Toggle */}
        <button
          type="button"
          onClick={onToggleZenMode}
          title={isZenMode ? 'Exit Canvas-Only Mode' : 'Enter Canvas-Only Mode (Distraction-Free)'}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
            isZenMode
              ? 'bg-amber-500 text-black border-amber-400 font-semibold shadow-sm'
              : 'bg-[#121620] text-[#9ca3af] border-[#202636] hover:text-white'
          }`}
        >
          {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden 2xl:inline text-[11px]">{isZenMode ? 'Exit Focus' : 'Focus'}</span>
        </button>

        <div className="h-4 w-[1px] bg-[#242b3b] mx-0.5" />

        {/* Add Element Button */}
        <button
          type="button"
          onClick={onAddElement}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1a2130] hover:bg-[#242e42] border border-[#2c374e] transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline text-[11px]">Add</span>
        </button>

        {/* Versions Button */}
        <button
          type="button"
          onClick={onOpenVersions}
          title="Version History & Restore"
          className="p-1.5 rounded-lg bg-[#131620] text-[#9ca3af] hover:text-white border border-[#202636] transition-all"
        >
          <History className="w-3.5 h-3.5" />
        </button>

        {/* Reset Layout */}
        <button
          type="button"
          onClick={onResetLayout}
          title="Reset to Default Layout"
          className="p-1.5 rounded-lg bg-[#131620] text-[#9ca3af] hover:text-red-400 border border-[#202636] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          title="Save Draft (Ctrl+S)"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#e5e7eb] bg-[#161a24] hover:bg-[#1d2331] border border-[#2b3345] transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-[#9ca3af]" />
          <span className="hidden md:inline text-[11px]">{isSaving ? 'Saving...' : 'Save'}</span>
          {hasUnsavedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
          )}
        </button>

        {/* Publish Changes */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0c0e12] shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {isPublishing ? (
            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-black" />
          )}
          <span className="text-[11px]">{isPublishing ? 'Publishing...' : 'Publish'}</span>
        </button>
      </div>

    </header>
  );
};
