import React from 'react';
import { GraduationCap, Calendar, BookOpen, UserCheck, Mail, Phone, Award } from 'lucide-react';
import type { Education, Reference } from '../../types.js';

interface EducationSectionProps {
  education?: Education[];
  references?: Reference[];
  accentColor?: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education = [],
  references = [],
  accentColor = '#e5a93c'
}) => {
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
            Academic milestones and undergraduate studies in Computer Science & Engineering cultivating theoretical depth, problem solving, and emerging software competencies.
          </p>
        </div>

        {/* Education Cards */}
        <div className="space-y-6 max-w-4xl">
          {visibleEdu.map((edu) => (
            <div
              key={edu.id}
              className="p-7 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-lg bg-[#181c25] border border-[#252c3d]"
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

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {edu.grade && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Award className="w-3.5 h-3.5" />
                      <span>{edu.grade}</span>
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] bg-[#161b25] px-3 py-1.5 rounded-md border border-[#232938] font-mono">
                    <Calendar className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span>
                      {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                    </span>
                  </div>
                </div>
              </div>

              {edu.department && (
                <div className="flex items-center gap-2 text-xs mb-3 font-medium" style={{ color: accentColor }}>
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

        {/* Academic References */}
        {references && references.length > 0 && (
          <div className="mt-16 max-w-4xl pt-12 border-t border-[#1c2230]">
            <div className="flex items-center gap-2 mb-6">
              <UserCheck className="w-4 h-4" style={{ color: accentColor }} />
              <h3 className="font-display font-bold text-xl text-white">
                Academic & Institutional References
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="p-6 rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-base text-white mb-0.5">{ref.name}</h4>
                    <p className="text-xs text-amber-400/90 font-medium mb-1" style={{ color: accentColor }}>
                      {ref.role}
                    </p>
                    <p className="text-xs text-[#9ca3af] mb-4">{ref.institution}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#1c2230] text-xs text-[#848ea0]">
                    {ref.email && (
                      <a
                        href={`mailto:${ref.email}`}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                        <span className="truncate">{ref.email}</span>
                      </a>
                    )}
                    {ref.phone && (
                      <a
                        href={`tel:${ref.phone}`}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                        <span>{ref.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
