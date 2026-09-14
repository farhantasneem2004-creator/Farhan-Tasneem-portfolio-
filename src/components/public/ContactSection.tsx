import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SiteSettings, SocialLink } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';
import { api } from '../../api.js';

interface ContactSectionProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
  prefilledSubject?: string;
  accentColor?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  socialLinks = [],
  prefilledSubject = '',
  accentColor
}) => {
  const accent = accentColor || settings?.accentColor || '#e5a93c';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (prefilledSubject) {
      setFormData((prev) => ({ ...prev, subject: `Inquiry: ${prefilledSubject}` }));
    }
  }, [prefilledSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to deliver message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Invitation & Direct Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px]" style={{ backgroundColor: accent }} />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
                  Let's Connect
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
                Have a project or opportunity in mind?
              </h2>

              <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed mb-8">
                Whether you wish to discuss software engineering, tournament platform development, commission poetry or technical illustration, feel free to send a message.
              </p>

              {/* Direct Info Blocks */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12151b] border border-[#1f2533]">
                  <div className="p-2 rounded-lg bg-[#181c25] text-amber-400" style={{ color: accent }}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6b7280] block font-medium">
                      Email Address
                    </span>
                    <a
                      href="mailto:farhantasneem2004@gmail.com"
                      className="text-sm font-medium text-[#e5e7eb] hover:text-white transition-colors"
                    >
                      farhantasneem2004@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12151b] border border-[#1f2533]">
                  <div className="p-2 rounded-lg bg-[#181c25] text-amber-400" style={{ color: accent }}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6b7280] block font-medium">
                      Phone / Mobile
                    </span>
                    <a
                      href="tel:+8801540345406"
                      className="text-sm font-medium text-[#e5e7eb] hover:text-white transition-colors"
                    >
                      +8801540345406
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12151b] border border-[#1f2533]">
                  <div className="p-2 rounded-lg bg-[#181c25] text-amber-400" style={{ color: accent }}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6b7280] block font-medium">
                      Location
                    </span>
                    <span className="text-sm font-medium text-[#e5e7eb]">
                      {settings.aboutLocation || 'Dhaka, Bangladesh'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links on bottom of left column */}
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6b7280] block mb-3 font-medium">
                Connect via Social Channels
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {(socialLinks || []).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-[#9ca3af] hover:text-white bg-[#12151b] border border-[#222732] hover:border-amber-500/40 transition-all"
                    aria-label={link.label}
                  >
                    <DynamicIcon name={link.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#11141c] border border-[#1f2533] shadow-xl">
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs sm:text-sm text-[#848ea0] mb-6">
                All submissions are delivered securely into the portfolio database.
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">Message Received</h4>
                    <p className="text-xs text-emerald-400/90 mt-0.5">
                      Thank you for reaching out! Farhan has received your note and will review it promptly.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-xs">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="contact-name">
                      Your Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="contact-email">
                      Your Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project inquiry / Collaboration / General note"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="contact-message">
                    Message <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe what you would like to discuss..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0c0e12] border border-[#232938] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563] transition-colors resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#0c0e12] transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
                  style={{ backgroundColor: accent }}
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
