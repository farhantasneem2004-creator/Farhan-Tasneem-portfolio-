import React from 'react';
import {
  X,
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Box,
  Square,
  Minus
} from 'lucide-react';
import type { ElementType, LandingPageElement, Breakpoint } from '../../../types.js';

interface AddElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddElement: (element: LandingPageElement) => void;
  breakpoint: Breakpoint;
  canvasHeight: number;
  accentColor: string;
}

export const AddElementModal: React.FC<AddElementModalProps> = ({
  isOpen,
  onClose,
  onAddElement,
  breakpoint,
  canvasHeight,
  accentColor
}) => {
  if (!isOpen) return null;

  const elementPresets: Array<{
    type: ElementType;
    title: string;
    desc: string;
    icon: React.ReactNode;
    create: () => LandingPageElement;
  }> = [
    {
      type: 'heading',
      title: 'Display Heading',
      desc: 'Bold display title for name or key statement',
      icon: <Heading className="w-5 h-5 text-amber-400" />,
      create: () => ({
        id: `elem_heading_${Date.now()}`,
        name: 'New Heading',
        type: 'heading',
        content: 'NEW HEADLINE',
        color: '#ffffff',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 200,
          width: 550,
          height: 60,
          fontSize: 48,
          fontWeight: '800',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        },
        tablet: {
          x: 50,
          y: 200,
          width: 500,
          height: 50,
          fontSize: 38,
          fontWeight: '800',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        },
        mobile: {
          x: 20,
          y: 200,
          width: 350,
          height: 45,
          fontSize: 32,
          fontWeight: '800',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        }
      })
    },
    {
      type: 'text',
      title: 'Text / Paragraph',
      desc: 'Body description, biography, or subtitles',
      icon: <Type className="w-5 h-5 text-blue-400" />,
      create: () => ({
        id: `elem_text_${Date.now()}`,
        name: 'New Text Block',
        type: 'text',
        content: 'Add your custom biographical or descriptive copy here.',
        color: '#9ca3af',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 280,
          width: 500,
          height: 60,
          fontSize: 15,
          fontWeight: '400',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        },
        tablet: {
          x: 50,
          y: 270,
          width: 500,
          height: 60,
          fontSize: 14,
          fontWeight: '400',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        },
        mobile: {
          x: 20,
          y: 260,
          width: 350,
          height: 70,
          fontSize: 13,
          fontWeight: '400',
          textAlign: 'left',
          visible: true,
          opacity: 1,
          rotation: 0
        }
      })
    },
    {
      type: 'button',
      title: 'Action Button',
      desc: 'Interactive call-to-action button or link',
      icon: <MousePointerClick className="w-5 h-5 text-emerald-400" />,
      create: () => ({
        id: `elem_btn_${Date.now()}`,
        name: 'Action Button',
        type: 'button',
        content: 'Get in Touch',
        buttonVariant: 'primary',
        buttonAction: 'contact',
        backgroundColor: accentColor,
        color: '#0c0e12',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 360,
          width: 170,
          height: 48,
          fontSize: 14,
          fontWeight: '600',
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 8
        },
        tablet: {
          x: 50,
          y: 350,
          width: 160,
          height: 46,
          fontSize: 14,
          fontWeight: '600',
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 8
        },
        mobile: {
          x: 20,
          y: 350,
          width: 350,
          height: 48,
          fontSize: 14,
          fontWeight: '600',
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 8
        }
      })
    },
    {
      type: 'image',
      title: 'Image Frame',
      desc: 'Portrait, showcase photo, or graphic visual',
      icon: <ImageIcon className="w-5 h-5 text-purple-400" />,
      create: () => ({
        id: `elem_img_${Date.now()}`,
        name: 'Showcase Image',
        type: 'image',
        imageUrl: '/src/assets/images/farhan_hero_portrait_1789381757896.jpg',
        imageAlt: 'Farhan Tasneem',
        imageCrop: 'cover',
        imagePosition: 'center',
        borderWidth: 1,
        borderColor: '#2e3544',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 900,
          y: 150,
          width: 320,
          height: 400,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 16
        },
        tablet: {
          x: 234,
          y: 100,
          width: 300,
          height: 350,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 16
        },
        mobile: {
          x: 45,
          y: 80,
          width: 300,
          height: 300,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 16
        }
      })
    },
    {
      type: 'badge',
      title: 'Pill Badge',
      desc: 'Floating credential, status, or tag pill',
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
      create: () => ({
        id: `elem_badge_${Date.now()}`,
        name: 'Badge Pill',
        type: 'badge',
        content: 'NEW CREDENTIAL',
        backgroundColor: '#12151b',
        borderColor: '#2e3544',
        color: accentColor,
        iconName: 'Sparkles',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 900,
          y: 570,
          width: 260,
          height: 42,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1.5,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 12
        },
        tablet: {
          x: 254,
          y: 470,
          width: 260,
          height: 40,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1.5,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 12
        },
        mobile: {
          x: 65,
          y: 400,
          width: 260,
          height: 40,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1.5,
          visible: true,
          opacity: 1,
          rotation: 0,
          borderRadius: 12
        }
      })
    },
    {
      type: 'decorative_shape',
      title: 'Accent Shape / Glow',
      desc: 'Ambient gold glow, border frame, or geometric line',
      icon: <Square className="w-5 h-5 text-amber-500/80" />,
      create: () => ({
        id: `elem_shape_${Date.now()}`,
        name: 'Ambient Glow',
        type: 'decorative_shape',
        shapeType: 'glow',
        backgroundColor: accentColor,
        locked: false,
        order: Date.now(),
        desktop: {
          x: 880,
          y: 130,
          width: 360,
          height: 440,
          visible: true,
          opacity: 0.15,
          rotation: 0,
          borderRadius: 9999
        },
        tablet: {
          x: 214,
          y: 80,
          width: 340,
          height: 380,
          visible: true,
          opacity: 0.12,
          rotation: 0,
          borderRadius: 9999
        },
        mobile: {
          x: 35,
          y: 70,
          width: 320,
          height: 320,
          visible: true,
          opacity: 0.1,
          rotation: 0,
          borderRadius: 9999
        }
      })
    },
    {
      type: 'feature_strip',
      title: 'Highlights Strip',
      desc: 'Row of key skill badges or credential chips',
      icon: <Box className="w-5 h-5 text-indigo-400" />,
      create: () => ({
        id: `elem_strip_${Date.now()}`,
        name: 'Highlights Strip',
        type: 'feature_strip',
        items: [
          { id: '1', label: 'AI Prompt Engineering', icon: 'Sparkles' },
          { id: '2', label: 'CSE Student', icon: 'GraduationCap' },
          { id: '3', label: 'Problem Solver', icon: 'Lightbulb' }
        ],
        backgroundColor: '#141822',
        borderColor: '#222938',
        color: '#d1d5db',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 430,
          width: 550,
          height: 42,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        tablet: {
          x: 50,
          y: 420,
          width: 500,
          height: 42,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        mobile: {
          x: 20,
          y: 430,
          width: 350,
          height: 80,
          visible: true,
          opacity: 1,
          rotation: 0
        }
      })
    },
    {
      type: 'social_links',
      title: 'Social Icons Row',
      desc: 'Connect row with links to GitHub, LinkedIn, etc.',
      icon: <Share2 className="w-5 h-5 text-sky-400" />,
      create: () => ({
        id: `elem_social_${Date.now()}`,
        name: 'Social Channels',
        type: 'social_links',
        items: [
          { id: '1', label: 'GitHub', platform: 'GitHub', url: 'https://github.com' },
          { id: '2', label: 'LinkedIn', platform: 'LinkedIn', url: 'https://linkedin.com' },
          { id: '3', label: 'Fiverr', platform: 'Fiverr', url: 'https://fiverr.com' }
        ],
        borderColor: '#1f2533',
        color: '#9ca3af',
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 500,
          width: 300,
          height: 44,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        tablet: {
          x: 50,
          y: 500,
          width: 300,
          height: 42,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        mobile: {
          x: 20,
          y: 520,
          width: 350,
          height: 44,
          visible: true,
          opacity: 1,
          rotation: 0
        }
      })
    },
    {
      type: 'divider',
      title: 'Divider Line',
      desc: 'Horizontal separation line or accent bar',
      icon: <Minus className="w-5 h-5 text-gray-400" />,
      create: () => ({
        id: `elem_divider_${Date.now()}`,
        name: 'Divider Line',
        type: 'divider',
        borderColor: '#222938',
        borderWidth: 1,
        locked: false,
        order: Date.now(),
        desktop: {
          x: 100,
          y: 480,
          width: 550,
          height: 10,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        tablet: {
          x: 50,
          y: 480,
          width: 500,
          height: 10,
          visible: true,
          opacity: 1,
          rotation: 0
        },
        mobile: {
          x: 20,
          y: 500,
          width: 350,
          height: 10,
          visible: true,
          opacity: 1,
          rotation: 0
        }
      })
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-[#10131b] border border-[#202737] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1b202c] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Add Element to Hero</h3>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Select an element to place onto your landing page canvas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2130]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {elementPresets.map((preset) => (
            <button
              key={preset.type}
              type="button"
              onClick={() => {
                onAddElement(preset.create());
                onClose();
              }}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-[#202737] bg-[#141822] hover:bg-[#1a2130] hover:border-amber-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="p-2.5 rounded-lg bg-[#0e1117] border border-[#232a3b] group-hover:border-amber-500/40 shrink-0">
                {preset.icon}
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white group-hover:text-amber-400 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-[#9ca3af] mt-1 leading-snug">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
