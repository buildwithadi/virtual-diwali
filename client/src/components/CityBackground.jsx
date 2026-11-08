import React, { useMemo } from 'react';

export default function CityBackground() {
    // Buildings are much shorter (max 28% height) to create a distant horizon
    // Widths are smaller to make them look further away
    const buildings = useMemo(() => [
        { id: 1, left: '-2%', width: '10%', height: '15%', windows: 16, color: 'bg-[#06040a]' },
        { id: 2, left: '6%', width: '8%', height: '22%', windows: 24, color: 'bg-[#08050e]' },
        { id: 3, left: '13%', width: '12%', height: '18%', windows: 20, color: 'bg-[#040207]' },
        { id: 4, left: '24%', width: '7%', height: '28%', windows: 32, color: 'bg-[#07040c]' },
        { id: 5, left: '30%', width: '15%', height: '20%', windows: 24, color: 'bg-[#050308]' },
        { id: 6, left: '44%', width: '10%', height: '30%', windows: 36, color: 'bg-[#08050e]' },
        { id: 7, left: '53%', width: '14%', height: '22%', windows: 24, color: 'bg-[#040207]' },
        { id: 8, left: '66%', width: '8%', height: '16%', windows: 16, color: 'bg-[#07040c]' },
        { id: 9, left: '73%', width: '13%', height: '26%', windows: 28, color: 'bg-[#050308]' },
        { id: 10, left: '85%', width: '16%', height: '19%', windows: 20, color: 'bg-[#06040a]' },
    ], []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#010105] via-[#04020a] to-[#0a0512]">
            
            {/* Vast Empty Night Sky */}
            <div className="absolute top-0 w-full h-[70%]">
                {/* Subtle moon/city glow at the very bottom of the sky */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-48 bg-festive-orange/5 rounded-[100%] blur-3xl opacity-50"></div>
            </div>

            {/* Distant City Skyline */}
            <div className="absolute bottom-0 w-full h-full flex items-end">
                {buildings.map((b) => (
                    <div
                        key={b.id}
                        className={`absolute bottom-0 ${b.color} border-t border-l border-r border-white/5 shadow-2xl`}
                        style={{
                            left: b.left,
                            width: b.width,
                            height: b.height,
                        }}
                    >
                        {/* Tiny Rooftop Diyas (Scaled down to match the distance) */}
                        <div className="absolute -top-1 left-0.5 w-1.5 h-2 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-[50%_50%_20%_20%] blur-[0.5px] animate-pulse shadow-[0_0_5px_#ff7a00]"></div>
                        <div className="absolute -top-1 right-0.5 w-1.5 h-2 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-[50%_50%_20%_20%] blur-[0.5px] animate-pulse shadow-[0_0_5px_#ff7a00]"></div>

                        {/* Windows Grid */}
                        {/* More columns (grid-cols-4) so windows look smaller/further away */}
                        <div className="w-full h-full p-2 grid grid-cols-4 gap-1.5 content-start mt-4 opacity-70">
                            {[...Array(b.windows)].map((_, i) => {
                                // Extremely minimal lights: only ~1 in 12 windows will be lit
                                const isLit = (i * b.id + i) % 12 === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-full pt-[100%] rounded-[1px] transition-colors ${
                                            isLit 
                                                ? 'bg-yellow-500/40 shadow-[0_0_3px_rgba(234,179,8,0.3)]' 
                                                : 'bg-white/[0.02]' // Barely visible unlit windows
                                        }`}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Dark gradient overlay at the bottom to create distance haze and blend with the UI */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#020108] via-[#04020a]/80 to-transparent"></div>
        </div>
    );
}