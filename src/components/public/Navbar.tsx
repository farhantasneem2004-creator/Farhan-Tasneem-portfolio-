import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Shield } from 'lucide-react';
import type { SiteSettings } from '../../types.js';

interface NavbarProps {
  settings: SiteSettings;
  activeSection?: string;
  hasExperience?: boolean;
  hasEducation?: boolean;
  hasCertifications?: boolean;
  onDownloadCv?: () => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
  accentColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection: initialActive = 'home',
  hasExperience = false,
  hasEducation = false,
  hasCertifications = false,
  onDownloadCv,
  onOpenAdmin,
  isAdminLoggedIn = false,
  accentColor
}) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(initialActive);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy: identify the currently active section in the viewport
      const sectionIds = [
        'contact',
        'gallery',
        'services',
        'certifications',
        'education',
        'experience',
        'projects',
        'skills',
        'about',
        'home'
      ];

      const scrollPosition = window.scrollY + 140;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibility = settings?.sectionVisibility || {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    certifications: true,
    services: true,
    gallery: true,
    contact: true
  };

  const navItems = [
    { id: 'home', label: 'Home', show: true },
    { id: 'about', label: 'About', show: !!visibility.about },
    { id: 'skills', label: 'Skills', show: !!visibility.skills },
    { id: 'projects', label: 'Projects', show: !!visibility.projects },
    { id: 'experience', label: 'Experience', show: !!visibility.experience && hasExperience },
    { id: 'education', label: 'Education', show: !!visibility.education && hasEducation },
    { id: 'certifications', label: 'Certifications', show: !!visibility.certifications && hasCertifications },
    { id: 'services', label: 'Services', show: !!visibility.services },
    { id: 'gallery', label: 'Gallery', show: !!visibility.gallery },
    { id: 'contact', label: 'Contact', show: !!visibility.contact }
  ].filter((item) => item.show);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0e12]/90 backdrop-blur-md border-b border-[#222732] py-3.5 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <button
          id="nav-logo-btn"
          onClick={() => scrollTo('home')}
          className="group text-left flex items-baseline gap-1.5 focus:outline-none"
        >
          <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-white/90 transition-colors">
            {settings.heroHeadingFirst || 'Farhan'}
          </span>
          <span
            className="font-display font-extrabold text-xl tracking-tight transition-colors"
            style={{ color: settings.accentColor || '#e5a93c' }}
          >
            {settings.heroHeadingAccent || 'Tasneem'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => scrollTo(item.id)}
                className={`relative px-3 py-1.5 text-xs xl:text-[13px] font-medium transition-all duration-200 cursor-pointer rounded-md hover:bg-white/[0.03] ${
                  isActive ? 'text-white' : 'text-[#9ca3af] hover:text-[#f3f4f6]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 8px ${accent}60`
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Download CV CTA */}
          {settings.publicCvDownload && (
            <button
              id="nav-cv-btn"
              onClick={onDownloadCv}
              className="btn-interactive ml-3 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[#2e3544] text-[#e5e7eb] hover:border-amber-500/50 hover:text-white bg-[#12151b]/80 hover:bg-[#181c24] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>Download CV</span>
            </button>
          )}

          {/* Admin Switcher */}
          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'Open Admin Dashboard' : 'Admin Login'}
            className={`ml-2 p-1.5 rounded-full border border-[#222732] text-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isAdminLoggedIn
                ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                : 'text-[#6b7280] hover:text-[#9ca3af] hover:border-[#374151]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {settings.publicCvDownload && (
            <button
              id="mobile-cv-btn"
              onClick={onDownloadCv}
              className="btn-interactive p-2 text-xs rounded-lg border border-[#2e3544] text-[#e5a93c] bg-[#12151b]"
              title="Download CV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9ca3af] hover:text-white rounded-lg border border-[#222732] bg-[#12151b] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer with smooth transition */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-b border-[#222732] bg-[#0c0e12]/98 backdrop-blur-xl px-6 py-4 space-y-2 max-h-[80vh] overflow-y-auto transition-all duration-300 shadow-2xl"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`block w-full text-left px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeSection === item.id
                  ? 'text-white bg-[#181c24] font-semibold border-l-2'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#12151b]'
              }`}
              style={activeSection === item.id ? { borderColor: accent } : undefined}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#222732] flex items-center justify-between">
            <button
              onClick={onDownloadCv}
              className="btn-interactive inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin?.();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#9ca3af] hover:text-white border border-[#222732] rounded-lg transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
