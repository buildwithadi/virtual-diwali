import React from 'react';

export default function FirecrackerSelector({ onLaunch }) {
    return (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <button
                onClick={() => onLaunch('Sky Burst')}
                title="Launch Sky Burst"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-festive-orange/50 hover:bg-white/10 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,122,0,0.5)]"
            >
                {/* Diwali Rocket / Shot Icon */}
                <div className="w-7 h-7">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Rocket Tip (Solid) */}
                        <path d="M12 2l-3 5h6z" fill="currentColor" stroke="none" />
                        
                        {/* Rocket Body */}
                        <path d="M9 7h6v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V7z" />
                        
                        {/* Stick */}
                        <path d="M12 14v8" />
                        
                        {/* Engine Sparks */}
                        <path d="M9 16l-2 3" />
                        <path d="M15 16l2 3" />
                    </svg>
                </div>
                
                <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border border-white/10 whitespace-nowrap pointer-events-none">
                    Launch Sky Burst
                </span>
            </button>
        </div>
    );
}