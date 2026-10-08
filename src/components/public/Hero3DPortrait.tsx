import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import type { SiteSettings } from '../../types.js';

interface Hero3DPortraitProps {
  currentImage: string;
  settings?: SiteSettings;
  accentColor: string;
  onImageError: () => void;
}

export const Hero3DPortrait: React.FC<Hero3DPortraitProps> = ({
  currentImage,
  settings,
  accentColor,
  onImageError
}) => {
  const glowColor = settings?.lightingGlowColor || accentColor;
  const intensity = settings?.lightingIntensity ?? 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // State for mouse coordinates & hover state
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Animation frame & smooth interpolated values for 60fps physics
  const targetX = useRef(0); // -1 to 1
  const targetY = useRef(0); // -1 to 1
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Specular light position in percentage (0 - 100%)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Detect touch-only devices to avoid unwanted jerky motions
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (hasTouch && isCoarsePointer) {
      setIsTouchDevice(true);
    }

    // Physics loop: Damped Lerp (Linear Interpolation) for ultra-smooth physical motion
    let isRunning = true;
    const lerpFactor = 0.08;

    const animate = () => {
      if (!isRunning) return;

      // Smoothly approach target
      currentX.current += (targetX.current - currentX.current) * lerpFactor;
      currentY.current += (targetY.current - currentY.current) * lerpFactor;

      if (cardRef.current) {
        const x = currentX.current;
        const y = currentY.current;

        // Controlled subtle tilt angles (max ~8 degrees)
        const tiltX = -y * 8.5;
        const tiltY = x * 8.5;
        const translateZ = isHovered ? 12 : 0;
        const liftY = isHovered ? -4 : 0;

        cardRef.current.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(${liftY}px) translateZ(${translateZ}px)`;

        // Dynamic shadow that opposes light source
        const shadowX = (-x * 22).toFixed(1);
        const shadowY = (24 - y * 16).toFixed(1);
        const shadowBlur = isHovered ? 48 : 36;
        const shadowSpread = isHovered ? -6 : -8;
        cardRef.current.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.85), 0 0 ${(30 * intensity).toFixed(0)}px -4px ${glowColor}35`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [glowColor, intensity, isHovered]);

  // Window/Hero mouse listener for global responsive parallax
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Center point of the portrait card
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized offset from card center (-1 to 1)
      // Clamped within reasonable window radius
      const maxDistanceX = window.innerWidth / 2;
      const maxDistanceY = window.innerHeight / 2;

      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / maxDistanceX));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / maxDistanceY));

      targetX.current = normX;
      targetY.current = normY;

      // Specular highlight relative to card coordinates
      const relativeX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const relativeY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setLightPos({ x: relativeX, y: relativeY });
    };

    const handleMouseLeave = () => {
      // Gently return to resting center position
      targetX.current = 0;
      targetY.current = 0;
      setLightPos({ x: 50, y: 50 });
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[320px] xl:max-w-[360px] 2xl:max-w-[380px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1100px' }}
    >
      {/* ========================================================= */}
      {/* LAYER 1: BACKLIGHT ATMOSPHERIC GLOW                        */}
      {/* Moves subtly opposite to the cursor to create real depth   */}
      {/* ========================================================= */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none transition-opacity duration-700 blur-2xl"
        style={{
          background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, ${glowColor}40 0%, transparent 70%)`,
          opacity: isHovered ? (0.85 * intensity) : (0.45 * intensity),
          transform: `translate3d(${(-targetX.current * 14).toFixed(1)}px, ${(-targetY.current * 14).toFixed(1)}px, -30px)`
        }}
      />

      {/* ========================================================= */}
      {/* LAYER 2: INTERACTIVE GOLD GEOMETRIC FRAME CORNERS         */}
      {/* Parallax layer that responds with distinct perspective    */}
      {/* ========================================================= */}
      {settings?.heroBgElement && (
        <>
          <div
            className="absolute -top-3.5 -right-3.5 w-16 h-16 border-t-2 border-r-2 pointer-events-none rounded-tr-xl transition-all duration-300"
            style={{
              borderColor: isHovered ? accentColor : `${accentColor}bb`,
              boxShadow: isHovered ? `0 0 16px ${accentColor}40` : 'none',
              transform: `translate3d(${(targetX.current * 8).toFixed(1)}px, ${(targetY.current * 8).toFixed(1)}px, 15px)`
            }}
          />
          <div
            className="absolute -bottom-3.5 -left-3.5 w-16 h-16 border-b-2 border-l-2 pointer-events-none rounded-bl-xl transition-all duration-300"
            style={{
              borderColor: isHovered ? `${accentColor}90` : '#2e3544',
              boxShadow: isHovered ? `0 0 12px ${accentColor}25` : 'none',
              transform: `translate3d(${(-targetX.current * 8).toFixed(1)}px, ${(-targetY.current * 8).toFixed(1)}px, 15px)`
            }}
          />
        </>
      )}

      {/* ========================================================= */}
      {/* LAYER 3: 3D PORTRAIT CARD CONTAINER                       */}
      {/* Driven by requestAnimationFrame lerped 3D rotation        */}
      {/* ========================================================= */}
      <div
        ref={cardRef}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#12151b] border border-[#222732] transition-colors duration-300 group cursor-default"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform, box-shadow'
        }}
      >
        {/* ========================================================= */}
        {/* LAYER 4: PORTRAIT IMAGE WITH SUBTLE COUNTER-PARALLAX      */}
        {/* Keeps the subject visually centered with high fidelity    */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: 'translateZ(10px) scale(1.03)',
            transformStyle: 'preserve-3d'
          }}
        >
          <img
            id="hero-portrait-image"
            src={currentImage}
            alt="Farhan Tasneem - Computer Science & Engineering Student"
            onError={onImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              objectPosition: settings?.heroImagePosition || 'center top',
              transform: `scale(${isHovered ? 1.05 : 1.02}) translate3d(${(-targetX.current * 4).toFixed(1)}px, ${(-targetY.current * 4).toFixed(1)}px, 0)`
            }}
          />
        </div>

        {/* ========================================================= */}
        {/* LAYER 5: CINEMATIC DYNAMIC SPECULAR LIGHT SHEEN           */}
        {/* Realistic moving highlight that tracks cursor angle       */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            transform: 'translateZ(25px)',
            background: `radial-gradient(circle 380px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.14) 0%, ${glowColor}25 25%, transparent 65%)`,
            opacity: isHovered ? (1 * intensity) : (0.65 * intensity),
            mixBlendMode: 'screen'
          }}
        />

        {/* Diagonal glass reflection sweep */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{
            transform: 'translateZ(20px)',
            background: `linear-gradient(${115 + targetX.current * 15}deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)`
          }}
        />

        {/* Bottom dark blend overlay */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/60 to-transparent pointer-events-none"
          style={{ transform: 'translateZ(18px)' }}
        />

        {/* Subtle rim light border sheen */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            transform: 'translateZ(22px)',
            border: `1px solid ${isHovered ? `${accentColor}60` : '#222732'}`,
            boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 1px 0 ${accentColor}20`
          }}
        />

        {/* ========================================================= */}
        {/* LAYER 6: FLOATING IDENTITY PILL                           */}
        {/* Suspended in shallow 3D space with independent parallax   */}
        {/* ========================================================= */}
        <div
          className="absolute bottom-3.5 inset-x-3.5 p-3 rounded-xl bg-[#0c0e12]/85 backdrop-blur-md border border-[#222732] flex items-center justify-between gap-2 shadow-lg transition-all duration-300"
          style={{
            transform: `translate3d(${(targetX.current * 4).toFixed(1)}px, ${(targetY.current * 4).toFixed(1)}px, 32px)`,
            borderColor: isHovered ? `${accentColor}40` : '#222732'
          }}
        >
          <div className="min-w-0">
            <span className="font-semibold text-xs text-white block truncate">
              Farhan Tasneem
            </span>
            <span className="text-[11px] text-[#9ca3af] block truncate">
              Daffodil Int. University
            </span>
          </div>
          <div
            className="shrink-0 p-1.5 rounded-lg text-xs transition-colors duration-300"
            style={{
              backgroundColor: isHovered ? `${accentColor}30` : `${accentColor}20`,
              color: accentColor
            }}
          >
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
