import React from 'react';

export default function Diya({ username, isCurrentUser }) {
    return (
        <div className="flex flex-col items-center justify-end w-16 h-20 group">
            {/* Minimal Diya */}
            <div className="relative flex flex-col items-center">
                {/* Subtle Glow */}
                <div className="absolute top-0 w-6 h-6 bg-festive-gold/30 rounded-full blur-md animate-pulse"></div>
                
                {/* Flame */}
                <div className="relative w-2.5 h-5 bg-gradient-to-t from-yellow-500 via-yellow-300 to-white rounded-[50%_50%_20%_20%] origin-bottom animate-[flicker_0.3s_infinite_alternate] z-10"></div>
                
                {/* Base */}
                <div className="relative w-8 h-3 bg-gradient-to-b from-orange-600 to-amber-900 rounded-b-full border-t border-orange-400 mt-[-2px] shadow-lg z-0"></div>
            </div>
            
            {/* Username underneath */}
            <span className={`text-[10px] sm:text-xs mt-2 truncate w-24 text-center tracking-wide ${
                isCurrentUser ? 'text-festive-gold font-bold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : 'text-gray-400'
            }`}>
                {username}
            </span>
            
            <style>{`
                @keyframes flicker {
                    0% { transform: scale(1) rotate(-2deg); opacity: 0.8; }
                    50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
                    100% { transform: scale(0.9) rotate(-1deg); opacity: 0.9; }
                }
            `}</style>
        </div>
    );
}