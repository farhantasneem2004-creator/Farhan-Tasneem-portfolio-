import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Toolbar
} from './landing-page-editor/Toolbar.js';
import {
  CanvasElement
} from './landing-page-editor/CanvasElement.js';
import {
  PropertiesPanel
} from './landing-page-editor/PropertiesPanel.js';
import {
  LayersPanel
} from './landing-page-editor/LayersPanel.js';
import {
  AddElementModal
} from './landing-page-editor/AddElementModal.js';
import {
  VersionHistoryModal
} from './landing-page-editor/VersionHistoryModal.js';
import {
  PublishConfirmModal
} from './landing-page-editor/PublishConfirmModal.js';
import {
  calculateSnapping,
  SnapGuide
} from './landing-page-editor/snapUtils.js';
import {
  defaultLandingPageLayout
} from './landing-page-editor/defaultLayout.js';
import type {
  LandingPageLayout,
  LandingPageElement,
  Breakpoint,
  SiteSettings,
  LandingPageVersion
} from '../../types.js';
import { api } from '../../api.js';
import { Sparkles, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminLandingPageEditorProps {
  settings: SiteSettings;
}

export const AdminLandingPageEditor: React.FC<AdminLandingPageEditorProps> = ({ settings }) => {
  const accentColor = settings.accentColor || '#e5a93c';

  // Layout & History State
  const [layout, setLayout] = useState<LandingPageLayout>(defaultLandingPageLayout);
  const [history, setHistory] = useState<LandingPageLayout[]>([]);
  const [redoStack, setRedoStack] = useState<LandingPageLayout[]>([]);

  // Editor View Controls
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [zoom, setZoom] = useState<number>(1);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [layersOpen, setLayersOpen] = useState<boolean>(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Snap Guides
  const [activeGuides, setActiveGuides] = useState<SnapGuide[]>([]);

  // Drag & Resize References
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    elementId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    width: number;
    height: number;
  } | null>(null);

  const resizeRef = useRef<{
    isResizing: boolean;
    elementId: string;
    handle: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  // Load Draft on Mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      setIsLoading(true);
      const draft = await api.getDraftLandingPage();
      if (draft && draft.elements && draft.elements.length > 0) {
        setLayout(draft);
      } else {
        setLayout(defaultLandingPageLayout);
      }
    } catch (err) {
      console.error('Failed to load landing page draft:', err);
      setLayout(defaultLandingPageLayout);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Push to Undo history
  const pushHistory = useCallback((currentLayout: LandingPageLayout) => {
    setHistory((prev) => [...prev.slice(-25), currentLayout]);
    setRedoStack([]);
    setHasUnsavedChanges(true);
  }, []);

  // Update layout with history
  const updateLayout = (newLayout: LandingPageLayout, recordHistory = true) => {
    if (recordHistory) {
      pushHistory(layout);
    }
    setLayout(newLayout);
    setHasUnsavedChanges(true);
  };

  // Partial update of layout settings (e.g. background color or heights)
  const handleUpdateLayoutSettings = (updates: Partial<LandingPageLayout>) => {
    pushHistory(layout);
    setLayout((prev) => ({
      ...prev,
      ...updates
    }));
    setHasUnsavedChanges(true);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [layout, ...prev]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setLayout(previous);
    setHasUnsavedChanges(true);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, layout]);
    setRedoStack((prev) => prev.slice(1));
    setLayout(next);
    setHasUnsavedChanges(true);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await api.saveDraftLandingPage(layout);
      setHasUnsavedChanges(false);
      showToast('Draft layout saved successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save draft', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const handleConfirmPublish = async (versionName?: string) => {
    try {
      setIsPublishing(true);
      await api.publishLandingPage(layout, versionName);
      setHasUnsavedChanges(false);
      setIsPublishModalOpen(false);
      showToast('Landing page published live to public visitors!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish changes', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset Layout
  const handleResetLayout = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset your layout to default? All custom positions and additions will be restored to the starting template.'
      )
    ) {
      return;
    }
    try {
      pushHistory(layout);
      const restoredLayout = await api.resetLandingPage();
      setLayout(restoredLayout);
      setSelectedElementId(null);
      showToast('Layout reset to default template', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset layout', 'error');
    }
  };

  // Element CRUD
  const handleUpdateElement = (updated: LandingPageElement) => {
    pushHistory(layout);
    setLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updated.id ? updated : el))
    }));
  };

  const handleAddElement = (newElement: LandingPageElement) => {
    pushHistory(layout);
    setLayout((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElementId(newElement.id);
    showToast(`Added ${newElement.name}`, 'info');
  };

  const handleDeleteElement = (id: string) => {
    const elem = layout.elements.find((e) => e.id === id);
    if (!elem) return;
    if (!window.confirm(`Delete "${elem.name}"?`)) return;

    pushHistory(layout);
    setLayout((prev) => ({
      ...prev,
      elements: prev.elements.filter((e) => e.id !== id)
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    showToast(`Deleted ${elem.name}`, 'info');
  };

  const handleDuplicateElement = (id: string) => {
    const orig = layout.elements.find((e) => e.id === id);
    if (!orig) return;

    const dup: LandingPageElement = {
      ...orig,
      id: `elem_${Date.now()}`,
      name: `${orig.name} (Copy)`,
      order: Date.now(),
      desktop: { ...orig.desktop, x: orig.desktop.x + 20, y: orig.desktop.y + 20 },
      tablet: { ...orig.tablet, x: orig.tablet.x + 15, y: orig.tablet.y + 15 },
      mobile: { ...orig.mobile, x: orig.mobile.x + 10, y: orig.mobile.y + 10 }
    };

    pushHistory(layout);
    setLayout((prev) => ({
      ...prev,
      elements: [...prev.elements, dup]
    }));
    setSelectedElementId(dup.id);
    showToast(`Duplicated ${orig.name}`, 'info');
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
    pushHistory(layout);
    const elements = [...layout.elements];
    const index = elements.findIndex((e) => e.id === id);
    if (index === -1) return;

    const [elem] = elements.splice(index, 1);
    if (direction === 'front' || direction === 'up') {
      elements.push(elem);
    } else {
      elements.unshift(elem);
    }

    // Reassign zIndex and order
    const updated = elements.map((el, idx) => ({
      ...el,
      order: idx + 1,
      [breakpoint]: {
        ...(el[breakpoint] || el.desktop),
        zIndex: idx + 1
      }
    }));

    setLayout((prev) => ({
      ...prev,
      elements: updated
    }));
  };

  const handleCopyDesktopToDevice = (id: string, targetBp: Breakpoint) => {
    const elem = layout.elements.find((e) => e.id === id);
    if (!elem || targetBp === 'desktop') return;

    pushHistory(layout);
    const updated: LandingPageElement = {
      ...elem,
      [targetBp]: {
        ...elem.desktop
      }
    };

    setLayout((prev) => ({
      ...prev,
      elements: prev.elements.map((e) => (e.id === id ? updated : e))
    }));
    showToast(`Copied desktop layout to ${targetBp}`, 'info');
  };

  // Keyboard Shortcuts (Undo, Redo, Delete, Nudge, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is editing an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        setSelectedElementId(null);
        return;
      }

      // Delete / Backspace: Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        handleDeleteElement(selectedElementId);
        return;
      }

      // Arrow Keys: Nudge selected element
      if (selectedElementId && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const elem = layout.elements.find((el) => el.id === selectedElementId);
        if (!elem || elem.locked) return;

        const bpProps = elem[breakpoint] || elem.desktop;
        let deltaX = 0;
        let deltaY = 0;

        if (e.key === 'ArrowLeft') deltaX = -step;
        if (e.key === 'ArrowRight') deltaX = step;
        if (e.key === 'ArrowUp') deltaY = -step;
        if (e.key === 'ArrowDown') deltaY = step;

        const updated: LandingPageElement = {
          ...elem,
          [breakpoint]: {
            ...bpProps,
            x: bpProps.x + deltaX,
            y: bpProps.y + deltaY
          }
        };

        setLayout((prev) => ({
          ...prev,
          elements: prev.elements.map((el) => (el.id === selectedElementId ? updated : el))
        }));
        setHasUnsavedChanges(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layout, history, redoStack, selectedElementId, breakpoint]);

  // Dragging Implementation
  const handleStartDrag = (elementId: string, e: React.MouseEvent) => {
    const elem = layout.elements.find((el) => el.id === elementId);
    if (!elem || elem.locked) return;

    const bpProps = elem[breakpoint] || elem.desktop;

    dragRef.current = {
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      origX: bpProps.x,
      origY: bpProps.y,
      width: bpProps.width,
      height: bpProps.height
    };

    // Push state before dragging begins so undo works
    pushHistory(layout);
  };

  // Resizing Implementation
  const handleStartResize = (elementId: string, handle: string, e: React.MouseEvent) => {
    const elem = layout.elements.find((el) => el.id === elementId);
    if (!elem || elem.locked) return;

    const bpProps = elem[breakpoint] || elem.desktop;

    resizeRef.current = {
      isResizing: true,
      elementId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: bpProps.x,
      origY: bpProps.y,
      origW: bpProps.width,
      origH: bpProps.height
    };

    pushHistory(layout);
  };

  // Global Mouse Move & Mouse Up for Drag & Resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Handle Dragging
      if (dragRef.current && dragRef.current.isDragging) {
        const { elementId, startX, startY, origX, origY, width, height } = dragRef.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;

        const proposedX = Math.round(origX + dx);
        const proposedY = Math.round(origY + dy);

        const canvasWidth = breakpoint === 'desktop' ? 1440 : breakpoint === 'tablet' ? 768 : 390;
        const canvasHeight =
          breakpoint === 'desktop'
            ? layout.canvasHeightDesktop
            : breakpoint === 'tablet'
            ? layout.canvasHeightTablet
            : layout.canvasHeightMobile;

        // Snapping calculations
        const snap = calculateSnapping(
          elementId,
          proposedX,
          proposedY,
          width,
          height,
          layout.elements,
          breakpoint,
          canvasWidth,
          canvasHeight,
          snapEnabled
        );

        setActiveGuides(snap.guides);

        setLayout((prev) => ({
          ...prev,
          elements: prev.elements.map((el) => {
            if (el.id !== elementId) return el;
            const curBp = el[breakpoint] || el.desktop;
            return {
              ...el,
              [breakpoint]: {
                ...curBp,
                x: snap.x,
                y: snap.y
              }
            };
          })
        }));
        setHasUnsavedChanges(true);
        return;
      }

      // 2. Handle Resizing
      if (resizeRef.current && resizeRef.current.isResizing) {
        const { elementId, handle, startX, startY, origX, origY, origW, origH } = resizeRef.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;

        let newX = origX;
        let newY = origY;
        let newW = origW;
        let newH = origH;

        if (handle.includes('e')) newW = Math.max(20, Math.round(origW + dx));
        if (handle.includes('s')) newH = Math.max(20, Math.round(origH + dy));
        if (handle.includes('w')) {
          const delta = Math.min(dx, origW - 20);
          newW = Math.round(origW - delta);
          newX = Math.round(origX + delta);
        }
        if (handle.includes('n')) {
          const delta = Math.min(dy, origH - 20);
          newH = Math.round(origH - delta);
          newY = Math.round(origY + delta);
        }

        setLayout((prev) => ({
          ...prev,
          elements: prev.elements.map((el) => {
            if (el.id !== elementId) return el;
            const curBp = el[breakpoint] || el.desktop;
            return {
              ...el,
              [breakpoint]: {
                ...curBp,
                x: newX,
                y: newY,
                width: newW,
                height: newH
              }
            };
          })
        }));
        setHasUnsavedChanges(true);
      }
    };

    const handleMouseUp = () => {
      if (dragRef.current?.isDragging || resizeRef.current?.isResizing) {
        dragRef.current = null;
        resizeRef.current = null;
        setActiveGuides([]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [layout, zoom, breakpoint, snapEnabled]);

  // Selected element reference
  const selectedElement = layout.elements.find((el) => el.id === selectedElementId) || null;

  // Active canvas dimensions
  const canvasWidth = breakpoint === 'desktop' ? 1440 : breakpoint === 'tablet' ? 768 : 390;
  const canvasHeight =
    breakpoint === 'desktop'
      ? layout.canvasHeightDesktop
      : breakpoint === 'tablet'
      ? layout.canvasHeightTablet
      : layout.canvasHeightMobile;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#090b0f] text-white p-12 min-h-[500px]">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#9ca3af]">Loading landing page visual editor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-[#090b0f] overflow-hidden select-none">
      
      {/* Top Bar */}
      <Toolbar
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        breakpoint={breakpoint}
        onBreakpointChange={(bp) => setBreakpoint(bp)}
        zoom={zoom}
        onZoomChange={(z) => setZoom(z)}
        snapEnabled={snapEnabled}
        onToggleSnap={() => setSnapEnabled(!snapEnabled)}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
        onAddElement={() => setIsAddModalOpen(true)}
        onOpenVersions={() => setIsVersionsModalOpen(true)}
        onResetLayout={handleResetLayout}
        onSaveDraft={handleSaveDraft}
        onPublish={() => setIsPublishModalOpen(true)}
        isSaving={isSaving}
        isPublishing={isPublishing}
        hasUnsavedChanges={hasUnsavedChanges}
        accentColor={accentColor}
      />

      {/* Main Workspace Area (Layers + Canvas Viewport + Properties) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Layers Panel */}
        {!isPreview && (
          <LayersPanel
            elements={layout.elements}
            selectedElementId={selectedElementId}
            breakpoint={breakpoint}
            isOpen={layersOpen}
            onToggleOpen={() => setLayersOpen(!layersOpen)}
            onSelectElement={(id) => setSelectedElementId(id)}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onMoveLayer={handleMoveLayer}
            accentColor={accentColor}
          />
        )}

        {/* Center: Scrollable & Zoomable Canvas Viewport */}
        <div
          onClick={() => setSelectedElementId(null)}
          className="flex-1 overflow-auto bg-[#07080b] flex items-center justify-center p-8 relative"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #1c2230 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        >
          {/* Scaled Canvas Container */}
          <div
            ref={canvasRef}
            id="landing-page-hero-canvas"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              backgroundColor: layout.backgroundColor || '#0c0e12',
              transition: dragRef.current?.isDragging ? 'none' : 'transform 0.15s ease'
            }}
            className="relative shadow-2xl rounded-2xl overflow-hidden border border-[#202737] shrink-0"
          >
            {/* Background Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0e12]/40 to-[#0c0e12] pointer-events-none" />

            {/* Render Visual Elements */}
            {layout.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                isPreview={isPreview}
                breakpoint={breakpoint}
                zoom={zoom}
                onSelect={(id) => setSelectedElementId(id)}
                onStartDrag={handleStartDrag}
                onStartResize={handleStartResize}
                accentColor={accentColor}
              />
            ))}

            {/* Magnetic Snap Guides Visual Overlay */}
            {activeGuides.map((guide, idx) => (
              <div
                key={idx}
                className="absolute pointer-events-none z-50 shadow-sm"
                style={
                  guide.type === 'vertical'
                    ? {
                        left: `${guide.position}px`,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: '#f59e0b'
                      }
                    : {
                        top: `${guide.position}px`,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#f59e0b'
                      }
                }
              />
            ))}

            {/* Breakpoint Badge in bottom right corner */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#000000]/80 text-[#9ca3af] text-[10px] font-mono border border-[#242b3b] pointer-events-none z-40">
              {breakpoint.toUpperCase()} • {canvasWidth}×{canvasHeight}px
            </div>
          </div>
        </div>

        {/* Right: Properties Inspector Panel */}
        {!isPreview && (
          <PropertiesPanel
            selectedElement={selectedElement}
            layout={layout}
            breakpoint={breakpoint}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onMoveLayer={handleMoveLayer}
            onCopyDesktopToDevice={handleCopyDesktopToDevice}
            onUpdateLayout={handleUpdateLayoutSettings}
            accentColor={accentColor}
          />
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : toastMessage.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-500/40'
              : 'bg-[#182030]/95 text-amber-200 border-amber-500/40'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-amber-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modals */}
      <AddElementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddElement={handleAddElement}
        breakpoint={breakpoint}
        canvasHeight={canvasHeight}
        accentColor={accentColor}
      />

      <VersionHistoryModal
        isOpen={isVersionsModalOpen}
        onClose={() => setIsVersionsModalOpen(false)}
        onRestoreVersion={(version) => {
          pushHistory(layout);
          setLayout(version.layout);
          setSelectedElementId(null);
          showToast(`Restored Version #${version.version}`, 'success');
        }}
        accentColor={accentColor}
      />

      <PublishConfirmModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        isPublishing={isPublishing}
        accentColor={accentColor}
      />

    </div>
  );
};
