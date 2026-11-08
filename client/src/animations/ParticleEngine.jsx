// The Explosion Particles
class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.color = color;
        this.life = life; this.maxLife = life;
        this.size = size;
        this.alpha = 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.04; // Gentle Gravity
        this.life--;
        this.alpha = Math.max(0, this.life / this.maxLife);
    }
    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// The Ascending Projectile (Calculated to take > 1 second)
class Rocket {
    constructor(engine) {
        this.engine = engine;
        this.exploded = false;
        
        // Start exactly at the bottom, randomized slightly across the center width
        this.x = (engine.canvas.width / 2) + (Math.random() * 300 - 150);
        this.y = engine.canvas.height; 
        
        // Target explosion height (top 15% to 35% of the sky)
        this.targetY = engine.canvas.height * (0.15 + Math.random() * 0.2);
        
        // Random Explosion Color
        this.explosionColor = engine.colors[Math.floor(Math.random() * engine.colors.length)];

        // --- KINEMATIC PHYSICS CALCULATION ---
        // Force the flight to take between 75 and 95 frames (1.25 to 1.6 seconds at 60fps)
        const flightFrames = 75 + Math.random() * 20; 
        const distanceY = this.y - this.targetY;
        
        // Calculate exact gravity (ay) and initial velocity (vy) needed to reach targetY at exactly 0 velocity
        this.ay = (2 * distanceY) / (flightFrames * flightFrames); 
        this.vy = -(this.ay * flightFrames); 
        
        // Slight horizontal wind drift
        this.vx = (Math.random() - 0.5) * 1.5; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.ay; // Apply exact calculated gravity

        // Dense trailing sparks
        for (let i = 0; i < 2; i++) {
            this.engine.trailParticles.push(
                new Particle(
                    this.x + (Math.random() - 0.5) * 2, 
                    this.y + 5, 
                    (Math.random() - 0.5), 
                    Math.random() * 2 + 1, // falling down
                    '#FFA500', 
                    15 + Math.random() * 10, 
                    1.5
                )
            );
        }

        // Explode exactly when vertical velocity reaches 0 (Apex of flight)
        // or as a fallback if it passes the target height.
        if (this.vy >= 0 || this.y <= this.targetY) {
            this.explode();
        }
    }

    explode() {
        this.exploded = true;
        this.engine.createBurst(this.x, this.y, this.explosionColor);
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FFA500';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

export class FirecrackerEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rockets = [];
        this.particles = [];
        this.trailParticles = [];
        this.frameId = null;
        this.lastTime = 0;
        
        // Vibrant Festive Colors
        this.colors = ['#FF3366', '#33FF33', '#33CCFF', '#FFFF33', '#FF9933', '#FF33FF'];
    }

    start() {
        const loop = (timestamp) => {
            this.frameId = requestAnimationFrame(loop);
            
            // FPS THROTTLE: Ensures the physics runs at a consistent 60fps 
            // even on 144hz/240hz gaming monitors.
            const dt = timestamp - this.lastTime;
            if (dt < 16) return; // Wait until ~16ms has passed (1000ms / 60fps)
            this.lastTime = timestamp;

            // Darker fade for a cleaner trail effect
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update & Draw Rockets
            for (let i = this.rockets.length - 1; i >= 0; i--) {
                const r = this.rockets[i];
                r.update();
                if (r.exploded) {
                    this.rockets.splice(i, 1);
                } else {
                    r.draw(this.ctx);
                }
            }

            // Update & Draw Trail Particles
            for (let i = this.trailParticles.length - 1; i >= 0; i--) {
                const p = this.trailParticles[i];
                p.update();
                p.draw(this.ctx);
                if (p.life <= 0) this.trailParticles.splice(i, 1);
            }

            // Update & Draw Explosion Particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.update();
                p.draw(this.ctx);
                if (p.life <= 0) this.particles.splice(i, 1);
            }
        };
        requestAnimationFrame(loop);
    }

    stop() {
        cancelAnimationFrame(this.frameId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createBurst(x, y, color) {
        const particleCount = 200;
        const maxSpeed = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * maxSpeed + 1;
            
            // Add a slight chance for a white spark to make the explosion pop
            const pColor = Math.random() > 0.85 ? '#FFFFFF' : color;
            
            this.particles.push(
                new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, pColor, 70 + Math.random() * 50, 1.5 + Math.random())
            );
        }
    }

    launch(type) {
        // No need to pass X/Y coordinates anymore, the Rocket handles it dynamically
        this.rockets.push(new Rocket(this));
    }
}