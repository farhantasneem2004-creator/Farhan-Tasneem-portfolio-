import React, { useState } from 'react';
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
  Printer
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
  accentColor = '#e5a93c'
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(cvVersions?.[0]?.id || 'default');
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern' | 'compact'>('modern');
  const [targetLength, setTargetLength] = useState<'one-page' | 'two-page' | 'extended'>('one-page');
  const [versionName, setVersionName] = useState('Software Engineering CV');

  // Included sections
  const [sections, setSections] = useState({
    summary: true,
    skills: true,
    projects: true,
    experience: (experiences?.length || 0) > 0,
    education: true,
    certifications: (certifications?.length || 0) > 0,
    services: false
  });

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const query = new URLSearchParams({
        template: activeTemplate,
        length: targetLength,
        sections: JSON.stringify(sections)
      });
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
      const query = new URLSearchParams({
        template: activeTemplate,
        length: targetLength,
        sections: JSON.stringify(sections)
      });
      window.location.href = `/api/admin/cv/export/docx?${query.toString()}`;
    } catch (err: any) {
      alert('Failed to generate Word document: ' + err.message);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleSaveVersion = async () => {
    try {
      await api.createCVVersion({
        title: versionName,
        template: activeTemplate,
        length: targetLength,
        sections: {
          profilePicture: false,
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
        sectionOrder: ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'services'],
        customTitle: settings.heroSubtitle || 'CSE Student & Developer',
        isDefault: false
      });
      alert('CV configuration saved successfully!');
      onVersionsUpdated();
    } catch (err: any) {
      alert('Failed to save version: ' + err.message);
    }
  };

  const handleLoadPreset = (preset: 'software' | 'academic' | 'freelance' | 'general') => {
    if (preset === 'software') {
      setVersionName('Software Engineering Focus');
      setActiveTemplate('modern');
      setTargetLength('one-page');
      setSections({
        summary: true,
        skills: true,
        projects: true,
        experience: true,
        education: true,
        certifications: true,
        services: false
      });
    } else if (preset === 'academic') {
      setVersionName('Academic & Research Focus');
      setActiveTemplate('classic');
      setTargetLength('two-page');
      setSections({
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        services: false
      });
    } else if (preset === 'freelance') {
      setVersionName('Creative & Freelance Focus');
      setActiveTemplate('modern');
      setTargetLength('one-page');
      setSections({
        summary: true,
        services: true,
        skills: true,
        projects: true,
        experience: false,
        education: true,
        certifications: false
      });
    } else {
      setVersionName('General Comprehensive CV');
      setActiveTemplate('classic');
      setTargetLength('two-page');
      setSections({
        summary: true,
        skills: true,
        projects: true,
        experience: true,
        education: true,
        certifications: true,
        services: true
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1c2230]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Curriculum Vitae Studio & Exporter
          </h1>
          <p className="text-xs sm:text-sm text-[#848ea0] mt-1">
            Build, preview, and generate production PDF and DOCX curriculum vitae documents directly from your portfolio database.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadDOCX}
            disabled={downloadingDocx}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#151922] border border-[#262f40] hover:border-amber-500/50 cursor-pointer shadow"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>{downloadingDocx ? 'Generating DOCX...' : 'Export DOCX'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#0c0e12] cursor-pointer shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: CV Controls & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Buttons */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <span className="text-xs font-semibold text-white block">Preset Career Profiles</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLoadPreset('software')}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left bg-[#161b25] border border-[#242b3a] hover:border-amber-500/40 text-[#cbd5e1] hover:text-white transition-all"
              >
                💻 Software Dev CV
              </button>
              <button
                onClick={() => handleLoadPreset('academic')}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left bg-[#161b25] border border-[#242b3a] hover:border-amber-500/40 text-[#cbd5e1] hover:text-white transition-all"
              >
                🎓 Academic CV
              </button>
              <button
                onClick={() => handleLoadPreset('freelance')}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left bg-[#161b25] border border-[#242b3a] hover:border-amber-500/40 text-[#cbd5e1] hover:text-white transition-all"
              >
                ✍️ Creative / Freelance
              </button>
              <button
                onClick={() => handleLoadPreset('general')}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left bg-[#161b25] border border-[#242b3a] hover:border-amber-500/40 text-[#cbd5e1] hover:text-white transition-all"
              >
                📄 General Comprehensive
              </button>
            </div>
          </div>

          {/* Template & Target Length */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Visual Layout Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'modern', label: 'Modern Minimal' },
                  { id: 'classic', label: 'Classic Editorial' },
                  { id: 'compact', label: 'Compact Technical' }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setActiveTemplate(tpl.id as any)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium text-center border transition-all ${
                      activeTemplate === tpl.id
                        ? 'bg-amber-500/15 text-white border-amber-500/60 font-semibold'
                        : 'bg-[#151922] text-[#9ca3af] border-[#202736]'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5">
                Target Document Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'one-page', label: 'One Page' },
                  { id: 'two-page', label: 'Two Pages' },
                  { id: 'extended', label: 'Extended' }
                ].map((len) => (
                  <button
                    key={len.id}
                    onClick={() => setTargetLength(len.id as any)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium text-center border transition-all ${
                      targetLength === len.id
                        ? 'bg-amber-500/15 text-white border-amber-500/60 font-semibold'
                        : 'bg-[#151922] text-[#9ca3af] border-[#202736]'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Inclusions */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <span className="text-xs font-semibold text-white block">
              Sections to Include in Export
            </span>
            <div className="space-y-2">
              {[
                { key: 'summary', label: 'Professional Biography & Narrative Summary' },
                { key: 'education', label: 'Education & Academic History' },
                { key: 'skills', label: 'Skills, Languages & Technologies' },
                { key: 'projects', label: 'Selected Engineering Projects & Systems' },
                { key: 'experience', label: 'Professional Experience Timeline' },
                { key: 'certifications', label: 'Verified Certifications' },
                { key: 'services', label: 'Creative Offerings (Poetry, Illustration)' }
              ].map(({ key, label }) => {
                const isChecked = (sections as any)[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSection(key as any)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#141822] hover:bg-[#181d28] border border-[#202736] text-xs text-left cursor-pointer transition-colors"
                  >
                    <span className={isChecked ? 'text-white font-medium' : 'text-[#6b7280]'}>
                      {label}
                    </span>
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" style={{ color: accentColor }} />
                    ) : (
                      <Square className="w-4 h-4 text-[#4b5563]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Configuration Version */}
          <div className="p-5 rounded-xl bg-[#11141c] border border-[#1f2533] space-y-3">
            <label className="block text-xs font-medium text-[#9ca3af]">
              Save Custom CV Configuration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-xs focus:outline-none focus:border-amber-500/60"
              />
              <button
                onClick={handleSaveVersion}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#161b25] border border-[#2a3344] text-white hover:border-amber-500/50 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Document Sheet Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3 text-xs text-[#848ea0]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" style={{ color: accentColor }} />
                <span>Live Curriculum Vitae Preview ({targetLength.replace('-', ' ')})</span>
              </span>
              <span className="font-mono text-[11px]">8.5" × 11" Paper Standard</span>
            </div>

            {/* Document Paper Container (White paper feel, crisp editorial typesetting) */}
            <div className="rounded-xl overflow-hidden shadow-2xl border border-[#262f40] bg-white text-[#111827] p-8 sm:p-10 font-sans text-xs leading-relaxed max-h-[85vh] overflow-y-auto">
              
              {/* Header block */}
              <div className="border-b-2 border-[#111827] pb-4 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] uppercase font-display">
                  {settings.heroHeadingFirst || 'Farhan'} {settings.heroHeadingAccent || 'Tasneem'}
                </h2>
                <div className="text-xs font-medium text-[#475569] mt-0.5 tracking-wide">
                  {settings.heroSubtitle || 'CSE Student • Developer • Creative'}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#64748b] mt-2">
                  <span>farhantasneem2004@gmail.com</span>
                  <span>•</span>
                  <span>{settings.aboutLocation || 'Dhaka, Bangladesh'}</span>
                  <span>•</span>
                  <span>github.com/farhantasneem</span>
                </div>
              </div>

              {/* Summary */}
              {sections.summary && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Professional Summary
                  </h3>
                  <p className="text-[11.5px] text-[#334155] leading-relaxed">
                    {settings.aboutShortBio}
                  </p>
                </div>
              )}

              {/* Education */}
              {sections.education && (education?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Education
                  </h3>
                  {(education || []).map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                        <span>{edu.institution}</span>
                        <span className="font-normal text-[#64748b]">
                          {edu.startYear} – {edu.current ? 'Present' : edu.endYear}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#475569] italic flex justify-between">
                        <span>{edu.degree}</span>
                        {edu.grade && <span className="font-semibold text-emerald-700 not-italic font-mono text-[10.5px]">{edu.grade}</span>}
                      </div>
                      {edu.description && (
                        <p className="text-[11px] text-[#64748b] mt-0.5">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {sections.skills && (skills?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Technical & Analytical Skills
                  </h3>
                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="font-bold text-[#1e293b]">Core Competencies: </span>
                      <span className="text-[#475569]">
                        {(skills || []).slice(0, 10).map((s) => s.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects */}
              {sections.projects && (projects?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Selected Engineering Projects
                  </h3>
                  {(projects || []).slice(0, targetLength === 'one-page' ? 2 : 5).map((p) => (
                    <div key={p.id} className="mb-3">
                      <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                        <span>{p.name}</span>
                        <span className="font-normal text-[#64748b]">{p.date}</span>
                      </div>
                      <div className="text-[11px] text-[#64748b] mb-1 font-mono">
                        Tech Stack: {(p.technologies || []).join(', ')}
                      </div>
                      <p className="text-[11px] text-[#334155] leading-relaxed">
                        {p.shortDescription}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {sections.experience && (experiences?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Professional Experience
                  </h3>
                  {(experiences || []).map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <div className="flex justify-between font-bold text-xs text-[#0f172a]">
                        <span>{exp.position} — {exp.organization}</span>
                        <span className="font-normal text-[#64748b]">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#334155] mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {sections.certifications && (certifications?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Certifications & Credentials
                  </h3>
                  {(certifications || []).map((c) => (
                    <div key={c.id} className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-[#1e293b]">
                        {c.name} — {c.issuer}
                      </span>
                      <span className="text-[#64748b]">{c.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Creative Offerings */}
              {sections.services && (services?.length || 0) > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#e2e8f0] pb-1 mb-2 font-display">
                    Creative Specializations
                  </h3>
                  <p className="text-[11px] text-[#475569]">
                    {(services || []).map((s) => s.name).join(' • ')}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
