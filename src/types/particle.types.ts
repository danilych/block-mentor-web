export interface ParticleOptions {
  particleColor: string
  lineColor: string
  particleAmount: number
  defaultRadius: number
  variantRadius: number
  defaultSpeed: number
  variantSpeed: number
  linkRadius: number
}

export interface Particle {
  x: number
  y: number
  color: string
  radius: number
  speed: number
  directionAngle: number
  vector: { x: number; y: number }
  update: () => void
  border: () => void
  draw: () => void
}
