import React, { useEffect, useRef } from "react";

interface ParticleOptions {
  particleColor: string;
  lineColor: string;
  particleAmount: number;
  defaultRadius: number;
  variantRadius: number;
  defaultSpeed: number;
  variantSpeed: number;
  linkRadius: number;
}

interface Particle {
  x: number;
  y: number;
  color: string;
  radius: number;
  speed: number;
  directionAngle: number;
  vector: { x: number; y: number };
  update: () => void;
  border: () => void;
  draw: () => void;
}

const ParticleEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const options: ParticleOptions = {
      particleColor: "rgba(255,255,255)",
      lineColor: "rgba(0,181,255)",
      particleAmount: 60,
      defaultRadius: 2,
      variantRadius: 2,
      defaultSpeed: 1,
      variantSpeed: 1,
      linkRadius: 300,
    };

    const particles: Particle[] = [];
    const loopIds: number[] = [];

    function initCanvas(
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D
    ) {
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);

      function resizeReset() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function initialiseParticles() {
        particles.length = 0; // Clear previous particles
        for (let i = 0; i < options.particleAmount; i++) {
          particles.push(createParticle(w, h));
        }
      }

      function createParticle(w: number, h: number): Particle {
        const angle = Math.random() * 360; // Random angle in degrees
        const radians = angle * (Math.PI / 180); // Convert to radians

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          color: options.particleColor,
          radius: options.defaultRadius + Math.random() * options.variantRadius,
          speed: options.defaultSpeed + Math.random() * options.variantSpeed,
          directionAngle: angle,
          vector: {
            x:
              Math.cos(radians) *
              (options.defaultSpeed + Math.random() * options.variantSpeed),
            y:
              Math.sin(radians) *
              (options.defaultSpeed + Math.random() * options.variantSpeed),
          },
          update() {
            this.border();
            this.x += this.vector.x;
            this.y += this.vector.y;
          },
          border() {
            if (this.x >= w || this.x <= 0) this.vector.x *= -1;
            if (this.y >= h || this.y <= 0) this.vector.y *= -1;
            if (this.x > w) this.x = w;
            if (this.y > h) this.y = h;
            if (this.x < 0) this.x = 0;
            if (this.y < 0) this.y = 0;
          },
          draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
          },
        };
      }

      function drawLine() {
        const rgb = options.lineColor.match(/\d+/g) || ["0", "0", "0"];
        for (let i = 0; i < particles.length; i++) {
          for (let j = 0; j < particles.length; j++) {
            const distance = checkDistance(particles[i], particles[j]);
            const opacity = 1 - distance / options.linkRadius;
            if (opacity > 0) {
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
      }

      function checkDistance(p1: Particle, p2: Particle): number {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      }

      function animationLoop() {
        ctx.clearRect(0, 0, w, h);
        drawLine();
        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
        loopIds.forEach((id) => cancelAnimationFrame(id));
        loopIds.push(requestAnimationFrame(animationLoop));
      }

      window.addEventListener("resize", resizeReset);
      initialiseParticles();
      animationLoop();
    }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        initCanvas(canvas, ctx);
      }
    }

    return () => {
      loopIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed bg-neutral-800 inset-0 z-[-10]" />
  );
};

export default ParticleEffect;
