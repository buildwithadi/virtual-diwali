import React from 'react';

export default function FirecrackerSelector({ onLaunch }) {
    return (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <button
                onClick={() => onLaunch('Sky Burst')}
                title="Launch Firework"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-festive-orange/50 hover:bg-white/10 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,122,0,0.5)]"
            >
                {/* Minimal Launch Icon */}
                <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22V8" />
                        <path d="M8 12l4-4 4 4" />
                        <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
                    </svg>
                </div>
                
                <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border border-white/10 whitespace-nowrap pointer-events-none">
                    Launch Sky Burst
                </span>
            </button>
        </div>
    );
}