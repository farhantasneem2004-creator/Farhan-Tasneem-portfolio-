import React, { useRef, useState, useEffect } from 'react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
  maxTilt?: number;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  glowColor = '#e5a93c',
  intensity = 1,
  maxTilt = 5,
  disabled = false,
  onClick,
  style = {}
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Physics animation loop using lerp (Linear Interpolation)
  const targetX = useRef(0); // -1 to 1
  const targetY = useRef(0); // -1 to 1
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Dynamic light position
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (hasTouch && isCoarsePointer) {
      setIsTouchDevice(true);
    }
  }, []);

  useEffect(() => {
    if (disabled || isTouchDevice) return;

    let isRunning = true;
    const lerpFactor = 0.1;

    const animate = () => {
      if (!isRunning) return;

      currentX.current += (targetX.current - currentX.current) * lerpFactor;
      currentY.current += (targetY.current - currentY.current) * lerpFactor;

      if (cardRef.current) {
        const x = currentX.current;
        const y = currentY.current;

        const tiltX = -y * maxTilt;
        const tiltY = x * maxTilt;
        const liftY = isHovered ? -3 : 0;
        const translateZ = isHovered ? 8 : 0;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(${liftY}px) translateZ(${translateZ}px)`;

        // Dynamic 3D lighting shadow that shifts slightly in the opposite direction
        const shadowX = (-x * 12).toFixed(1);
        const shadowY = (16 - y * 8).toFixed(1);
        const shadowOpacity = 0.6 * intensity;
        const rimGlow = isHovered ? `0 0 20px -2px ${glowColor}30` : 'none';

        cardRef.current.style.boxShadow = `${shadowX}px ${shadowY}px 30px -5px rgba(0, 0, 0, ${shadowOpacity}), ${rimGlow}`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered, disabled, isTouchDevice, glowColor, intensity, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized from -1 to 1
    const normX = ((x / rect.width) - 0.5) * 2;
    const normY = ((y / rect.height) - 0.5) * 2;

    targetX.current = Math.max(-1, Math.min(1, normX));
    targetY.current = Math.max(-1, Math.min(1, normY));

    // Specular highlight relative percentage
    setLightPos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100))
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetX.current = 0;
    targetY.current = 0;
    setLightPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-[border-color] duration-300 ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: isHovered ? 'transform, box-shadow' : 'auto'
      }}
    >
      {/* 3D Specular Light Sheen Overlay */}
      {!disabled && !isTouchDevice && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-10 overflow-hidden"
          style={{
            background: `radial-gradient(circle 240px at ${lightPos.x}% ${lightPos.y}%, ${glowColor}25 0%, rgba(255, 255, 255, 0.08) 20%, transparent 65%)`,
            opacity: isHovered ? (0.85 * intensity) : 0,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Subtle Rim Highlight on Hover */}
      {!disabled && !isTouchDevice && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-10"
          style={{
            border: `1px solid ${glowColor}`,
            opacity: isHovered ? (0.45 * intensity) : 0
          }}
        />
      )}

      {children}
    </div>
  );
};
