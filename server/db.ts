import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type {
  SiteSettings,
  SocialLink,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Service,
  GalleryCategory,
  GalleryAlbum,
  GalleryImage,
  ContactMessage,
  CVVersion,
  LandingPageLayout,
  LandingPageVersion
} from '../src/types.js';
import { createDefaultLandingPageLayout } from '../src/components/admin/landing-page-editor/defaultLayout.js';

interface DatabaseSchema {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  services: Service[];
  galleryCategories: GalleryCategory[];
  galleryAlbums: GalleryAlbum[];
  galleryImages: GalleryImage[];
  contactMessages: ContactMessage[];
  cvVersions: CVVersion[];
  landingPageDraft?: LandingPageLayout;
  landingPagePublished?: LandingPageLayout;
  landingPageVersions?: LandingPageVersion[];
  admin: {
    email: string;
    passwordHash: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const DEFAULT_PASSWORD = 'AdminFarhan2026!';
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const DEFAULT_DATA: DatabaseSchema = {
  admin: {
    email: 'farhantasneem2004@gmail.com',
    passwordHash: DEFAULT_PASSWORD_HASH
  },
  settings: {
    websiteTitle: 'Farhan Tasneem | CSE Student • Developer • Creative',
    heroHeadingFirst: 'FARHAN',
    heroHeadingAccent: 'TASNEEM',
    heroSubtitle: 'CSE Student • Developer • Creative',
    heroDescription:
      "I'm a Computer Science and Engineering student with a passion for programming, web development, creative writing, technical visualization and building meaningful digital projects.",
    heroImage: '/farhan_hero_portrait.jpg',
    heroImageCrop: 'cover',
    heroImagePosition: 'center',
    heroImageStyle: 'editorial',
    heroBgElement: true,
    heroBgShape: 'frame_accent',
    heroBadgeText: 'Build • Learn • Create',
    heroEyebrow: "Hello, I'm",
    accentColor: '#e5a93c',
    publicCvDownload: true,
    customCvPdfUrl: '',
    seoTitle: 'Farhan Tasneem | CSE Student • Developer • Creative',
    seoDescription:
      'Personal portfolio and creative case studies of Farhan Tasneem, a CSE student, developer, and creative.',
    aboutPhoto: '/src/assets/images/workspace_editorial_1789381777509.jpg',
    aboutHeading: 'Turning ideas into meaningful digital experiences.',
    aboutShortBio:
      "I'm Farhan Tasneem, a passionate Computer Science and Engineering student. I enjoy solving problems through code, exploring new technologies, and creating things that make an impact.",
    aboutDetailedBio:
      'Alongside core software development and algorithms, my interests bridge both analytical engineering and creative mediums—ranging from technical and machinery illustration to custom scriptwriting and poetry. I believe that thoughtful design and clear architecture make technology truly human.',
    aboutLocation: 'Dhaka, Bangladesh',
    aboutCurrentFocus: 'Web Software Architecture, Algorithmic Problem Solving, Technical Visualization',
    aboutInterests: 'Software Engineering, Algorithms, Creative Writing, Technical Illustration, Photography',
    sectionVisibility: {
      about: true,
      skills: true,
      projects: true,
      experience: false, // Hidden by default if empty to satisfy rule: "If there is no experience, hide the public section. Do not create fake experience."
      education: true,
      certifications: false, // Hidden by default if empty to satisfy rule: "Do not invent certifications. If there are none, hide."
      services: true,
      gallery: true,
      contact: true
    },
    highlights: [
      { id: 'h1', icon: 'GraduationCap', label: 'CSE Student', order: 1 },
      { id: 'h2', icon: 'Code2', label: 'Developer', order: 2 },
      { id: 'h3', icon: 'PenTool', label: 'Creative', order: 3 },
      { id: 'h4', icon: 'Lightbulb', label: 'Problem Solver', order: 4 }
    ]
  },
  socialLinks: [
    { id: 's1', platform: 'GitHub', label: 'GitHub', url: 'https://github.com', order: 1, visible: true },
    { id: 's2', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com', order: 2, visible: true },
    { id: 's3', platform: 'Fiverr', label: 'Fiverr', url: 'https://fiverr.com', order: 3, visible: true },
    { id: 's4', platform: 'Facebook', label: 'Facebook', url: 'https://facebook.com', order: 4, visible: true },
    { id: 's5', platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com', order: 5, visible: true },
    { id: 's6', platform: 'YouTube', label: 'YouTube', url: 'https://youtube.com', order: 6, visible: true },
    { id: 's7', platform: 'X', label: 'X (Twitter)', url: 'https://x.com', order: 7, visible: true }
  ],
  skills: [
    { id: 'sk1', name: 'C / C++', category: 'Programming', description: 'Systems & core algorithm implementation', level: 'Advanced', percentage: 90, order: 1, visible: true },
    { id: 'sk2', name: 'Python', category: 'Programming', description: 'Scripting, tooling and algorithmic exploration', level: 'Proficient', percentage: 85, order: 2, visible: true },
    { id: 'sk3', name: 'JavaScript & TypeScript', category: 'Programming', description: 'Modern typed full-stack engineering', level: 'Advanced', percentage: 88, order: 3, visible: true },
    { id: 'sk4', name: 'React & Next.js', category: 'Web Development', description: 'Component-driven reactive user interfaces', level: 'Advanced', percentage: 88, order: 4, visible: true },
    { id: 'sk5', name: 'Node.js & Express', category: 'Web Development', description: 'REST APIs, server-side middleware and authentication', level: 'Proficient', percentage: 82, order: 5, visible: true },
    { id: 'sk6', name: 'PostgreSQL & Databases', category: 'Web Development', description: 'Relational data modeling, indexing and schema design', level: 'Proficient', percentage: 80, order: 6, visible: true },
    { id: 'sk7', name: 'Tailwind CSS', category: 'Web Development', description: 'High-precision responsive visual design and layout systems', level: 'Expert', percentage: 92, order: 7, visible: true },
    { id: 'sk8', name: 'Data Structures & Algorithms', category: 'Algorithms & Data Structures', description: 'Trees, graphs, dynamic programming, sorting and search complexity', level: 'Advanced', percentage: 86, order: 8, visible: true },
    { id: 'sk9', name: 'Competitive Problem Solving', category: 'Problem Solving', description: 'Mathematical reasoning and competitive algorithmic contests', level: 'Proficient', percentage: 82, order: 9, visible: true },
    { id: 'sk10', name: 'Technical / Machinery Illustration', category: 'Technical Illustration', description: 'Isometric diagrams, schematic layout and structural line art', level: 'Advanced', percentage: 88, order: 10, visible: true },
    { id: 'sk11', name: 'Creative Writing & Short Scripts', category: 'Creative Skills', description: 'Narrative worldbuilding, poetic composition and dialogue structuring', level: 'Advanced', percentage: 90, order: 11, visible: true }
  ],
  projects: [
    {
      id: 'p1',
      name: 'eFuture Cup Manager',
      shortDescription:
        'A tournament management web application for creating and managing tournaments, participants, matches, tables and brackets.',
      detailedDescription:
        'eFuture Cup Manager is an end-to-end tournament operations and bracket orchestration web platform. Designed to eliminate manual administrative overhead, it provides automated knockout bracket seeding, round-robin table calculations, scheduled fixture generation, real-time match outcome recording, and participant profile rosters.',
      mainImage: '/src/assets/images/efuture_cup_project_1789381795595.jpg',
      additionalImages: [],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      category: 'Web Application',
      githubUrl: 'https://github.com/farhantasneem/efuture-cup-manager',
      liveDemoUrl: 'https://efuturecup.example.com',
      date: '2024 - Present',
      featured: true,
      displayOrder: 1,
      visible: true
    }
  ],
  experiences: [], // Zero fake jobs: user prompt states "If there is no experience, hide the public section. Do not create fake experience."
  education: [
    {
      id: 'edu-diu',
      institution: 'Daffodil International University',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      department: 'Department of Computer Science and Engineering',
      startYear: '2025',
      endYear: 'Present',
      current: true,
      grade: 'Currently Enrolled',
      description:
        'Undergraduate studies in Computer Science and Engineering. Academic coursework emphasizing Artificial Intelligence, Data Science, Software Development, Data Structures, Algorithms, and collaborative technical projects.',
      order: 1,
      visible: true
    },
    {
      id: 'edu-hsc',
      institution: 'BAF Shaheen College Shamshernagar',
      degree: 'Higher Secondary Certificate (HSC)',
      department: 'Science Division',
      startYear: '2022',
      endYear: '2023',
      current: false,
      grade: 'GPA 5.00 / 5.00',
      description:
        'Graduated with highest academic distinction (GPA 5.00) in Science division. Advanced coursework in Higher Mathematics, Physics, Chemistry, and Information & Communication Technology.',
      order: 2,
      visible: true
    },
    {
      id: 'edu-ssc',
      institution: 'Bishaw Zakir Monzil Govt. High School',
      degree: 'Secondary School Certificate (SSC)',
      department: 'Science Division',
      startYear: '2020',
      endYear: '2021',
      current: false,
      grade: 'GPA 5.00 / 5.00',
      description:
        'Completed Secondary School Certificate with a perfect score (GPA 5.00). Fundamental studies in General Science, Mathematics, and Computer Studies.',
      order: 3,
      visible: true
    }
  ],
  certifications: [
    {
      id: 'cert-ai-prompt',
      name: 'AI Prompt Engineering Course',
      issuer: 'NetCom Learning – in collaboration with Microsoft',
      date: '2024 - 2025',
      credentialId: 'NETCOM-MSFT-AIPE',
      description:
        'Specialized training covering Generative AI fundamentals, context-aware prompt architecture, iterative refinement, system instructions, and modern productivity tooling with Microsoft.',
      order: 1,
      visible: true
    }
  ],
  services: [
    {
      id: 'srv1',
      name: 'Custom Poetry',
      shortDescription: 'Evocative, tailored poetic compositions crafted for meaningful occasions and conceptual projects.',
      detailedDescription:
        'Original written poetry shaped by rhythm, tone, and bespoke themes. Suitable for personal tributes, artistic books, creative collaborations, and reflective publications.',
      icon: 'Feather',
      ctaText: 'Commission a Poem',
      order: 1,
      visible: true
    },
    {
      id: 'srv2',
      name: 'Technical / Machinery Illustration',
      shortDescription: 'Precise isometric, vector line-art, and diagrammatic visuals of mechanical assemblies and hardware.',
      detailedDescription:
        'Detailed visual diagrams that make complex engineering concepts, machinery parts, and technical architectures clear, aesthetically refined, and accessible.',
      icon: 'Compass',
      ctaText: 'Request Illustration',
      order: 2,
      visible: true
    },
    {
      id: 'srv3',
      name: 'Short Script Writing',
      shortDescription: 'Character-driven dialogue and structured narrative storytelling for visual media and short films.',
      detailedDescription:
        'Writing compelling short screenplay concepts, visual outlines, and dialogues designed for cinematic shorts, voiceovers, and thematic storytelling.',
      icon: 'FileText',
      ctaText: 'Discuss a Script',
      order: 3,
      visible: true
    }
  ],
  galleryCategories: [
    { id: 'cat-univ', name: 'University', order: 1, visible: true },
    { id: 'cat-comp', name: 'Competitions', order: 2, visible: true },
    { id: 'cat-proj', name: 'Projects', order: 3, visible: true },
    { id: 'cat-travel', name: 'Travel', order: 4, visible: true },
    { id: 'cat-photo', name: 'Photography', order: 5, visible: true },
    { id: 'cat-events', name: 'Events', order: 6, visible: true },
    { id: 'cat-pers', name: 'Personal', order: 7, visible: true }
  ],
  galleryAlbums: [
    {
      id: 'alb-dhaka',
      title: 'Dhaka Trip',
      description: 'Streets, architectural textures, and urban atmospheres captured across the city.',
      coverImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      date: '2024',
      location: 'Dhaka',
      categoryId: 'cat-travel',
      order: 1,
      visible: true
    },
    {
      id: 'alb-comp',
      title: 'University Competition',
      description: 'Coding hackathons, collaborative team sessions, and problem solving events.',
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      date: '2024',
      location: 'Campus Tech Hall',
      categoryId: 'cat-comp',
      order: 2,
      visible: true
    },
    {
      id: 'alb-travel26',
      title: 'Travel 2026',
      description: 'Landscape and natural horizon studies across serene rural and coastal routes.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      date: '2026',
      location: 'Bengal Coast',
      categoryId: 'cat-travel',
      order: 3,
      visible: true
    },
    {
      id: 'alb-proj',
      title: 'Project Exhibition',
      description: 'Showcasing engineering builds, interface designs, and interactive student displays.',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      date: '2024',
      location: 'Auditorium',
      categoryId: 'cat-proj',
      order: 4,
      visible: true
    }
  ],
  galleryImages: [
    {
      id: 'g-ws',
      title: 'Studio Workspace & Code Sessions',
      caption: 'Quiet morning focus with fresh code and coffee.',
      url: '/src/assets/images/workspace_editorial_1789381777509.jpg',
      categoryId: 'cat-photo',
      albumId: 'alb-proj',
      aspectRatio: 'landscape',
      date: '2024',
      location: 'Desk Studio',
      order: 1,
      visible: true
    },
    {
      id: 'g-1',
      title: 'Algorithmic Workshop',
      caption: 'Whiteboarding logic diagrams during intensive competition prep.',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-comp',
      albumId: 'alb-comp',
      aspectRatio: 'landscape',
      date: '2024',
      location: 'University Lab',
      order: 2,
      visible: true
    },
    {
      id: 'g-2',
      title: 'Historic Brick Archways',
      caption: 'Architectural perspectives framing morning sunlight.',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-travel',
      albumId: 'alb-dhaka',
      aspectRatio: 'portrait',
      date: '2024',
      location: 'Old Dhaka',
      order: 3,
      visible: true
    },
    {
      id: 'g-3',
      title: 'Technical Schematics Review',
      caption: 'Inspecting isometric machinery drawings and line-art drafts.',
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-proj',
      albumId: 'alb-proj',
      aspectRatio: 'landscape',
      date: '2024',
      location: 'Design Studio',
      order: 4,
      visible: true
    },
    {
      id: 'g-4',
      title: 'Riverfront Sunset Geometry',
      caption: 'Long shadows across the water during golden hour.',
      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-travel',
      albumId: 'alb-travel26',
      aspectRatio: 'landscape',
      date: '2026',
      location: 'Riverbank',
      order: 5,
      visible: true
    },
    {
      id: 'g-5',
      title: 'Campus Quadrangle in Spring',
      caption: 'Greenery against university red brick walls between lectures.',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-univ',
      albumId: 'alb-comp',
      aspectRatio: 'portrait',
      date: '2024',
      location: 'University Campus',
      order: 6,
      visible: true
    }
  ],
  contactMessages: [],
  cvVersions: [
    {
      id: 'cv-general',
      title: 'General CV',
      template: 'modern',
      length: 'two-page',
      sections: {
        profilePicture: true,
        about: true,
        contact: true,
        skills: true,
        projects: true,
        experience: true,
        education: true,
        certifications: true,
        services: true,
        socialLinks: true
      },
      sectionOrder: ['about', 'education', 'skills', 'projects', 'services', 'contact'],
      customTitle: 'Farhan Tasneem — Curriculum Vitae',
      customSummary:
        'CSE Student and developer with solid foundations in algorithmic problem solving, web technologies, and creative visualization.',
      isDefault: true
    },
    {
      id: 'cv-software',
      title: 'Software Development CV',
      template: 'classic',
      length: 'one-page',
      sections: {
        profilePicture: false,
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
      sectionOrder: ['skills', 'projects', 'education', 'contact'],
      customTitle: 'Farhan Tasneem — Software Development CV',
      customSummary:
        'Computer Science and Engineering student specializing in full-stack web applications, TypeScript, C++, and competitive algorithms.'
    },
    {
      id: 'cv-freelance',
      title: 'Freelance CV',
      template: 'modern',
      length: 'one-page',
      sections: {
        profilePicture: true,
        about: true,
        contact: true,
        skills: true,
        projects: true,
        experience: false,
        education: true,
        certifications: false,
        services: true,
        socialLinks: true
      },
      sectionOrder: ['services', 'projects', 'skills', 'contact'],
      customTitle: 'Farhan Tasneem — Freelance & Creative Services',
      customSummary:
        'Bespoke web development, technical illustration, and scriptwriting tailored for clients seeking precise, high-craft deliverables.'
    },
    {
      id: 'cv-academic',
      title: 'Academic CV',
      template: 'compact',
      length: 'two-page',
      sections: {
        profilePicture: false,
        about: true,
        contact: true,
        skills: true,
        projects: true,
        experience: false,
        education: true,
        certifications: true,
        services: false,
        socialLinks: true
      },
      sectionOrder: ['education', 'skills', 'projects', 'about', 'contact'],
      customTitle: 'Farhan Tasneem — Academic Profile',
      customSummary:
        'Undergraduate CSE researcher with coursework focus in discrete mathematics, algorithms, and distributed systems.'
    }
  ]
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed reading database.json, resetting to defaults', err);
        this.data = DEFAULT_DATA;
        this.save();
      }
    } else {
      this.data = DEFAULT_DATA;
      this.save();
    }

    // Ensure landing page fields exist
    this.ensureLandingPageData();
  }

  private ensureLandingPageData() {
    let modified = false;
    if (!this.data.landingPagePublished) {
      this.data.landingPagePublished = createDefaultLandingPageLayout();
      modified = true;
    }
    if (!this.data.landingPageDraft) {
      this.data.landingPageDraft = JSON.parse(JSON.stringify(this.data.landingPagePublished));
      modified = true;
    }
    if (!this.data.landingPageVersions || this.data.landingPageVersions.length === 0) {
      this.data.landingPageVersions = [
        {
          id: 'ver_initial_1',
          version: 1,
          name: 'Original Portfolio Hero Layout',
          publishedAt: new Date().toISOString(),
          publishedBy: this.data.admin?.email || 'farhantasneem2004@gmail.com',
          elementCount: this.data.landingPagePublished.elements.length,
          layout: JSON.parse(JSON.stringify(this.data.landingPagePublished))
        }
      ];
      modified = true;
    }
    if (modified) {
      this.save();
    }
  }

  public reload() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed reading database.json during reload', err);
      }
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed writing to database.json', err);
    }
  }

  // Settings
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
    return this.data.settings;
  }

  // Admin Auth
  getAdmin() {
    return this.data.admin;
  }

  updateAdminPassword(newPasswordHash: string) {
    this.data.admin.passwordHash = newPasswordHash;
    this.save();
  }

  updateAdminEmail(email: string) {
    this.data.admin.email = email;
    this.save();
  }

  // Social Links
  getSocialLinks(): SocialLink[] {
    return [...this.data.socialLinks].sort((a, b) => a.order - b.order);
  }

  updateSocialLinks(links: SocialLink[]): SocialLink[] {
    this.data.socialLinks = links;
    this.save();
    return this.getSocialLinks();
  }

  // Skills
  getSkills(): Skill[] {
    return [...this.data.skills].sort((a, b) => a.order - b.order);
  }

  addSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = { ...skill, id: `sk_${Date.now()}` };
    this.data.skills.push(newSkill);
    this.save();
    return newSkill;
  }

  updateSkill(id: string, update: Partial<Skill>): Skill | null {
    const idx = this.data.skills.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.skills[idx] = { ...this.data.skills[idx], ...update };
    this.save();
    return this.data.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const before = this.data.skills.length;
    this.data.skills = this.data.skills.filter((s) => s.id !== id);
    if (this.data.skills.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Projects
  getProjects(): Project[] {
    return [...this.data.projects].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = { ...project, id: `proj_${Date.now()}` };
    this.data.projects.push(newProject);
    this.save();
    return newProject;
  }

  updateProject(id: string, update: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...update };
    this.save();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const before = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Experiences
  getExperiences(): Experience[] {
    return [...this.data.experiences].sort((a, b) => a.order - b.order);
  }

  addExperience(exp: Omit<Experience, 'id'>): Experience {
    const newExp: Experience = { ...exp, id: `exp_${Date.now()}` };
    this.data.experiences.push(newExp);
    this.save();
    return newExp;
  }

  updateExperience(id: string, update: Partial<Experience>): Experience | null {
    const idx = this.data.experiences.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.data.experiences[idx] = { ...this.data.experiences[idx], ...update };
    this.save();
    return this.data.experiences[idx];
  }

  deleteExperience(id: string): boolean {
    const before = this.data.experiences.length;
    this.data.experiences = this.data.experiences.filter((e) => e.id !== id);
    if (this.data.experiences.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Education
  getEducation(): Education[] {
    return [...this.data.education].sort((a, b) => a.order - b.order);
  }

  addEducation(edu: Omit<Education, 'id'>): Education {
    const newEdu: Education = { ...edu, id: `edu_${Date.now()}` };
    this.data.education.push(newEdu);
    this.save();
    return newEdu;
  }

  updateEducation(id: string, update: Partial<Education>): Education | null {
    const idx = this.data.education.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.data.education[idx] = { ...this.data.education[idx], ...update };
    this.save();
    return this.data.education[idx];
  }

  deleteEducation(id: string): boolean {
    const before = this.data.education.length;
    this.data.education = this.data.education.filter((e) => e.id !== id);
    if (this.data.education.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Certifications
  getCertifications(): Certification[] {
    return [...this.data.certifications].sort((a, b) => a.order - b.order);
  }

  addCertification(cert: Omit<Certification, 'id'>): Certification {
    const newCert: Certification = { ...cert, id: `cert_${Date.now()}` };
    this.data.certifications.push(newCert);
    this.save();
    return newCert;
  }

  updateCertification(id: string, update: Partial<Certification>): Certification | null {
    const idx = this.data.certifications.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.certifications[idx] = { ...this.data.certifications[idx], ...update };
    this.save();
    return this.data.certifications[idx];
  }

  deleteCertification(id: string): boolean {
    const before = this.data.certifications.length;
    this.data.certifications = this.data.certifications.filter((c) => c.id !== id);
    if (this.data.certifications.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Services
  getServices(): Service[] {
    return [...this.data.services].sort((a, b) => a.order - b.order);
  }

  addService(srv: Omit<Service, 'id'>): Service {
    const newSrv: Service = { ...srv, id: `srv_${Date.now()}` };
    this.data.services.push(newSrv);
    this.save();
    return newSrv;
  }

  updateService(id: string, update: Partial<Service>): Service | null {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...update };
    this.save();
    return this.data.services[idx];
  }

  deleteService(id: string): boolean {
    const before = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Gallery Categories & Albums & Images
  getGalleryCategories(): GalleryCategory[] {
    return [...this.data.galleryCategories].sort((a, b) => a.order - b.order);
  }

  addGalleryCategory(cat: Omit<GalleryCategory, 'id'>): GalleryCategory {
    const newCat: GalleryCategory = { ...cat, id: `cat_${Date.now()}` };
    this.data.galleryCategories.push(newCat);
    this.save();
    return newCat;
  }

  updateGalleryCategory(id: string, update: Partial<GalleryCategory>): GalleryCategory | null {
    const idx = this.data.galleryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.galleryCategories[idx] = { ...this.data.galleryCategories[idx], ...update };
    this.save();
    return this.data.galleryCategories[idx];
  }

  deleteGalleryCategory(id: string): boolean {
    const before = this.data.galleryCategories.length;
    this.data.galleryCategories = this.data.galleryCategories.filter((c) => c.id !== id);
    if (this.data.galleryCategories.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  getGalleryAlbums(): GalleryAlbum[] {
    return [...this.data.galleryAlbums].sort((a, b) => a.order - b.order);
  }

  addGalleryAlbum(alb: Omit<GalleryAlbum, 'id'>): GalleryAlbum {
    const newAlb: GalleryAlbum = { ...alb, id: `alb_${Date.now()}` };
    this.data.galleryAlbums.push(newAlb);
    this.save();
    return newAlb;
  }

  updateGalleryAlbum(id: string, update: Partial<GalleryAlbum>): GalleryAlbum | null {
    const idx = this.data.galleryAlbums.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.galleryAlbums[idx] = { ...this.data.galleryAlbums[idx], ...update };
    this.save();
    return this.data.galleryAlbums[idx];
  }

  deleteGalleryAlbum(id: string): boolean {
    const before = this.data.galleryAlbums.length;
    this.data.galleryAlbums = this.data.galleryAlbums.filter((a) => a.id !== id);
    if (this.data.galleryAlbums.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  getGalleryImages(): GalleryImage[] {
    return [...this.data.galleryImages].sort((a, b) => a.order - b.order);
  }

  addGalleryImage(img: Omit<GalleryImage, 'id'>): GalleryImage {
    const newImg: GalleryImage = { ...img, id: `img_${Date.now()}` };
    this.data.galleryImages.push(newImg);
    this.save();
    return newImg;
  }

  updateGalleryImage(id: string, update: Partial<GalleryImage>): GalleryImage | null {
    const idx = this.data.galleryImages.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.galleryImages[idx] = { ...this.data.galleryImages[idx], ...update };
    this.save();
    return this.data.galleryImages[idx];
  }

  deleteGalleryImage(id: string): boolean {
    const before = this.data.galleryImages.length;
    this.data.galleryImages = this.data.galleryImages.filter((i) => i.id !== id);
    if (this.data.galleryImages.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return [...this.data.contactMessages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addContactMessage(msg: { name: string; email: string; subject: string; message: string }): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  markMessageRead(id: string, read = true): boolean {
    const m = this.data.contactMessages.find((item) => item.id === id);
    if (m) {
      m.read = read;
      this.save();
      return true;
    }
    return false;
  }

  deleteContactMessage(id: string): boolean {
    const before = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter((m) => m.id !== id);
    if (this.data.contactMessages.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // CV Versions
  getCVVersions(): CVVersion[] {
    return this.data.cvVersions;
  }

  addCVVersion(ver: Omit<CVVersion, 'id'>): CVVersion {
    const newVer: CVVersion = { ...ver, id: `cv_${Date.now()}` };
    this.data.cvVersions.push(newVer);
    this.save();
    return newVer;
  }

  updateCVVersion(id: string, update: Partial<CVVersion>): CVVersion | null {
    const idx = this.data.cvVersions.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.data.cvVersions[idx] = { ...this.data.cvVersions[idx], ...update };
    this.save();
    return this.data.cvVersions[idx];
  }

  deleteCVVersion(id: string): boolean {
    const before = this.data.cvVersions.length;
    this.data.cvVersions = this.data.cvVersions.filter((v) => v.id !== id);
    if (this.data.cvVersions.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Stats for Admin Dashboard
  getStats() {
    return {
      projectsCount: this.data.projects.length,
      skillsCount: this.data.skills.length,
      experiencesCount: this.data.experiences.length,
      certificationsCount: this.data.certifications.length,
      galleryImagesCount: this.data.galleryImages.length,
      unreadMessagesCount: this.data.contactMessages.filter((m) => !m.read).length,
      totalMessagesCount: this.data.contactMessages.length
    };
  }

  // Visual Landing Page Editor Methods
  getLandingPagePublished(): LandingPageLayout {
    this.ensureLandingPageData();
    return this.data.landingPagePublished || createDefaultLandingPageLayout();
  }

  getLandingPageDraft(): LandingPageLayout {
    this.ensureLandingPageData();
    return this.data.landingPageDraft || createDefaultLandingPageLayout();
  }

  saveLandingPageDraft(layout: LandingPageLayout): LandingPageLayout {
    this.ensureLandingPageData();
    const updated: LandingPageLayout = {
      ...layout,
      updatedAt: new Date().toISOString()
    };
    this.data.landingPageDraft = updated;
    this.save();
    return updated;
  }

  publishLandingPage(publishedBy: string, name?: string): { published: LandingPageLayout; version: LandingPageVersion } {
    this.ensureLandingPageData();
    const currentDraft = this.data.landingPageDraft || createDefaultLandingPageLayout();
    const newVersionNumber = (this.data.landingPageVersions?.length || 0) + 1;

    const publishedLayout: LandingPageLayout = {
      ...JSON.parse(JSON.stringify(currentDraft)),
      version: newVersionNumber,
      updatedAt: new Date().toISOString()
    };

    const newVersion: LandingPageVersion = {
      id: `ver_${Date.now()}_${newVersionNumber}`,
      version: newVersionNumber,
      name: name || `Published Version ${newVersionNumber}`,
      publishedAt: new Date().toISOString(),
      publishedBy: publishedBy || 'Administrator',
      elementCount: publishedLayout.elements.length,
      layout: JSON.parse(JSON.stringify(publishedLayout))
    };

    this.data.landingPagePublished = publishedLayout;
    this.data.landingPageDraft = JSON.parse(JSON.stringify(publishedLayout));
    if (!this.data.landingPageVersions) {
      this.data.landingPageVersions = [];
    }
    this.data.landingPageVersions.unshift(newVersion);
    // Keep last 30 versions
    if (this.data.landingPageVersions.length > 30) {
      this.data.landingPageVersions = this.data.landingPageVersions.slice(0, 30);
    }

    this.save();
    return { published: publishedLayout, version: newVersion };
  }

  getLandingPageVersions(): LandingPageVersion[] {
    this.ensureLandingPageData();
    return this.data.landingPageVersions || [];
  }

  restoreLandingPageVersion(versionId: string): LandingPageLayout | null {
    this.ensureLandingPageData();
    const target = this.data.landingPageVersions?.find((v) => v.id === versionId);
    if (!target) return null;

    const restoredLayout: LandingPageLayout = JSON.parse(JSON.stringify(target.layout));
    restoredLayout.updatedAt = new Date().toISOString();
    this.data.landingPageDraft = restoredLayout;
    this.save();
    return restoredLayout;
  }

  resetLandingPageLayout(): LandingPageLayout {
    const defaultLayout = createDefaultLandingPageLayout();
    this.data.landingPageDraft = JSON.parse(JSON.stringify(defaultLayout));
    this.save();
    return this.data.landingPageDraft;
  }
}

export const db = new Database();
