
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Loader2, Download, Maximize, FileCode, LucideIcon, FileText } from 'lucide-react';

interface InfographicResultCardProps {
  title: string;
  label: string;
  icon: LucideIcon;
  iconColorClass: string;
  imageData: string | null;
  is3D?: boolean;
  isGenerating?: boolean;
  onFullScreen: () => void;
  onExportSvg: () => void;
  onExportPdf?: () => void; // Optional for now
  isVectorizing: boolean;
  onGenerateAction?: () => void; // Optional action for empty state (like 3D gen)
  generateActionLabel?: string;
  generateActionIcon?: LucideIcon;
  emptyStateMessage?: string;
  bgClass?: string;
}

export const InfographicResultCard: React.FC<InfographicResultCardProps> = ({
  title,
  label,
  icon: Icon,
  iconColorClass,
  imageData,
  is3D = false,
  isGenerating = false,
  onFullScreen,
  onExportSvg,
  onExportPdf,
  isVectorizing,
  onGenerateAction,
  generateActionLabel,
  generateActionIcon: GenerateIcon,
  emptyStateMessage,
  bgClass = "bg-[#eef8fe]"
}) => {
  return (
    <div className="glass-panel rounded-3xl p-1.5 flex flex-col h-full">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between border-b border-white/5 mb-1.5 shrink-0 gap-2">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 font-mono uppercase tracking-wider">
          <Icon className={`w-4 h-4 ${iconColorClass}`} /> {label}
        </h3>
        
        {imageData && (
          <div className="flex items-center gap-1.5 animate-in fade-in">
            <button 
              onClick={onFullScreen}
              className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-mono p-1.5 rounded-lg hover:bg-white/10"
              title="Full Screen (Esc to close)"
            >
              <Maximize className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onExportSvg}
              disabled={isVectorizing}
              className="text-xs flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-mono bg-white/5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 border border-white/10 font-semibold disabled:opacity-50"
              title="Export as Vector SVG (Synthesis)"
            >
              {isVectorizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCode className="w-3.5 h-3.5" />} SVG
            </button>

            {onExportPdf && (
                <button
                    onClick={onExportPdf}
                    className="text-xs flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-mono bg-white/5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 border border-white/10 font-semibold"
                    title="Export as PDF"
                >
                    <FileText className="w-3.5 h-3.5" /> PDF
                </button>
            )}

            <a 
              href={`data:image/png;base64,${imageData}`} 
              download={`${title.replace(/\s+/g, '-').toLowerCase()}.png`} 
              className="text-xs flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-mono bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/10 font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </a>
          </div>
        )}
      </div>

      <div className={`flex-1 rounded-2xl overflow-hidden ${imageData ? bgClass : 'bg-slate-950/30'} relative flex items-center justify-center min-h-[300px] group border border-slate-200/10`}>
        {imageData ? (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
             {/* Styling overlays can be passed via props if needed, simpler for now */}
            <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
            <img 
              src={`data:image/png;base64,${imageData}`} 
              alt={label} 
              className="w-full h-auto object-cover transition-opacity relative z-20" 
              loading="lazy"
            />
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center animate-in fade-in">
            <Loader2 className={`w-8 h-8 animate-spin ${iconColorClass}`} />
            <p className={`${iconColorClass} font-mono text-xs animate-pulse opacity-70`}>RENDERING...</p>
          </div>
        ) : onGenerateAction ? (
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            {emptyStateMessage && <p className="text-slate-500 font-mono text-xs">{emptyStateMessage}</p>}
            <button 
              onClick={onGenerateAction}
              className={`px-5 py-2 bg-white/5 hover:bg-white/10 ${iconColorClass} border border-white/10 rounded-xl font-semibold transition-all flex items-center gap-2 font-mono text-sm`}
            >
              {GenerateIcon && <GenerateIcon className="w-4 h-4" />}
              {generateActionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
