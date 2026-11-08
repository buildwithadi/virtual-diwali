import React, { useEffect, useRef } from 'react';

export default function ActivityFeed({ activities }) {
    const feedEndRef = useRef(null);

    useEffect(() => {
        feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activities]);

    return (
        <div 
            className="absolute top-16 right-4 w-56 h-48 flex flex-col z-30 pointer-events-none"
            // This mask creates a smooth fade-to-transparent at the top of the container
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' }}
        >
            <div className="flex-1 overflow-y-auto space-y-2 pb-2 custom-scrollbar flex flex-col justify-end">
                {activities.length === 0 ? (
                    <p className="text-white/30 text-xs text-right animate-pulse">Awaiting launches...</p>
                ) : (
                    activities.map((act) => (
                        <div 
                            key={act.id} 
                            className="text-xs text-white/50 text-right animate-[fadeIn_0.5s_ease-out] drop-shadow-md"
                        >
                            <span className="text-festive-orange/80 font-medium">{act.username}</span> 
                            <span className="ml-1 opacity-80">{act.action}</span>
                        </div>
                    ))
                )}
                <div ref={feedEndRef} />
            </div>
        </div>
    );
}