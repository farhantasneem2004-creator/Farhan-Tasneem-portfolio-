import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckSquare,
  Square,
  Save,
  Layers,
  Sparkles,
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
  Layout,
  Star,
  Trash2,
  Check,
  Plus,
  Sliders,
  UserCheck,
  FolderKanban,
  Award,
  ListChecks,
  FileCheck2
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

const DEFAULT_HERO_IMAGE = '/images/hero/farhan-hero.png';

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
type ActiveTab = 'presets' | 'archetype' | 'candidate' | 'items' | 'sections';

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
  // Navigation Tabs in Studio
  const [activeTab, setActiveTab] = useState<ActiveTab>('presets');

  // Active CV Preset Tracking
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Active CV Configuration
  const [cvType, setCvType] = useState<CvArchetype>('professional');
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern' | 'compact' | 'sidebar'>('modern');
  const [targetLength, setTargetLength] = useState<'one-page' | 'two-page' | 'extended'>('one-page');
  const [selectedAccent, setSelectedAccent] = useState<string>(initialAccent);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');

  // Photo Configuration
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_HERO_IMAGE);
  const [photoShape, setPhotoShape] = useState<PhotoShape>('rounded');
  const [photoPosition, setPhotoPosition] = useState<PhotoPosition>('header-right');
  const [photoSize, setPhotoSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact Information
  const [contactName, setContactName] = useState<string>(
    `${settings.heroHeadingFirst || 'Farhan'} ${settings.heroHeadingAccent || 'Tasneem'}`
  );
  const [customTitle, setCustomTitle] = useState<string>(
    'Full-Stack Software Engineer & Solutions Developer'
  );
  const [contactEmail, setContactEmail] = useState<string>('farhantasneem2004@gmail.com');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactLocation, setContactLocation] = useState<string>(settings.aboutLocation || 'Dhaka, Bangladesh');
  const [contactGithub, setContactGithub] = useState<string>('github.com/farhantasneem');
  const [contactLinkedin, setContactLinkedin] = useState<string>('');
  const [contactWebsite, setContactWebsite] = useState<string>('');

  // Narrative Summary
  const [customSummary, setCustomSummary] = useState<string>(
    'CSE student and software developer with solid foundations in algorithmic problem solving, modern web architectures, and high-craft digital visualization. Experienced in building performant full-stack systems and automated tournament orchestration tools.'
  );
  const [versionName, setVersionName] = useState<string>('Farhan Tasneem — Professional CV');

  // Section Toggles
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

  // Granular Item Selection (IDs of included items)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedEducationIds, setSelectedEducationIds] = useState<string[]>([]);
  const [selectedCertificationIds, setSelectedCertificationIds] = useState<string[]>([]);

  // Action & Feedback States
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [versionDownloadingId, setVersionDownloadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  // Initialize selected item lists from data if empty
  useEffect(() => {
    if (selectedProjectIds.length === 0 && projects.length > 0) {
      setSelectedProjectIds(projects.filter((p) => p.visible).map((p) => p.id));
    }
    if (selectedExperienceIds.length === 0 && experiences.length > 0) {
      setSelectedExperienceIds(experiences.filter((e) => e.visible).map((e) => e.id));
    }
    if (selectedSkillIds.length === 0 && skills.length > 0) {
      setSelectedSkillIds(skills.filter((s) => s.visible).map((s) => s.id));
    }
    if (selectedEducationIds.length === 0 && education.length > 0) {
      setSelectedEducationIds(education.filter((e) => e.visible).map((e) => e.id));
    }
    if (selectedCertificationIds.length === 0 && certifications.length > 0) {
      setSelectedCertificationIds(certifications.filter((c) => c.visible).map((c) => c.id));
    }
  }, [projects, experiences, skills, education, certifications]);

  // Load a saved preset into the Studio
  const handleLoadVersion = (ver: CVVersion) => {
    setSelectedVersionId(ver.id);
    setVersionName(ver.title);
    if (ver.cvType) setCvType(ver.cvType);
    if (ver.template) setActiveTemplate(ver.template);
    if (ver.length) setTargetLength(ver.length);
    if (ver.accentColor) setSelectedAccent(ver.accentColor);
    if (ver.fontFamily) setFontFamily(ver.fontFamily);
    if (ver.photoUrl) setPhotoUrl(ver.photoUrl);
    if (ver.photoShape) setPhotoShape(ver.photoShape);
    if (ver.photoPosition) setPhotoPosition(ver.photoPosition);
    if (ver.customTitle) setCustomTitle(ver.customTitle);
    if (ver.customSummary) setCustomSummary(ver.customSummary);

    if (ver.contactInfo) {
      if (ver.contactInfo.name) setContactName(ver.contactInfo.name);
      if (ver.contactInfo.email) setContactEmail(ver.contactInfo.email);
      if (ver.contactInfo.phone) setContactPhone(ver.contactInfo.phone);
      if (ver.contactInfo.location) setContactLocation(ver.contactInfo.location);
      if (ver.contactInfo.github) setContactGithub(ver.contactInfo.github);
      if (ver.contactInfo.linkedin) setContactLinkedin(ver.contactInfo.linkedin);
      if (ver.contactInfo.website) setContactWebsite(ver.contactInfo.website);
    }

    if (ver.sections) {
      setIncludePhoto(ver.sections.profilePicture ?? true);
      setSections({
        summary: ver.sections.about ?? true,
        education: ver.sections.education ?? true,
        skills: ver.sections.skills ?? true,
        projects: ver.sections.projects ?? true,
        experience: ver.sections.experience ?? true,
        certifications: ver.sections.certifications ?? true,
        services: ver.sections.services ?? false
      });
    }

    if (ver.sectionOrder && ver.sectionOrder.length > 0) {
      setSectionOrder(ver.sectionOrder);
    }

    if (ver.selectedProjectIds && ver.selectedProjectIds.length > 0) {
      setSelectedProjectIds(ver.selectedProjectIds);
    }
    if (ver.selectedExperienceIds && ver.selectedExperienceIds.length > 0) {
      setSelectedExperienceIds(ver.selectedExperienceIds);
    }
    if (ver.selectedSkillIds && ver.selectedSkillIds.length > 0) {
      setSelectedSkillIds(ver.selectedSkillIds);
    }
    if (ver.selectedEducationIds && ver.selectedEducationIds.length > 0) {
      setSelectedEducationIds(ver.selectedEducationIds);
    }
    if (ver.selectedCertificationIds && ver.selectedCertificationIds.length > 0) {
      setSelectedCertificationIds(ver.selectedCertificationIds);
    }

    setStatusMessage(`Loaded "${ver.title}" preset into studio!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Archetype Presets Switcher
  const handleSelectArchetype = (type: CvArchetype) => {
    setCvType(type);
    if (type === 'academic') {
      setVersionName('Farhan Tasneem — Academic & Research CV');
      setActiveTemplate('classic');
      setTargetLength('two-page');
      setSelectedAccent('#881337');
      setFontFamily('serif');
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('square');
      setCustomTitle('Computer Science & Engineering Student & Researcher');
      setCustomSummary(
        'Undergraduate Computer Science & Engineering researcher with coursework focus in algorithms, discrete mathematics, and distributed systems. Committed to rigorous academic inquiry, open-source software methodology, and practical systems engineering.'
      );
      setSectionOrder(['summary', 'education', 'skills', 'experience', 'projects', 'certifications']);
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: false
      });
    } else if (type === 'technical') {
      setVersionName('Farhan Tasneem — Full-Stack & Systems CV');
      setActiveTemplate('modern');
      setTargetLength('one-page');
      setSelectedAccent('#0284c7');
      setFontFamily('mono');
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('Full-Stack Software Engineer • Systems Architect');
      setCustomSummary(
        'Full-stack software engineer with deep expertise in TypeScript, React, Node.js, and automated deployment architectures. Track record of developing high-throughput tournament orchestration platforms and responsive web systems.'
      );
      setSectionOrder(['summary', 'skills', 'projects', 'experience', 'education', 'certifications']);
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: false
      });
    } else if (type === 'creative') {
      setVersionName('Farhan Tasneem — Creative Technologist CV');
      setActiveTemplate('sidebar');
      setTargetLength('one-page');
      setSelectedAccent('#d97706');
      setFontFamily('sans');
      setIncludePhoto(true);
      setPhotoPosition('sidebar');
      setPhotoShape('circle');
      setCustomTitle('Creative Technologist • Developer • Visual Thinker');
      setCustomSummary(
        'Multidisciplinary technologist bridging computational logic, graphic finesse, and human interaction. Designing intuitive software experiences with deliberate aesthetic discipline and robust engineering.'
      );
      setSectionOrder(['summary', 'projects', 'services', 'experience', 'skills', 'education']);
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: false,
        services: true
      });
    } else if (type === 'professional') {
      setVersionName('Farhan Tasneem — Executive Professional CV');
      setActiveTemplate('modern');
      setTargetLength('one-page');
      setSelectedAccent('#e5a93c');
      setFontFamily('sans');
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('Software Developer & CSE Undergraduate');
      setCustomSummary(
        'CSE undergraduate and software developer with solid foundations in algorithmic problem solving, modern web architectures, and high-craft digital visualization. Experienced in building performant full-stack systems and automated tournament orchestration tools.'
      );
      setSectionOrder(['summary', 'experience', 'skills', 'projects', 'education', 'certifications']);
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: false
      });
    } else {
      setVersionName('Farhan Tasneem — General Curriculum Vitae');
      setActiveTemplate('modern');
      setTargetLength('two-page');
      setSelectedAccent('#4f46e5');
      setFontFamily('sans');
      setIncludePhoto(true);
      setPhotoPosition('header-right');
      setPhotoShape('rounded');
      setCustomTitle('Computer Science & Engineering Specialist');
      setCustomSummary(
        'Comprehensive curriculum vitae encompassing academic coursework, software implementations, technical skill sets, leadership milestones, and verified certifications.'
      );
      setSectionOrder(['summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'services']);
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: true
      });
    }
  };

  // Build full payload for PDF/Word exports
  const buildExportPayload = () => {
    return {
      versionName,
      cvType,
      template: activeTemplate,
      length: targetLength,
      includePhoto,
      photoUrl,
      photoShape,
      photoPosition,
      accentColor: selectedAccent,
      fontFamily,
      customTitle,
      customSummary,
      contactInfo: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        location: contactLocation,
        github: contactGithub,
        linkedin: contactLinkedin,
        website: contactWebsite
      },
      sections,
      sectionOrder,
      selectedProjectIds,
      selectedExperienceIds,
      selectedSkillIds,
      selectedEducationIds,
      selectedCertificationIds
    };
  };

  // Download PDF for Active Studio state
  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const payload = buildExportPayload();
      const safeFilename = `${versionName.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')}.pdf`;
      await api.downloadCvPdf(payload, safeFilename);
      setStatusMessage(`Downloaded "${versionName}.pdf" successfully!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Download DOCX for Active Studio state
  const handleDownloadDOCX = async () => {
    setDownloadingDocx(true);
    try {
      const payload = buildExportPayload();
      const safeFilename = `${versionName.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')}.docx`;
      await api.downloadCvDocx(payload, safeFilename);
      setStatusMessage(`Downloaded "${versionName}.docx" successfully!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Failed to generate Word document: ' + err.message);
    } finally {
      setDownloadingDocx(false);
    }
  };

  // Download specific saved CV version
  const handleDownloadSpecificVersion = async (ver: CVVersion, format: 'pdf' | 'docx') => {
    setVersionDownloadingId(`${ver.id}_${format}`);
    try {
      const safeFilename = `${ver.title.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')}.${format}`;
      if (format === 'pdf') {
        await api.downloadCvVersionPdf(ver.id, safeFilename);
      } else {
        await api.downloadCvVersionDocx(ver.id, safeFilename);
      }
      setStatusMessage(`Downloaded "${ver.title}.${format}"!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Failed to download ${format.toUpperCase()}: ` + err.message);
    } finally {
      setVersionDownloadingId(null);
    }
  };

  // Save current studio configuration as a preset (or update existing)
  const handleSavePreset = async (asNew: boolean = false) => {
    try {
      const payload = {
        title: versionName,
        cvType,
        template: activeTemplate,
        length: targetLength,
        photoUrl,
        photoShape,
        photoPosition,
        accentColor: selectedAccent,
        fontFamily,
        contactInfo: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          location: contactLocation,
          github: contactGithub,
          linkedin: contactLinkedin,
          website: contactWebsite
        },
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
        selectedProjectIds,
        selectedExperienceIds,
        selectedSkillIds,
        selectedEducationIds,
        selectedCertificationIds,
        customTitle,
        customSummary,
        isDefault: selectedVersionId ? cvVersions.find((v) => v.id === selectedVersionId)?.isDefault || false : false
      };

      if (selectedVersionId && !asNew) {
        await api.updateCVVersion(selectedVersionId, payload);
        setStatusMessage(`Updated preset "${versionName}"!`);
      } else {
        const created = await api.createCVVersion(payload);
        setSelectedVersionId(created.id);
        setStatusMessage(`Created new preset "${versionName}"!`);
      }

      setTimeout(() => setStatusMessage(null), 3500);
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to save CV preset: ' + err.message);
    }
  };

  // Set preset as public default
  const handleSetDefaultVersion = async (id: string) => {
    try {
      await api.updateCVVersion(id, { isDefault: true });
      setStatusMessage('Set as public portfolio default CV!');
      setTimeout(() => setStatusMessage(null), 3500);
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to set default: ' + err.message);
    }
  };

  // Delete preset
  const handleDeleteVersion = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteCVVersion(id);
      if (selectedVersionId === id) setSelectedVersionId(null);
      setStatusMessage(`Deleted preset "${title}"`);
      setTimeout(() => setStatusMessage(null), 3500);
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to delete CV preset: ' + err.message);
    }
  };

  // Quick Seed Starters if user has no presets
  const handleSeedStarters = async () => {
    try {
      // Preset 1: Academic & Research CV
      await api.createCVVersion({
        title: 'Farhan Tasneem — Academic & Research CV',
        cvType: 'academic',
        template: 'classic',
        length: 'two-page',
        photoUrl: DEFAULT_HERO_IMAGE,
        photoShape: 'square',
        photoPosition: 'header-right',
        accentColor: '#881337',
        fontFamily: 'serif',
        customTitle: 'Computer Science & Engineering Student & Researcher',
        customSummary:
          'Undergraduate Computer Science & Engineering researcher with coursework focus in algorithms, discrete mathematics, and distributed systems. Committed to rigorous academic inquiry, open-source software methodology, and practical systems engineering.',
        sections: {
          profilePicture: true,
          about: true,
          contact: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          certifications: true,
          services: false,
          socialLinks: true
        },
        sectionOrder: ['summary', 'education', 'skills', 'experience', 'projects', 'certifications'],
        isDefault: false
      });

      // Preset 2: Software Engineering & Systems CV
      await api.createCVVersion({
        title: 'Farhan Tasneem — Software Engineering & Systems CV',
        cvType: 'technical',
        template: 'modern',
        length: 'one-page',
        photoUrl: DEFAULT_HERO_IMAGE,
        photoShape: 'rounded',
        photoPosition: 'header-right',
        accentColor: '#0284c7',
        fontFamily: 'mono',
        customTitle: 'Full-Stack Software Engineer • Systems Developer',
        customSummary:
          'Full-stack software engineer with deep expertise in TypeScript, React, Node.js, and automated deployment architectures. Track record of developing high-throughput tournament orchestration platforms and responsive web systems.',
        sections: {
          profilePicture: true,
          about: true,
          contact: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          certifications: true,
          services: false,
          socialLinks: true
        },
        sectionOrder: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications'],
        isDefault: true
      });

      // Preset 3: Executive Professional CV
      await api.createCVVersion({
        title: 'Farhan Tasneem — Executive Professional CV',
        cvType: 'professional',
        template: 'modern',
        length: 'one-page',
        photoUrl: DEFAULT_HERO_IMAGE,
        photoShape: 'rounded',
        photoPosition: 'header-right',
        accentColor: '#e5a93c',
        fontFamily: 'sans',
        customTitle: 'Software Developer & CSE Undergraduate',
        customSummary:
          'CSE undergraduate and software developer with solid foundations in algorithmic problem solving, modern web architectures, and high-craft digital visualization. Experienced in building performant full-stack systems and automated tournament orchestration tools.',
        sections: {
          profilePicture: true,
          about: true,
          contact: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          certifications: true,
          services: false,
          socialLinks: true
        },
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
        isDefault: false
      });

      setStatusMessage('Generated 3 professional CV starter presets!');
      setTimeout(() => setStatusMessage(null), 3500);
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to seed presets: ' + err.message);
    }
  };

  // Upload Custom Portrait
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const res = await api.uploadFile(file);
      setPhotoUrl(res.url);
      setIncludePhoto(true);
      setStatusMessage('Portrait image uploaded and applied!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Section Ordering Helpers
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

  // Granular Item Toggles
  const toggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExperience = (id: string) => {
    setSelectedExperienceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleEducation = (id: string) => {
    setSelectedEducationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCertification = (id: string) => {
    setSelectedCertificationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSkill = (id: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Items Filtered for Preview
  const previewProjects = projects.filter((p) => selectedProjectIds.includes(p.id));
  const previewExperiences = experiences.filter((e) => selectedExperienceIds.includes(e.id));
  const previewEducation = education.filter((e) => selectedEducationIds.includes(e.id));
  const previewCertifications = certifications.filter((c) => selectedCertificationIds.includes(c.id));
  const previewSkills = skills.filter((s) => selectedSkillIds.includes(s.id));
  const previewServices = services.filter((s) => s.visible);

  // Group skills by category for preview
  const skillsByCategory: Record<string, Skill[]> = {};
  previewSkills.forEach((s) => {
    const cat = s.category || 'General';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s);
  });

  // Photo Style Classes
  const photoShapeClass =
    photoShape === 'circle' ? 'rounded-full' : photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none';
  const photoSizePx = photoSize === 'compact' ? 56 : photoSize === 'standard' ? 72 : 88;

  const sectionLabelMap: Record<string, string> = {
    summary: 'Executive / Research Summary',
    experience: 'Professional & Academic Appointments',
    skills: 'Technical Skills & Competencies',
    projects: 'Featured Software & Research Projects',
    education: 'Education & Academic Degrees',
    certifications: 'Certifications & Credentials',
    services: 'Specialized Offerings & Services'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Notification Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#11141c] p-5 rounded-2xl border border-[#1e2535]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: selectedAccent }} />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Professional CV Studio & Multi-Preset Dossier Hub
            </h1>
          </div>
          <p className="text-xs text-[#848ea0] max-w-2xl">
            Design, tailor, and instantly download distinct CV profiles (Academic, Systems Engineering, Executive, or Creative).
            Save custom versions, toggle specific projects and work experiences, and customize portrait framing with 1-click PDF/Word exports.
          </p>
        </div>

        {/* Global Studio Export Action Group */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-900 shadow-lg flex items-center gap-2 transition-all hover:opacity-95 active:scale-95 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: selectedAccent }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download Active PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDOCX}
            disabled={downloadingDocx}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1a2233] text-white border border-[#2b3952] hover:bg-[#202a3f] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>{downloadingDocx ? 'Generating Word...' : 'Download Word (.docx)'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-[#141824] border border-[#232c40] text-[#9ca3af] hover:text-white hover:bg-[#1a2030] transition-all cursor-pointer"
            title="Browser Print Preview"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Toast */}
      {statusMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 1: SAVED CV PRESETS HUB & MULTI-CV DOWNLOADER                */}
      {/* ==================================================================== */}
      <div className="bg-[#11141c] border border-[#1e2535] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2230] pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" style={{ color: selectedAccent }} />
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Saved CV Profiles ({cvVersions.length})
              </h2>
              <p className="text-[11px] text-[#6b7280]">
                Select any saved profile to download its specific tailored CV or load it into the studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cvVersions.length === 0 ? (
              <button
                type="button"
                onClick={handleSeedStarters}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seed Recommended CV Profiles</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleSavePreset(true)}
              className="px-3 py-1.5 rounded-lg bg-[#182030] border border-[#2b3952] text-white hover:border-amber-500/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Save As New Preset</span>
            </button>
          </div>
        </div>

        {/* Presets Cards Grid */}
        {cvVersions.length === 0 ? (
          <div className="p-8 text-center bg-[#0c0e12] rounded-xl border border-dashed border-[#232b3d] space-y-3">
            <FileText className="w-8 h-8 text-[#4b5563] mx-auto" />
            <div className="text-xs text-[#9ca3af]">No saved CV presets found.</div>
            <p className="text-[11px] text-[#64748b] max-w-md mx-auto">
              Click "Seed Recommended CV Profiles" above to instantly generate tailored Academic, Software Engineering, and Executive CVs!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cvVersions.map((ver) => {
              const isSelected = selectedVersionId === ver.id;
              const isDefault = ver.isDefault;
              const isDownloadingThisPdf = versionDownloadingId === `${ver.id}_pdf`;
              const isDownloadingThisDocx = versionDownloadingId === `${ver.id}_docx`;

              return (
                <div
                  key={ver.id}
                  className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#151c2a] border-amber-500/80 shadow-lg'
                      : 'bg-[#0e1118] border-[#1f2637] hover:border-[#2f3b54]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-white line-clamp-1">{ver.title}</span>
                          {isDefault && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              Public Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#6b7280]">
                          <span className="capitalize px-1.5 py-0.5 rounded bg-[#161b26] border border-[#252f44] text-[#9ca3af]">
                            {ver.cvType || 'Professional'}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{ver.length?.replace('-', ' ') || '1-page'}</span>
                          <span>•</span>
                          <div
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: ver.accentColor || '#e5a93c' }}
                          />
                        </div>
                      </div>

                      {/* Delete Preset Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVersion(ver.id, ver.title);
                        }}
                        className="p-1 rounded text-[#4b5563] hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                        title="Delete this CV preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ver.customTitle && (
                      <p className="text-[10px] text-[#848ea0] line-clamp-1 italic">
                        {ver.customTitle}
                      </p>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 mt-3 border-t border-[#1a2130] flex items-center justify-between gap-2">
                    {/* Load in Studio */}
                    <button
                      type="button"
                      onClick={() => handleLoadVersion(ver)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-900 font-bold'
                          : 'bg-[#182030] text-[#cbd5e1] hover:bg-[#202a40]'
                      }`}
                    >
                      {isSelected ? 'Active in Studio' : 'Load Preset'}
                    </button>

                    {/* Direct Quick Exporters */}
                    <div className="flex items-center gap-1.5">
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultVersion(ver.id)}
                          className="px-2 py-1 rounded text-[10px] bg-[#141824] text-[#9ca3af] hover:text-amber-400 border border-[#232b3d] cursor-pointer"
                          title="Set this CV as the one public visitors download"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDownloadSpecificVersion(ver, 'pdf')}
                        disabled={isDownloadingThisPdf}
                        className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Download PDF directly for this CV preset"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>{isDownloadingThisPdf ? '...' : 'PDF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadSpecificVersion(ver, 'docx')}
                        disabled={isDownloadingThisDocx}
                        className="px-2.5 py-1 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Download Word docx directly for this CV preset"
                      >
                        <FileText className="w-2.5 h-2.5" />
                        <span>{isDownloadingThisDocx ? '...' : 'Word'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: WORKSPACE STUDIO (CONTROLS TABS + LIVE DOCUMENT SHEET)     */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Studio Controls Tabs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Studio Tabs Navigation */}
          <div className="grid grid-cols-4 gap-1 bg-[#11141c] p-1.5 rounded-xl border border-[#1e2535]">
            {[
              { id: 'archetype', label: 'Archetype', icon: Layout },
              { id: 'candidate', label: 'Profile & Photo', icon: UserCheck },
              { id: 'items', label: 'Item Selector', icon: ListChecks },
              { id: 'sections', label: 'Sections', icon: Sliders }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1e273a] text-white shadow'
                      : 'text-[#848ea0] hover:text-white hover:bg-[#141824]'
                  }`}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: isActive ? selectedAccent : 'inherit' }}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Preset Save Bar */}
          <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                Preset Title & Label
              </label>
              {selectedVersionId && (
                <span className="text-[10px] text-amber-400 font-mono">
                  Editing: {versionName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g. Farhan Tasneem — Robotics & Systems Focus"
                className="flex-1 px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="button"
                onClick={() => handleSavePreset(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#161b25] border border-[#2a3344] text-white hover:border-amber-500/50 flex items-center gap-1.5 cursor-pointer shadow flex-shrink-0"
                title="Save updates to active preset or create new"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ARCHETYPE & STYLING */}
          {activeTab === 'archetype' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Archetype Selector */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Select Career Archetype Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'academic',
                      label: 'Academic & Scholar',
                      icon: GraduationCap,
                      desc: 'Serif scholarly type, Education & Research first'
                    },
                    {
                      id: 'professional',
                      label: 'Executive Professional',
                      icon: Briefcase,
                      desc: 'Modern balanced layout, Experience timeline'
                    },
                    {
                      id: 'technical',
                      label: 'Technical Dev & Systems',
                      icon: Code,
                      desc: 'ATS matrix layout, Systems & Tech badges'
                    },
                    {
                      id: 'creative',
                      label: 'Creative Minimal',
                      icon: Feather,
                      desc: 'Dual column, Photo sidebar & narrative focus'
                    },
                    {
                      id: 'general',
                      label: 'Comprehensive General',
                      icon: Layout,
                      desc: 'Full portfolio dossier with all credentials'
                    }
                  ].map((arch) => {
                    const Icon = arch.icon;
                    const isActive = cvType === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => handleSelectArchetype(arch.id as CvArchetype)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isActive
                            ? 'bg-[#182030] border-amber-500/80 shadow'
                            : 'bg-[#0c0e12] border-[#1e2535] hover:border-[#2f3b52]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: isActive ? selectedAccent : '#9ca3af' }}
                          />
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#d1d5db]'}`}>
                            {arch.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#848ea0] line-clamp-2 leading-tight">
                          {arch.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout & Typography Controls */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Document Geometry & Typography
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Target Length */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                      Length Standard
                    </label>
                    <select
                      value={targetLength}
                      onChange={(e) => setTargetLength(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none"
                    >
                      <option value="one-page">1-Page ATS Concise</option>
                      <option value="two-page">2-Page Standard</option>
                      <option value="extended">Extended Dossier (Full)</option>
                    </select>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                      Typeface Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none"
                    >
                      <option value="sans">Modern Sans (Helvetica / Inter)</option>
                      <option value="serif">Scholarly Serif (Times New Roman)</option>
                      <option value="mono">Technical Monospace (Courier / Code)</option>
                    </select>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div>
                  <label className="block text-[11px] font-medium text-[#9ca3af] mb-1.5 flex items-center justify-between">
                    <span>Accent Branding Color</span>
                    <span className="font-mono text-[10px] text-[#6b7280]">{selectedAccent}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      '#e5a93c', // Warm Amber (Farhan Default)
                      '#881337', // Academic Maroon
                      '#0284c7', // Technical Sky
                      '#059669', // Emerald Green
                      '#4f46e5', // Royal Indigo
                      '#d97706', // Gold Amber
                      '#0f172a'  // Minimal Slate
                    ].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedAccent(col)}
                        className={`w-7 h-7 rounded-lg border-2 cursor-pointer transition-transform ${
                          selectedAccent === col ? 'scale-110 border-white shadow' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedAccent}
                      onChange={(e) => setSelectedAccent(e.target.value)}
                      className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                      title="Custom color picker"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATE INFO & HERO PICTURE STUDIO */}
          {activeTab === 'candidate' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Picture Studio */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c2230] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" style={{ color: selectedAccent }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Hero Portrait Picture
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
                  <div className="space-y-3 pt-1">
                    {/* Portrait Preview & Upload Controls */}
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
                            <span>{uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPhotoUrl(DEFAULT_HERO_IMAGE)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#141822] border border-[#202736] hover:border-neutral-500 text-[#9ca3af] hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            title="Reset to Farhan's official hero portrait"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reset Official</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-[#6b7280]">
                          Embedded crisply into generated PDF and DOCX documents with high-res byte validation.
                        </p>
                      </div>
                    </div>

                    {/* Frame Shape & Position */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
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
                              className={`py-1 text-[10px] font-medium rounded capitalize transition-all cursor-pointer ${
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
                              className={`py-1 text-[10px] font-medium rounded transition-all cursor-pointer ${
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

                    {/* Photo Size */}
                    <div>
                      <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                        Photo Dimension Scale
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'compact', label: 'Compact (56pt)' },
                          { id: 'standard', label: 'Standard (72pt)' },
                          { id: 'large', label: 'Prominent (88pt)' }
                        ].map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => setPhotoSize(sz.id as any)}
                            className={`py-1 text-[10px] rounded border cursor-pointer ${
                              photoSize === sz.id
                                ? 'bg-[#182030] border-amber-500/70 text-white font-bold'
                                : 'bg-[#0c0e12] border-[#202736] text-[#848ea0]'
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Info Suite */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Contact & Candidate Identity
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">Candidate Full Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">Email Address</label>
                    <input
                      type="text"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 1..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">Location</label>
                    <input
                      type="text"
                      value={contactLocation}
                      onChange={(e) => setContactLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">GitHub Handle / URL</label>
                    <input
                      type="text"
                      value={contactGithub}
                      onChange={(e) => setContactGithub(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#848ea0] mb-0.5">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={contactLinkedin}
                      onChange={(e) => setContactLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#848ea0] mb-0.5">
                    Target Professional Title / Subtitle
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DETAIL-ORIENTED ITEM SELECTOR */}
          {activeTab === 'items' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
                Pick exactly which projects, experiences, and qualifications appear on this CV. Tailor this CV to specific job descriptions or fellowship applications.
              </div>

              {/* Projects Item Picker */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Included Projects ({selectedProjectIds.length}/{projects.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIds(projects.map((p) => p.id))}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      All
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIds([])}
                      className="text-[#848ea0] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {projects.map((p) => {
                    const isChecked = selectedProjectIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0c0e12] border border-[#1d2332] hover:border-[#2f3b52] cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProject(p.id)}
                          className="mt-0.5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between font-semibold text-white text-[11px]">
                            <span>{p.name}</span>
                            <span className="text-[10px] text-[#6b7280] font-normal">{p.date}</span>
                          </div>
                          <p className="text-[10px] text-[#848ea0] line-clamp-1">{p.shortDescription}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Experience Item Picker */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Included Work & Appointments ({selectedExperienceIds.length}/{experiences.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedExperienceIds(experiences.map((e) => e.id))}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      All
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedExperienceIds([])}
                      className="text-[#848ea0] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {experiences.map((exp) => {
                    const isChecked = selectedExperienceIds.includes(exp.id);
                    return (
                      <label
                        key={exp.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0c0e12] border border-[#1d2332] hover:border-[#2f3b52] cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExperience(exp.id)}
                          className="mt-0.5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between font-semibold text-white text-[11px]">
                            <span>{exp.position}</span>
                            <span className="text-[10px] text-[#6b7280] font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                          </div>
                          <div className="text-[10px] text-amber-400/80">{exp.organization}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Education & Certifications Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Education ({selectedEducationIds.length})</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {education.map((edu) => (
                      <label key={edu.id} className="flex items-center gap-2 text-[11px] text-[#cbd5e1] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEducationIds.includes(edu.id)}
                          onChange={() => toggleEducation(edu.id)}
                          className="rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span className="line-clamp-1">{edu.institution}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    <span>Credentials ({selectedCertificationIds.length})</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {certifications.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-[11px] text-[#cbd5e1] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCertificationIds.includes(c.id)}
                          onChange={() => toggleCertification(c.id)}
                          className="rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span className="line-clamp-1">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECTIONS & NARRATIVE ORDERING */}
          {activeTab === 'sections' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Executive Summary Textarea */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Tailored Professional Summary
                  </label>
                  <span className="text-[10px] text-[#6b7280]">
                    {customSummary.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none leading-relaxed"
                />
              </div>

              {/* Section Visibility & Reordering */}
              <div className="p-4 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Section Visibility & Sequence Order
                </label>
                <div className="space-y-1.5">
                  {sectionOrder.map((key, index) => {
                    const isChecked = sections[key as keyof typeof sections] ?? true;
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#141924] border-[#222a3d]'
                            : 'bg-[#0c0e12] border-[#181d28] opacity-50'
                        }`}
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
                          <span className={isChecked ? 'text-white font-medium text-xs' : 'text-[#6b7280] text-xs'}>
                            {sectionLabelMap[key] || key}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 pl-2">
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded text-[#848ea0] hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Section Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sectionOrder.length - 1}
                            className="p-1 rounded text-[#848ea0] hover:text-white disabled:opacity-20 cursor-pointer"
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
            </div>
          )}
        </div>

        {/* Right Column: High-Fidelity Live Document Sheet Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 space-y-3">
            {/* Sheet Preview Bar */}
            <div className="flex items-center justify-between text-xs text-[#848ea0] bg-[#11141c] px-4 py-2.5 rounded-xl border border-[#1e2535]">
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

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#0c0e12] px-2 py-0.5 rounded-lg border border-[#202736] text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(Math.max(80, previewZoom - 10))}
                    className="hover:text-white cursor-pointer px-1"
                  >
                    -
                  </button>
                  <span className="text-white">{previewZoom}%</span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(Math.min(130, previewZoom + 10))}
                    className="hover:text-white cursor-pointer px-1"
                  >
                    +
                  </button>
                </div>
                <span className="font-mono text-[10px] text-[#6b7280]">
                  8.5" × 11" Standard
                </span>
              </div>
            </div>

            {/* Document Paper Container */}
            <div
              id="cv-printable-sheet"
              style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
              className={`rounded-2xl shadow-2xl border border-[#262f40] bg-white text-[#111827] p-8 sm:p-10 max-h-[85vh] overflow-y-auto leading-relaxed transition-all ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              }`}
            >
              {/* Layout Archetype: Creative Dual-Column */}
              {cvType === 'creative' ? (
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column (Sidebar) */}
                  <div className="col-span-4 border-r border-[#e2e8f0] pr-5 space-y-5 text-[11px]">
                    {includePhoto && (
                      <div className="mb-4">
                        <img
                          src={photoUrl}
                          alt={contactName}
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
                        <div>{contactEmail}</div>
                        {contactPhone && <div>{contactPhone}</div>}
                        <div>{contactLocation}</div>
                        <div>{contactGithub}</div>
                        {contactLinkedin && <div>{contactLinkedin}</div>}
                      </div>
                    </div>

                    {sections.services && previewServices.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Creative Disciplines
                        </h4>
                        <div className="space-y-2">
                          {previewServices.map((s) => (
                            <div key={s.id}>
                              <div className="font-bold text-[#1e293b]">{s.name}</div>
                              <p className="text-[10px] text-[#64748b] leading-tight">{s.shortDescription}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sections.skills && previewSkills.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Key Competencies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {previewSkills.slice(0, 10).map((s) => (
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

                    {sections.education && previewEducation.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#0f172a] border-b pb-1 mb-2 font-sans">
                          Education
                        </h4>
                        {previewEducation.map((edu) => (
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
                        {contactName}
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

                    {sections.projects && previewProjects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-sans">
                          Featured Showcase Projects
                        </h3>
                        {previewProjects.map((p) => (
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

                    {sections.experience && previewExperiences.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-sans">
                          Professional Experience
                        </h3>
                        {previewExperiences.map((exp) => (
                          <div key={exp.id} className="mb-2.5">
                            <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                              <span>{exp.position} — {exp.organization}</span>
                              <span className="font-normal text-[#64748b] text-[10.5px]">
                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#334155] mt-0.5">{exp.description}</p>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="mt-1 space-y-0.5 list-disc list-inside text-[10.5px] text-[#475569]">
                                {exp.responsibilities.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Layout Archetypes: Academic, Professional, Technical, General */
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
                            alt={contactName}
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
                          {contactName}
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
                          <span>{contactEmail}</span>
                          {contactPhone && (
                            <>
                              <span>•</span>
                              <span>{contactPhone}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{contactLocation}</span>
                          <span>•</span>
                          <span>{contactGithub}</span>
                          {contactLinkedin && (
                            <>
                              <span>•</span>
                              <span>{contactLinkedin}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Photo if configured */}
                      {includePhoto && photoPosition === 'header-right' && (
                        <div className="flex-shrink-0">
                          <img
                            src={photoUrl}
                            alt={contactName}
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
                          if (!sections.education || previewEducation.length === 0) return null;
                          return (
                            <div key="education">
                              <h3
                                className={`text-xs font-bold uppercase tracking-wider text-[#0f172a] pb-1 mb-2 ${
                                  cvType === 'academic' ? 'border-b border-black' : 'border-b border-[#e2e8f0]'
                                }`}
                              >
                                {cvType === 'academic' ? 'Education & Qualifications' : 'Education'}
                              </h3>
                              {previewEducation.map((edu) => (
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
                          if (!sections.skills || previewSkills.length === 0) return null;
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
                                  {previewSkills.map((s) => `${s.name} (${s.level})`).join('   •   ')}
                                </div>
                              )}
                            </div>
                          );
                        }

                        case 'experience': {
                          if (!sections.experience || previewExperiences.length === 0) return null;
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
                              {previewExperiences.map((exp) => (
                                <div key={exp.id} className="mb-3">
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
                                  {exp.description && (
                                    <p className="text-[11px] text-[#334155] mt-0.5">{exp.description}</p>
                                  )}
                                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                                    <ul className="mt-1 space-y-0.5 list-disc list-inside text-[10.5px] text-[#475569]">
                                      {exp.responsibilities.map((r, i) => (
                                        <li key={i}>{r}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        }

                        case 'projects': {
                          if (!sections.projects || previewProjects.length === 0) return null;
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
                              {previewProjects.map((p) => (
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
                          if (!sections.certifications || previewCertifications.length === 0) return null;
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
                                {previewCertifications.map((c) => (
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
                          if (!sections.services || previewServices.length === 0) return null;
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
                                {previewServices.map((s) => (
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
