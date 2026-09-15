import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckSquare,
  Square,
  Save,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Printer,
  Camera,
  Upload,
  ArrowUp,
  ArrowDown,
  Palette,
  RefreshCw,
  GraduationCap,
  Briefcase,
  Code,
  Feather,
  Layout
} from 'lucide-react';
import type {
  SiteSettings,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Service,
  CVVersion
} from '../../types.js';
import { api } from '../../api.js';

const DEFAULT_HERO_IMAGE = '/farhan_hero_portrait.jpg';

interface AdminCVBuilderProps {
  settings: SiteSettings;
  skills?: Skill[];
  projects?: Project[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  services?: Service[];
  cvVersions?: CVVersion[];
  onVersionsUpdated: () => void;
  accentColor?: string;
}

type CvArchetype = 'academic' | 'professional' | 'technical' | 'creative' | 'general';
type PhotoShape = 'circle' | 'rounded' | 'square';
type PhotoPosition = 'header-right' | 'header-left' | 'sidebar';

export const AdminCVBuilder: React.FC<AdminCVBuilderProps> = ({
  settings,
  skills = [],
  projects = [],
  experiences = [],
  education = [],
  certifications = [],
  services = [],
  cvVersions = [],
  onVersionsUpdated,
  accentColor: initialAccent = '#e5a93c'
}) => {
  // Active CV Type
  const [cvType, setCvType] = useState<CvArchetype>('professional');
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern' | 'compact' | 'sidebar'>('modern');
  const [targetLength, setTargetLength] = useState<'one-page' | 'two-page' | 'extended'>('one-page');
  const [selectedAccent, setSelectedAccent] = useState<string>(initialAccent);

  // Photo Configuration
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_HERO_IMAGE);
  const [photoShape, setPhotoShape] = useState<PhotoShape>('rounded');
  const [photoPosition, setPhotoPosition] = useState<PhotoPosition>('header-right');
  const [photoSize, setPhotoSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Content Customization
  const [customTitle, setCustomTitle] = useState<string>(
    'Full-Stack Software Engineer & Solutions Developer'
  );
  const [customSummary, setCustomSummary] = useState<string>(
    'CSE student and software developer with solid foundations in algorithmic problem solving, modern web architectures, and high-craft digital visualization. Experienced in building performant full-stack systems and automated tournament orchestration tools.'
  );
  const [versionName, setVersionName] = useState<string>('Farhan Tasneem — Professional CV');

  // Included Sections
  const [sections, setSections] = useState<{
    summary: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    certifications: boolean;
    services: boolean;
  }>({
    summary: true,
    education: true,
    skills: true,
    projects: true,
    experience: true,
    certifications: true,
    services: false
  });

  // Section Order
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'summary',
    'experience',
    'skills',
    'projects',
    'education',
    'certifications'
  ]);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Preset switchers
  const handleSelectArchetype = (type: CvArchetype) => {
    setCvType(type);
    if (type === 'academic') {
      setVersionName('Farhan Tasneem — Academic & Research CV');
      setActiveTemplate('classic');
      setTargetLength('two-page');
      setSelectedAccent('#881337'); // Academic Maroon
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('square');
      setCustomTitle('Computer Science & Engineering Student & Researcher');
      setCustomSummary(
        'Undergraduate Computer Science & Engineering researcher with coursework focus in algorithms, discrete mathematics, and distributed systems. Committed to rigorous academic inquiry, open-source software methodology, and practical systems engineering.'
      );
      setSections({
        summary: true,
        education: true,
        projects: true,
        skills: true,
        experience: true,
        certifications: true,
        services: false
      });
      setSectionOrder(['summary', 'education', 'projects', 'skills', 'experience', 'certifications']);
    } else if (type === 'professional') {
      setVersionName('Farhan Tasneem — Professional CV');
      setActiveTemplate('modern');
      setTargetLength('one-page');
      setSelectedAccent('#e5a93c'); // Farhan Gold
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('Full-Stack Software Engineer & Solutions Developer');
      setCustomSummary(
        'CSE student and software developer with solid foundations in algorithmic problem solving, modern web architectures, and high-craft digital visualization. Experienced in building performant full-stack systems and automated tournament orchestration tools.'
      );
      setSections({
        summary: true,
        experience: true,
        skills: true,
        projects: true,
        education: true,
        certifications: true,
        services: false
      });
      setSectionOrder(['summary', 'experience', 'skills', 'projects', 'education', 'certifications']);
    } else if (type === 'technical') {
      setVersionName('Farhan Tasneem — Technical & Software Engineering CV');
      setActiveTemplate('compact');
      setTargetLength('one-page');
      setSelectedAccent('#1e3a8a'); // Tech Navy
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('Computer Science & Engineering • Full-Stack Systems');
      setCustomSummary(
        'High-density engineering profile focusing on TypeScript, React, Node.js, C++, and competitive algorithmic problem solving. Track record of developing robust full-stack web applications and tournament management infrastructure.'
      );
      setSections({
        summary: true,
        skills: true,
        projects: true,
        experience: true,
        education: true,
        certifications: true,
        services: false
      });
      setSectionOrder(['skills', 'projects', 'experience', 'education', 'certifications']);
    } else if (type === 'creative') {
      setVersionName('Farhan Tasneem — Creative & Multidisciplinary CV');
      setActiveTemplate('sidebar');
      setTargetLength('one-page');
      setSelectedAccent('#047857'); // Emerald
      setIncludePhoto(true);
      setPhotoPosition('sidebar');
      setPhotoShape('circle');
      setCustomTitle('Creative Technologist • Developer • Visual Thinker');
      setCustomSummary(
        'Bespoke software development, technical illustration, and scriptwriting tailored for clients seeking precise, high-craft deliverables. Blending technical engineering with narrative worldbuilding and aesthetic line art.'
      );
      setSections({
        summary: true,
        services: true,
        projects: true,
        skills: true,
        experience: true,
        education: true,
        certifications: false
      });
      setSectionOrder(['summary', 'services', 'projects', 'skills', 'experience', 'education']);
    } else {
      setVersionName('Farhan Tasneem — General Comprehensive CV');
      setActiveTemplate('modern');
      setTargetLength('two-page');
      setSelectedAccent('#e5a93c');
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('CSE Student • Software Developer • Technical Creator');
      setCustomSummary(
        settings.aboutShortBio ||
          'CSE student at East Delta University with expertise in full-stack web development, algorithmic problem solving, technical illustration, and creative writing.'
      );
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: true
      });
      setSectionOrder(['summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'services']);
    }
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionOrder(newOrder);
  };

  // Upload custom portrait photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const res = await api.uploadFile(file);
      setPhotoUrl(res.url);
      setIncludePhoto(true);
      setStatusMessage('Portrait image uploaded successfully!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Build query params for server export
  const buildExportParams = () => {
    return new URLSearchParams({
      cvType,
      template: activeTemplate,
      length: targetLength,
      includePhoto: String(includePhoto),
      photoUrl,
      photoShape,
      photoPosition,
      accentColor: selectedAccent,
      customTitle,
      customSummary,
      sections: JSON.stringify(sections),
      sectionOrder: JSON.stringify(sectionOrder)
    });
  };

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const query = buildExportParams();
      window.open(`/api/admin/cv/export/pdf?${query.toString()}`, '_blank');
    } catch (err: any) {
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDOCX = async () => {
    setDownloadingDocx(true);
    try {
      const query = buildExportParams();
      window.location.href = `/api/admin/cv/export/docx?${query.toString()}`;
    } catch (err: any) {
      alert('Failed to generate Word document: ' + err.message);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleSaveVersion = async () => {
    try {
      await api.createCVVersion({
        title: versionName,
        cvType,
        template: activeTemplate,
        length: targetLength,
        photoUrl,
        photoShape,
        photoPosition,
        accentColor: selectedAccent,
        sections: {
          profilePicture: includePhoto,
          about: sections.summary,
          contact: true,
          skills: sections.skills,
          projects: sections.projects,
          experience: sections.experience,
          education: sections.education,
          certifications: sections.certifications,
          services: sections.services,
          socialLinks: true
        },
        sectionOrder,
        customTitle,
        customSummary,
        isDefault: false
      });
      setStatusMessage('CV preset saved to database successfully!');
      setTimeout(() => setStatusMessage(null), 3500);
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to save CV version: ' + err.message);
    }
  };

  // Pre-calculate visible items based on length
  const maxProjects = targetLength === 'one-page' ? (cvType === 'technical' ? 3 : 2) : targetLength === 'two-page' ? 4 : 8;
  const maxExperiences = targetLength === 'one-page' ? 2 : targetLength === 'two-page' ? 4 : 8;
  const maxEducation = targetLength === 'one-page' ? 2 : 4;
  const maxCertifications = targetLength === 'one-page' ? 3 : 6;

  const visibleProjects = projects.filter((p) => p.visible).slice(0, maxProjects);
  const visibleExperiences = experiences.filter((e) => e.visible).slice(0, maxExperiences);
  const visibleEducation = education.filter((e) => e.visible).slice(0, maxEducation);
  const visibleCertifications = certifications.filter((c) => c.visible).slice(0, maxCertifications);
  const visibleServices = services.filter((s) => s.visible).slice(0, targetLength === 'one-page' ? 2 : 4);
  const visibleSkills = skills.filter((s) => s.visible);

  // Group skills by category for technical mode
  const skillsByCategory: Record<string, Skill[]> = {};
  visibleSkills.forEach((s) => {
    const cat = s.category || 'General';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s);
  });

  // Photo size classes
  const photoSizePx = photoSize === 'compact' ? 56 : photoSize === 'standard' ? 72 : 88;
  const photoShapeClass =
    photoShape === 'circle' ? 'rounded-full' : photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

  return (
    <div className="space-y-8">
      {/* Top Header & Export Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-white">
              Curriculum Vitae Studio & Exporter
            </h1>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-black"
              style={{ backgroundColor: selectedAccent }}
            >
              {cvType} CV
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Produce tailored Academic, Professional, Technical, and Creative CVs with integrated hero portrait photography and multi-format exports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#cbd5e1] bg-[#151922] border border-[#262f40] hover:border-white/40 cursor-pointer shadow transition-all"
            title="Open browser print dialog to save as native PDF"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDOCX}
            disabled={downloadingDocx}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#151922] border border-[#262f40] hover:border-sky-500/50 cursor-pointer shadow transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>{downloadingDocx ? 'Generating Word...' : 'Export DOCX'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-[#0c0e12] cursor-pointer shadow-md transition-all disabled:opacity-50"
            style={{ backgroundColor: selectedAccent }}
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between">
          <span>✓ {statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Career Archetype Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider block">
          Select CV Profile Archetype
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            {
              id: 'academic',
              label: 'Academic CV',
              icon: GraduationCap,
              desc: 'Scholarly serif, Education & Research first'
            },
            {
              id: 'professional',
              label: 'Professional CV',
              icon: Briefcase,
              desc: 'Executive modern, Experience timeline'
            },
            {
              id: 'technical',
              label: 'Technical Dev CV',
              icon: Code,
              desc: 'ATS matrix, Systems & Tech badges'
            },
            {
              id: 'creative',
              label: 'Creative Minimal',
              icon: Feather,
              desc: 'Dual column, Photo sidebar & narrative'
            },
            {
              id: 'general',
              label: 'General Dossier',
              icon: Layout,
              desc: 'Balanced comprehensive portfolio'
            }
          ].map((archetype) => {
            const Icon = archetype.icon;
            const isActive = cvType === archetype.id;
            return (
              <button
                key={archetype.id}
                type="button"
                onClick={() => handleSelectArchetype(archetype.id as CvArchetype)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#182030] border-amber-500/80 shadow-lg'
                    : 'bg-[#11141c] border-[#1e2535] hover:border-[#2f3b52] hover:bg-[#141822]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? selectedAccent : '#9ca3af' }}
                  />
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#d1d5db]'}`}>
                    {archetype.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#848ea0] line-clamp-2 leading-tight">
                  {archetype.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: CV Controls & Configuration Suite */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Hero Portrait Photo Suite */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2230] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" style={{ color: selectedAccent }} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Hero Portrait Photo
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={includePhoto}
                  onChange={(e) => setIncludePhoto(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span className={includePhoto ? 'text-white font-medium' : 'text-[#6b7280]'}>
                  Include in CV
                </span>
              </label>
            </div>

            {includePhoto && (
              <div className="space-y-4 pt-1">
                {/* Photo Preview & Upload Controls */}
                <div className="flex items-center gap-4">
                  <div
                    className={`relative overflow-hidden border-2 shadow-md flex-shrink-0 bg-neutral-900 ${photoShapeClass}`}
                    style={{
                      width: photoSizePx,
                      height: photoSizePx,
                      borderColor: selectedAccent
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt="Candidate Hero Portrait"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-3 py-1.5 rounded-lg bg-[#161b25] border border-[#262f40] hover:border-amber-500/50 text-white text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoUrl(DEFAULT_HERO_IMAGE)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#141822] border border-[#202736] hover:border-neutral-500 text-[#9ca3af] hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        title="Reset to Farhan's official hero portrait"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-[#6b7280]">
                      Embedded directly into generated PDF and DOCX documents.
                    </p>
                  </div>
                </div>

                {/* Photo Shape & Placement Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                      Frame Shape
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-[#0c0e12] p-1 rounded-lg border border-[#202736]">
                      {(['rounded', 'circle', 'square'] as PhotoShape[]).map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => setPhotoShape(shape)}
                          className={`py-1 text-[10px] font-medium rounded capitalize transition-all ${
                            photoShape === shape
                              ? 'bg-[#202838] text-white font-bold'
                              : 'text-[#848ea0] hover:text-white'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                      Placement
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-[#0c0e12] p-1 rounded-lg border border-[#202736]">
                      {(['header-right', 'header-left'] as PhotoPosition[]).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPhotoPosition(pos)}
                          className={`py-1 text-[10px] font-medium rounded transition-all ${
                            photoPosition === pos
                              ? 'bg-[#202838] text-white font-bold'
                              : 'text-[#848ea0] hover:text-white'
                          }`}
                        >
                          {pos === 'header-right' ? 'Right' : 'Left'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Scale */}
                <div>
                  <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                    Photo Scale
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'compact', label: 'Compact (56px)' },
                      { id: 'standard', label: 'Standard (72px)' },
                      { id: 'large', label: 'Large (88px)' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setPhotoSize(s.id as any)}
                        className={`py-1 px-2 text-[10px] rounded-lg border transition-all ${
                          photoSize === s.id
                            ? 'bg-[#1c2436] text-white border-amber-500/60 font-semibold'
                            : 'bg-[#141822] text-[#848ea0] border-[#202736]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Document Length & Accent Palette */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">
                  Target Length
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'one-page', label: 'One Page (Curated)' },
                    { id: 'two-page', label: 'Two Pages (Standard)' },
                    { id: 'extended', label: 'Extended (Complete)' }
                  ].map((len) => (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => setTargetLength(len.id as any)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium text-left border transition-all ${
                        targetLength === len.id
                          ? 'bg-[#1c2436] text-white border-amber-500/60 font-semibold'
                          : 'bg-[#141822] text-[#848ea0] border-[#202736]'
                      }`}
                    >
                      {len.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="space-y-1.5">
                  {[
                    { hex: '#e5a93c', name: 'Farhan Gold' },
                    { hex: '#881337', name: 'Academic Maroon' },
                    { hex: '#1e3a8a', name: 'Corporate Navy' },
                    { hex: '#047857', name: 'Emerald Green' },
                    { hex: '#1e293b', name: 'Midnight Slate' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setSelectedAccent(color.hex)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-left border flex items-center gap-2 transition-all ${
                        selectedAccent === color.hex
                          ? 'bg-[#1c2436] text-white border-amber-500/60 font-semibold'
                          : 'bg-[#141822] text-[#848ea0] border-[#202736]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="truncate text-[11px]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Role Title & Custom Summary Override */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Application Tailoring & Narrative
            </span>

            <div>
              <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                Headline / Target Designation
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Computer Science & Engineering Student & Researcher"
                className="w-full px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                Summary / Research Abstract
              </label>
              <textarea
                rows={4}
                value={customSummary}
                onChange={(e) => setCustomSummary(e.target.value)}
                placeholder="Narrative summary for this specific CV version..."
                className="w-full px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60 leading-relaxed"
              />
            </div>
          </div>

          {/* Card 4: Section Inclusions & Order Arrangement */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Sections & Arrangement
              </span>
              <span className="text-[10px] text-[#848ea0]">Reorder with arrows</span>
            </div>

            <div className="space-y-1.5">
              {sectionOrder.map((key, index) => {
                const labelMap: Record<string, string> = {
                  summary: 'Biography / Research Abstract',
                  education: 'Education & Academic History',
                  skills: 'Technical & Analytical Skills',
                  projects: 'Featured Projects & Systems',
                  experience: 'Professional Experience',
                  certifications: 'Verified Certifications & Honors',
                  services: 'Creative Offerings & Services'
                };
                const isChecked = (sections as any)[key] ?? true;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#141822] border border-[#202736] text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(key as any)}
                      className="flex items-center gap-2.5 text-left cursor-pointer flex-1"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" style={{ color: selectedAccent }} />
                      ) : (
                        <Square className="w-4 h-4 text-[#4b5563]" />
                      )}
                      <span className={isChecked ? 'text-white font-medium' : 'text-[#6b7280]'}>
                        {labelMap[key] || key}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 pl-2">
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-[#848ea0] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sectionOrder.length - 1}
                        className="p-1 rounded text-[#848ea0] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 5: Version Presets Saver */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Save Configuration Preset
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g. Farhan Tasneem — Fellowship CV"
                className="flex-1 px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="button"
                onClick={handleSaveVersion}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#161b25] border border-[#2a3344] text-white hover:border-amber-500/50 flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Document Sheet Preview (Screen & Print Media) */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#848ea0]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4" style={{ color: selectedAccent }} />
                <span>
                  {cvType === 'academic'
                    ? 'Academic Scholarly View'
                    : cvType === 'technical'
                    ? 'Technical Matrix View'
                    : cvType === 'creative'
                    ? 'Creative Dual-Column View'
                    : 'Executive Professional View'}{' '}
                  • {targetLength.replace('-', ' ')}
                </span>
              </span>
              <span className="font-mono text-[11px] text-[#6b7280]">
                8.5" × 11" Paper Standard
              </span>
            </div>

            {/* Document Paper Container */}
            <div
              id="cv-printable-sheet"
              className={`rounded-xl shadow-2xl border border-[#262f40] bg-white text-[#111827] p-8 sm:p-10 max-h-[85vh] overflow-y-auto leading-relaxed transition-all ${
                cvType === 'academic' ? 'font-serif' : 'font-sans'
              }`}
            >
              {/* Archetype 1: Creative Dual-Column Layout */}
              {cvType === 'creative' ? (
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column (Sidebar) */}
                  <div className="col-span-4 border-r border-[#e2e8f0] pr-5 space-y-5 text-[11px]">
                    {includePhoto && (
                      <div className="mb-4">
                        <img
                          src={photoUrl}
                          alt="Farhan Tasneem"
                          className={`w-24 h-24 object-cover object-top border-2 shadow-sm ${photoShapeClass}`}
                          style={{ borderColor: selectedAccent }}
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                        Contact
                      </h4>
                      <div className="space-y-1 text-[#475569]">
                        <div>farhantasneem2004@gmail.com</div>
                        <div>{settings.aboutLocation || 'Dhaka, Bangladesh'}</div>
                        <div>github.com/farhantasneem</div>
                      </div>
                    </div>

                    {sections.services && visibleServices.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Creative Disciplines
                        </h4>
                        <div className="space-y-2">
                          {visibleServices.map((s) => (
                            <div key={s.id}>
                              <div className="font-bold text-[#1e293b]">{s.name}</div>
                              <p className="text-[10px] text-[#64748b] leading-tight">{s.shortDescription}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sections.skills && visibleSkills.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Key Competencies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {visibleSkills.slice(0, 10).map((s) => (
                            <span
                              key={s.id}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-[#334155] border border-neutral-200"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {sections.education && visibleEducation.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Education
                        </h4>
                        {visibleEducation.map((edu) => (
                          <div key={edu.id} className="mb-2">
                            <div className="font-bold text-[#0f172a]">{edu.institution}</div>
                            <div className="text-[10px] text-[#64748b]">{edu.degree}</div>
                            {edu.grade && (
                              <div className="text-[10px] text-emerald-700 font-semibold font-mono">
                                CGPA: {edu.grade}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="col-span-8 pl-1 space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] uppercase font-sans">
                        {settings.heroHeadingFirst || 'Farhan'} {settings.heroHeadingAccent || 'Tasneem'}
                      </h2>
                      <div
                        className="text-xs font-semibold tracking-wide mt-0.5"
                        style={{ color: selectedAccent }}
                      >
                        {customTitle}
                      </div>
                    </div>

                    {sections.summary && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-1.5 font-sans">
                          Personal Statement
                        </h3>
                        <p className="text-[11.5px] text-[#334155] leading-relaxed">
                          {customSummary}
                        </p>
                      </div>
                    )}

                    {sections.projects && visibleProjects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-sans">
                          Featured Showcase Projects
                        </h3>
                        {visibleProjects.map((p) => (
                          <div key={p.id} className="mb-3">
                            <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                              <span>{p.name}</span>
                              <span className="font-normal text-[#64748b] text-[10.5px]">{p.date}</span>
                            </div>
                            <div
                              className="text-[10px] font-mono mb-0.5"
                              style={{ color: selectedAccent }}
                            >
                              Tech: {(p.technologies || []).join(', ')}
                            </div>
                            <p className="text-[11px] text-[#334155] leading-relaxed">
                              {p.shortDescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {sections.experience && visibleExperiences.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-sans">
                          Professional Experience
                        </h3>
                        {visibleExperiences.map((exp) => (
                          <div key={exp.id} className="mb-2.5">
                            <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                              <span>{exp.position} — {exp.organization}</span>
                              <span className="font-normal text-[#64748b] text-[10.5px]">
                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#334155] mt-0.5">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Archetypes: Academic, Professional, Technical, General */
                <div>
                  {/* Header Area with Optional Photo */}
                  <div
                    className={`pb-4 mb-5 ${
                      cvType === 'academic'
                        ? 'border-b-2 border-double border-[#1e293b]'
                        : 'border-b border-[#e2e8f0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Photo if configured */}
                      {includePhoto && photoPosition === 'header-left' && (
                        <div className="flex-shrink-0">
                          <img
                            src={photoUrl}
                            alt="Farhan Tasneem"
                            className={`object-cover object-top border shadow-sm ${photoShapeClass}`}
                            style={{
                              width: photoSizePx,
                              height: photoSizePx,
                              borderColor: selectedAccent
                            }}
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] uppercase">
                          {settings.heroHeadingFirst || 'Farhan'} {settings.heroHeadingAccent || 'Tasneem'}
                        </h2>
                        <div
                          className={`text-xs font-bold tracking-wide mt-0.5 ${
                            cvType === 'academic' ? 'italic' : ''
                          }`}
                          style={{ color: selectedAccent }}
                        >
                          {customTitle}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#64748b] mt-1.5 font-sans">
                          <span>farhantasneem2004@gmail.com</span>
                          <span>•</span>
                          <span>{settings.aboutLocation || 'Dhaka, Bangladesh'}</span>
                          <span>•</span>
                          <span>github.com/farhantasneem</span>
                        </div>
                      </div>

                      {/* Right Photo if configured */}
                      {includePhoto && photoPosition === 'header-right' && (
                        <div className="flex-shrink-0">
                          <img
                            src={photoUrl}
                            alt="Farhan Tasneem"
                            className={`object-cover object-top border shadow-sm ${photoShapeClass}`}
                            style={{
                              width: photoSizePx,
                              height: photoSizePx,
                              borderColor: selectedAccent
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Render Sections in Configured Order */}
                  <div className="space-y-4">
                    {sectionOrder.map((sectionKey) => {
                      switch (sectionKey) {
                        case 'summary': {
                          if (!sections.summary) return null;
                          return (
                            <div key="summary">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-1.5 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic'
                                  ? 'Academic & Research Profile'
                                  : cvType === 'technical'
                                  ? 'Technical Profile'
                                  : 'Professional Summary'}
                              </h3>
                              <p className="text-[11.5px] text-[#334155] leading-relaxed">
                                {customSummary}
                              </p>
                            </div>
                          );
                        }

                        case 'education': {
                          if (!sections.education || visibleEducation.length === 0) return null;
                          return (
                            <div key="education">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic' ? 'Education & Qualifications' : 'Education'}
                              </h3>
                              {visibleEducation.map((edu) => (
                                <div key={edu.id} className="mb-2">
                                  <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                                    <span>{edu.institution}</span>
                                    <span className="font-normal text-[#64748b] text-[10.5px]">
                                      {edu.startYear} – {edu.current ? 'Present' : edu.endYear}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#475569] flex justify-between">
                                    <span className={cvType === 'academic' ? 'italic' : ''}>
                                      {edu.degree} {edu.department ? `• ${edu.department}` : ''}
                                    </span>
                                    {edu.grade && (
                                      <span className="font-semibold text-emerald-700 font-mono text-[10.5px]">
                                        CGPA: {edu.grade}
                                      </span>
                                    )}
                                  </div>
                                  {edu.description && (
                                    <p className="text-[10.5px] text-[#64748b] mt-0.5">{edu.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        }

                        case 'skills': {
                          if (!sections.skills || visibleSkills.length === 0) return null;
                          return (
                            <div key="skills">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic'
                                  ? 'Technical Competencies & Laboratory Tools'
                                  : cvType === 'technical'
                                  ? 'Technical Skills & Architecture Matrix'
                                  : 'Core Skills & Competencies'}
                              </h3>

                              {cvType === 'technical' ? (
                                <div className="space-y-1.5 text-[11px]">
                                  {Object.entries(skillsByCategory).map(([cat, list]) => (
                                    <div key={cat} className="flex items-baseline">
                                      <span className="font-bold text-[#1e293b] w-36 flex-shrink-0">
                                        {cat}:
                                      </span>
                                      <span className="text-[#475569]">
                                        {list.map((s) => s.name).join(', ')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[11px] text-[#475569] leading-relaxed">
                                  {visibleSkills.map((s) => `${s.name} (${s.level})`).join('   •   ')}
                                </div>
                              )}
                            </div>
                          );
                        }

                        case 'experience': {
                          if (!sections.experience || visibleExperiences.length === 0) return null;
                          return (
                            <div key="experience">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic'
                                  ? 'Academic & Professional Appointments'
                                  : 'Professional Experience'}
                              </h3>
                              {visibleExperiences.map((exp) => (
                                <div key={exp.id} className="mb-2.5">
                                  <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                                    <span>{exp.position} — {exp.organization}</span>
                                    <span className="font-normal text-[#64748b] text-[10.5px]">
                                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                  </div>
                                  {(exp.type || exp.location) && (
                                    <div className="text-[10px] text-[#64748b] italic">
                                      {exp.type} • {exp.location}
                                    </div>
                                  )}
                                  <p className="text-[11px] text-[#334155] mt-0.5">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        case 'projects': {
                          if (!sections.projects || visibleProjects.length === 0) return null;
                          return (
                            <div key="projects">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic'
                                  ? 'Research & Systems Implementations'
                                  : cvType === 'technical'
                                  ? 'Featured Software Engineering Projects'
                                  : 'Selected Engineering Projects'}
                              </h3>
                              {visibleProjects.map((p) => (
                                <div key={p.id} className="mb-3">
                                  <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                                    <span>{p.name}</span>
                                    <span className="font-normal text-[#64748b] text-[10.5px]">{p.date}</span>
                                  </div>
                                  {p.technologies && p.technologies.length > 0 && (
                                    <div
                                      className={`text-[10px] mb-0.5 ${
                                        cvType === 'technical' ? 'font-mono' : ''
                                      }`}
                                      style={{ color: selectedAccent }}
                                    >
                                      Tech Stack: [{p.technologies.join(', ')}]
                                    </div>
                                  )}
                                  <p className="text-[11px] text-[#334155] leading-relaxed">
                                    {p.shortDescription}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        case 'certifications': {
                          if (!sections.certifications || visibleCertifications.length === 0) return null;
                          return (
                            <div key="certifications">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic'
                                  ? 'Honors, Awards & Verified Credentials'
                                  : 'Certifications & Credentials'}
                              </h3>
                              <div className="space-y-1">
                                {visibleCertifications.map((c) => (
                                  <div key={c.id} className="flex justify-between text-[11px]">
                                    <span className="font-semibold text-[#1e293b]">
                                      {c.name} — <span className="font-normal text-[#475569]">{c.issuer}</span>
                                    </span>
                                    <span className="text-[#64748b] text-[10px]">{c.date}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        case 'services': {
                          if (!sections.services || visibleServices.length === 0) return null;
                          return (
                            <div key="services">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                Specialized & Creative Services
                              </h3>
                              <div className="text-[11px] text-[#475569] space-y-1">
                                {visibleServices.map((s) => (
                                  <div key={s.id}>
                                    <span className="font-bold text-[#1e293b]">{s.name}: </span>
                                    <span>{s.shortDescription}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
