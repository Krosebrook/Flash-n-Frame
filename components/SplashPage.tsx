import React, { useEffect, useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

interface SplashPageProps {
  onComplete: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'exit'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    const readyTimer = setTimeout(() => {
      setPhase('ready');
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(readyTimer);
    };
  }, []);

  const handleEnter = () => {
    setPhase('exit');
    setTimeout(onComplete, 600);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: '#0a0a12'
      }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/splash-circuit-bg.png)',
          opacity: 0.8
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a12]/90" />
      
      <div className="absolute inset-0">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            top: '10%',
            left: '20%'
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-25 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #2B6C85 0%, transparent 70%)',
            top: '50%',
            right: '30%',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <div className="relative">
          <div 
            className="absolute -inset-8 rounded-full blur-2xl opacity-50 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #2B6C85 50%, #ec4899 100%)'
            }}
          />
          
          <div 
            className="relative p-6 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Zap className="w-16 h-16 text-white" style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))' }} />
          </div>
        </div>

        <div className="text-center">
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-2"
            style={{
              fontFamily: 'Roboto Condensed, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #2B6C85 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(139, 92, 246, 0.5)'
            }}
          >
            Flash-n-Frame
          </h1>
          <p 
            className="text-lg md:text-xl tracking-widest uppercase"
            style={{
              fontFamily: 'Rubik, sans-serif',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Visual Intelligence Platform
          </p>
        </div>

        {phase === 'loading' && (
          <div className="w-64 md:w-80">
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #2B6C85 50%, #ec4899 100%)'
                }}
              />
            </div>
            <p 
              className="text-center mt-3 text-sm"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              Initializing...
            </p>
          </div>
        )}

        {phase === 'ready' && (
          <button
            onClick={handleEnter}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: 'Rubik, sans-serif',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(43, 108, 133, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: 'white',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
            }}
          >
            <span>Enter Studio</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        )}

      </div>

      <div 
        className="absolute bottom-8 left-0 right-0 text-center text-sm z-10"
        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
      >
        Powered by INT Inc
      </div>
    </div>
  );
};

export default SplashPage;
