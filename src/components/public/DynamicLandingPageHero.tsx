import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink
} from 'lucide-react';
import type { LandingPageLayout, LandingPageElement, Breakpoint, SiteSettings } from '../../types.js';
import { getOptimizedImageUrl, DEFAULT_HERO_PORTRAIT } from '../../utils/imageHelper.js';

interface DynamicLandingPageHeroProps {
  layout: LandingPageLayout;
  settings: SiteSettings;
  onViewWork?: () => void;
  onDownloadCv?: () => void;
  accentColor?: string;
}

const HeroImageElement: React.FC<{
  element: LandingPageElement;
  elemStyle: React.CSSProperties;
  props: any;
  settings?: SiteSettings;
}> = ({ element, elemStyle, props, settings }) => {
  // If settings.heroImage is present, prioritize it for the hero image element so updates in admin reflect immediately
  const getEffectiveImage = () => {
    if (element.id === 'elem-hero-image' || element.type === 'image') {
      return settings?.heroImage || element.imageUrl || DEFAULT_HERO_PORTRAIT;
    }
    return element.imageUrl || settings?.heroImage || DEFAULT_HERO_PORTRAIT;
  };

  const initialUrl = getOptimizedImageUrl(getEffectiveImage());
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);

  useEffect(() => {
    setImgSrc(getOptimizedImageUrl(getEffectiveImage()));
  }, [element.imageUrl, settings?.heroImage, element.id, element.type]);

  const handleImgError = () => {
    if (imgSrc !== DEFAULT_HERO_PORTRAIT) {
      setImgSrc(DEFAULT_HERO_PORTRAIT);
    } else if (imgSrc !== '/images/farhan_hero_portrait_1789381757896.jpg') {
      setImgSrc('/images/farhan_hero_portrait_1789381757896.jpg');
    }
  };

  const effectivePosition = (element.id === 'elem-hero-image' && settings?.heroImagePosition)
    ? settings.heroImagePosition
    : (element.imagePosition || 'center top');

  const effectiveFit = (element.id === 'elem-hero-image' && settings?.heroImageCrop)
    ? settings.heroImageCrop
    : ((element.imageCrop as any) || 'cover');

  return (
    <div
      style={{
        ...elemStyle,
        borderRadius: `${props.borderRadius ?? 16}px`,
        border: element.borderWidth
          ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#2e3544'}`
          : '1px solid #2e3544'
      }}
      className="relative overflow-hidden bg-[#12151b] shadow-2xl shadow-black/70 group"
    >
      <img
        src={imgSrc}
        alt={element.imageAlt || 'Farhan Tasneem - Hero profile'}
        onError={handleImgError}
        referrerPolicy="no-referrer"
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        style={{
          objectFit: (effectiveFit as any) || 'cover',
          objectPosition: effectivePosition
        }}
      />
      {/* Subtle bottom gradient for depth */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0e12]/80 to-transparent pointer-events-none" />
    </div>
  );
};

const renderPublicIcon = (name?: string, className = 'w-4 h-4') => {
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

export const DynamicLandingPageHero: React.FC<DynamicLandingPageHeroProps> = ({
  layout,
  settings,
  onViewWork,
  onDownloadCv,
  accentColor: customAccent
}) => {
  const accent = customAccent || settings?.accentColor || '#e5a93c';
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1440);

  // ResizeObserver to calculate real container width and active breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Determine active breakpoint and canvas reference dimensions
  let breakpoint: Breakpoint = 'desktop';
  let canvasRefWidth = 1440;
  let canvasRefHeight = layout.canvasHeightDesktop || 750;

  if (containerWidth < 640) {
    breakpoint = 'mobile';
    canvasRefWidth = 390;
    canvasRefHeight = layout.canvasHeightMobile || 950;
  } else if (containerWidth < 1024) {
    breakpoint = 'tablet';
    canvasRefWidth = 768;
    canvasRefHeight = layout.canvasHeightTablet || 850;
  }

  // Calculate scale factor so the canvas fits the current container without horizontal overflow
  const scale = Math.min(1.15, containerWidth / canvasRefWidth);
  const scaledHeight = Math.round(canvasRefHeight * scale);

  const handleButtonClick = (action?: string, linkUrl?: string) => {
    switch (action) {
      case 'view_work':
        if (onViewWork) onViewWork();
        else {
          const el = document.getElementById('projects');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'download_cv':
        if (onDownloadCv) onDownloadCv();
        else {
          window.open('/api/cv-export/pdf', '_blank');
        }
        break;
      case 'contact': {
        const el = document.getElementById('contact');
        el?.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'custom_url':
        if (linkUrl) window.open(linkUrl, '_blank', 'noopener,noreferrer');
        break;
      default:
        break;
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col items-center justify-start pt-24 sm:pt-28 select-none"
      style={{
        backgroundColor: layout.backgroundColor || '#0c0e12',
        minHeight: `${scaledHeight + 90}px`
      }}
    >
      {/* Background Architectural Subtle Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161922_1px,transparent_1px),linear-gradient(to_bottom,#161922_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_65%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Precision Viewport Wrapper - Prevents horizontal overflow & ensures crisp centering on PC and Mobile */}
      <div
        className="relative mx-auto flex items-start justify-center"
        style={{
          width: `${Math.min(containerWidth, Math.round(canvasRefWidth * scale))}px`,
          height: `${scaledHeight}px`,
          overflow: 'hidden'
        }}
      >
        <div
          className="relative shrink-0 transition-transform duration-100 ease-out"
          style={{
            width: `${canvasRefWidth}px`,
            height: `${canvasRefHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
        {layout.elements.map((element) => {
          const props = element[breakpoint] || element.desktop;
          if (!props || !props.visible) return null;

          const elemStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${props.x}px`,
            top: `${props.y}px`,
            width: `${props.width}px`,
            height: `${props.height}px`,
            transform: props.rotation ? `rotate(${props.rotation}deg)` : undefined,
            opacity: props.opacity ?? 1,
            zIndex: props.zIndex ?? element.order
          };

          switch (element.type) {
            case 'heading': {
              const first = element.content || '';
              const acc = element.accentContent || '';
              return (
                <div
                  key={element.id}
                  style={{
                    ...elemStyle,
                    fontFamily: element.fontFamily || 'inherit',
                    textAlign: props.textAlign || 'left',
                    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined
                  }}
                  className="flex flex-col justify-center leading-none"
                >
                  <h1
                    className="font-extrabold tracking-tight"
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
                  {acc && (
                    <h1
                      className="font-extrabold tracking-tight"
                      style={{
                        fontSize: `${props.fontSize || 48}px`,
                        lineHeight: props.lineHeight || 1.05,
                        fontWeight: props.fontWeight || '800',
                        color: element.accentColor || accent,
                        textTransform: element.textTransform || 'none'
                      }}
                    >
                      {acc}
                    </h1>
                  )}
                </div>
              );
            }

            case 'text':
              return (
                <div
                  key={element.id}
                  style={{
                    ...elemStyle,
                    textAlign: props.textAlign || 'left',
                    fontFamily: element.fontFamily || 'inherit',
                    fontSize: `${props.fontSize || 16}px`,
                    lineHeight: props.lineHeight || 1.5,
                    fontWeight: props.fontWeight || '400',
                    color: element.color || '#9ca3af',
                    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
                    textTransform: element.textTransform || 'none'
                  }}
                  className="flex items-center"
                >
                  <p className="w-full whitespace-pre-line break-words">
                    {element.content}
                  </p>
                </div>
              );

            case 'button': {
              const isPrimary = element.buttonVariant === 'primary' || !element.buttonVariant;
              const isSecondary = element.buttonVariant === 'secondary';
              const isOutline = element.buttonVariant === 'outline';

              const btnBg = isPrimary
                ? element.backgroundColor || accent
                : isSecondary
                ? element.backgroundColor || '#12151b'
                : 'transparent';

              const btnText = isPrimary
                ? element.color || '#0c0e12'
                : element.color || '#f3f4f6';

              const btnBorder = isOutline
                ? `1px solid ${element.borderColor || accent}`
                : isSecondary
                ? `1px solid ${element.borderColor || '#2e3544'}`
                : element.borderWidth
                ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || 'transparent'}`
                : 'none';

              return (
                <button
                  key={element.id}
                  type="button"
                  onClick={() => handleButtonClick(element.buttonAction, element.linkUrl)}
                  style={{
                    ...elemStyle,
                    backgroundColor: btnBg,
                    color: btnText,
                    border: btnBorder,
                    borderRadius: `${props.borderRadius ?? 8}px`,
                    fontSize: `${props.fontSize || 14}px`,
                    fontWeight: props.fontWeight || '600'
                  }}
                  className="flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <span>{element.content || 'Click Here'}</span>
                  {element.iconName && renderPublicIcon(element.iconName, 'w-4 h-4')}
                </button>
              );
            }

            case 'image':
              return (
                <HeroImageElement
                  key={element.id}
                  element={element}
                  elemStyle={elemStyle}
                  props={props}
                  settings={settings}
                />
              );

            case 'badge':
              return (
                <div
                  key={element.id}
                  style={{
                    ...elemStyle,
                    backgroundColor: element.backgroundColor || '#12151b',
                    border: `1px solid ${element.borderColor || '#2e3544'}`,
                    color: element.color || accent,
                    borderRadius: `${props.borderRadius ?? 12}px`,
                    fontSize: `${props.fontSize || 12}px`,
                    fontWeight: props.fontWeight || '700',
                    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : '1.5px'
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 shadow-md"
                >
                  {element.iconName && renderPublicIcon(element.iconName, 'w-3.5 h-3.5')}
                  <span className="truncate">{element.content}</span>
                </div>
              );

            case 'feature_strip': {
              const items = element.items || [];
              return (
                <div
                  key={element.id}
                  style={elemStyle}
                  className="flex flex-wrap items-center gap-2 overflow-hidden"
                >
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
                      {it.icon && renderPublicIcon(it.icon, 'w-3.5 h-3.5 text-amber-400')}
                      <span>{it.label}</span>
                    </span>
                  ))}
                </div>
              );
            }

            case 'social_links': {
              const links = element.items || [];
              return (
                <div
                  key={element.id}
                  style={elemStyle}
                  className="flex items-center gap-2.5"
                >
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      style={{
                        borderColor: element.borderColor || '#1f2533',
                        color: element.color || '#9ca3af',
                        backgroundColor: element.backgroundColor || '#10141d'
                      }}
                      title={link.label}
                    >
                      {renderPublicIcon(link.platform || link.label, 'w-4 h-4')}
                    </a>
                  ))}
                </div>
              );
            }

            case 'decorative_shape': {
              if (element.shapeType === 'glow') {
                return (
                  <div
                    key={element.id}
                    style={{
                      ...elemStyle,
                      backgroundColor: element.backgroundColor || accent,
                      opacity: 0.15
                    }}
                    className="pointer-events-none rounded-full blur-3xl"
                  />
                );
              }

              if (element.shapeType === 'frame') {
                return (
                  <div
                    key={element.id}
                    style={{
                      ...elemStyle,
                      border: `${element.borderWidth || 2}px solid ${element.borderColor || accent}`
                    }}
                    className="pointer-events-none relative rounded-2xl"
                  >
                    <div
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full"
                      style={{ backgroundColor: element.borderColor || accent }}
                    />
                    <div
                      className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full"
                      style={{ backgroundColor: element.borderColor || accent }}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={element.id}
                  style={{
                    ...elemStyle,
                    backgroundColor: element.backgroundColor || '#151923',
                    borderRadius: `${props.borderRadius ?? 8}px`,
                    border: element.borderWidth
                      ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#2e3544'}`
                      : 'none'
                  }}
                />
              );
            }

            case 'divider':
              return (
                <div key={element.id} style={elemStyle} className="flex items-center">
                  <div
                    className="w-full"
                    style={{
                      height: `${element.borderWidth || 1}px`,
                      backgroundColor: element.borderColor || '#222938'
                    }}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
        </div>
      </div>
    </section>
  );
};
