'use client';

import React from 'react';
import { SAMPLE_PRESETS, SampleDraftPreset } from '@/lib/brandVaultDefaults';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface PresetSelectorProps {
  currentPresetId: string;
  onSelectPreset: (preset: SampleDraftPreset) => void;
  onLoadFilePreset?: (type: 'doc' | 'banner', filename: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
  onLoadFilePreset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1 py-1 text-sm">
      {/* Left: Label + 3 Segmented Preset Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Presets:
        </span>
        <div className="inline-flex items-center bg-slate-100/90 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 gap-1 shadow-xs">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            let displayLabel = 'Q4 Cloud Launch (5 Flags)';
            if (preset.id === 'sample-2') displayLabel = 'Security Notice (3 Flags)';
            if (preset.id === 'sample-3') displayLabel = '100% Compliant Draft';

            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs md:text-sm px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{displayLabel}</span>
                {preset.id === 'sample-1' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
                {preset.id === 'sample-2' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
                {preset.id === 'sample-3' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Quick asset pills: [ 📄 Q4_Launch.md ] [ 🖼️ Banner.png ] placed neatly on the right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (onLoadFilePreset) {
              onLoadFilePreset('doc', 'Q4_Launch.md');
            } else {
              onSelectPreset(SAMPLE_PRESETS[0]);
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          title="Quick load Q4_Launch.md draft file"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>Q4_Launch.md</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onLoadFilePreset) {
              onLoadFilePreset('banner', 'Banner.png');
            } else {
              onSelectPreset(SAMPLE_PRESETS[0]);
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          title="Quick load Banner.png asset"
        >
          <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>Banner.png</span>
        </button>
      </div>
    </div>
  );
};
