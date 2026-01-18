
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { RepoHistoryItem, ArticleHistoryItem } from '../types';
import { Clock, Search, FilterX } from 'lucide-react';

type HistoryItem = RepoHistoryItem | ArticleHistoryItem;

interface HistoryGridProps {
  items: HistoryItem[];
  onSelect: (item: any) => void; // Using any here to simplify unified interface, type guards used inside logic if needed
  type: 'repo' | 'article';
}

/**
 * Reusable component for displaying history grids with search/filter capabilities.
 * Implements performance optimizations via useMemo.
 */
export const HistoryGrid: React.FC<HistoryGridProps> = ({ items, onSelect, type }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (type === 'repo') {
        const i = item as RepoHistoryItem;
        return i.repoName.toLowerCase().includes(lowerQuery);
      } else {
        const i = item as ArticleHistoryItem;
        return (
            i.title.toLowerCase().includes(lowerQuery) || 
            i.url.toLowerCase().includes(lowerQuery)
        );
      }
    });
  }, [items, searchQuery, type]);

  if (items.length === 0) return null;

  return (
    <div className="pt-12 border-t border-white/5 animate-in fade-in space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <h3 className="text-sm font-mono uppercase tracking-wider">
                    Recent {type === 'repo' ? 'Blueprints' : 'Sketches'}
                </h3>
            </div>
            
            {/* Search / Filter Input */}
            <div className="relative max-w-sm w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search className="w-4 h-4" />
                </div>
                <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Filter ${type === 'repo' ? 'repos' : 'articles'}...`}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 font-mono transition-all shadow-inner"
                />
            </div>
        </div>

        {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                    const isRepo = type === 'repo';
                    const repoItem = item as RepoHistoryItem;
                    const artItem = item as ArticleHistoryItem;
                    
                    const title = isRepo ? repoItem.repoName : artItem.title;
                    const subtitle = isRepo ? repoItem.style : new URL(artItem.url).hostname;
                    const shadowClass = isRepo ? 'hover:shadow-neon-violet' : 'hover:shadow-neon-emerald';
                    const borderHover = isRepo ? 'hover:border-violet-500/50' : 'hover:border-emerald-500/50';

                    return (
                        <button 
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`group bg-slate-900/50 border border-white/5 ${borderHover} rounded-xl overflow-hidden text-left transition-all ${shadowClass}`}
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-950">
                                <img 
                                    src={`data:image/png;base64,${item.imageData}`} 
                                    alt={title} 
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                                />
                                {isRepo && repoItem.is3D && (
                                    <div className="absolute top-2 right-2 bg-fuchsia-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10">3D</div>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-bold text-white truncate font-mono">{title}</p>
                                <p className="text-[10px] text-slate-500 mt-1 truncate">{subtitle}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-4 glass-panel rounded-3xl border-dashed border-white/5 opacity-50">
                <FilterX className="w-8 h-8 text-slate-600" />
                <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">No matching results found</p>
            </div>
        )}
    </div>
  );
};
