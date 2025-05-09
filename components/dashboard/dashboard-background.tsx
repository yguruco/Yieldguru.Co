"use client"

import { useEffect, useRef } from "react"

export default function DashboardBackground({ accentColor = "#f68b27" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const connections: Connection[] = []

    // Use the accent color plus YieldGuru brand colors
    const colors = [accentColor, "#4f1964", "#fbdc3e"]
    const connectionColor = `${accentColor}15` // Very transparent connection lines

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      originalSize: number
      angle: number
      angleSpeed: number
      pulseSpeed: number
      pulseDirection: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.originalSize = Math.random() * 3 + 0.5 // Smaller particles for dashboard
        this.size = this.originalSize
        this.speedX = Math.random() * 0.3 - 0.15 // Slower movement
        this.speedY = Math.random() * 0.3 - 0.15
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.angle = Math.random() * 360
        this.angleSpeed = Math.random() * 0.5 - 0.25
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
      }

      update() {
        // Move particle
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height

        // Pulse size
        this.size += this.pulseSpeed * this.pulseDirection
        if (this.size > this.originalSize * 1.5 || this.size < this.originalSize * 0.5) {
          this.pulseDirection *= -1
        }

        // Rotate (for non-circular particles if we add them later)
        this.angle += this.angleSpeed
      }

      draw() {
        if (!ctx) return

        // Save context state
        ctx.save()

        // Set up shadow for glow effect
        ctx.shadowColor = this.color
        ctx.shadowBlur = 5

        // Draw particle
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Restore context state
        ctx.restore()
      }
    }

    class Connection {
      particle1: Particle
      particle2: Particle
      distance: number
      maxDistance: number

      constructor(p1: Particle, p2: Particle, maxDist: number) {
        this.particle1 = p1
        this.particle2 = p2
        this.distance = 0
        this.maxDistance = maxDist
      }

      update() {
        // Calculate distance between particles
        const dx = this.particle1.x - this.particle2.x
        const dy = this.particle1.y - this.particle2.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
      }

      draw() {
        if (!ctx || this.distance > this.maxDistance) return

        // Calculate opacity based on distance
        const opacity = 1 - (this.distance / this.maxDistance)

        // Draw connection line
        ctx.beginPath()
        ctx.strokeStyle = connectionColor
        ctx.lineWidth = opacity * 0.5
        ctx.moveTo(this.particle1.x, this.particle1.y)
        ctx.lineTo(this.particle2.x, this.particle2.y)
        ctx.stroke()
      }
    }

    const init = () => {
      // Create particles
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle())
      }

      // Create connections between particles
      const maxDistance = 150 // Maximum distance for connections

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          connections.push(new Connection(particles[i], particles[j], maxDistance))
        }
      }
    }

    const animate = () => {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw connections
      for (let i = 0; i < connections.length; i++) {
        connections[i].update()
        connections[i].draw()
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    init()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [accentColor])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-15 pointer-events-none" />
}
