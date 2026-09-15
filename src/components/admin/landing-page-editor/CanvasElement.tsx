import React, { useRef } from 'react';
import {
  Sparkles,
  Award,
  GraduationCap,
  MapPin,
  Download,
  ArrowRight,
  Code2,
  PenTool,
  Lightbulb,
  Languages,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  ExternalLink,
  Lock,
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';
import type { LandingPageElement, Breakpoint } from '../../../types.js';
import { getOptimizedImageUrl, DEFAULT_HERO_PORTRAIT } from '../../../utils/imageHelper.js';

interface CanvasElementProps {
  element: LandingPageElement;
  isSelected: boolean;
  isPreview: boolean;
  breakpoint: Breakpoint;
  zoom: number;
  onSelect: (elementId: string, e: React.MouseEvent) => void;
  onStartDrag: (elementId: string, e: React.MouseEvent) => void;
  onStartResize: (elementId: string, handle: string, e: React.MouseEvent) => void;
  accentColor: string;
}

const renderIcon = (name?: string, className = 'w-4 h-4') => {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('sparkle')) return <Sparkles className={className} />;
  if (n.includes('award')) return <Award className={className} />;
  if (n.includes('grad') || n.includes('cap') || n.includes('school')) return <GraduationCap className={className} />;
  if (n.includes('map') || n.includes('pin')) return <MapPin className={className} />;
  if (n.includes('down')) return <Download className={className} />;
  if (n.includes('arrow')) return <ArrowRight className={className} />;
  if (n.includes('code')) return <Code2 className={className} />;
  if (n.includes('pen') || n.includes('tool')) return <PenTool className={className} />;
  if (n.includes('light') || n.includes('bulb')) return <Lightbulb className={className} />;
  if (n.includes('lang')) return <Languages className={className} />;
  if (n.includes('git')) return <Github className={className} />;
  if (n.includes('link')) return <Linkedin className={className} />;
  if (n.includes('face')) return <Facebook className={className} />;
  if (n.includes('insta')) return <Instagram className={className} />;
  if (n.includes('you')) return <Youtube className={className} />;
  if (n === 'x' || n.includes('twit')) return <Twitter className={className} />;
  return <Sparkles className={className} />;
};

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  isPreview,
  breakpoint,
  zoom,
  onSelect,
  onStartDrag,
  onStartResize,
  accentColor
}) => {
  const props = element[breakpoint] || element.desktop;
  const elementRef = useRef<HTMLDivElement>(null);

  if (!props.visible && isPreview) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    onSelect(element.id, e);
    if (!element.locked) {
      onStartDrag(element.id, e);
    }
  };

  const handleResizeHandleMouseDown = (handle: string, e: React.MouseEvent) => {
    if (isPreview || element.locked) return;
    e.stopPropagation();
    onStartResize(element.id, handle, e);
  };

  // Outer container styling
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: props.rotation ? `rotate(${props.rotation}deg)` : undefined,
    opacity: props.visible ? props.opacity ?? 1 : 0.35,
    zIndex: props.zIndex ?? element.order,
    pointerEvents: isPreview ? (element.type === 'button' || element.type === 'social_links' ? 'auto' : 'none') : 'auto',
    cursor: isPreview ? 'default' : element.locked ? 'not-allowed' : 'move',
    transition: 'opacity 0.15s ease'
  };

  // Render Inner Content
  const renderContent = () => {
    switch (element.type) {
      case 'heading': {
        const first = element.content || '';
        const accent = element.accentContent || '';
        return (
          <div
            className="w-full h-full flex flex-col justify-center leading-none"
            style={{
              fontFamily: element.fontFamily || 'inherit',
              textAlign: props.textAlign || 'left',
              letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined
            }}
          >
            <h1
              className="font-extrabold select-none tracking-tight"
              style={{
                fontSize: `${props.fontSize || 48}px`,
                lineHeight: props.lineHeight || 1.05,
                fontWeight: props.fontWeight || '800',
                color: element.color || '#ffffff',
                textTransform: element.textTransform || 'none'
              }}
            >
              {first}
            </h1>
            {accent && (
              <h1
                className="font-extrabold select-none tracking-tight"
                style={{
                  fontSize: `${props.fontSize || 48}px`,
                  lineHeight: props.lineHeight || 1.05,
                  fontWeight: props.fontWeight || '800',
                  color: element.accentColor || accentColor,
                  textTransform: element.textTransform || 'none'
                }}
              >
                {accent}
              </h1>
            )}
          </div>
        );
      }

      case 'text': {
        return (
          <div
            className="w-full h-full flex items-center select-none"
            style={{
              textAlign: props.textAlign || 'left',
              fontFamily: element.fontFamily || 'inherit',
              fontSize: `${props.fontSize || 16}px`,
              lineHeight: props.lineHeight || 1.5,
              fontWeight: props.fontWeight || '400',
              color: element.color || '#9ca3af',
              letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
              textTransform: element.textTransform || 'none'
            }}
          >
            <p className="w-full whitespace-pre-line break-words">
              {element.content || 'Sample text content'}
            </p>
          </div>
        );
      }

      case 'button': {
        const isPrimary = element.buttonVariant === 'primary' || !element.buttonVariant;
        const isSecondary = element.buttonVariant === 'secondary';
        const isOutline = element.buttonVariant === 'outline';

        const btnBg = isPrimary
          ? element.backgroundColor || accentColor
          : isSecondary
          ? element.backgroundColor || '#12151b'
          : 'transparent';

        const btnText = isPrimary
          ? element.color || '#0c0e12'
          : element.color || '#f3f4f6';

        const btnBorder = isOutline
          ? `1px solid ${element.borderColor || accentColor}`
          : isSecondary
          ? `1px solid ${element.borderColor || '#2e3544'}`
          : element.borderWidth
          ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || 'transparent'}`
          : 'none';

        return (
          <div
            className="w-full h-full flex items-center justify-center gap-2 font-semibold select-none shadow-md transition-all rounded-lg overflow-hidden"
            style={{
              backgroundColor: btnBg,
              color: btnText,
              border: btnBorder,
              borderRadius: `${props.borderRadius ?? 8}px`,
              fontSize: `${props.fontSize || 14}px`,
              fontWeight: props.fontWeight || '600'
            }}
          >
            <span>{element.content || 'Click Here'}</span>
            {element.iconName && renderIcon(element.iconName, 'w-4 h-4')}
          </div>
        );
      }

      case 'image': {
        return (
          <div
            className="w-full h-full relative overflow-hidden bg-[#12151b] select-none group"
            style={{
              borderRadius: `${props.borderRadius ?? 16}px`,
              border: element.borderWidth
                ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#2e3544'}`
                : '1px solid #2e3544'
            }}
          >
            {element.imageUrl ? (
              <img
                src={getOptimizedImageUrl(element.imageUrl)}
                alt={element.imageAlt || 'Hero profile'}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== window.location.origin + DEFAULT_HERO_PORTRAIT) {
                    target.src = DEFAULT_HERO_PORTRAIT;
                  }
                }}
                className="w-full h-full pointer-events-none"
                style={{
                  objectFit: element.imageCrop || 'cover',
                  objectPosition: element.imagePosition || 'center top'
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#6b7280] gap-2 p-4 text-center">
                <ImageIcon className="w-8 h-8 opacity-50" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
          </div>
        );
      }

      case 'badge': {
        return (
          <div
            className="w-full h-full flex items-center justify-center gap-2 px-3 py-1.5 select-none rounded-xl"
            style={{
              backgroundColor: element.backgroundColor || '#12151b',
              border: `1px solid ${element.borderColor || '#2e3544'}`,
              color: element.color || accentColor,
              borderRadius: `${props.borderRadius ?? 12}px`,
              fontSize: `${props.fontSize || 12}px`,
              fontWeight: props.fontWeight || '700',
              letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : '1.5px'
            }}
          >
            {element.iconName && renderIcon(element.iconName, 'w-3.5 h-3.5')}
            <span className="truncate">{element.content || 'Badge Text'}</span>
          </div>
        );
      }

      case 'feature_strip': {
        const items = element.items || [
          { id: '1', label: 'Feature 1', icon: 'Sparkles' },
          { id: '2', label: 'Feature 2', icon: 'Award' }
        ];
        return (
          <div className="w-full h-full flex flex-wrap items-center gap-2 select-none overflow-hidden">
            {items.map((it) => (
              <span
                key={it.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border"
                style={{
                  backgroundColor: element.backgroundColor || '#141822',
                  borderColor: element.borderColor || '#222938',
                  color: element.color || '#d1d5db'
                }}
              >
                {it.icon && renderIcon(it.icon, 'w-3.5 h-3.5 text-amber-400')}
                <span>{it.label}</span>
              </span>
            ))}
          </div>
        );
      }

      case 'social_links': {
        const links = element.items || [
          { id: '1', label: 'GitHub', platform: 'GitHub', url: '#' },
          { id: '2', label: 'LinkedIn', platform: 'LinkedIn', url: '#' }
        ];
        return (
          <div className="w-full h-full flex items-center gap-2 select-none">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-2.5 rounded-lg border flex items-center justify-center transition-all"
                style={{
                  borderColor: element.borderColor || '#1f2533',
                  color: element.color || '#9ca3af',
                  backgroundColor: element.backgroundColor || '#10141d'
                }}
                title={link.label}
              >
                {renderIcon(link.platform || link.label, 'w-4 h-4')}
              </div>
            ))}
          </div>
        );
      }

      case 'decorative_shape': {
        if (element.shapeType === 'glow') {
          return (
            <div
              className="w-full h-full pointer-events-none rounded-full blur-3xl"
              style={{
                backgroundColor: element.backgroundColor || accentColor,
                opacity: 0.8
              }}
            />
          );
        }

        if (element.shapeType === 'frame') {
          return (
            <div
              className="w-full h-full pointer-events-none relative rounded-2xl"
              style={{
                border: `${element.borderWidth || 2}px solid ${element.borderColor || accentColor}`
              }}
            >
              <div
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full"
                style={{ backgroundColor: element.borderColor || accentColor }}
              />
              <div
                className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full"
                style={{ backgroundColor: element.borderColor || accentColor }}
              />
            </div>
          );
        }

        if (element.shapeType === 'circle') {
          return (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: element.backgroundColor || '#151923',
                border: element.borderWidth
                  ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#2e3544'}`
                  : 'none'
              }}
            />
          );
        }

        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.backgroundColor || '#151923',
              borderRadius: `${props.borderRadius ?? 8}px`,
              border: element.borderWidth
                ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#2e3544'}`
                : 'none'
            }}
          />
        );
      }

      case 'divider': {
        return (
          <div className="w-full h-full flex items-center">
            <div
              className="w-full"
              style={{
                height: `${element.borderWidth || 1}px`,
                backgroundColor: element.borderColor || '#222938'
              }}
            />
          </div>
        );
      }

      default:
        return (
          <div className="w-full h-full border border-dashed border-gray-600 flex items-center justify-center text-xs text-gray-400">
            {element.name}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      id={`canvas-elem-${element.id}`}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      className={`group ${
        !isPreview && isSelected
          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0c0e12]'
          : !isPreview
          ? 'hover:ring-1 hover:ring-[#374151]'
          : ''
      }`}
    >
      {/* Element Content */}
      {renderContent()}

      {/* Editor Overlay (Only when selected in Edit mode) */}
      {!isPreview && isSelected && (
        <>
          {/* Header Label displaying element name & lock status */}
          <div
            className="absolute -top-7 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-black flex items-center gap-1.5 shadow-md whitespace-nowrap pointer-events-none z-50"
            style={{ backgroundColor: accentColor }}
          >
            <span>{element.name}</span>
            {element.locked && <Lock className="w-3 h-3 text-black" />}
            {!props.visible && <EyeOff className="w-3 h-3 text-black" />}
            <span className="opacity-75">
              ({props.x}, {props.y}) {props.width}×{props.height}
            </span>
          </div>

          {/* 8 Resize Handles (if not locked) */}
          {!element.locked && (
            <>
              {/* Top-Left */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('nw', e)}
                className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-nwse-resize z-50 shadow-sm"
              />
              {/* Top-Center */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('n', e)}
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-ns-resize z-50 shadow-sm"
              />
              {/* Top-Right */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('ne', e)}
                className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-nesw-resize z-50 shadow-sm"
              />
              {/* Middle-Right */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('e', e)}
                className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-ew-resize z-50 shadow-sm"
              />
              {/* Bottom-Right */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('se', e)}
                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-nwse-resize z-50 shadow-sm"
              />
              {/* Bottom-Center */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('s', e)}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-ns-resize z-50 shadow-sm"
              />
              {/* Bottom-Left */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('sw', e)}
                className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-nesw-resize z-50 shadow-sm"
              />
              {/* Middle-Left */}
              <div
                onMouseDown={(e) => handleResizeHandleMouseDown('w', e)}
                className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border-2 border-amber-500 rounded-sm cursor-ew-resize z-50 shadow-sm"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
