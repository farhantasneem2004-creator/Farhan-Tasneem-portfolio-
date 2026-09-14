import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Normalize names
  const normalizedName = name.replace(/[-_ ](\w)/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase());

  // Platform specific icon fallbacks
  if (normalizedName === 'Github' || normalizedName === 'Github') {
    const Component = (Icons as any)['Github'] || Icons.Code2;
    return <Component className={className} size={size} />;
  }
  if (normalizedName === 'Linkedin') {
    const Component = (Icons as any)['Linkedin'] || Icons.Share2;
    return <Component className={className} size={size} />;
  }
  if (normalizedName === 'Facebook') {
    const Component = (Icons as any)['Facebook'] || Icons.Share2;
    return <Component className={className} size={size} />;
  }
  if (normalizedName === 'Instagram') {
    const Component = (Icons as any)['Instagram'] || Icons.Camera;
    return <Component className={className} size={size} />;
  }
  if (normalizedName === 'Youtube') {
    const Component = (Icons as any)['Youtube'] || Icons.Video;
    return <Component className={className} size={size} />;
  }
  if (normalizedName === 'X' || normalizedName === 'Twitter') {
    const Component = (Icons as any)['Twitter'] || Icons.AtSign;
    return <Component className={className} size={size} />;
  }

  const LucideComponent = (Icons as any)[normalizedName] || (Icons as any)[name] || Icons.Sparkles;
  return <LucideComponent className={className} size={size} />;
};
