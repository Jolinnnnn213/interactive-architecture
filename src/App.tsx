import { useEffect, useRef, useState } from 'react'
import { DotmCircular7 } from './DotmCircular7'

const BG_IMAGE_1 = '/images/background-model-expanded.png'
const BG_IMAGE_2 = '/images/foreground-model-expanded.png'

const SPOTLIGHT_R = 260

type RevealLayerProps = {
  image: string
  cursorX: number
  cursorY: number
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    const gradient = context.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    context.fillStyle = gradient
    context.beginPath()
    context.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    context.fill()

    const mask = `url(${canvas.toDataURL()})`
    reveal.style.maskImage = mask
    reveal.style.webkitMaskImage = mask
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image}), linear-gradient(to bottom, #edf2f8 0%, #e3e9ef 42%, #000000 72%, #000000 100%)`,
          backgroundPosition: 'center, center',
          backgroundSize: '102% auto, 100% 100%',
          backgroundRepeat: 'no-repeat, no-repeat',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />
    </>
  )
}

function App() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | undefined>(undefined)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX
      mouse.current.y = event.clientY
    }

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="w-[102%] shrink-0 bg-center bg-cover bg-no-repeat hero-zoom"
            style={{
              aspectRatio: `${6336} / ${3000}`,
              backgroundImage: `url(${BG_IMAGE_1})`,
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
            }}
          />
        </div>

        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        <div className="absolute top-5 left-6 sm:top-7 sm:left-8 z-50 text-white text-base sm:text-lg font-light uppercase tracking-[0.18em] mix-blend-difference pointer-events-none">
          Jolin Li
        </div>

        <div className="absolute top-8 right-2 sm:top-10 sm:right-3 z-50 origin-top-right rotate-45 scale-[0.6] mix-blend-difference">
          <DotmCircular7 aria-label="Animated architectural dot matrix" />
        </div>
      </section>
    </div>
  )
}

export default App
