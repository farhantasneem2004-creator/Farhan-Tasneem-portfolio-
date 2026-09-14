import React from 'react';
import { X, ExternalLink, Github, Calendar, Layers } from 'lucide-react';
import type { Project } from '../../types.js';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  accentColor?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, accentColor = '#e5a93c' }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#11141c] border border-[#232938] rounded-2xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2533] bg-[#0e1117]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#9ca3af]">
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a202d] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Main Visual Image */}
          {project.mainImage && (
            <div className="relative rounded-xl overflow-hidden border border-[#232938] bg-[#0c0e12] aspect-video">
              <img
                src={project.mainImage}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {project.name}
              </h2>
              {project.date && (
                <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                  <Calendar className="w-4 h-4 text-amber-400" style={{ color: accentColor }} />
                  <span>{project.date}</span>
                </div>
              )}
            </div>

            <p className="text-base text-[#cbd5e1] leading-relaxed mb-6 font-medium">
              {project.shortDescription}
            </p>

            {/* Links and Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#0c0e12] transition-colors"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#1a202d] border border-[#2c3547] hover:border-amber-500/50 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Detailed Narrative Description */}
          <div className="pt-6 border-t border-[#1c2230]">
            <h4 className="text-xs uppercase tracking-wider text-[#9ca3af] font-semibold mb-3">
              Case Study & System Overview
            </h4>
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed whitespace-pre-line">
              {project.detailedDescription}
            </p>
          </div>

          {/* Technologies Used */}
          {(project.technologies?.length || 0) > 0 && (
            <div className="pt-4 border-t border-[#1c2230]">
              <h4 className="text-xs uppercase tracking-wider text-[#9ca3af] font-semibold mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Architecture & Technologies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#161b26] text-[#cbd5e1] border border-[#262f42]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Images if available */}
          {(project.additionalImages?.length || 0) > 0 && (
            <div className="pt-4 border-t border-[#1c2230]">
              <h4 className="text-xs uppercase tracking-wider text-[#9ca3af] font-semibold mb-3">
                Interface Previews
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(project.additionalImages || []).map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-[#232938]">
                    <img
                      src={img}
                      alt={`${project.name} preview ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
