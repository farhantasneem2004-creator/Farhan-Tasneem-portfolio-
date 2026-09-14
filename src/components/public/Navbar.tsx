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
  activeSection = 'home',
  hasExperience = false,
  hasEducation = false,
  hasCertifications = false,
  onDownloadCv,
  onOpenAdmin,
  isAdminLoggedIn = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
                className={`relative px-3 py-1.5 text-xs xl:text-[13px] font-medium transition-colors cursor-pointer rounded-md ${
                  isActive ? 'text-white' : 'text-[#9ca3af] hover:text-[#f3f4f6]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all"
                    style={{ backgroundColor: settings.accentColor || '#e5a93c' }}
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
              className="ml-3 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[#2e3544] text-[#e5e7eb] hover:border-amber-500/50 hover:text-white transition-all bg-[#12151b]/80 hover:bg-[#181c24]"
            >
              <Download className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span>Download CV</span>
            </button>
          )}

          {/* Admin Switcher */}
          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'Open Admin Dashboard' : 'Admin Login'}
            className={`ml-2 p-1.5 rounded-full border border-[#222732] text-xs transition-colors ${
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
              className="p-2 text-xs rounded-lg border border-[#2e3544] text-[#e5a93c] bg-[#12151b]"
              title="Download CV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9ca3af] hover:text-white rounded-lg border border-[#222732] bg-[#12151b] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-b border-[#222732] bg-[#0c0e12]/98 backdrop-blur-xl px-6 py-4 space-y-2 max-h-[80vh] overflow-y-auto"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'text-white bg-[#181c24] font-semibold'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#12151b]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#222732] flex items-center justify-between">
            <button
              onClick={onDownloadCv}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#9ca3af] hover:text-white border border-[#222732] rounded-lg"
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
