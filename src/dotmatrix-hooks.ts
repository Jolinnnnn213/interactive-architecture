import { useEffect, useState } from 'react'
import type { DotMatrixPhase } from './dotmatrix-core'

export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

export function useDotMatrixPhases({
  animated,
  hoverAnimated,
}: {
  animated: boolean
  hoverAnimated: boolean
  speed: number
}) {
  const [hovered, setHovered] = useState(false)
  const phase: DotMatrixPhase =
    animated || (hoverAnimated && hovered) ? 'running' : 'idle'

  return {
    phase,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
}

export function useCyclePhase({
  active,
  cycleMsBase,
  speed,
}: {
  active: boolean
  cycleMsBase: number
  speed: number
}) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase(0)
      return
    }

    let raf = 0
    const startedAt = performance.now()
    const cycleDuration = cycleMsBase / Math.max(speed, 0.01)

    const tick = (now: number) => {
      setPhase(((now - startedAt) % cycleDuration) / cycleDuration)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, cycleMsBase, speed])

  return phase
}
