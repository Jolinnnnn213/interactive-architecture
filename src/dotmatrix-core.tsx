import type { CSSProperties, HTMLAttributes } from 'react'

export type DotMatrixPhase = 'idle' | 'running'

export type DotAnimationResolver = (input: {
  row: number
  col: number
  phase: DotMatrixPhase
}) => {
  className?: string
  style?: CSSProperties
}

export type DotMatrixCommonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  speed?: number
  animated?: boolean
  hoverAnimated?: boolean
}

type DotMatrixBaseProps = DotMatrixCommonProps & {
  pattern: 'full'
  phase: DotMatrixPhase
  reducedMotion: boolean
  animationResolver: DotAnimationResolver
}

export function isWithinCircularMask(row: number, col: number) {
  const x = col - 2
  const y = row - 2
  return Math.sqrt(x * x + y * y) <= 2.2
}

export function DotMatrixBase({
  className = '',
  phase,
  animationResolver,
  speed: _speed,
  animated: _animated,
  hoverAnimated: _hoverAnimated,
  reducedMotion: _reducedMotion,
  pattern: _pattern,
  ...rest
}: DotMatrixBaseProps) {
  return (
    <div className={`dot-matrix ${className}`} {...rest}>
      {Array.from({ length: 25 }, (_, index) => {
        const row = Math.floor(index / 5)
        const col = index % 5
        const resolved = animationResolver({ row, col, phase })

        return (
          <span
            key={`${row}-${col}`}
            className={`dot-matrix__cell ${resolved.className ?? ''}`}
            style={resolved.style}
          />
        )
      })}
    </div>
  )
}
