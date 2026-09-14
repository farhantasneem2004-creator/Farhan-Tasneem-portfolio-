import React from 'react';
import type { HighlightItem } from '../../types.js';
import { DynamicIcon } from '../common/IconHelper.js';

interface HighlightStripProps {
  highlights?: HighlightItem[];
  accentColor?: string;
}

export const HighlightStrip: React.FC<HighlightStripProps> = ({ highlights = [], accentColor = '#e5a93c' }) => {
  if (!highlights || highlights.length === 0) return null;

  const sorted = [...(highlights || [])].sort((a, b) => a.order - b.order);

  return (
    <div
      id="highlights-strip"
      className="border-y border-[#1c212c] bg-[#10131a]/60 backdrop-blur-sm py-6 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-center justify-center">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center gap-3 group transition-transform hover:-translate-y-0.5"
            >
              <div
                className="p-2 rounded-lg bg-[#181c25] border border-[#262c3a] text-amber-400 group-hover:border-amber-500/40 transition-colors"
                style={{ color: accentColor }}
              >
                <DynamicIcon name={item.icon} className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-[#e5e7eb] group-hover:text-white transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
