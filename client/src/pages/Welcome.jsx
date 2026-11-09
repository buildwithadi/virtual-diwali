import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Welcome() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem('diwali_user');
        if (session) {
            navigate('/celebration');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Only passing username now
            const data = await registerUser(username);
            localStorage.setItem('diwali_user', JSON.stringify(data.user));
            navigate('/celebration');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020104] px-6 selection:bg-orange-500/30">
            
            <div className="w-full max-w-sm flex flex-col items-center">
                
                <div className="relative flex flex-col items-center mb-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-2.5 h-4 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 rounded-[50%_50%_20%_20%] shadow-[0_0_15px_rgba(255,122,0,0.8)] z-10"></div>
                    <div className="relative w-7 h-2 border-b border-orange-500/30 rounded-[50%] mt-0.5 z-0"></div>
                </div>
                
                <p className="text-white/30 italic text-xs md:text-sm leading-relaxed tracking-wider font-light text-center mb-16">
                    "Miles away from home, yet sharing the same sky. <br className="hidden md:block"/> 
                    Tonight, we light up the dark together."
                </p>

                <form 
                    onSubmit={handleSubmit} 
                    className="w-full flex flex-col items-center space-y-6"
                >
                    <div className="w-full max-w-[240px]">
                        <input 
                            type="text" 
                            required
                            placeholder="Enter a Username" 
                            className="w-full bg-transparent border-b border-white/10 pb-2 text-center focus:outline-none focus:border-orange-500/40 text-white/80 placeholder-white/20 transition-colors text-sm font-light tracking-wide"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400/70 text-xs text-center">{error}</p>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="mt-8 text-[10px] tracking-[0.2em] text-white/40 uppercase transition-all hover:text-orange-400 disabled:opacity-50"
                    >
                        {isLoading ? 'Lighting...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
}