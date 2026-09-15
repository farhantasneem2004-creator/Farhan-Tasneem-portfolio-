import React, { useState } from 'react';
import type { Skill } from '../../types.js';

interface SkillsSectionProps {
  skills?: Skill[];
  accentColor?: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [], accentColor = '#e5a93c' }) => {
  const visibleSkills = (skills || []).filter((s) => s && s.visible);
  if (visibleSkills.length === 0) return null;

  // Extract unique categories preserving logical order
  const categories = Array.from(new Set(visibleSkills.map((s) => s.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSkills =
    selectedCategory === 'All'
      ? visibleSkills
      : visibleSkills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 sm:py-24 border-t border-[#1a1f29] relative overflow-x-clip">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Technical & Creative Matrix
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4 break-words">
            Skills, Tools & Proficiencies
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
            A balanced synthesis of algorithmic computing, engineering frameworks, and visual illustration competencies honed through rigorous coursework and creative practice.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-[#12151b] text-[#9ca3af] hover:text-white border border-[#222732]'
            }`}
            style={
              selectedCategory === 'All'
                ? { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}60`, color: '#ffffff' }
                : {}
            }
          >
            All Disciplines ({visibleSkills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-[#12151b] text-[#9ca3af] hover:text-white border border-[#222732]'
              }`}
              style={
                selectedCategory === cat
                  ? { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}60`, color: '#ffffff' }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid with minimal, elegant progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 sm:p-5 rounded-xl bg-[#12151c] border border-[#1f2533] hover:border-[#2f384c] transition-all group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#191e2b] text-[#94a3b8] border border-[#252c3d]">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#9ca3af]">{skill.level}</span>
                  {skill.percentage > 0 && (
                    <span
                      className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-[#181d27]"
                      style={{ color: accentColor }}
                    >
                      {skill.percentage}%
                    </span>
                  )}
                </div>
              </div>

              {skill.description && (
                <p className="text-xs text-[#848ea0] mb-3 leading-relaxed">
                  {skill.description}
                </p>
              )}

              {/* Minimalist modern progress bar */}
              <div className="h-1.5 w-full bg-[#1b202c] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${skill.percentage}%`,
                    backgroundColor: accentColor
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
