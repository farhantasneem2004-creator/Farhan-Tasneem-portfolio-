import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PublishConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: (versionName?: string) => void;
  isPublishing: boolean;
  accentColor: string;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing,
  accentColor
}) => {
  const [versionName, setVersionName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPublish(versionName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#10131b] border border-[#202737] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1b202c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Publish Landing Page</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2130]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#141822] border border-[#222938] text-xs text-[#d1d5db] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Instant Live Update</span>
            </div>
            <p className="text-[#9ca3af] leading-relaxed">
              Publishing will update the live public portfolio landing page immediately across Desktop, Tablet, and Mobile devices. A snapshot version will be created for rollback safety.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9ca3af] mb-1.5">
              Version / Release Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Hero portrait resized and typography tuned"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              className="w-full px-3 py-2 bg-[#141822] border border-[#242b3b] rounded-xl text-white text-xs placeholder:text-[#4b5563] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#9ca3af] hover:text-white bg-[#141822] border border-[#222938] hover:bg-[#191f2c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="px-5 py-2 rounded-xl text-xs font-bold text-[#0c0e12] flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              {isPublishing ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-black" />
              )}
              <span>{isPublishing ? 'Publishing...' : 'Publish to Live Site'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
