import React from 'react';
import { Users } from 'lucide-react';

export default function OnlineUsers({ count, users }) {
    return (
        <div className="absolute bottom-6 right-4 w-56 md:w-72 h-48 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex flex-col z-30 shadow-xl overflow-hidden">
            <div className="bg-white/5 p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users size={18} className="text-festive-gold" />
                    <h3 className="font-semibold text-gray-200 text-sm">Online Users</h3>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">
                    {count} Active
                </span>
            </div>
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                {users.map(u => (
                    <div key={u.userId} className="text-xs text-gray-300 py-2 px-3 hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                        </div>
                        <span className="font-medium tracking-wide">{u.username}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}