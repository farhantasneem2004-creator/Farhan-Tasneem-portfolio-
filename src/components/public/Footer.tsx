import React from 'react';
import { ArrowUp, Download, Shield } from 'lucide-react';
import type { SiteSettings, SocialLink } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';

interface FooterProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
  onDownloadCv?: () => void;
  onOpenAdmin?: () => void;
  accentColor?: string;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  socialLinks = [],
  onDownloadCv,
  onOpenAdmin,
  accentColor
}) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1a1f29] bg-[#0a0c10] py-14 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#181d28]">
          
          {/* Brand & Brief */}
          <div className="max-w-md">
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-display font-extrabold text-xl text-white">
                {settings.heroHeadingFirst || 'Farhan'}
              </span>
              <span
                className="font-display font-extrabold text-xl"
                style={{ color: accent }}
              >
                {settings.heroHeadingAccent || 'Tasneem'}
              </span>
            </div>
            <p className="text-xs text-[#848ea0] leading-relaxed">
              Computer Science & Engineering student, developer, and creative storyteller based in Dhaka.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-2">
            {(socialLinks || []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 rounded-lg text-[#9ca3af] hover:text-white bg-[#11141c] border border-[#202636] hover:border-amber-500/40 transition-colors"
              >
                <DynamicIcon name={link.platform} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom copyright & micro links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b7280]">
          <div>
            © {new Date().getFullYear()} Farhan Tasneem. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {settings.publicCvDownload && (
              <button
                onClick={onDownloadCv}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" style={{ color: accent }} />
                <span>Curriculum Vitae</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400/70" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-[#13161f] border border-[#202534] hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
