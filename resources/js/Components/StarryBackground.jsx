import React, { useEffect, useRef } from 'react';

const StarryBackground = ({ children }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const shootingStars = [];
        const numStars = 200;
        const numShootingStars = 3;

        // Create stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random(),
                twinkleSpeed: 0.005 + Math.random() * 0.005,
                color: Math.random() > 0.8 ? '#ffffff' : '#f0f0ff'
            });
        }

        // Create shooting stars
        for (let i = 0; i < numShootingStars; i++) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 80 + 20,
                speed: Math.random() * 10 + 5,
                opacity: 0,
                fadeSpeed: 0.01,
                active: false,
                angle: Math.random() * Math.PI / 4 + Math.PI / 6
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update stars
            stars.forEach(star => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Add glow effect for some stars
                if (star.radius > 1) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            // Draw and update shooting stars
            shootingStars.forEach(star => {
                if (!star.active) {
                    if (Math.random() < 0.001) {
                        star.active = true;
                        star.opacity = 1;
                        star.x = Math.random() * canvas.width;
                        star.y = Math.random() * canvas.height * 0.5;
                    }
                    return;
                }

                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity -= star.fadeSpeed;

                if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
                    star.active = false;
                    return;
                }

                // Draw shooting star trail
                const gradient = ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );
                ctx.stroke();

                // Add glow
                ctx.beginPath();
                ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%)' }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default StarryBackground;
