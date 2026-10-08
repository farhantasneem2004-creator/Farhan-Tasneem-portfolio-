import React from 'react';
import { ArrowRight, Feather, Compass, FileText } from 'lucide-react';
import type { Service } from '../../types.js';
import { ScrollReveal } from '../common/ScrollReveal.js';
import { Interactive3DCard } from '../common/Interactive3DCard.js';

interface ServicesSectionProps {
  services?: Service[];
  accentColor?: string;
  glowColor?: string;
  lightingIntensity?: number;
  enable3D?: boolean;
  onSelectService?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [],
  accentColor = '#e5a93c',
  glowColor,
  lightingIntensity = 1,
  enable3D = true,
  onSelectService
}) => {
  const visibleServices = (services || []).filter((s) => s && s.visible);
  if (visibleServices.length === 0) return null;

  const activeGlow = glowColor || accentColor;

  const renderServiceIcon = (name: string) => {
    if (name.toLowerCase().includes('poet') || name.toLowerCase().includes('feather')) {
      return <Feather className="w-6 h-6" />;
    }
    if (name.toLowerCase().includes('illustrat') || name.toLowerCase().includes('machin') || name.toLowerCase().includes('compass')) {
      return <Compass className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  return (
    <section id="services" className="py-24 border-t border-[#1a1f29] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <ScrollReveal delay={50}>
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px]" style={{ backgroundColor: accentColor }} />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9ca3af]">
                Creative Offerings
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
              Specialized & Creative Services
            </h2>
            <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
              Beyond traditional software engineering, I collaborate on bespoke writing, technical visualization, and narrative creative projects.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleServices.map((service, index) => (
            <ScrollReveal key={service.id} delay={100 * (index + 1)}>
              <Interactive3DCard
                glowColor={activeGlow}
                intensity={lightingIntensity}
                disabled={!enable3D}
                className="rounded-2xl bg-[#11141c] border border-[#1f2533] hover:border-[#2f384c] p-8 flex flex-col justify-between h-full group shadow-lg"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#181c25] border border-[#262f40] transition-colors group-hover:border-amber-500/40"
                    style={{ color: accentColor }}
                  >
                    {renderServiceIcon(service.name)}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-sm text-[#cbd5e1] font-medium leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  <p className="text-xs text-[#848ea0] leading-relaxed mb-6">
                    {service.detailedDescription}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#1c2230]">
                  <button
                    onClick={() => {
                      if (onSelectService) {
                        onSelectService(service.name);
                      } else {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn-interactive w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#161b26] border border-[#252c3d] hover:border-amber-500/50 hover:bg-[#1a202d] cursor-pointer"
                  >
                    <span>{service.ctaText || 'Inquire Service'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" style={{ color: accentColor }} />
                  </button>
                </div>
              </Interactive3DCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
