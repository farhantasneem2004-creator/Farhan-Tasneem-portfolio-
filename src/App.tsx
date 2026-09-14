import React, { useState, useEffect } from 'react';
import type {
  SiteSettings,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Service,
  GalleryCategory,
  GalleryAlbum,
  GalleryImage,
  SocialLink,
  ContactMessage,
  CVVersion
} from './types.js';
import { api } from './api.js';

// Public Components
import { Navbar } from './components/public/Navbar.js';
import { Hero } from './components/public/Hero.js';
import { AboutSection } from './components/public/AboutSection.js';
import { SkillsSection } from './components/public/SkillsSection.js';
import { ProjectsSection } from './components/public/ProjectsSection.js';
import { ExperienceSection } from './components/public/ExperienceSection.js';
import { EducationSection } from './components/public/EducationSection.js';
import { CertificationsSection } from './components/public/CertificationsSection.js';
import { ServicesSection } from './components/public/ServicesSection.js';
import { GallerySection } from './components/public/GallerySection.js';
import { ContactSection } from './components/public/ContactSection.js';
import { Footer } from './components/public/Footer.js';
import { ProjectModal } from './components/public/ProjectModal.js';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminLayout, type AdminTab } from './components/admin/AdminLayout.js';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview.js';
import { AdminProfileSettings } from './components/admin/AdminProfileSettings.js';
import { AdminHeroSettings } from './components/admin/AdminHeroSettings.js';
import { AdminSkillsManager } from './components/admin/AdminSkillsManager.js';
import { AdminProjectsManager } from './components/admin/AdminProjectsManager.js';
import { AdminExperienceManager } from './components/admin/AdminExperienceManager.js';
import { AdminEducationManager } from './components/admin/AdminEducationManager.js';
import { AdminCertificationsManager } from './components/admin/AdminCertificationsManager.js';
import { AdminServicesManager } from './components/admin/AdminServicesManager.js';
import { AdminGalleryManager } from './components/admin/AdminGalleryManager.js';
import { AdminCVBuilder } from './components/admin/AdminCVBuilder.js';
import { AdminMessagesManager } from './components/admin/AdminMessagesManager.js';
import { AdminSocialLinksManager } from './components/admin/AdminSocialLinksManager.js';
import { AdminWebsiteSettings } from './components/admin/AdminWebsiteSettings.js';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Core Database Data
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [cvVersions, setCvVersions] = useState<CVVersion[]>([]);

  // Load public portfolio data
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getPublicData();
      setSettings(data.settings);
      setSkills(data.skills || []);
      setProjects(data.projects || []);
      setExperiences(data.experiences || []);
      setEducation(data.education || []);
      setCertifications(data.certifications || []);
      setServices(data.services || []);
      setGalleryCategories(data.galleryCategories || []);
      setGalleryAlbums(data.galleryAlbums || []);
      setGalleryImages(data.galleryImages || []);
      setSocialLinks(data.socialLinks || []);

      // Check if already authenticated
      if (api.isAuthenticated()) {
        setIsAuthenticated(true);
        loadAdminData();
      }
    } catch (err) {
      console.error('Failed to load portfolio database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load private admin data (messages, cv versions)
  const loadAdminData = async () => {
    try {
      const [msgs, versions] = await Promise.all([
        api.getContactMessages().catch(() => []),
        api.getCVVersions().catch(() => [])
      ]);
      setContactMessages(msgs);
      setCvVersions(versions);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Support Hash-based navigation e.g. #admin
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#admin')) {
        setView('admin');
      } else if (hash === '#public' || hash === '' || hash === '#home') {
        setView('public');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadAdminData();
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setView('public');
    window.location.hash = '';
  };

  const handleDownloadCV = () => {
    window.open('/api/admin/cv/export/pdf', '_blank');
  };

  const accentColor = settings?.accentColor || '#e5a93c';

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center p-6 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${accentColor} transparent transparent transparent` }}
          />
          <div className="text-xs font-mono tracking-widest text-[#848ea0] uppercase">
            Loading Portfolio Experience...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD & LOGIN VIEWS
  // --------------------------------------------------------------------------
  if (view === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onSuccess={handleLoginSuccess}
          onBackToPublic={() => {
            setView('public');
            window.location.hash = '';
          }}
          onBackToSite={() => {
            setView('public');
            window.location.hash = '';
          }}
          accentColor={accentColor}
        />
      );
    }

    const unreadMessagesCount = contactMessages.filter((m) => !m.read).length;

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onLogout={handleLogout}
        onViewPublicSite={() => {
          setView('public');
          window.location.hash = '';
        }}
        settings={settings}
        unreadCount={unreadMessagesCount}
      >
        {adminTab === 'overview' && (
          <AdminDashboardOverview
            settings={settings}
            skills={skills}
            projects={projects}
            experiences={experiences}
            certifications={certifications}
            services={services}
            galleryImages={galleryImages}
            messages={contactMessages}
            onNavigate={(tab) => setAdminTab(tab as AdminTab)}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'profile' && (
          <AdminProfileSettings
            settings={settings}
            onSettingsUpdated={(updated) => setSettings(updated)}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'hero' && (
          <AdminHeroSettings
            settings={settings}
            onSettingsUpdated={(updated) => setSettings(updated)}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'skills' && (
          <AdminSkillsManager
            skills={skills}
            onSkillsUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'projects' && (
          <AdminProjectsManager
            projects={projects}
            onProjectsUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'experience' && (
          <AdminExperienceManager
            experiences={experiences}
            onExperiencesUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'education' && (
          <AdminEducationManager
            education={education}
            onEducationUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'certifications' && (
          <AdminCertificationsManager
            certifications={certifications}
            onCertificationsUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'services' && (
          <AdminServicesManager
            services={services}
            onServicesUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'gallery' && (
          <AdminGalleryManager
            categories={galleryCategories}
            albums={galleryAlbums}
            images={galleryImages}
            onGalleryUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'cv-builder' && (
          <AdminCVBuilder
            settings={settings}
            skills={skills}
            projects={projects}
            experiences={experiences}
            education={education}
            certifications={certifications}
            services={services}
            cvVersions={cvVersions}
            onVersionsUpdated={loadAdminData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'messages' && (
          <AdminMessagesManager
            messages={contactMessages}
            onMessagesUpdated={loadAdminData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'social-links' && (
          <AdminSocialLinksManager
            socialLinks={socialLinks}
            onSocialLinksUpdated={loadData}
            accentColor={accentColor}
          />
        )}

        {adminTab === 'settings' && (
          <AdminWebsiteSettings
            settings={settings}
            onSettingsUpdated={(updated) => setSettings(updated)}
          />
        )}
      </AdminLayout>
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC WEBSITE VIEW
  // --------------------------------------------------------------------------
  const { sectionVisibility } = settings;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f3f4f6] selection:bg-[#e5a93c]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        hasExperience={(experiences?.length || 0) > 0}
        hasEducation={(education?.length || 0) > 0}
        hasCertifications={(certifications?.length || 0) > 0}
        onDownloadCv={handleDownloadCV}
        onOpenAdmin={() => {
          setView('admin');
          window.location.hash = 'admin';
        }}
        isAdminLoggedIn={isAuthenticated}
        accentColor={accentColor}
      />

      {/* Main Sections */}
      <main className="relative z-10 space-y-24 sm:space-y-32">
        <Hero
          settings={settings}
          onDownloadCV={handleDownloadCV}
          accentColor={accentColor}
        />

        {sectionVisibility.about && (
          <AboutSection
            settings={settings}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.skills && (
          <SkillsSection
            skills={skills}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.projects && (
          <ProjectsSection
            projects={projects}
            onSelectProject={setSelectedProject}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.experience && (
          <ExperienceSection
            experiences={experiences}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.education && (
          <EducationSection
            education={education}
            references={settings.references}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.certifications && (
          <CertificationsSection
            certifications={certifications}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.services && (
          <ServicesSection
            services={services}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.gallery && (
          <GallerySection
            categories={galleryCategories}
            albums={galleryAlbums}
            images={galleryImages}
            accentColor={accentColor}
          />
        )}

        {sectionVisibility.contact && (
          <ContactSection
            settings={settings}
            socialLinks={socialLinks}
            accentColor={accentColor}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        socialLinks={socialLinks}
        onOpenAdmin={() => {
          setView('admin');
          window.location.hash = 'admin';
        }}
        accentColor={accentColor}
      />

      {/* Project Case Study Lightbox / Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
