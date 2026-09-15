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
} from './types.js';

export interface PublicPortfolioData {
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
  landingPage?: LandingPageLayout;
}

export interface AdminStats {
  projectsCount: number;
  skillsCount: number;
  experiencesCount: number;
  certificationsCount: number;
  galleryImagesCount: number;
  unreadMessagesCount: number;
  totalMessagesCount: number;
}

const TOKEN_KEY = 'farhan_portfolio_admin_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY)
};

const getAuthHeaders = () => {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Public
  async getPublicPortfolio(): Promise<PublicPortfolioData> {
    const res = await fetch('/api/public/portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
  },
  async getPublicData(): Promise<PublicPortfolioData> {
    return this.getPublicPortfolio();
  },

  async sendContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send message');
    return result;
  },

  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    authStorage.setToken(result.token);
    return result;
  },

  async checkAuth() {
    const token = authStorage.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        authStorage.clearToken();
        return null;
      }
      return await res.json();
    } catch {
      authStorage.clearToken();
      return null;
    }
  },

  logout() {
    authStorage.clearToken();
  },

  isAuthenticated(): boolean {
    return !!authStorage.getToken();
  },

  async updateCredentials(data: { email?: string; currentPassword?: string; newPassword?: string }) {
    const res = await fetch('/api/auth/update-credentials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update credentials');
    return result;
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to get stats');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/admin/settings', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to get settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Social Links
  async getSocialLinks(): Promise<SocialLink[]> {
    const res = await fetch('/api/admin/social-links', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch social links');
    return res.json();
  },

  async updateSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    const res = await fetch('/api/admin/social-links', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(links)
    });
    if (!res.ok) throw new Error('Failed to update social links');
    return res.json();
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const res = await fetch('/api/admin/skills', { headers: getAuthHeaders() });
    return res.json();
  },
  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    return res.json();
  },
  async updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    return res.json();
  },
  async deleteSkill(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/admin/projects', { headers: getAuthHeaders() });
    return res.json();
  },
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    return res.json();
  },
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    return res.json();
  },
  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const res = await fetch('/api/admin/experiences', { headers: getAuthHeaders() });
    return res.json();
  },
  async createExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const res = await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(exp)
    });
    return res.json();
  },
  async updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(exp)
    });
    return res.json();
  },
  async deleteExperience(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Education
  async getEducation(): Promise<Education[]> {
    const res = await fetch('/api/admin/education', { headers: getAuthHeaders() });
    return res.json();
  },
  async createEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    const res = await fetch('/api/admin/education', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(edu)
    });
    return res.json();
  },
  async updateEducation(id: string, edu: Partial<Education>): Promise<Education> {
    const res = await fetch(`/api/admin/education/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(edu)
    });
    return res.json();
  },
  async deleteEducation(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/education/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    const res = await fetch('/api/admin/certifications', { headers: getAuthHeaders() });
    return res.json();
  },
  async createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const res = await fetch('/api/admin/certifications', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cert)
    });
    return res.json();
  },
  async updateCertification(id: string, cert: Partial<Certification>): Promise<Certification> {
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cert)
    });
    return res.json();
  },
  async deleteCertification(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Services
  async getServices(): Promise<Service[]> {
    const res = await fetch('/api/admin/services', { headers: getAuthHeaders() });
    return res.json();
  },
  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    return res.json();
  },
  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    return res.json();
  },
  async deleteService(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Gallery
  async getGalleryCategories(): Promise<GalleryCategory[]> {
    const res = await fetch('/api/admin/gallery/categories', { headers: getAuthHeaders() });
    return res.json();
  },
  async createGalleryCategory(cat: Omit<GalleryCategory, 'id'>): Promise<GalleryCategory> {
    const res = await fetch('/api/admin/gallery/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    return res.json();
  },
  async updateGalleryCategory(id: string, cat: Partial<GalleryCategory>): Promise<GalleryCategory> {
    const res = await fetch(`/api/admin/gallery/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    return res.json();
  },
  async deleteGalleryCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/gallery/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  async getGalleryAlbums(): Promise<GalleryAlbum[]> {
    const res = await fetch('/api/admin/gallery/albums', { headers: getAuthHeaders() });
    return res.json();
  },
  async createGalleryAlbum(alb: Omit<GalleryAlbum, 'id'>): Promise<GalleryAlbum> {
    const res = await fetch('/api/admin/gallery/albums', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(alb)
    });
    return res.json();
  },
  async updateGalleryAlbum(id: string, alb: Partial<GalleryAlbum>): Promise<GalleryAlbum> {
    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(alb)
    });
    return res.json();
  },
  async deleteGalleryAlbum(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  async getGalleryImages(): Promise<GalleryImage[]> {
    const res = await fetch('/api/admin/gallery/images', { headers: getAuthHeaders() });
    return res.json();
  },
  async createGalleryImage(img: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    const res = await fetch('/api/admin/gallery/images', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(img)
    });
    return res.json();
  },
  async updateGalleryImage(id: string, img: Partial<GalleryImage>): Promise<GalleryImage> {
    const res = await fetch(`/api/admin/gallery/images/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(img)
    });
    return res.json();
  },
  async deleteGalleryImage(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/gallery/images/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/admin/messages', { headers: getAuthHeaders() });
    return res.json();
  },
  async getContactMessages(): Promise<ContactMessage[]> {
    return this.getMessages();
  },
  async markMessageRead(id: string, read = true): Promise<boolean> {
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read })
    });
    const data = await res.json();
    return data.success;
  },
  async deleteMessage(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // CV Versions
  async getCVVersions(): Promise<CVVersion[]> {
    const res = await fetch('/api/admin/cv-versions', { headers: getAuthHeaders() });
    return res.json();
  },
  async createCVVersion(ver: Omit<CVVersion, 'id'>): Promise<CVVersion> {
    const res = await fetch('/api/admin/cv-versions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ver)
    });
    return res.json();
  },
  async updateCVVersion(id: string, ver: Partial<CVVersion>): Promise<CVVersion> {
    const res = await fetch(`/api/admin/cv-versions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(ver)
    });
    return res.json();
  },
  async deleteCVVersion(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/cv-versions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Upload File
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = authStorage.getToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  // Landing Page Visual Editor API
  async getPublishedLandingPage(): Promise<LandingPageLayout> {
    const res = await fetch('/api/public/landing-page');
    if (!res.ok) throw new Error('Failed to fetch published landing page');
    return res.json();
  },

  async getDraftLandingPage(): Promise<LandingPageLayout> {
    const res = await fetch('/api/admin/landing-page/draft', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch draft landing page');
    return res.json();
  },

  async saveDraftLandingPage(layout: LandingPageLayout): Promise<LandingPageLayout> {
    const res = await fetch('/api/admin/landing-page/draft', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(layout)
    });
    if (!res.ok) throw new Error('Failed to save draft landing page');
    return res.json();
  },

  async publishLandingPage(
    layout?: LandingPageLayout,
    name?: string
  ): Promise<{ success: boolean; published: LandingPageLayout; version: LandingPageVersion }> {
    const res = await fetch('/api/admin/landing-page/publish', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ layout, name })
    });
    if (!res.ok) throw new Error('Failed to publish landing page');
    return res.json();
  },

  async getLandingPageVersions(): Promise<LandingPageVersion[]> {
    const res = await fetch('/api/admin/landing-page/versions', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch versions');
    return res.json();
  },

  async restoreLandingPageVersion(versionId: string): Promise<LandingPageLayout> {
    const res = await fetch(`/api/admin/landing-page/restore-version/${versionId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restore version');
    return data.layout;
  },

  async resetLandingPage(): Promise<LandingPageLayout> {
    const res = await fetch('/api/admin/landing-page/reset', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset landing page');
    return data.layout;
  }
};
