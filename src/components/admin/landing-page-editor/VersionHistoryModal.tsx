import React, { useState, useEffect } from 'react';
import { X, History, RotateCcw, Check, Calendar, User, Layers, AlertCircle } from 'lucide-react';
import type { LandingPageVersion, LandingPageLayout } from '../../../types.js';
import { api } from '../../../api.js';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (version: LandingPageVersion) => void;
  accentColor: string;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  onRestoreVersion,
  accentColor
}) => {
  const [versions, setVersions] = useState<LandingPageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getLandingPageVersions();
      setVersions(data);
      if (data.length > 0 && !selectedVersionId) {
        setSelectedVersionId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];

  const handleRestore = async (version: LandingPageVersion) => {
    if (
      !window.confirm(
        `Are you sure you want to restore Version #${version.version} ("${version.name}")? This will replace your current draft in the editor.`
      )
    ) {
      return;
    }
    try {
      setRestoringId(version.id);
      await api.restoreLandingPageVersion(version.id);
      onRestoreVersion(version);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to restore version');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#10131b] border border-[#202737] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1b202c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Version History & Snapshots</h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Browse and restore previously published revisions of your landing page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2130]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split View (List on Left, Details on Right) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Versions List */}
          <div className="w-1/2 border-r border-[#1b202c] overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="py-12 text-center text-[#9ca3af] text-xs">
                Loading revisions...
              </div>
            ) : versions.length === 0 ? (
              <div className="py-12 text-center text-[#6b7280] text-xs">
                No published revisions yet. Publish changes to create revisions!
              </div>
            ) : (
              versions.map((ver, idx) => {
                const isSelected = ver.id === selectedVersionId;
                const formattedDate = new Date(ver.publishedAt).toLocaleString();

                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVersionId(ver.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#182030] border-amber-500/50 text-white shadow-sm'
                        : 'bg-[#141822] border-[#222938] text-[#9ca3af] hover:bg-[#191f2c] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-amber-400">
                        Version #{ver.version}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Current Live
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-white truncate mb-1">
                      {ver.name || `Release v${ver.version}`}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Selected Version Details & Restore Action */}
          <div className="w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-[#0d1017]">
            {selectedVersion ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                    Snapshot Details
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {selectedVersion.name || `Version #${selectedVersion.version}`}
                  </h3>
                </div>

                <div className="space-y-3 bg-[#131722] p-4 rounded-xl border border-[#202737] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9ca3af] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Published Date:
                    </span>
                    <span className="text-white font-mono">
                      {new Date(selectedVersion.publishedAt).toLocaleDateString()} at{' '}
                      {new Date(selectedVersion.publishedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9ca3af] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Published By:
                    </span>
                    <span className="text-white truncate max-w-[160px]">
                      {selectedVersion.publishedBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9ca3af] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Element Count:
                    </span>
                    <span className="text-white font-mono">{selectedVersion.elementCount} elements</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-wider">
                    Included Elements Preview
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 bg-[#131722] p-3 rounded-xl border border-[#202737]">
                    {selectedVersion.layout?.elements?.map((el) => (
                      <div
                        key={el.id}
                        className="flex items-center justify-between text-[11px] py-1 border-b border-[#1b2233] last:border-0"
                      >
                        <span className="text-white truncate">{el.name}</span>
                        <span className="text-[#6b7280] uppercase text-[10px] font-mono">
                          {el.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(selectedVersion)}
                    disabled={restoringId === selectedVersion.id}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-[#0c0e12] flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                  >
                    {restoringId === selectedVersion.id ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    <span>Restore Version #{selectedVersion.version} to Editor</span>
                  </button>
                  <p className="text-[11px] text-[#6b7280] text-center mt-2">
                    Restoring loads this snapshot into your editor draft. You can make further edits or re-publish.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-[#6b7280] text-xs">
                Select a version on the left to see details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
