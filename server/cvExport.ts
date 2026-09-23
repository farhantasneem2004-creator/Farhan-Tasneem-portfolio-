import path from 'path';
import fs from 'fs';
import { jsPDF } from 'jspdf';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType
} from 'docx';
import { db } from './db.js';
import type {
  SiteSettings,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Service
} from '../src/types.js';

export interface CvExportOptions {
  versionId?: string;
  versionName?: string;
  cvType?: 'academic' | 'professional' | 'technical' | 'creative' | 'general';
  template?: 'classic' | 'modern' | 'compact' | 'sidebar';
  length?: 'one-page' | 'two-page' | 'extended';
  includePhoto?: boolean;
  photoUrl?: string;
  photoShape?: 'circle' | 'rounded' | 'square';
  photoPosition?: 'header-right' | 'header-left' | 'sidebar';
  photoFilter?: 'none' | 'grayscale';
  accentColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
  customTitle?: string;
  customSummary?: string;
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  sections?: {
    summary?: boolean;
    education?: boolean;
    skills?: boolean;
    projects?: boolean;
    experience?: boolean;
    certifications?: boolean;
    services?: boolean;
    contact?: boolean;
  };
  sectionOrder?: string[];
  selectedProjectIds?: string[];
  selectedExperienceIds?: string[];
  selectedSkillIds?: string[];
  selectedEducationIds?: string[];
  selectedCertificationIds?: string[];
}

/**
 * Safely resolves the candidate's portrait image buffer from local disk or URL.
 */
export function getHeroPortraitBuffer(customUrl?: string): { buffer: Buffer; mime: string } | null {
  try {
    const settings = db.getSettings();
    const candidateUrl = customUrl || settings.heroImage || '/images/hero/farhan-hero.png';

    // If candidate starts with data:image
    if (candidateUrl.startsWith('data:image')) {
      const matches = candidateUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        const buf = Buffer.from(matches[2], 'base64');
        const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        return {
          buffer: buf,
          mime: isPng ? 'image/png' : 'image/jpeg'
        };
      }
    }

    // Candidate path from disk
    const cleanPath = candidateUrl.replace(/^\/+/, '');
    const possibleLocations = [
      candidateUrl,
      cleanPath,
      path.join(process.cwd(), cleanPath),
      path.join(process.cwd(), 'public', cleanPath),
      path.join(process.cwd(), 'dist', cleanPath),
      path.join(process.cwd(), 'uploads', path.basename(cleanPath)),
      path.join(process.cwd(), 'public/uploads', path.basename(cleanPath)),
      path.join(process.cwd(), 'public/images/hero/farhan-hero.png'),
      path.join(process.cwd(), 'public/images/hero/farhan-hero.jpg'),
      path.join(process.cwd(), 'src/assets/images/hero/farhan-hero.png'),
      path.join(process.cwd(), 'public/farhan_hero_portrait.jpg'),
      path.join(process.cwd(), 'public/images/farhan_hero_portrait_1789381757896.jpg')
    ];

    for (const loc of possibleLocations) {
      if (typeof loc === 'string' && fs.existsSync(loc) && fs.statSync(loc).isFile()) {
        const buf = fs.readFileSync(loc);
        const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        return { buffer: buf, mime: isPng ? 'image/png' : 'image/jpeg' };
      }
    }
  } catch (err) {
    console.error('Failed to get hero portrait buffer:', err);
  }
  return null;
}

// Convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16)
    ];
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.substring(0, 2), 16),
      parseInt(clean.substring(2, 4), 16),
      parseInt(clean.substring(4, 6), 16)
    ];
  }
  return [229, 169, 60]; // default gold
}

/**
 * High-precision PDF CV Generation with differentiated styles:
 * - Academic CV (Scholarly serif typography, formal academic header, education & research prioritized)
 * - Professional CV (Modern corporate sans, executive summary, work experience prioritized)
 * - Technical CV (High-density ATS layout, categorized skills matrix, engineering projects)
 * - Creative CV (Modern dual-column layout with hero portrait, visual services, creative narrative)
 * - General CV (Balanced portfolio document)
 */
export function generateCvPdf(options: CvExportOptions = {}): Buffer {
  const settings = db.getSettings();
  const allSkills = db.getSkills().filter((s) => s.visible);
  const allProjects = db.getProjects().filter((p) => p.visible);
  const allEducation = db.getEducation().filter((e) => e.visible);
  const allExperiences = db.getExperiences().filter((e) => e.visible);
  const allCertifications = db.getCertifications().filter((c) => c.visible);
  const allServices = db.getServices().filter((s) => s.visible);

  const cvType = options.cvType || 'professional';
  const targetLength = options.length || 'one-page';
  const accent = options.accentColor || settings.accentColor || '#e5a93c';
  const [ar, ag, ab] = hexToRgb(accent);

  // Section visibility defaults according to CV type if not explicitly provided
  const sec = {
    summary: options.sections?.summary ?? true,
    education: options.sections?.education ?? true,
    skills: options.sections?.skills ?? true,
    projects: options.sections?.projects ?? true,
    experience: options.sections?.experience ?? (cvType !== 'academic' || allExperiences.length > 0),
    certifications: options.sections?.certifications ?? true,
    services: options.sections?.services ?? (cvType === 'creative' || cvType === 'general')
  };

  // Section item limits according to target length
  const maxProjects = targetLength === 'one-page' ? (cvType === 'technical' ? 3 : 2) : targetLength === 'two-page' ? 5 : 8;
  const maxExperiences = targetLength === 'one-page' ? (cvType === 'professional' ? 3 : 2) : targetLength === 'two-page' ? 5 : 8;
  const maxEducation = targetLength === 'one-page' ? 2 : 4;
  const maxCertifications = targetLength === 'one-page' ? 3 : 6;

  // Filter items based on explicit selection IDs or defaults
  const projects = Array.isArray(options.selectedProjectIds)
    ? allProjects.filter((p) => options.selectedProjectIds!.includes(p.id))
    : allProjects.slice(0, maxProjects);

  const experiences = Array.isArray(options.selectedExperienceIds)
    ? allExperiences.filter((e) => options.selectedExperienceIds!.includes(e.id))
    : allExperiences.slice(0, maxExperiences);

  const education = Array.isArray(options.selectedEducationIds)
    ? allEducation.filter((e) => options.selectedEducationIds!.includes(e.id))
    : allEducation.slice(0, maxEducation);

  const certifications = Array.isArray(options.selectedCertificationIds)
    ? allCertifications.filter((c) => options.selectedCertificationIds!.includes(c.id))
    : allCertifications.slice(0, maxCertifications);

  const skillsToRender = Array.isArray(options.selectedSkillIds)
    ? allSkills.filter((s) => options.selectedSkillIds!.includes(s.id))
    : allSkills;

  const services = allServices.slice(0, targetLength === 'one-page' ? 2 : 4);

  // Portrait photo resolution
  const includePhoto = options.includePhoto ?? (cvType === 'creative' || cvType === 'professional');
  const portrait = includePhoto ? getHeroPortraitBuffer(options.photoUrl) : null;
  const photoPos = options.photoPosition || (cvType === 'creative' ? 'sidebar' : 'header-right');

  // Initialize jsPDF document (letter: 612 x 792 pt)
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2; // 532 pt

  // Select font family according to CV type or preference
  const isAcademic = cvType === 'academic';
  const primaryFont = options.fontFamily === 'serif' || isAcademic
    ? 'times'
    : options.fontFamily === 'mono'
    ? 'courier'
    : 'helvetica';

  let y = 38;

  // Helper for page breaks
  const ensureSpace = (needed: number): number => {
    if (y + needed > pageHeight - 35) {
      doc.addPage();
      y = 38;
    }
    return y;
  };

  // Helper to render candidate header
  const fullName = (
    options.contactInfo?.name ||
    `${settings.heroHeadingFirst || 'FARHAN'} ${settings.heroHeadingAccent || 'TASNEEM'}`
  ).toUpperCase();

  const defaultSub = isAcademic
    ? 'Computer Science & Engineering Student & Researcher'
    : cvType === 'technical'
    ? 'Full-Stack Software Engineer • Systems Developer'
    : cvType === 'creative'
    ? 'Creative Technologist • Developer • Visual Thinker'
    : 'CSE Student • Software Developer • Technical Creator';
  const subtitle = options.customTitle || settings.heroSubtitle || defaultSub;

  const email = options.contactInfo?.email || 'farhantasneem2004@gmail.com';
  const phone = options.contactInfo?.phone || '';
  const location = options.contactInfo?.location || settings.aboutLocation || 'Dhaka, Bangladesh';
  const github = options.contactInfo?.github || 'github.com/farhantasneem';
  const linkedin = options.contactInfo?.linkedin || '';
  const website = options.contactInfo?.website || '';

  const contactItems = [email, phone, location, github, linkedin, website].filter(Boolean);
  const contactRow = contactItems.join('  |  ');

  // Draw Photo if included in header
  if (portrait && photoPos !== 'sidebar') {
    const photoSize = 58;
    const photoBase64 = `data:${portrait.mime};base64,${portrait.buffer.toString('base64')}`;
    const imgFormat = portrait.mime === 'image/png' ? 'PNG' : 'JPEG';

    if (photoPos === 'header-right') {
      // Photo on upper right corner
      const photoX = pageWidth - marginX - photoSize;
      const photoY = y;
      try {
        doc.addImage(photoBase64, imgFormat, photoX, photoY, photoSize, photoSize);
      } catch (err) {
        console.warn('Failed to embed PDF image:', err);
      }
      // Draw subtle accent border around photo
      doc.setDrawColor(ar, ag, ab);
      doc.setLineWidth(1);
      doc.rect(photoX, photoY, photoSize, photoSize);

      // Name and details with narrower width so they don't overlap photo
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(isAcademic ? 20 : 22);
      doc.setTextColor(20, 24, 33);
      doc.text(fullName, marginX, y + 16);

      doc.setFont(primaryFont, isAcademic ? 'italic' : 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(ar, ag, ab);
      doc.text(subtitle, marginX, y + 32);

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 90, 105);
      doc.text(contactRow, marginX, y + 46);

      y += photoSize + 12;
    } else {
      // Photo on upper left
      const photoX = marginX;
      const photoY = y;
      try {
        doc.addImage(photoBase64, imgFormat, photoX, photoY, photoSize, photoSize);
      } catch (err) {
        console.warn('Failed to embed PDF image:', err);
      }
      doc.setDrawColor(ar, ag, ab);
      doc.setLineWidth(1);
      doc.rect(photoX, photoY, photoSize, photoSize);

      const textX = marginX + photoSize + 14;
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(isAcademic ? 20 : 22);
      doc.setTextColor(20, 24, 33);
      doc.text(fullName, textX, y + 16);

      doc.setFont(primaryFont, isAcademic ? 'italic' : 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(ar, ag, ab);
      doc.text(subtitle, textX, y + 32);

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 90, 105);
      doc.text(contactRow, textX, y + 46);

      y += photoSize + 12;
    }
  } else if (portrait && photoPos === 'sidebar' && cvType === 'creative') {
    // Creative dual-layout: photo placed in left column
    const photoSize = 70;
    const photoBase64 = `data:${portrait.mime};base64,${portrait.buffer.toString('base64')}`;
    const imgFormat = portrait.mime === 'image/png' ? 'PNG' : 'JPEG';
    try {
      doc.addImage(photoBase64, imgFormat, marginX, y, photoSize, photoSize);
    } catch (err) {
      console.warn('Failed to embed PDF image:', err);
    }
    doc.setDrawColor(ar, ag, ab);
    doc.setLineWidth(1.5);
    doc.rect(marginX, y, photoSize, photoSize);

    const textX = marginX + photoSize + 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(20, 24, 33);
    doc.text(fullName, textX, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(ar, ag, ab);
    doc.text(subtitle, textX, y + 36);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 90, 105);
    doc.text(contactRow, textX, y + 52);

    y += photoSize + 14;
  } else {
    // Standard text header without photo
    doc.setFont(primaryFont, 'bold');
    doc.setFontSize(isAcademic ? 21 : 23);
    doc.setTextColor(20, 24, 33);
    doc.text(fullName, marginX, y + 16);

    doc.setFont(primaryFont, isAcademic ? 'italic' : 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(ar, ag, ab);
    doc.text(subtitle, marginX, y + 32);

    doc.setFont(primaryFont, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 90, 105);
    doc.text(contactRow, marginX, y + 46);

    y += 56;
  }

  // Header separator line
  if (isAcademic) {
    // Formal scholarly double line
    doc.setDrawColor(30, 40, 55);
    doc.setLineWidth(1.2);
    doc.line(marginX, y, pageWidth - marginX, y);
    doc.setLineWidth(0.4);
    doc.line(marginX, y + 3, pageWidth - marginX, y + 3);
    y += 14;
  } else {
    // Sleek single line with accent highlight
    doc.setDrawColor(ar, ag, ab);
    doc.setLineWidth(1.5);
    doc.line(marginX, y, marginX + 45, y);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.75);
    doc.line(marginX + 45, y, pageWidth - marginX, y);
    y += 14;
  }

  // Section heading helper
  const drawSectionHeader = (title: string) => {
    ensureSpace(35);
    doc.setFont(primaryFont, 'bold');
    doc.setFontSize(isAcademic ? 11 : 11.5);
    doc.setTextColor(20, 25, 35);
    doc.text(title.toUpperCase(), marginX, y);

    // Accent line beneath section header
    y += 4;
    doc.setDrawColor(isAcademic ? 160 : ar, isAcademic ? 160 : ag, isAcademic ? 160 : ab);
    doc.setLineWidth(0.8);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 11;
  };

  // Determine section order based on CV Type
  let order: string[] = [];
  if (options.sectionOrder && options.sectionOrder.length > 0) {
    order = options.sectionOrder;
  } else if (isAcademic) {
    order = ['summary', 'education', 'projects', 'skills', 'experience', 'certifications', 'services'];
  } else if (cvType === 'professional') {
    order = ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];
  } else if (cvType === 'technical') {
    order = ['skills', 'projects', 'experience', 'education', 'certifications'];
  } else {
    order = ['summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'services'];
  }

  // Render sections in determined order
  order.forEach((sectionKey) => {
    switch (sectionKey) {
      case 'summary':
      case 'about': {
        if (!sec.summary) return;
        const summaryText =
          options.customSummary ||
          (isAcademic
            ? `Computer Science and Engineering scholar with academic concentration in algorithms, discrete mathematics, and systems design. Dedicated to rigorous theoretical exploration, open-source software contribution, and practical engineering implementations.`
            : settings.aboutShortBio + ' ' + (targetLength === 'one-page' ? '' : settings.aboutDetailedBio));

        drawSectionHeader(isAcademic ? 'Academic & Research Profile' : 'Professional Summary');
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(50, 55, 65);
        const lines = doc.splitTextToSize(summaryText, contentWidth);
        doc.text(lines, marginX, y);
        y += lines.length * 12 + 10;
        break;
      }

      case 'education': {
        if (!sec.education || education.length === 0) return;
        drawSectionHeader(isAcademic ? 'Education & Academic Qualifications' : 'Education');

        education.forEach((edu) => {
          ensureSpace(40);
          doc.setFont(primaryFont, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(20, 25, 35);
          doc.text(edu.institution, marginX, y);

          doc.setFont(primaryFont, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 110, 125);
          const years = `${edu.startYear} – ${edu.current ? 'Present' : edu.endYear}`;
          doc.text(years, pageWidth - marginX, y, { align: 'right' });
          y += 12;

          doc.setFont(primaryFont, isAcademic ? 'italic' : 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(ar, ag, ab);
          doc.text(edu.degree + (edu.department ? ` • ${edu.department}` : ''), marginX, y);

          if (edu.grade) {
            doc.setFont(primaryFont, 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(4, 120, 87); // Emerald green
            doc.text(`CGPA: ${edu.grade}`, pageWidth - marginX, y, { align: 'right' });
          }
          y += 11;

          if (edu.description) {
            doc.setFont(primaryFont, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(70, 75, 85);
            const descLines = doc.splitTextToSize(edu.description, contentWidth);
            doc.text(descLines, marginX, y);
            y += descLines.length * 11 + 6;
          } else {
            y += 4;
          }
        });
        y += 4;
        break;
      }

      case 'skills': {
        if (!sec.skills || skillsToRender.length === 0) return;
        drawSectionHeader(
          isAcademic
            ? 'Technical Competencies & Laboratory Tools'
            : cvType === 'technical'
            ? 'Technical Skills & Architecture Matrix'
            : 'Core Competencies & Skills'
        );

        if (cvType === 'technical') {
          // Categorized matrix for technical ATS formatting
          const cats: Record<string, string[]> = {};
          skillsToRender.forEach((s) => {
            const cat = s.category || 'General';
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push(s.name);
          });

          Object.entries(cats).forEach(([category, list]) => {
            ensureSpace(16);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(30, 35, 45);
            doc.text(`${category}: `, marginX, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 65, 75);
            const line = doc.splitTextToSize(list.join(', '), contentWidth - 120);
            doc.text(line, marginX + 115, y);
            y += line.length * 11 + 3;
          });
          y += 5;
        } else {
          // Clean bulleted flow
          doc.setFont(primaryFont, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(45, 50, 60);
          const skillText = skillsToRender.map((s) => `${s.name} (${s.level})`).join('   •   ');
          const skillLines = doc.splitTextToSize(skillText, contentWidth);
          doc.text(skillLines, marginX, y);
          y += skillLines.length * 12 + 8;
        }
        break;
      }

      case 'experience': {
        if (!sec.experience || experiences.length === 0) return;
        drawSectionHeader(
          isAcademic ? 'Academic & Professional Appointments' : 'Professional Experience'
        );

        experiences.forEach((exp) => {
          ensureSpace(50);
          doc.setFont(primaryFont, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(20, 25, 35);
          doc.text(`${exp.position} — ${exp.organization}`, marginX, y);

          doc.setFont(primaryFont, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 110, 125);
          const dates = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
          doc.text(dates, pageWidth - marginX, y, { align: 'right' });
          y += 12;

          if (exp.location || exp.type) {
            doc.setFont(primaryFont, 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(ar, ag, ab);
            doc.text(`${exp.type || 'Role'} • ${exp.location || 'Remote'}`, marginX, y);
            y += 11;
          }

          if (exp.description) {
            doc.setFont(primaryFont, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(60, 65, 75);
            const descLines = doc.splitTextToSize(exp.description, contentWidth);
            doc.text(descLines, marginX, y);
            y += descLines.length * 11 + 4;
          }

          // Render bulleted responsibilities if provided
          if (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0) {
            exp.responsibilities.forEach((resp) => {
              if (!resp.trim()) return;
              ensureSpace(16);
              doc.setFont(primaryFont, 'normal');
              doc.setFontSize(8.5);
              doc.setTextColor(50, 55, 65);
              const bulletText = `•  ${resp.trim()}`;
              const respLines = doc.splitTextToSize(bulletText, contentWidth - 8);
              doc.text(respLines, marginX + 8, y);
              y += respLines.length * 11 + 2;
            });
          }
          y += 4;
        });
        y += 4;
        break;
      }

      case 'projects': {
        if (!sec.projects || projects.length === 0) return;
        drawSectionHeader(
          isAcademic
            ? 'Research & Software Engineering Projects'
            : cvType === 'technical'
            ? 'Featured Systems & Software Engineering'
            : 'Key Engineering & Creative Projects'
        );

        projects.forEach((proj) => {
          ensureSpace(50);
          doc.setFont(primaryFont, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(20, 25, 35);
          doc.text(proj.name, marginX, y);

          doc.setFont(primaryFont, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 110, 125);
          doc.text(proj.date || 'Active', pageWidth - marginX, y, { align: 'right' });
          y += 12;

          if (proj.technologies && proj.technologies.length > 0) {
            doc.setFont(cvType === 'technical' ? 'courier' : primaryFont, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(ar, ag, ab);
            doc.text(`Tech: [${proj.technologies.join(', ')}]`, marginX, y);
            y += 11;
          }

          const desc = proj.shortDescription || proj.detailedDescription;
          if (desc) {
            doc.setFont(primaryFont, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(60, 65, 75);
            const descLines = doc.splitTextToSize(desc, contentWidth);
            doc.text(descLines, marginX, y);
            y += descLines.length * 11 + 6;
          } else {
            y += 4;
          }
        });
        y += 4;
        break;
      }

      case 'certifications': {
        if (!sec.certifications || certifications.length === 0) return;
        drawSectionHeader(isAcademic ? 'Honors, Awards & Verified Credentials' : 'Certifications & Credentials');

        certifications.forEach((cert) => {
          ensureSpace(20);
          doc.setFont(primaryFont, 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 35, 45);
          doc.text(`${cert.name} — ${cert.issuer}`, marginX, y);

          doc.setFont(primaryFont, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(110, 120, 130);
          doc.text(cert.date || '', pageWidth - marginX, y, { align: 'right' });
          y += 13;
        });
        y += 5;
        break;
      }

      case 'services': {
        if (!sec.services || services.length === 0) return;
        drawSectionHeader('Specialized & Creative Offerings');
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 55, 65);
        const servText = services.map((s) => `${s.name}: ${s.shortDescription}`).join('\n• ');
        const servLines = doc.splitTextToSize('• ' + servText, contentWidth);
        doc.text(servLines, marginX, y);
        y += servLines.length * 11 + 8;
        break;
      }

      default:
        break;
    }
  });

  return Buffer.from(doc.output('arraybuffer'));
}

/**
 * Generates formatted Microsoft Word (.docx) documents with candidate's portrait photo,
 * distinct headers, and styled tables for Academic, Professional, Technical, and Creative CVs.
 */
export async function generateCvDocx(options: CvExportOptions = {}): Promise<Buffer> {
  const settings = db.getSettings();
  const allSkills = db.getSkills().filter((s) => s.visible);
  const allProjects = db.getProjects().filter((p) => p.visible);
  const allEducation = db.getEducation().filter((e) => e.visible);
  const allExperiences = db.getExperiences().filter((e) => e.visible);
  const allCertifications = db.getCertifications().filter((c) => c.visible);
  const allServices = db.getServices().filter((s) => s.visible);

  const cvType = options.cvType || 'professional';
  const targetLength = options.length || 'one-page';
  const isAcademic = cvType === 'academic';

  const includePhoto = options.includePhoto ?? (cvType === 'creative' || cvType === 'professional');
  const portrait = includePhoto ? getHeroPortraitBuffer(options.photoUrl) : null;

  const maxProjects = targetLength === 'one-page' ? 3 : 6;
  const maxExperiences = targetLength === 'one-page' ? 3 : 6;
  const projects = Array.isArray(options.selectedProjectIds)
    ? allProjects.filter((p) => options.selectedProjectIds!.includes(p.id))
    : allProjects.slice(0, maxProjects);

  const experiences = Array.isArray(options.selectedExperienceIds)
    ? allExperiences.filter((e) => options.selectedExperienceIds!.includes(e.id))
    : allExperiences.slice(0, maxExperiences);

  const education = Array.isArray(options.selectedEducationIds)
    ? allEducation.filter((e) => options.selectedEducationIds!.includes(e.id))
    : allEducation;

  const skillsToRender = Array.isArray(options.selectedSkillIds)
    ? allSkills.filter((s) => options.selectedSkillIds!.includes(s.id))
    : allSkills;

  const certifications = Array.isArray(options.selectedCertificationIds)
    ? allCertifications.filter((c) => options.selectedCertificationIds!.includes(c.id))
    : allCertifications;

  const docChildren: (Paragraph | Table)[] = [];

  const fullName = (
    options.contactInfo?.name ||
    `${settings.heroHeadingFirst || 'FARHAN'} ${settings.heroHeadingAccent || 'TASNEEM'}`
  ).toUpperCase();

  const subtitle =
    options.customTitle ||
    settings.heroSubtitle ||
    (isAcademic
      ? 'Computer Science & Engineering Student & Researcher'
      : 'CSE Student • Full-Stack Developer • Creative Technologist');

  const email = options.contactInfo?.email || 'farhantasneem2004@gmail.com';
  const phone = options.contactInfo?.phone || '';
  const location = options.contactInfo?.location || settings.aboutLocation || 'Dhaka, Bangladesh';
  const github = options.contactInfo?.github || 'github.com/farhantasneem';
  const linkedin = options.contactInfo?.linkedin || '';
  const contactText = [email, phone, location, github, linkedin].filter(Boolean).join('  |  ');

  // Header Table with Candidate Portrait Photo if requested
  if (portrait) {
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: 'D0D7DE' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: fullName, bold: true, size: 32, font: isAcademic ? 'Times New Roman' : 'Calibri' })]
                }),
                new Paragraph({
                  children: [new TextRun({ text: subtitle, color: 'B4781E', bold: true, size: 22, font: isAcademic ? 'Times New Roman' : 'Calibri' })]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: contactText,
                      size: 18,
                      color: '57606A'
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new ImageRun({
                      data: portrait.buffer,
                      transformation: { width: 75, height: 75 },
                      type: portrait.mime === 'image/png' ? 'png' : 'jpg'
                    } as any)
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    docChildren.push(headerTable);
  } else {
    // Text-only header
    docChildren.push(
      new Paragraph({
        text: fullName,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: subtitle,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: contactText,
        alignment: AlignmentType.CENTER
      })
    );
  }

  docChildren.push(new Paragraph({ text: '' }));

  // Summary / Profile
  const summaryText =
    options.customSummary ||
    (isAcademic
      ? 'Computer Science and Engineering scholar with academic concentration in algorithms, discrete mathematics, and systems design. Dedicated to rigorous theoretical exploration, open-source software contribution, and practical engineering implementations.'
      : settings.aboutShortBio + ' ' + (targetLength === 'one-page' ? '' : settings.aboutDetailedBio));

  docChildren.push(
    new Paragraph({
      text: isAcademic ? 'ACADEMIC & RESEARCH PROFILE' : 'PROFESSIONAL SUMMARY',
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({ text: summaryText }),
    new Paragraph({ text: '' })
  );

  // Education
  docChildren.push(
    new Paragraph({
      text: isAcademic ? 'EDUCATION & ACADEMIC BACKGROUND' : 'EDUCATION',
      heading: HeadingLevel.HEADING_1
    }),
    ...education.map(
      (edu) =>
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true }),
            new TextRun({ text: ` (${edu.startYear} – ${edu.current ? 'Present' : edu.endYear})\n` }),
            new TextRun({ text: edu.degree + (edu.grade ? ` [CGPA: ${edu.grade}]` : '') + '\n', italics: true }),
            new TextRun({ text: edu.description || '' })
          ]
        })
    ),
    new Paragraph({ text: '' })
  );

  // Skills
  docChildren.push(
    new Paragraph({
      text: isAcademic ? 'TECHNICAL COMPETENCIES & TOOLS' : 'SKILLS & EXPERTISE',
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      text: skillsToRender.map((s) => `${s.name} (${s.level})`).join('  •  ')
    }),
    new Paragraph({ text: '' })
  );

  // Experience
  if (experiences.length > 0) {
    const expParagraphs: Paragraph[] = [
      new Paragraph({
        text: isAcademic ? 'ACADEMIC & PROFESSIONAL EXPERIENCE' : 'PROFESSIONAL EXPERIENCE',
        heading: HeadingLevel.HEADING_1
      })
    ];

    experiences.forEach((exp) => {
      const runs: TextRun[] = [
        new TextRun({ text: `${exp.position} — ${exp.organization}`, bold: true }),
        new TextRun({ text: ` (${exp.startDate} – ${exp.current ? 'Present' : exp.endDate})\n` }),
        new TextRun({ text: `${exp.type || 'Role'} • ${exp.location || 'Remote'}\n`, italics: true }),
        new TextRun({ text: `${exp.description || ''}\n` })
      ];

      if (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach((r) => {
          if (r.trim()) {
            runs.push(new TextRun({ text: `  • ${r.trim()}\n` }));
          }
        });
      }

      expParagraphs.push(new Paragraph({ children: runs }));
    });

    expParagraphs.push(new Paragraph({ text: '' }));
    docChildren.push(...expParagraphs);
  }

  // Key Projects
  if (projects.length > 0) {
    docChildren.push(
      new Paragraph({
        text: isAcademic ? 'RESEARCH & DEVELOPMENT PROJECTS' : 'KEY PROJECTS',
        heading: HeadingLevel.HEADING_1
      }),
      ...projects.map(
        (p) =>
          new Paragraph({
            children: [
              new TextRun({ text: p.name, bold: true }),
              new TextRun({ text: ` [${p.technologies.join(', ')}]\n`, italics: true, color: 'B4781E' }),
              new TextRun({ text: `${p.shortDescription}\n` }),
              new TextRun({ text: p.detailedDescription || '' })
            ]
          })
      ),
      new Paragraph({ text: '' })
    );
  }

  // Certifications
  if (certifications.length > 0) {
    docChildren.push(
      new Paragraph({
        text: isAcademic ? 'HONORS & CERTIFICATIONS' : 'CERTIFICATIONS & CREDENTIALS',
        heading: HeadingLevel.HEADING_1
      }),
      ...certifications.map(
        (c) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${c.name} — ${c.issuer}`, bold: true }),
              new TextRun({ text: ` (${c.date})` })
            ]
          })
      ),
      new Paragraph({ text: '' })
    );
  }

  // Services
  if (cvType === 'creative' && allServices.length > 0) {
    docChildren.push(
      new Paragraph({
        text: 'CREATIVE DISCIPLINES & SERVICES',
        heading: HeadingLevel.HEADING_1
      }),
      ...allServices.map(
        (s) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${s.name}: `, bold: true }),
              new TextRun({ text: s.shortDescription })
            ]
          })
      )
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children: docChildren
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
