import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Volume2, VolumeX } from 'lucide-react';

import Diya from '../components/Diya';
import AnimationArea from '../components/AnimationArea';
import FirecrackerSelector from '../components/FireCrackerSelector';
import ActivityFeed from '../components/ActivityFeed';
import CityBackground from '../components/CityBackground';
import { socket } from '../services/socket';

const PUBLIC_ROOM_CODE = 'DIWALI_2026';

const SOUND_CONFIG = {
    'Sky Burst': { file: '/shot.mp3', volume: 0.7 } 
};

export default function Celebration() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // Default to true so the UI matches the autoplay attempt
    const [isSoundOn, setIsSoundOn] = useState(true);
    const isSoundOnRef = useRef(isSoundOn);
    
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    // Keep the ref in sync with the state
    useEffect(() => {
        isSoundOnRef.current = isSoundOn;
    }, [isSoundOn]);

    // Handle initial volume and force play
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.15; // Keep it atmospheric 
            
            // Explicitly call play() and catch any browser blocks
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Autoplay started successfully
                        setIsSoundOn(true);
                    })
                    .catch(err => {
                        // Browser blocked autoplay (e.g., if user refreshed the page directly)
                        console.log("Autoplay prevented by browser:", err);
                        setIsSoundOn(false);
                    });
            }
        }
    }, []);

    const addActivity = useCallback((username, action) => {
        setActivities(prev => [...prev, {
            id: Date.now() + Math.random(),
            username,
            action,
            timestamp: new Date()
        }].slice(-50));
    }, []);

    useEffect(() => {
        const session = localStorage.getItem('diwali_user');
        if (!session) {
            navigate('/');
            return;
        }
        
        const currentUser = JSON.parse(session);
        setUser(currentUser);

        socket.connect();

        socket.on('connect', () => {
            socket.emit('join-room', { 
                userId: currentUser.id, 
                roomCode: PUBLIC_ROOM_CODE 
            });
        });

        socket.on('room-state', (state) => {
            setOnlineUsers(state.users);
        });

        socket.on('user-joined', (data) => {
            addActivity(data.username, 'joined the celebration ✨');
        });

        socket.on('user-left', (data) => {
            addActivity(data.username, 'left the room 🏃‍♂️');
        });

        socket.on('firecracker-launched', (data) => {
            if (animationRef.current) {
                animationRef.current.launchFirecracker(data.firecrackerType);
            }
            
            addActivity(data.username, `launched a ${data.firecrackerType} 🎆`);

            if (isSoundOnRef.current) {
                const config = SOUND_CONFIG[data.firecrackerType] || { file: '/shot.mp3', volume: 0.7 };
                const shotSound = new Audio(config.file);
                shotSound.volume = config.volume; 
                shotSound.play().catch(err => console.log("Audio play prevented:", err));
            }
        });

        return () => {
            socket.off('connect');
            socket.off('room-state');
            socket.off('user-joined');
            socket.off('user-left');
            socket.off('firecracker-launched');
            socket.disconnect();
        };
    }, [navigate, addActivity]);

    const toggleSound = () => {
        if (isSoundOn) {
            audioRef.current.pause();
            setIsSoundOn(false);
        } else {
            audioRef.current.play().catch(err => console.log("Audio play prevented:", err));
            setIsSoundOn(true);
        }
    };

    const handleLeave = () => {
        socket.disconnect();
        localStorage.removeItem('diwali_user');
        navigate('/');
    };

    const handleLaunch = (type) => {
        if (!user) return;
        socket.emit('launch-firecracker', { firecrackerType: type });
    };

    if (!user) return null;

    return (
        <div className="relative min-h-screen bg-[#02010a] overflow-hidden">
            
            {/* Added autoPlay attribute here */}
            <audio 
                ref={audioRef} 
                src="/background.mp3" 
                loop 
                autoPlay
                preload="auto" 
            />

            <CityBackground />

            {/* Transparent Header */}
            <header className="relative z-30 flex justify-between items-center p-6 bg-transparent">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-festive-gold to-festive-orange drop-shadow-md">
                    Virtual Diwali
                </h1>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSound} 
                        className={`p-2 rounded-full transition-colors border backdrop-blur-md ${
                            isSoundOn 
                                ? 'bg-festive-orange/20 text-festive-gold border-festive-gold/30' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                        title={isSoundOn ? "Mute Game" : "Unmute Game"}
                    >
                        {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>

                    <button onClick={handleLeave} className="flex items-center gap-2 text-sm bg-red-500/20 text-red-300 hover:bg-red-500/40 backdrop-blur-md px-3 py-2 rounded-lg transition-colors border border-red-500/30 shadow-lg">
                        <LogOut size={16} /> Leave
                    </button>
                </div>
            </header>
            
            <ActivityFeed activities={activities} />
            <FirecrackerSelector onLaunch={handleLaunch} />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30 pointer-events-none flex flex-col items-center">
                <div className="flex flex-wrap justify-center items-end gap-x-6 gap-y-4">
                    {onlineUsers.map(u => (
                        <Diya 
                            key={u.userId} 
                            username={u.username} 
                            isCurrentUser={u.userId === user.id}
                        />
                    ))}
                </div>
            </div>

            <AnimationArea ref={animationRef} />
        </div>
    );
}