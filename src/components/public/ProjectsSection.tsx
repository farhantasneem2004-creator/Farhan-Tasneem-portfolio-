import React, { useState } from 'react';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import type { Project } from '../../types.js';
import { ProjectModal } from './ProjectModal.js';

interface ProjectsSectionProps {
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  accentColor?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  onSelectProject,
  accentColor = '#e5a93c'
}) => {
  const visibleProjects = (projects || []).filter((p) => p && p.visible);
  const [internalSelectedProject, setInternalSelectedProject] = useState<Project | null>(null);

  const handleSelect = (proj: Project) => {
    if (onSelectProject) {
      onSelectProject(proj);
    } else {
      setInternalSelectedProject(proj);
    }
  };

  if (visibleProjects.length === 0) return null;

  // Split into featured vs secondary projects
  const featuredProjects = visibleProjects.filter((p) => p.featured);
  const regularProjects = visibleProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
              Selected Works
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Featured Engineering Case Studies
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
            Real-world web software systems and applications built with an emphasis on reliable architecture, clean user interfaces, and domain complexity.
          </p>
        </div>

        {/* Featured Projects: Large Editorial Presentation */}
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleSelect(project)}
            className="mb-12 rounded-2xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] transition-all duration-300 overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Image Column */}
              <div className="lg:col-span-7 relative overflow-hidden bg-[#0a0c10] aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[420px]">
                <img
                  src={project.mainImage || '/src/assets/images/efuture_cup_project_1789381795595.jpg'}
                  alt={project.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-transparent lg:hidden" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-[#0c0e12]"
                    style={{ backgroundColor: accentColor }}
                  >
                    Featured System
                  </span>
                </div>
              </div>

              {/* Information Column */}
              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#9ca3af]">
                      {project.category}
                    </span>
                    <span className="text-xs text-[#6b7280] font-mono">{project.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white group-hover:text-amber-300 transition-colors mb-4 flex items-center justify-between">
                    <span>{project.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#6b7280] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed mb-6">
                    {project.shortDescription}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(project.technologies || []).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#161b25] text-[#cbd5e1] border border-[#252d3e]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#1d2331]" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleSelect(project)}
                    className="text-xs font-semibold text-[#e5e7eb] hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" style={{ color: accentColor }} />
                  </button>

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 transition-colors ml-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Regular Projects Grid (if any) */}
        {regularProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleSelect(proj)}
                className="rounded-xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between p-6"
              >
                <div>
                  <div className="relative rounded-lg overflow-hidden aspect-video mb-5 bg-[#0a0c10] border border-[#1b202c]">
                    <img
                      src={proj.mainImage || '/src/assets/images/efuture_cup_project_1789381795595.jpg'}
                      alt={proj.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-2">
                    <span>{proj.category}</span>
                    <span className="font-mono">{proj.date}</span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors mb-2">
                    {proj.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4 line-clamp-3">
                    {proj.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1c2230] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.technologies || []).slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161b25] text-[#9ca3af]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#6b7280] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal (fallback if not handled externally) */}
      {!onSelectProject && (
        <ProjectModal
          project={internalSelectedProject}
          onClose={() => setInternalSelectedProject(null)}
          accentColor={accentColor}
        />
      )}
    </section>
  );
};
