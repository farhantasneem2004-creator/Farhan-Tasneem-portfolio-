import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import type { SiteSettings, SocialLink } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';

interface HeroProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
  onViewWork?: () => void;
  onDownloadCv?: () => void;
  accentColor?: string;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  socialLinks = [],
  onViewWork,
  onDownloadCv,
  accentColor
}) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center pt-24 pb-16 lg:py-0 overflow-hidden"
    >
      {/* Subtle ambient lighting / radial background */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none blur-[140px] opacity-[0.07]"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute -top-24 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none blur-[160px] opacity-[0.04] bg-white" />

      {/* Very faint architectural background grid / line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161922_1px,transparent_1px),linear-gradient(to_bottom,#161922_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Mobile order vs Desktop order: on mobile portrait comes first */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Mobile Profile Portrait (shown only on < lg screens) */}
          <div className="block lg:hidden w-full max-w-sm mx-auto">
            <div className="relative mx-auto aspect-[3/4] max-w-[280px] sm:max-w-[320px]">
              {settings.heroBgElement && (
                <div
                  className="absolute -inset-3 rounded-2xl border border-amber-500/30 -rotate-2"
                  style={{ borderColor: `${accent}40` }}
                />
              )}
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#222732] bg-[#12151b] shadow-2xl">
                <img
                  src={settings.heroImage || '/src/assets/images/farhan_hero_portrait_1789381757896.jpg'}
                  alt="Farhan Tasneem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: settings.heroImagePosition || 'center' }}
                />
              </div>
            </div>
          </div>

          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#9ca3af]">
                {settings.heroEyebrow || "Hello, I'm"}
              </span>
            </div>

            {/* Huge Name with refined editorial typography */}
            <h1 className="font-display font-extrabold tracking-tight leading-[0.92] text-5xl sm:text-6xl md:text-7xl xl:text-8xl mb-5 text-white">
              <span className="block">{settings.heroHeadingFirst || 'Farhan'}</span>
              <span
                className="block transition-colors"
                style={{ color: accent }}
              >
                {settings.heroHeadingAccent || 'Tasneem'}
              </span>
            </h1>

            {/* Professional Title */}
            <div className="text-base sm:text-lg md:text-xl font-medium text-[#d1d5db] mb-4 flex items-center gap-2">
              <span>{settings.heroSubtitle || 'CSE Student • Developer • Creative'}</span>
            </div>

            {/* Short Introduction */}
            <p className="text-sm sm:text-base text-[#9ca3af] max-w-xl leading-relaxed mb-8 font-normal">
              {settings.heroDescription ||
                "I'm a Computer Science and Engineering student with a passion for programming, web development, creative writing, technical visualization and building meaningful digital projects."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                id="hero-view-work-btn"
                onClick={onViewWork}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#0c0e12] transition-all transform active:scale-95 shadow-md hover:brightness-105 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {settings.publicCvDownload && (
                <button
                  id="hero-download-cv-btn"
                  onClick={onDownloadCv}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#f3f4f6] bg-[#12151b] border border-[#2e3544] hover:border-[#4b5563] hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <span>Download CV</span>
                  <Download className="w-4 h-4 text-[#9ca3af]" />
                </button>
              )}
            </div>

            {/* Dynamic Social Links */}
            <div className="flex items-center gap-3">
              {(socialLinks || []).map((link) => (
                <a
                  key={link.id}
                  id={`social-${link.platform.toLowerCase()}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-lg text-[#9ca3af] hover:text-white border border-transparent hover:border-[#2e3544] hover:bg-[#181c24] transition-all"
                >
                  <DynamicIcon name={link.platform} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Large Personal Portrait with geometric frame & vertical tag */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            <div className="relative w-full max-w-[420px] xl:max-w-[460px]">
              
              {/* Decorative background element behind portrait */}
              {settings.heroBgElement && (
                <>
                  {/* Subtle outer geometric frame */}
                  <div
                    className="absolute -top-4 -right-4 bottom-8 left-8 rounded-2xl border border-[#2e3544]/60 pointer-events-none transition-all"
                  />
                  {/* Accent colored corner bracket */}
                  <div
                    className="absolute -top-6 -right-6 w-16 h-16 border-t-2 border-r-2 pointer-events-none"
                    style={{ borderColor: accent }}
                  />
                </>
              )}

              {/* Vertical accent ribbon badge: "Build • Learn • Create" */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-3 pointer-events-none select-none rotate-90 origin-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#6b7280] font-medium whitespace-nowrap">
                  {settings.heroBadgeText || 'Build • Learn • Create'}
                </span>
                <span className="w-8 h-[1px] bg-[#374151]" />
              </div>

              {/* Main Portrait Frame */}
              <div
                className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[#222732] bg-[#12151b] shadow-2xl transition-all group ${
                  settings.heroImageStyle === 'framed' ? 'p-3' : ''
                }`}
              >
                <img
                  id="hero-portrait-image"
                  src={settings.heroImage || '/src/assets/images/farhan_hero_portrait_1789381757896.jpg'}
                  alt="Farhan Tasneem - CSE Student & Developer"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  style={{
                    objectPosition: settings.heroImagePosition || 'center'
                  }}
                />

                {/* Subtle bottom gradient to blend into dark atmosphere */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
