import React from 'react';

interface BackgroundDoodlesProps {
  accentColor?: string;
  glowColor?: string;
  intensity?: number;
  keywords?: string;
  enabled?: boolean;
}

export const BackgroundDoodles: React.FC<BackgroundDoodlesProps> = ({
  accentColor = '#e5a93c',
  glowColor,
  intensity = 1,
  keywords = 'CFC • ALGORITHMS • LOGIC • CSE • SYSTEMS • DATA STRUCTURES',
  enabled = true
}) => {
  if (!enabled) return null;

  const color = glowColor || accentColor;
  const wordList = keywords
    ? keywords.split(/[•,|]+/).map((w) => w.trim()).filter(Boolean)
    : ['CFC', 'ALGORITHMS', 'DATA STRUCTURES', 'LOGIC', 'SYSTEMS'];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* 1. CFC & COMPUTER SCIENCE WATERMARK TYPOGRAPHY            */}
      {/* Ultra-faint, slow ambient floating typography             */}
      {/* ========================================================= */}
      <div className="absolute inset-0">
        {/* Large faint CFC watermark at top left */}
        <div
          className="absolute -top-10 left-[4%] text-[10rem] sm:text-[14rem] font-display font-black tracking-widest leading-none pointer-events-none transition-all duration-1000"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1px ${color}`,
            opacity: 0.03 * intensity,
            transform: 'rotate(-4deg)'
          }}
        >
          {wordList[0] || 'CFC'}
        </div>

        {/* Floating background technical keywords along section margins */}
        <div
          className="absolute top-[28%] -right-10 text-6xl sm:text-8xl font-mono font-bold tracking-[0.3em] uppercase pointer-events-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1px ${color}`,
            opacity: 0.025 * intensity,
            transform: 'rotate(90deg) translateY(-50%)'
          }}
        >
          {wordList[1] || 'ALGORITHMS'}
        </div>

        <div
          className="absolute top-[52%] -left-8 text-5xl sm:text-7xl font-mono font-bold tracking-[0.25em] uppercase pointer-events-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1px #94a3b8`,
            opacity: 0.02 * intensity,
            transform: 'rotate(-90deg) translateY(-50%)'
          }}
        >
          {wordList[2] || 'LOGIC'}
        </div>

        <div
          className="absolute top-[75%] right-[8%] text-6xl sm:text-8xl font-display font-black tracking-widest uppercase pointer-events-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1px ${color}`,
            opacity: 0.025 * intensity,
            transform: 'rotate(-2deg)'
          }}
        >
          {wordList[3] || 'SYSTEMS'}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TECHNICAL & ARCHITECTURAL VECTOR DOODLES               */}
      {/* Code brackets, coordinate crosses, circuit logic nodes    */}
      {/* ========================================================= */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.045 * intensity }}
      >
        <defs>
          <pattern id="tech-dots" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={color} fillOpacity="0.4" />
          </pattern>
        </defs>

        {/* Faint subtle tech dots overlay */}
        <rect width="100%" height="100%" fill="url(#tech-dots)" />

        {/* Top-right corner architectural crosshair & coordinates */}
        <g stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none">
          <circle cx="85%" cy="18%" r="42" />
          <line x1="85%" y1="14%" x2="85%" y2="22%" />
          <line x1="81%" y1="18%" x2="89%" y2="18%" />
          <text x="86%" y="17%" fill={color} fontSize="10" fontFamily="monospace" stroke="none">
            [SYS_NODE_01]
          </text>
        </g>

        {/* Left side abstract circuit graph doodle */}
        <g stroke={color} strokeWidth="1.2" fill="none">
          <path d="M 60 480 L 140 480 L 170 510 L 260 510" />
          <circle cx="60" cy="480" r="3.5" fill={color} />
          <circle cx="170" cy="510" r="2.5" fill={color} />
          <circle cx="260" cy="510" r="3.5" fill={color} />
          <text x="180" y="505" fill={color} fontSize="9" fontFamily="monospace" stroke="none">
            fn(x) =&gt; O(log N)
          </text>
        </g>

        {/* Mid-right floating code bracket doodle */}
        <g stroke="#94a3b8" strokeWidth="1" fill="none">
          <path d="M 920 820 L 900 820 L 890 840 L 900 860 L 920 860" />
          <path d="M 950 820 L 970 820 L 980 840 L 970 860 L 950 860" />
          <text x="925" y="845" fill="#94a3b8" fontSize="11" fontFamily="monospace" stroke="none">
            {'{ ... }'}
          </text>
        </g>

        {/* Lower-left mathematical / algorithmic geometry doodle */}
        <g stroke={color} strokeWidth="1" fill="none">
          {/* Isometric cube outline */}
          <polygon points="120,950 160,930 200,950 160,970" />
          <polygon points="120,950 160,970 160,1010 120,990" />
          <polygon points="200,950 160,970 160,1010 200,990" />
          <text x="135" y="1030" fill={color} fontSize="9" fontFamily="monospace" stroke="none">
            λ · Σ(i=0..n)
          </text>
        </g>

        {/* Subtle grid coordinate crosshairs scattered elegantly */}
        {[
          { x: '22%', y: '35%' },
          { x: '72%', y: '42%' },
          { x: '45%', y: '68%' },
          { x: '18%', y: '85%' },
          { x: '82%', y: '90%' }
        ].map((pt, idx) => (
          <g key={idx} stroke={color} strokeWidth="1" strokeOpacity="0.5">
            <line x1={`calc(${pt.x} - 6px)`} y1={pt.y} x2={`calc(${pt.x} + 6px)`} y2={pt.y} />
            <line x1={pt.x} y1={`calc(${pt.y} - 6px)`} x2={pt.x} y2={`calc(${pt.y} + 6px)`} />
          </g>
        ))}
      </svg>
    </div>
  );
};
