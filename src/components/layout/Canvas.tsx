import { useEffect, useRef, useState } from 'react'
import { ParticleOptions, Particle } from '@/types'

function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const particleOptions: ParticleOptions = {
    particleColor: '#fff',
    lineColor: 'rgba(255, 255, 255, 0.1)',
    particleAmount: 30,
    defaultRadius: 2,
    variantRadius: 2,
    defaultSpeed: 1,
    variantSpeed: 1,
    linkRadius: 220,
  }

  useEffect(() => {
    if (canvasRef.current) {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      const ctx = canvasRef.current.getContext('2d')
      setContext(ctx)
    }

    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const createParticle = (ctx: CanvasRenderingContext2D): Particle => {
    let x = Math.random() * width
    let y = Math.random() * height
    const color = particleOptions.particleColor
    const radius =
      particleOptions.defaultRadius +
      Math.random() * particleOptions.variantRadius
    const speed =
      particleOptions.defaultSpeed +
      Math.random() * particleOptions.variantSpeed
    const directionAngle = Math.PI * 2 * Math.random()

    const vector = {
      x: Math.cos(directionAngle) * speed,
      y: Math.sin(directionAngle) * speed,
    }

    const update = () => {
      x += vector.x
      y += vector.y
    }

    const border = () => {
      if (x >= width || x <= 0) {
        vector.x *= -1
      }
      if (y >= height || y <= 0) {
        vector.y *= -1
      }
      if (x > width) x = width
      if (y > height) y = height
      if (x < 0) x = 0
      if (y < 0) y = 0
    }

    const draw = () => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    return {
      x,
      y,
      color,
      radius,
      speed,
      directionAngle,
      vector,
      update,
      border,
      draw,
    }
  }

  useEffect(() => {
    if (context && width && height) {
      const newParticles: Particle[] = []
      for (let i = 0; i < particleOptions.particleAmount; i++) {
        newParticles.push(createParticle(context))
      }
      setParticles(newParticles)
    }
  }, [context, width, height])

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      if (context && width && height) {
        context.clearRect(0, 0, width, height)

        particles.forEach(particle => {
          particle.update()
          particle.border()
          particle.draw()
        })

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < particleOptions.linkRadius) {
              context.beginPath()
              context.moveTo(particles[i].x, particles[i].y)
              context.lineTo(particles[j].x, particles[j].y)
              context.strokeStyle = particleOptions.lineColor
              context.lineWidth = 0.5
              context.stroke()
              context.closePath()
            }
          }
        }

        animationFrameId = window.requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [context, particles, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  )
}

export default ParticleEffect
