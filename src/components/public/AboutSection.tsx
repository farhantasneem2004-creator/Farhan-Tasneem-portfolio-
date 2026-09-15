import React from 'react';
import { MapPin, Target, Sparkles, Download } from 'lucide-react';
import type { SiteSettings } from '../../types.js';

interface AboutSectionProps {
  settings: SiteSettings;
  onDownloadCv?: () => void;
  accentColor?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onDownloadCv, accentColor }) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';
  const defaultAboutPhoto = '/src/assets/images/workspace_editorial_1789381777509.jpg';
  const [photoSrc, setPhotoSrc] = React.useState<string>(settings?.aboutPhoto || defaultAboutPhoto);

  React.useEffect(() => {
    if (settings?.aboutPhoto) {
      setPhotoSrc(settings.aboutPhoto);
    }
  }, [settings?.aboutPhoto]);

  return (
    <section id="about" className="py-20 sm:py-24 relative overflow-x-clip">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Personal Photography Composition */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Elegant Geometric Frame Accent */}
              <div
                className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-16 sm:w-20 h-16 sm:h-20 border-t-2 border-l-2 pointer-events-none transition-all rounded-tl-lg"
                style={{ borderColor: accent }}
              />
              <div className="absolute -bottom-2.5 -right-2.5 sm:-bottom-3 sm:-right-3 w-16 sm:w-20 h-16 sm:h-20 border-b-2 border-r-2 border-[#2e3544] pointer-events-none rounded-br-lg" />

              {/* Photo Box */}
              <div className="relative rounded-2xl overflow-hidden border border-[#222732] bg-[#12151b] shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={photoSrc}
                  alt="Farhan Tasneem Creative Space"
                  onError={() => {
                    if (photoSrc !== defaultAboutPhoto) setPhotoSrc(defaultAboutPhoto);
                  }}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Subtle caption pill */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#9ca3af] px-3 py-2 rounded-xl bg-[#0c0e12]/85 backdrop-blur-sm border border-[#222732]">
                  <span className="font-medium text-white/90">Workstation & Creative Focus</span>
                  <span>{settings.aboutLocation || 'Dhaka, Bangladesh'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
                About Me
              </span>
            </div>

            {/* Section Headline */}
            <h2 className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-5 sm:mb-6 break-words">
              {settings.aboutHeading || 'Turning ideas into meaningful digital experiences.'}
            </h2>

            {/* Biographies */}
            <p className="text-base sm:text-lg text-[#d1d5db] font-normal leading-relaxed mb-4">
              {settings.aboutShortBio}
            </p>
            {settings.aboutDetailedBio && (
              <p className="text-sm sm:text-base text-[#9ca3af] font-normal leading-relaxed mb-6 whitespace-pre-line">
                {settings.aboutDetailedBio}
              </p>
            )}

            {/* Career Objective Callout */}
            {settings.aboutCareerObjective && (
              <div className="p-4 rounded-xl bg-[#141822] border-l-2 mb-8 border-[#e5a93c]" style={{ borderColor: accent }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1" style={{ color: accent }}>
                  Career Objective
                </span>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed italic">
                  "{settings.aboutCareerObjective}"
                </p>
              </div>
            )}

            {/* Subtle Information Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-4 border-t border-[#1c212c]">
              {settings.aboutLocation && (
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#12151b] border border-[#1e232e]">
                  <div className="p-2 rounded bg-[#181c25] text-amber-400" style={{ color: accent }}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6b7280] uppercase tracking-wider block font-medium">
                      Location
                    </span>
                    <span className="text-sm font-medium text-[#e5e7eb]">
                      {settings.aboutLocation}
                    </span>
                  </div>
                </div>
              )}

              {settings.aboutCurrentFocus && (
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#12151b] border border-[#1e232e]">
                  <div className="p-2 rounded bg-[#181c25] text-amber-400" style={{ color: accent }}>
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6b7280] uppercase tracking-wider block font-medium">
                      Current Focus
                    </span>
                    <span className="text-sm font-medium text-[#e5e7eb]">
                      {settings.aboutCurrentFocus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Languages & Communication */}
            {settings?.aboutLanguages && (
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider text-[#6b7280] block mb-2.5 font-medium">
                  Languages
                </span>
                <div className="flex flex-wrap gap-2">
                  {settings.aboutLanguages.split(',').map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-[#141720] text-emerald-400/90 border border-emerald-500/20"
                    >
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests & Hobbies Tag List */}
            {settings?.aboutInterests && (
              <div className="mb-8">
                <span className="text-xs uppercase tracking-wider text-[#6b7280] block mb-2 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" style={{ color: accent }} />
                  <span>Hobbies, Interests & Disciplines</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {(settings.aboutInterests || '')
                    .split(',')
                    .filter((item) => item && item.trim().length > 0)
                    .map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-[#14171f] text-[#cbd5e1] border border-[#222732]"
                    >
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            {settings.publicCvDownload && (
              <div>
                <button
                  id="about-download-cv-btn"
                  onClick={onDownloadCv}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#151922] border border-[#2e3544] hover:border-amber-500/50 hover:bg-[#1a202c] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" style={{ color: accent }} />
                  <span>Download Curriculum Vitae</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
