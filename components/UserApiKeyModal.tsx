import React, { useState } from 'react';
import { Key, ExternalLink, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface UserApiKeyModalProps {
  onKeySubmitted: (apiKey: string) => void;
}

const UserApiKeyModal: React.FC<UserApiKeyModalProps> = ({ onKeySubmitted }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setError('Please enter your API key');
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
      setError('Invalid API key format. Gemini API keys typically start with "AIza"');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onKeySubmitted(trimmedKey);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
      <div className="w-full max-w-md relative overflow-hidden glass-panel rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] animate-in fade-in zoom-in-95 duration-300">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <form onSubmit={handleSubmit} className="p-8 relative z-10 flex flex-col items-center text-center space-y-6">
          
          <div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center border border-violet-500/30 shadow-xl">
            <Key className="w-8 h-8 text-violet-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-sans">Enter Your API Key</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Link2Ink requires a <span className="text-slate-200 font-semibold">Google Gemini API key</span> to generate images. Your key is only used for this session and is never stored.
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-left space-y-2">
            <p className="text-xs font-semibold text-slate-300">How to get your API key:</p>
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>Go to Google AI Studio</li>
              <li>Create or select a project</li>
              <li>Generate an API key</li>
            </ol>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !apiKey.trim()}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-slate-700 disabled:to-slate-600 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
              </>
            ) : (
              <>
                <Key className="w-5 h-5" /> Start Using Link2Ink
              </>
            )}
          </button>

          <div className="pt-4 border-t border-white/5 w-full">
            <a 
              href="https://aistudio.google.com/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              Get your API key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserApiKeyModal;
