import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import type { SiteSettings, SocialLink, LandingPageLayout } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';
import { DynamicLandingPageHero } from './DynamicLandingPageHero.js';
import { getOptimizedImageUrl, DEFAULT_HERO_PORTRAIT } from '../../utils/imageHelper.js';
import { Hero3DPortrait } from './Hero3DPortrait.js';

interface HeroProps {
  settings: SiteSettings;
  landingPage?: LandingPageLayout | null;
  socialLinks?: SocialLink[];
  onViewWork?: () => void;
  onDownloadCv?: () => void;
  onDownloadCV?: () => void;
  accentColor?: string;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  landingPage,
  socialLinks = [],
  onViewWork,
  onDownloadCv,
  onDownloadCV,
  accentColor
}) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';
  const handleDownload = onDownloadCv || onDownloadCV;

  // If a custom published landing page layout exists, render it!
  if (landingPage && landingPage.elements && landingPage.elements.length > 0) {
    return (
      <DynamicLandingPageHero
        layout={landingPage}
        settings={settings}
        onViewWork={onViewWork}
        onDownloadCv={handleDownload}
        accentColor={accent}
      />
    );
  }

  // Resilient image source with multi-tier fallback and cross-device version cache-busting
  const versionTimestamp = settings?.updatedAt || 'v1';
  const getUrlWithVersion = (rawUrl?: string | null) => {
    const optimized = getOptimizedImageUrl(rawUrl);
    if (!versionTimestamp || optimized.startsWith('data:image') || optimized.startsWith('blob:')) {
      return optimized;
    }
    const cleanUrl = optimized.split('?')[0];
    const ts = typeof versionTimestamp === 'string' ? new Date(versionTimestamp).getTime() || versionTimestamp : versionTimestamp;
    return `${cleanUrl}?v=${ts}`;
  };

  const [currentImage, setCurrentImage] = useState<string>(() => getUrlWithVersion(settings?.heroImage));

  useEffect(() => {
    setCurrentImage(getUrlWithVersion(settings?.heroImage));
  }, [settings?.heroImage, settings?.updatedAt]);

  const handleImageError = () => {
    if (currentImage !== DEFAULT_HERO_PORTRAIT) {
      setCurrentImage(DEFAULT_HERO_PORTRAIT);
    } else if (currentImage !== '/images/hero/farhan-hero.jpg') {
      setCurrentImage('/images/hero/farhan-hero.jpg');
    } else if (currentImage !== '/farhan_hero_portrait.jpg') {
      setCurrentImage('/farhan_hero_portrait.jpg');
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-5rem)] flex items-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-28 lg:pb-20 overflow-x-clip"
    >
      {/* Atmospheric Depth: Ultra-sparse, subtle slow-floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          className="atmospheric-particle absolute w-1.5 h-1.5 rounded-full blur-[0.5px]"
          style={{ top: '22%', left: '18%', backgroundColor: accent, opacity: 0.35, animationDelay: '0s' }}
        />
        <div
          className="atmospheric-particle absolute w-1 h-1 rounded-full blur-[0.5px]"
          style={{ top: '65%', left: '28%', backgroundColor: '#94a3b8', opacity: 0.25, animationDelay: '3s' }}
        />
        <div
          className="atmospheric-particle absolute w-2 h-2 rounded-full blur-[1px]"
          style={{ top: '35%', right: '22%', backgroundColor: accent, opacity: 0.2, animationDelay: '6s' }}
        />
        <div
          className="atmospheric-particle absolute w-1 h-1 rounded-full blur-[0.5px]"
          style={{ top: '78%', right: '35%', backgroundColor: '#cbd5e1', opacity: 0.3, animationDelay: '2s' }}
        />
      </div>

      {/* Subtle ambient lighting / radial backgrounds that do not cause layout shifts */}
      <div
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none blur-[120px] sm:blur-[140px] opacity-[0.09]"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute top-1/3 right-10 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full pointer-events-none blur-[140px] opacity-[0.04] bg-white" />

      {/* Faint background architectural grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161922_1px,transparent_1px),linear-gradient(to_bottom,#161922_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_65%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================= */}
          {/* MOBILE PROFILE SHOT (Visible on screens < lg)             */}
          {/* Compact, modern, and does not push or cut off the text     */}
          {/* ========================================================= */}
          <div className="block lg:hidden w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Profile Image with subtle ring and status pill */}
              <div className="relative shrink-0">
                <div
                  className="w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 bg-[#12151b] shadow-xl shadow-black/60 relative"
                  style={{ borderColor: `${accent}50` }}
                >
                  <img
                    src={currentImage}
                    alt="Farhan Tasneem"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: settings?.heroImagePosition || 'center top' }}
                  />
                  {/* Subtle bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0c0e12]/80 to-transparent pointer-events-none" />
                </div>

                {/* Active status indicator dot */}
                <div
                  className="absolute -bottom-1.5 -right-1.5 px-2.5 py-1 rounded-full bg-[#12151b] border border-[#2e3544] text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 shadow-md"
                  title="Open for opportunities"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>

              {/* Mobile quick credentials beside/below photo */}
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#161a24] text-[#9ca3af] border border-[#232938]">
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: accent }} />
                  <span>CSE Undergrad • Daffodil Int. University</span>
                </div>
                <div className="text-xs text-[#6b7280] flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>{settings?.aboutLocation || 'Dhaka, Bangladesh'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TEXT CONTENT COLUMN (Both Mobile & PC)                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left">
            {/* Eyebrow greeting */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <span className="w-6 sm:w-8 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
                {settings?.heroEyebrow || "Hello, I'm"}
              </span>
            </div>

            {/* Fluid Name Headline - Enhanced with subtle dimensional depth and specular sheen */}
            <h1 className="font-display font-extrabold tracking-tight leading-[1.05] text-4xl xs:text-5xl sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-4 sm:mb-5 text-white break-words select-none">
              <span
                className="block transition-transform duration-300 hover:translate-x-0.5"
                style={{
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.7), 0 8px 24px rgba(0, 0, 0, 0.5)'
                }}
              >
                {settings?.heroHeadingFirst || 'Farhan'}
              </span>
              <span
                className="block transition-all duration-300 hover:translate-x-0.5"
                style={{
                  color: accent,
                  textShadow: `0 2px 12px rgba(0, 0, 0, 0.8), 0 0 24px ${accent}35`
                }}
              >
                {settings?.heroHeadingAccent || 'Tasneem'}
              </span>
            </h1>

            {/* Professional Subtitle */}
            <div className="text-base sm:text-lg lg:text-xl font-medium text-[#d1d5db] mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
              <span>{settings?.heroSubtitle || 'Computer Science & Engineering Student'}</span>
            </div>

            {/* Introduction Description - Clean line-height and max-width */}
            <p className="text-sm sm:text-base text-[#9ca3af] max-w-xl leading-relaxed mb-6 sm:mb-8 font-normal">
              {settings?.heroDescription ||
                "Motivated Computer Science and Engineering student at Daffodil International University with a strong academic background, passion for artificial intelligence, prompt engineering, and software development."}
            </p>

            {/* Key Academic & Skill Highlight Pills */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#141822] text-[#d1d5db] border border-[#222938]">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
                <span>AI Prompt Engineering</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#141822] text-[#d1d5db] border border-[#222938]">
                <span>GPA 5.00 High School & College</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#141822] text-[#d1d5db] border border-[#222938]">
                <span>Bangla • English • Hindi</span>
              </span>
            </div>

            {/* Action Buttons: Responsive layout (stacked on small mobile, row on sm+) */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <button
                id="hero-view-work-btn"
                onClick={onViewWork}
                className="btn-interactive inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#0c0e12] shadow-md hover:brightness-105 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {settings?.publicCvDownload && (
                <button
                  id="hero-download-cv-btn"
                  onClick={handleDownload}
                  className="btn-interactive inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#f3f4f6] bg-[#12151b] border border-[#2e3544] hover:border-[#4b5563] hover:text-white cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#9ca3af]" />
                  <span>Download CV</span>
                </button>
              )}
            </div>

            {/* Social Links Row */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#181c25]">
                <span className="text-xs uppercase tracking-wider text-[#6b7280] font-medium mr-1 hidden sm:inline-block">
                  Connect:
                </span>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    id={`social-${link.platform.toLowerCase()}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="p-2.5 rounded-lg text-[#9ca3af] hover:text-white border border-[#1f2533] hover:border-[#374151] hover:bg-[#181c24] transition-all hover:-translate-y-0.5"
                  >
                    <DynamicIcon name={link.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* DESKTOP PROFILE SHOT (Visible only on lg+ screens)        */}
          {/* Layered 3D portrait with subtle perspective, lighting,    */}
          {/* interactive gold frame and specular depth                 */}
          {/* ========================================================= */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 relative items-center justify-center">
            <Hero3DPortrait
              currentImage={currentImage}
              settings={settings}
              accentColor={accent}
              onImageError={handleImageError}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
