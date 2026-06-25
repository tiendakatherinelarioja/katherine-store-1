import React, { useEffect, useRef } from 'react';

export default function StarsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    
    // Adjust density based on screen size
    const getStarCount = () => {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.floor(area / 7000), 250); // limit max stars for performance
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = getStarCount();
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3, // varied sizes
          alpha: Math.random() * 0.8 + 0.2,
          alphaSpeed: 0.003 + Math.random() * 0.008, // slow twinkling
          direction: Math.random() > 0.5 ? 1 : -1,
          speedX: (Math.random() - 0.5) * 0.04, // very slow horizontal drift
          speedY: (Math.random() - 0.5) * 0.04  // very slow vertical drift
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // Update positions (slow drift)
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle update
        star.alpha += star.alphaSpeed * star.direction;
        if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.direction = 1;
        } else if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 block"
    />
  );
}
