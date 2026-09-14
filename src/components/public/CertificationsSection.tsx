import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import type { Certification } from '../../types.js';

interface CertificationsSectionProps {
  certifications?: Certification[];
  accentColor?: string;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications = [], accentColor = '#e5a93c' }) => {
  const visibleCerts = (certifications || []).filter((c) => c && c.visible);
  // Strictly enforce user prompt rule: "If none, hide the public section. Do not invent certifications."
  if (visibleCerts.length === 0) return null;

  return (
    <section id="certifications" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Credentials
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Certifications & Verified Learning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCerts.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#181c25] text-amber-400" style={{ color: accentColor }}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-white">{cert.name}</h3>
                      <span className="text-xs text-[#9ca3af]">{cert.issuer}</span>
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded text-[#9ca3af] hover:text-white transition-colors"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {cert.description && (
                  <p className="text-xs text-[#848ea0] leading-relaxed mb-4">{cert.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#6b7280] pt-3 border-t border-[#1c2230] font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{cert.date}</span>
                </div>
                {cert.credentialId && <span>ID: {cert.credentialId}</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
