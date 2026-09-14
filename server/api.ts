import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { db } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'farhan_tasneem_portfolio_secret_2026';

// Configure multer storage for uploads
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPG, PNG, WEBP, PDF, SVG'));
    }
  }
});

// Middleware for auth verification
interface AuthRequest extends Request {
  user?: { email: string };
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Get entire public view (only visible items)
router.get('/public/portfolio', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    const socialLinks = db.getSocialLinks().filter((l) => l.visible);
    const skills = db.getSkills().filter((s) => s.visible);
    const projects = db.getProjects().filter((p) => p.visible);
    const experiences = db.getExperiences().filter((e) => e.visible);
    const education = db.getEducation().filter((e) => e.visible);
    const certifications = db.getCertifications().filter((c) => c.visible);
    const services = db.getServices().filter((s) => s.visible);
    const galleryCategories = db.getGalleryCategories().filter((c) => c.visible);
    const galleryAlbums = db.getGalleryAlbums().filter((a) => a.visible);
    const galleryImages = db.getGalleryImages().filter((i) => i.visible);

    res.json({
      settings,
      socialLinks,
      skills,
      projects,
      experiences,
      education,
      certifications,
      services,
      galleryCategories,
      galleryAlbums,
      galleryImages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

// Public contact form submission
router.post('/public/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const saved = db.addContactMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'Portfolio Inquiry').trim(),
      message: String(message).trim()
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact message.' });
  }
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const admin = db.getAdmin();
  if (email.toLowerCase().trim() !== admin.email.toLowerCase().trim()) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = bcrypt.compareSync(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    success: true,
    token,
    user: {
      email: admin.email,
      name: 'Farhan Tasneem',
      role: 'admin'
    }
  });
});

router.get('/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const admin = db.getAdmin();
  res.json({
    email: admin.email,
    name: 'Farhan Tasneem',
    role: 'admin'
  });
});

router.post('/auth/update-credentials', requireAuth, (req: AuthRequest, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;
  const admin = db.getAdmin();

  if (currentPassword) {
    const valid = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
  }

  if (email) {
    db.updateAdminEmail(email.toLowerCase().trim());
  }

  if (newPassword && newPassword.length >= 6) {
    const hash = bcrypt.hashSync(newPassword, 10);
    db.updateAdminPassword(hash);
  }

  res.json({ success: true, message: 'Credentials updated successfully.' });
});

// ==========================================
// 3. ADMIN PROTECTED ROUTES
// ==========================================

router.get('/admin/stats', requireAuth, (req: Request, res: Response) => {
  res.json(db.getStats());
});

// Settings
router.get('/admin/settings', requireAuth, (req: Request, res: Response) => {
  res.json(db.getSettings());
});

router.put('/admin/settings', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Social Links
router.get('/admin/social-links', requireAuth, (req: Request, res: Response) => {
  res.json(db.getSocialLinks());
});

router.put('/admin/social-links', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSocialLinks(req.body);
  res.json(updated);
});

// Skills
router.get('/admin/skills', requireAuth, (req: Request, res: Response) => {
  res.json(db.getSkills());
});

router.post('/admin/skills', requireAuth, (req: Request, res: Response) => {
  const created = db.addSkill(req.body);
  res.status(201).json(created);
});

router.put('/admin/skills/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSkill(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Skill not found' });
  res.json(updated);
});

router.delete('/admin/skills/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteSkill(req.params.id);
  res.json({ success });
});

// Projects
router.get('/admin/projects', requireAuth, (req: Request, res: Response) => {
  res.json(db.getProjects());
});

router.post('/admin/projects', requireAuth, (req: Request, res: Response) => {
  const created = db.addProject(req.body);
  res.status(201).json(created);
});

router.put('/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json(updated);
});

router.delete('/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteProject(req.params.id);
  res.json({ success });
});

// Experiences
router.get('/admin/experiences', requireAuth, (req: Request, res: Response) => {
  res.json(db.getExperiences());
});

router.post('/admin/experiences', requireAuth, (req: Request, res: Response) => {
  const created = db.addExperience(req.body);
  res.status(201).json(created);
});

router.put('/admin/experiences/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateExperience(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Experience not found' });
  res.json(updated);
});

router.delete('/admin/experiences/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteExperience(req.params.id);
  res.json({ success });
});

// Education
router.get('/admin/education', requireAuth, (req: Request, res: Response) => {
  res.json(db.getEducation());
});

router.post('/admin/education', requireAuth, (req: Request, res: Response) => {
  const created = db.addEducation(req.body);
  res.status(201).json(created);
});

router.put('/admin/education/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateEducation(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Education not found' });
  res.json(updated);
});

router.delete('/admin/education/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteEducation(req.params.id);
  res.json({ success });
});

// Certifications
router.get('/admin/certifications', requireAuth, (req: Request, res: Response) => {
  res.json(db.getCertifications());
});

router.post('/admin/certifications', requireAuth, (req: Request, res: Response) => {
  const created = db.addCertification(req.body);
  res.status(201).json(created);
});

router.put('/admin/certifications/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateCertification(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Certification not found' });
  res.json(updated);
});

router.delete('/admin/certifications/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteCertification(req.params.id);
  res.json({ success });
});

// Services
router.get('/admin/services', requireAuth, (req: Request, res: Response) => {
  res.json(db.getServices());
});

router.post('/admin/services', requireAuth, (req: Request, res: Response) => {
  const created = db.addService(req.body);
  res.status(201).json(created);
});

router.put('/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found' });
  res.json(updated);
});

router.delete('/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteService(req.params.id);
  res.json({ success });
});

// Gallery Categories
router.get('/admin/gallery/categories', requireAuth, (req: Request, res: Response) => {
  res.json(db.getGalleryCategories());
});

router.post('/admin/gallery/categories', requireAuth, (req: Request, res: Response) => {
  const created = db.addGalleryCategory(req.body);
  res.status(201).json(created);
});

router.put('/admin/gallery/categories/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateGalleryCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

router.delete('/admin/gallery/categories/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteGalleryCategory(req.params.id);
  res.json({ success });
});

// Gallery Albums
router.get('/admin/gallery/albums', requireAuth, (req: Request, res: Response) => {
  res.json(db.getGalleryAlbums());
});

router.post('/admin/gallery/albums', requireAuth, (req: Request, res: Response) => {
  const created = db.addGalleryAlbum(req.body);
  res.status(201).json(created);
});

router.put('/admin/gallery/albums/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateGalleryAlbum(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Album not found' });
  res.json(updated);
});

router.delete('/admin/gallery/albums/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteGalleryAlbum(req.params.id);
  res.json({ success });
});

// Gallery Images
router.get('/admin/gallery/images', requireAuth, (req: Request, res: Response) => {
  res.json(db.getGalleryImages());
});

router.post('/admin/gallery/images', requireAuth, (req: Request, res: Response) => {
  const created = db.addGalleryImage(req.body);
  res.status(201).json(created);
});

router.put('/admin/gallery/images/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateGalleryImage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Image not found' });
  res.json(updated);
});

router.delete('/admin/gallery/images/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteGalleryImage(req.params.id);
  res.json({ success });
});

// Contact Messages (Admin)
router.get('/admin/messages', requireAuth, (req: Request, res: Response) => {
  res.json(db.getContactMessages());
});

router.put('/admin/messages/:id/read', requireAuth, (req: Request, res: Response) => {
  const { read } = req.body;
  const success = db.markMessageRead(req.params.id, read !== false);
  res.json({ success });
});

router.delete('/admin/messages/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteContactMessage(req.params.id);
  res.json({ success });
});

// CV Versions
router.get('/admin/cv-versions', requireAuth, (req: Request, res: Response) => {
  res.json(db.getCVVersions());
});

router.post('/admin/cv-versions', requireAuth, (req: Request, res: Response) => {
  const created = db.addCVVersion(req.body);
  res.status(201).json(created);
});

router.put('/admin/cv-versions/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateCVVersion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'CV Version not found' });
  res.json(updated);
});

router.delete('/admin/cv-versions/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteCVVersion(req.params.id);
  res.json({ success });
});

// Upload endpoint
router.post('/upload', requireAuth, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// ==========================================
// 4. CV GENERATION & EXPORT (PDF & DOCX)
// ==========================================

// DOCX Export
router.get('/cv-export/docx', async (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    const skills = db.getSkills().filter((s) => s.visible);
    const projects = db.getProjects().filter((p) => p.visible);
    const education = db.getEducation().filter((e) => e.visible);
    const experiences = db.getExperiences().filter((e) => e.visible);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'FARHAN TASNEEM',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: 'CSE Student • Developer • Creative',
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `${settings.aboutLocation} | Email: farhantasneem2004@gmail.com | GitHub: github.com/farhantasneem`,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ text: '' }),

            // Summary
            new Paragraph({
              text: 'PROFESSIONAL SUMMARY',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              text: settings.aboutShortBio + ' ' + settings.aboutDetailedBio
            }),
            new Paragraph({ text: '' }),

            // Education
            new Paragraph({
              text: 'EDUCATION',
              heading: HeadingLevel.HEADING_1
            }),
            ...education.map(
              (edu) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: edu.degree, bold: true }),
                    new TextRun({ text: ` — ${edu.institution} (${edu.startYear} - ${edu.endYear})\n` }),
                    new TextRun({ text: edu.description })
                  ]
                })
            ),
            new Paragraph({ text: '' }),

            // Technical Skills
            new Paragraph({
              text: 'TECHNICAL & CREATIVE SKILLS',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              text: skills.map((s) => `${s.name} (${s.level})`).join(' • ')
            }),
            new Paragraph({ text: '' }),

            // Projects
            new Paragraph({
              text: 'KEY PROJECTS',
              heading: HeadingLevel.HEADING_1
            }),
            ...projects.map(
              (p) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: p.name, bold: true }),
                    new TextRun({ text: ` [${p.technologies.join(', ')}]\n` }),
                    new TextRun({ text: `${p.shortDescription}\n` }),
                    new TextRun({ text: p.detailedDescription })
                  ]
                })
            )
          ]
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="Farhan-Tasneem-CV.docx"');
    res.send(buffer);
  } catch (err) {
    console.error('Failed generating DOCX:', err);
    res.status(500).json({ error: 'Failed to generate DOCX CV' });
  }
});

// PDF Export
router.get('/cv-export/pdf', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    const skills = db.getSkills().filter((s) => s.visible);
    const projects = db.getProjects().filter((p) => p.visible);
    const education = db.getEducation().filter((e) => e.visible);

    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter'
    });

    let y = 45;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text('FARHAN TASNEEM', 40, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(180, 120, 30);
    doc.text('CSE Student • Developer • Creative', 40, y);

    y += 16;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${settings.aboutLocation} | Email: farhantasneem2004@gmail.com | Portfolio Website`, 40, y);

    y += 24;
    doc.setDrawColor(220, 220, 220);
    doc.line(40, y, 570, y);

    // About / Summary
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('SUMMARY', 40, y);

    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(settings.aboutShortBio + ' ' + settings.aboutDetailedBio, 530);
    doc.text(summaryLines, 40, y);
    y += summaryLines.length * 13 + 12;

    // Education
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('EDUCATION', 40, y);
    y += 15;

    education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(edu.degree, 40, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`${edu.startYear} - ${edu.endYear}`, 520, y, { align: 'right' });

      y += 12;
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(70, 70, 70);
      doc.text(edu.institution, 40, y);

      y += 12;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(edu.description, 530);
      doc.text(descLines, 40, y);
      y += descLines.length * 12 + 10;
    });

    // Technical Skills
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('SKILLS & EXPERTISE', 40, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);

    const skillsText = skills.map((s) => `${s.name} (${s.level})`).join('  •  ');
    const skillLines = doc.splitTextToSize(skillsText, 530);
    doc.text(skillLines, 40, y);
    y += skillLines.length * 13 + 14;

    // Key Projects
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('FEATURED PROJECTS', 40, y);
    y += 15;

    projects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(proj.name, 40, y);

      y += 12;
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(180, 120, 30);
      doc.text(`Tech: ${proj.technologies.join(', ')}`, 40, y);

      y += 12;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const projLines = doc.splitTextToSize(proj.detailedDescription, 530);
      doc.text(projLines, 40, y);
      y += projLines.length * 12 + 10;
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Farhan-Tasneem-CV.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Failed generating PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF CV' });
  }
});

export default router;
