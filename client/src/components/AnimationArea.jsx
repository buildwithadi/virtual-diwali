import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FirecrackerEngine } from '../animations/ParticleEngine';

const AnimationArea = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        engineRef.current = new FirecrackerEngine(canvas);
        engineRef.current.start();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            engineRef.current.stop();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        launchFirecracker: (type) => {
            if (engineRef.current) {
                // Launch from bottom center-ish
                const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
                const startY = window.innerHeight - 100;
                engineRef.current.launch(type, startX, startY);
            }
        }
    }));

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
    );
});

AnimationArea.displayName = 'AnimationArea';
export default AnimationArea;