import React from 'react';
import { Award, ExternalLink, Calendar, FileText } from 'lucide-react';
import type { Certification } from '../../types.js';
import { ScrollReveal } from '../common/ScrollReveal.js';
import { Interactive3DCard } from '../common/Interactive3DCard.js';

interface CertificationsSectionProps {
  certifications?: Certification[];
  accentColor?: string;
  glowColor?: string;
  lightingIntensity?: number;
  enable3D?: boolean;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications = [],
  accentColor = '#e5a93c',
  glowColor,
  lightingIntensity = 1,
  enable3D = true
}) => {
  const visibleCerts = (certifications || []).filter((c) => c && c.visible);
  // Strictly enforce user prompt rule: "If none, hide the public section. Do not invent certifications."
  if (visibleCerts.length === 0) return null;

  const activeGlow = glowColor || accentColor;

  return (
    <section id="certifications" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <ScrollReveal delay={50}>
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
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCerts.map((cert, index) => (
            <ScrollReveal key={cert.id} delay={100 * (index + 1)}>
              <Interactive3DCard
                glowColor={activeGlow}
                intensity={lightingIntensity}
                disabled={!enable3D}
                className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] flex flex-col justify-between"
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

                    <div className="flex items-center gap-1.5">
                      {cert.certificatePdf && (
                        <a
                          href={cert.certificatePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-interactive p-1.5 rounded text-[#9ca3af] hover:text-white"
                          title="View Certificate PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-interactive p-1.5 rounded text-[#9ca3af] hover:text-white"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {cert.certificateImage && (
                    <div className="relative rounded-lg overflow-hidden mb-3 aspect-video bg-[#0c0e12] border border-[#1f2533]">
                      <img
                        src={cert.certificateImage}
                        alt={cert.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

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
              </Interactive3DCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
