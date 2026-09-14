export interface SiteSettings {
  websiteTitle: string;
  heroHeadingFirst: string;
  heroHeadingAccent: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageCrop: 'cover' | 'contain' | 'custom';
  heroImagePosition: string;
  heroImageStyle: 'editorial' | 'minimal' | 'framed' | 'transparent';
  heroBgElement: boolean;
  heroBgShape: 'frame_accent' | 'circle_glow' | 'grid_minimal' | 'none';
  heroBadgeText: string;
  heroEyebrow: string;
  accentColor: string;
  publicCvDownload: boolean;
  customCvPdfUrl: string;
  seoTitle: string;
  seoDescription: string;
  faviconUrl?: string;
  aboutPhoto: string;
  aboutHeading: string;
  aboutShortBio: string;
  aboutDetailedBio: string;
  aboutLocation: string;
  aboutCurrentFocus: string;
  aboutInterests: string;
  sectionVisibility: {
    about: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    education: boolean;
    certifications: boolean;
    services: boolean;
    gallery: boolean;
    contact: boolean;
  };
  highlights: HighlightItem[];
}

export interface HighlightItem {
  id: string;
  icon: string;
  label: string;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  visible: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  level: string; // e.g. 'Advanced', 'Proficient', 'Intermediate'
  percentage: number;
  icon?: string;
  order: number;
  visible: boolean;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  mainImage: string;
  additionalImages: string[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  videoUrl?: string;
  date: string;
  featured: boolean;
  displayOrder: number;
  order?: number;
  visible: boolean;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  type: 'Internship' | 'Freelance' | 'Employment' | 'Volunteer' | 'Project' | 'Other' | 'Full-time' | string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
  organizationLogo?: string;
  order: number;
  visible: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string;
  startYear: string;
  endYear: string;
  current: boolean;
  description: string;
  grade?: string;
  logo?: string;
  order: number;
  visible: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  certificateImage?: string;
  certificatePdf?: string;
  order: number;
  visible: boolean;
}

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  ctaText: string;
  externalUrl?: string;
  order: number;
  visible: boolean;
}

export interface GalleryCategory {
  id: string;
  name: string;
  order: number;
  visible: boolean;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date?: string;
  location?: string;
  categoryId?: string;
  order: number;
  visible: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption?: string;
  url: string;
  thumbnailUrl?: string;
  albumId?: string;
  categoryId: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  date: string;
  location?: string;
  order: number;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface CVVersion {
  id: string;
  title: string; // e.g. "General CV", "Software Development CV", "Freelance CV", "Academic CV"
  template: 'classic' | 'modern' | 'compact';
  length: 'one-page' | 'two-page' | 'extended';
  sections: {
    profilePicture: boolean;
    about: boolean;
    contact: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    education: boolean;
    certifications: boolean;
    services: boolean;
    socialLinks: boolean;
  };
  sectionOrder: string[];
  customTitle?: string;
  customSummary?: string;
  isDefault?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
