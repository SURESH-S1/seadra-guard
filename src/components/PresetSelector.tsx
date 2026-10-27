'use client';

import React from 'react';
import { SAMPLE_PRESETS, SampleDraftPreset } from '@/lib/brandVaultDefaults';
import { Sparkles, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PresetSelectorProps {
  currentPresetId: string;
  onSelectPreset: (preset: SampleDraftPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1-Click Demo Presets for Hackathon Judges
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Click any preset to instantaneously populate draft, banner, and test audit engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {SAMPLE_PRESETS.map((preset, idx) => {
          const isSelected = currentPresetId === preset.id;
          const isViolations = preset.id === 'sample-1';
          const isCompliant = preset.id === 'sample-3';

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-2.5 rounded-lg border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/90 border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                  {preset.name}
                </span>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                    isCompliant
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : isViolations
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{preset.tagline}</p>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

