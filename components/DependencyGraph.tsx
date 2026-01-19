/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DependencyInfo } from '../types';
import { fetchRepoDependencies } from '../services/githubService';
import { generateDependencyGraph, analyzeDependencies } from '../services/geminiService';
import { 
  Package, AlertTriangle, Shield, ShieldAlert, ShieldCheck,
  Loader2, Download, Maximize, RefreshCw, Box
} from 'lucide-react';
import ImageViewer from './ImageViewer';

interface DependencyGraphProps {
  owner: string;
  repo: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ owner, repo }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [dependencies, setDependencies] = useState<DependencyInfo[]>([]);
  const [ecosystem, setEcosystem] = useState<string>('');
  const [manifestFile, setManifestFile] = useState<string>('');
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<{src: string, alt: string} | null>(null);

  const handleScanDependencies = async () => {
    setLoading(true);
    setError(null);
    setDependencies([]);
    setGraphImage(null);
    setAnalysisSummary('');
    
    try {
      setLoadingStage('SCANNING MANIFEST FILES');
      const result = await fetchRepoDependencies(owner, repo);
      
      if (result.dependencies.length === 0) {
        throw new Error('No dependency manifest found (package.json, requirements.txt, Cargo.toml, or go.mod)');
      }
      
      setDependencies(result.dependencies);
      setEcosystem(result.ecosystem);
      setManifestFile(result.manifestFile);
      
      setLoadingStage('ANALYZING SECURITY');
      setAnalyzing(true);
      const { analyzed, summary } = await analyzeDependencies(result.dependencies, result.ecosystem);
      setDependencies(analyzed);
      setAnalysisSummary(summary);
      setAnalyzing(false);
      
      setLoadingStage('GENERATING VISUAL');
      const graphBase64 = await generateDependencyGraph(repo, analyzed, result.ecosystem);
      
      if (graphBase64) {
        setGraphImage(graphBase64);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to scan dependencies');
    } finally {
      setLoading(false);
      setAnalyzing(false);
      setLoadingStage('');
    }
  };

  const handleDownload = () => {
    if (!graphImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${graphImage}`;
    link.download = `${repo}-dependencies.png`;
    link.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'production': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'development': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'peer': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const prodDeps = dependencies.filter(d => d.type === 'production');
  const devDeps = dependencies.filter(d => d.type === 'development');
  const peerDeps = dependencies.filter(d => d.type === 'peer');
  const alertDeps = dependencies.filter(d => d.securityAlert);

  return (
    <div className="space-y-6">
      {fullScreenImage && (
        <ImageViewer 
          src={fullScreenImage.src} 
          alt={fullScreenImage.alt} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}

      {!dependencies.length && !loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-white/10 mb-6">
            <Package className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Dependency Scanner</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Scan package manifests to visualize all dependencies with version info and security analysis.
          </p>
          <button
            onClick={handleScanDependencies}
            disabled={loading || !owner || !repo}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-bold hover:from-violet-400 hover:to-indigo-400 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto shadow-lg shadow-violet-500/20"
          >
            <Shield className="w-5 h-5" />
            Scan Dependencies
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">{loadingStage}</p>
        </div>
      )}

      {error && (
        <div className="glass-panel rounded-xl p-4 border border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {dependencies.length > 0 && !loading && (
        <div className="space-y-6">
          {/* Summary Header */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                  <Package className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{repo}</h3>
                  <p className="text-xs text-slate-500 font-mono">{manifestFile} ({ecosystem})</p>
                </div>
              </div>
              <button
                onClick={handleScanDependencies}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
                title="Rescan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">{prodDeps.length}</p>
                <p className="text-[10px] uppercase text-emerald-400/70 font-mono">Production</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">{devDeps.length}</p>
                <p className="text-[10px] uppercase text-blue-400/70 font-mono">Development</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-orange-400">{peerDeps.length}</p>
                <p className="text-[10px] uppercase text-orange-400/70 font-mono">Peer</p>
              </div>
              <div className={`border rounded-xl p-3 text-center ${alertDeps.length > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
                <p className={`text-2xl font-bold ${alertDeps.length > 0 ? 'text-red-400' : 'text-slate-400'}`}>{alertDeps.length}</p>
                <p className={`text-[10px] uppercase font-mono ${alertDeps.length > 0 ? 'text-red-400/70' : 'text-slate-400/70'}`}>Alerts</p>
              </div>
            </div>

            {/* Analysis Summary */}
            {analysisSummary && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                {alertDeps.length > 0 ? (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-slate-300">{analysisSummary}</p>
              </div>
            )}
          </div>

          {/* Security Alerts */}
          {alertDeps.length > 0 && (
            <div className="glass-panel rounded-2xl p-4">
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Security Alerts ({alertDeps.length})
              </h4>
              <div className="space-y-2">
                {alertDeps.map((dep, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(dep.securityAlert?.severity || 'low')}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold">{dep.name}@{dep.version}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-current/10">
                        {dep.securityAlert?.severity}
                      </span>
                    </div>
                    <p className="text-xs opacity-80">{dep.securityAlert?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Graph */}
          {graphImage && (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-950/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-violet-400" />
                  <h4 className="text-sm font-bold text-slate-300 font-mono">Dependency Visualization</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFullScreenImage({ src: `data:image/png;base64,${graphImage}`, alt: `${repo} Dependencies` })}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <img 
                  src={`data:image/png;base64,${graphImage}`} 
                  alt={`${repo} Dependency Graph`}
                  className="w-full rounded-xl border border-white/10 cursor-pointer hover:border-violet-500/50 transition-all"
                  onClick={() => setFullScreenImage({ src: `data:image/png;base64,${graphImage}`, alt: `${repo} Dependencies` })}
                />
              </div>
            </div>
          )}

          {/* Dependency List */}
          <div className="glass-panel rounded-2xl p-4">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              All Dependencies ({dependencies.length})
            </h4>
            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
              {dependencies.map((dep, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded-lg ${dep.securityAlert ? 'bg-red-500/5 border border-red-500/20' : 'bg-white/5 border border-transparent hover:border-white/10'} transition-all`}
                >
                  <div className="flex items-center gap-2">
                    {dep.securityAlert ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="font-mono text-sm text-white">{dep.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">{dep.version}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold ${getTypeColor(dep.type)}`}>
                      {dep.type.slice(0, 3)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;
