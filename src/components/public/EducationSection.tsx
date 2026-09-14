import React from 'react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import type { Education } from '../../types.js';

interface EducationSectionProps {
  education?: Education[];
  accentColor?: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education = [], accentColor = '#e5a93c' }) => {
  const visibleEdu = (education || []).filter((e) => e && e.visible);
  if (visibleEdu.length === 0) return null;

  return (
    <section id="education" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Academic Background
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Education & Core Foundations
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
            Rigorous undergraduate studies in Computer Science & Engineering cultivating strong theoretical depth and practical software implementation competencies.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          {visibleEdu.map((edu) => (
            <div
              key={edu.id}
              className="p-7 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-lg bg-[#181c25] border border-[#252c3d] text-amber-400"
                    style={{ color: accentColor }}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                      {edu.degree}
                    </h3>
                    <div className="text-xs sm:text-sm text-[#9ca3af]">{edu.institution}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] bg-[#161b25] px-3 py-1.5 rounded-md border border-[#232938] self-start sm:self-auto font-mono">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" style={{ color: accentColor }} />
                  <span>
                    {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                  </span>
                </div>
              </div>

              {edu.department && (
                <div className="flex items-center gap-2 text-xs text-amber-400/90 mb-3" style={{ color: accentColor }}>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{edu.department}</span>
                </div>
              )}

              <p className="text-sm text-[#cbd5e1] leading-relaxed">
                {edu.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
