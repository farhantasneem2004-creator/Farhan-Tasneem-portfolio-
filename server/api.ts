import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { db } from './db.js';
import { generateCvPdf, generateCvDocx, CvExportOptions } from './cvExport.js';

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
    const landingPage = db.getLandingPagePublished();

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
      galleryImages,
      landingPage
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

  // Also sync to public/uploads directory for static web serving
  try {
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
    fs.copyFileSync(req.file.path, path.join(publicUploadsDir, req.file.filename));
  } catch (err) {
    console.warn('Could not mirror upload to public/uploads:', err);
  }

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

function parseCvOptions(req: Request): CvExportOptions {
  const source = { ...(req.query || {}), ...(req.body || {}) };
  let sections: any = undefined;
  if (typeof source.sections === 'string') {
    try {
      sections = JSON.parse(source.sections);
    } catch {
      // ignore
    }
  } else if (typeof source.sections === 'object') {
    sections = source.sections;
  }

  let sectionOrder: string[] | undefined = undefined;
  if (typeof source.sectionOrder === 'string') {
    try {
      sectionOrder = JSON.parse(source.sectionOrder);
    } catch {
      sectionOrder = source.sectionOrder.split(',').map((s: string) => s.trim());
    }
  } else if (Array.isArray(source.sectionOrder)) {
    sectionOrder = source.sectionOrder;
  }

  const cvType = (source.cvType as any) || 'professional';
  const includePhoto =
    source.includePhoto === true ||
    source.includePhoto === 'true' ||
    source.includePhoto === '1' ||
    (source.includePhoto === undefined && (cvType === 'creative' || cvType === 'professional'));

  return {
    cvType,
    template: (source.template as any) || 'modern',
    length: (source.length as any) || 'one-page',
    includePhoto,
    photoUrl: source.photoUrl,
    photoShape: source.photoShape,
    photoPosition: source.photoPosition,
    accentColor: source.accentColor,
    customTitle: source.customTitle,
    customSummary: source.customSummary,
    sections,
    sectionOrder
  };
}

const handlePdfExport = (req: Request, res: Response) => {
  try {
    const options = parseCvOptions(req);
    const pdfBuffer = generateCvPdf(options);
    const safeType = (options.cvType || 'Curriculum').replace(/[^a-zA-Z0-9_-]/g, '');
    const safeName = `Farhan-Tasneem-${safeType}-CV.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Failed generating PDF CV:', err);
    res.status(500).json({ error: 'Failed to generate PDF CV' });
  }
};

const handleDocxExport = async (req: Request, res: Response) => {
  try {
    const options = parseCvOptions(req);
    const docxBuffer = await generateCvDocx(options);
    const safeType = (options.cvType || 'Curriculum').replace(/[^a-zA-Z0-9_-]/g, '');
    const safeName = `Farhan-Tasneem-${safeType}-CV.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.send(docxBuffer);
  } catch (err) {
    console.error('Failed generating DOCX CV:', err);
    res.status(500).json({ error: 'Failed to generate DOCX CV' });
  }
};

// PDF routes (both public and admin paths, GET and POST)
router.get('/cv-export/pdf', handlePdfExport);
router.post('/cv-export/pdf', handlePdfExport);
router.get('/admin/cv/export/pdf', handlePdfExport);
router.post('/admin/cv/export/pdf', handlePdfExport);

// DOCX routes (both public and admin paths, GET and POST)
router.get('/cv-export/docx', handleDocxExport);
router.post('/cv-export/docx', handleDocxExport);
router.get('/admin/cv/export/docx', handleDocxExport);
router.post('/admin/cv/export/docx', handleDocxExport);

// ==========================================
// 5. VISUAL LANDING PAGE EDITOR API
// ==========================================

// Public: Get currently published landing page layout
router.get('/public/landing-page', (req: Request, res: Response) => {
  try {
    const layout = db.getLandingPagePublished();
    res.json(layout);
  } catch (err) {
    console.error('Failed to get published landing page:', err);
    res.status(500).json({ error: 'Failed to get published landing page' });
  }
});

// Admin: Get current draft landing page layout
router.get('/admin/landing-page/draft', requireAuth, (req: Request, res: Response) => {
  try {
    const layout = db.getLandingPageDraft();
    res.json(layout);
  } catch (err) {
    console.error('Failed to get draft landing page:', err);
    res.status(500).json({ error: 'Failed to get draft landing page' });
  }
});

// Admin: Save draft landing page layout
router.post('/admin/landing-page/draft', requireAuth, (req: Request, res: Response) => {
  try {
    const layout = req.body;
    if (!layout || !Array.isArray(layout.elements)) {
      return res.status(400).json({ error: 'Invalid layout structure: elements array required' });
    }
    const saved = db.saveLandingPageDraft(layout);
    res.json(saved);
  } catch (err) {
    console.error('Failed to save draft landing page:', err);
    res.status(500).json({ error: 'Failed to save draft landing page' });
  }
});

// Admin: Publish landing page (creates a version record and updates published layout)
router.post('/admin/landing-page/publish', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { name, layout } = req.body;
    if (layout && Array.isArray(layout.elements)) {
      db.saveLandingPageDraft(layout);
    }
    const publishedBy = req.user?.email || 'Administrator';
    const result = db.publishLandingPage(publishedBy, name);
    res.json({
      success: true,
      published: result.published,
      version: result.version
    });
  } catch (err) {
    console.error('Failed to publish landing page:', err);
    res.status(500).json({ error: 'Failed to publish landing page' });
  }
});

// Admin: Get version history
router.get('/admin/landing-page/versions', requireAuth, (req: Request, res: Response) => {
  try {
    const versions = db.getLandingPageVersions();
    res.json(versions);
  } catch (err) {
    console.error('Failed to get landing page versions:', err);
    res.status(500).json({ error: 'Failed to get landing page versions' });
  }
});

// Admin: Restore a specific version into draft
router.post('/admin/landing-page/restore-version/:versionId', requireAuth, (req: Request, res: Response) => {
  try {
    const { versionId } = req.params;
    const restored = db.restoreLandingPageVersion(versionId);
    if (!restored) {
      return res.status(404).json({ error: 'Version not found' });
    }
    res.json({ success: true, layout: restored });
  } catch (err) {
    console.error('Failed to restore landing page version:', err);
    res.status(500).json({ error: 'Failed to restore version' });
  }
});

// Admin: Reset landing page to default design
router.post('/admin/landing-page/reset', requireAuth, (req: Request, res: Response) => {
  try {
    const resetLayout = db.resetLandingPageLayout();
    res.json({ success: true, layout: resetLayout });
  } catch (err) {
    console.error('Failed to reset landing page:', err);
    res.status(500).json({ error: 'Failed to reset landing page' });
  }
});

export default router;
