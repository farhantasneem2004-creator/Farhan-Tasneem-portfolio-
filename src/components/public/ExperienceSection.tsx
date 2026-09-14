import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import type { Experience } from '../../types.js';

interface ExperienceSectionProps {
  experiences?: Experience[];
  accentColor?: string;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences = [], accentColor = '#e5a93c' }) => {
  const visibleExperiences = (experiences || []).filter((e) => e && e.visible);
  // Strictly enforce user prompt rule: "If there is no experience, hide the public section. Do not create fake experience."
  if (visibleExperiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Career Timeline
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Professional Experience
          </h2>
        </div>

        <div className="space-y-6 max-w-4xl">
          {visibleExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {exp.position}
                  </h3>
                  <div className="text-sm font-medium text-amber-400" style={{ color: accentColor }}>
                    {exp.organization}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#9ca3af]">
                  <span className="px-2.5 py-1 rounded-md bg-[#161b25] border border-[#252d3e]">
                    {exp.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {exp.location && (
                <div className="flex items-center gap-1.5 text-xs text-[#848ea0] mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              )}

              <p className="text-sm text-[#cbd5e1] leading-relaxed mb-4">
                {exp.description}
              </p>

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside text-xs text-[#94a3b8] space-y-1 mb-4">
                  {(exp.responsibilities || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}

              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1c2230]">
                  {(exp.skills || []).map((s, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161b25] text-[#9ca3af]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
