import { useStore } from 'reactflow'

const PALETTE = [
  '#fefce8', // giallo tenuo
  '#fff7ed', // arancio tenuo
  '#f0fdf4', // verde tenuo
  '#eff6ff', // azzurro tenuo
  '#fdf4ff', // lilla tenuo
  '#fdf2f8', // rosa tenuo
  '#f0fdfa', // turchese tenuo
]

interface Props {
  generationCount: number
  bandHeight: number
}

export function BandBackground({ generationCount, bandHeight }: Props) {
  const { x, y, zoom } = useStore((s) => ({
    x: s.transform[0],
    y: s.transform[1],
    zoom: s.transform[2]
  }))

  const W = 20000
  const labelSize = Math.min(13, 13 / zoom)
  const labelOffset = Math.min(20, 20 / zoom)

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -10
      }}
    >
      <g transform={`translate(${x},${y}) scale(${zoom})`}>
        {/* base bianco sotto le bande */}
        <rect x={-W / 2} y={0} width={W} height={bandHeight * generationCount} fill="white" />

        {Array.from({ length: generationCount }, (_, i) => {
          const color = PALETTE[i % PALETTE.length]
          const bandY = i * bandHeight
          const label = `${i + 1}ª generazione`

          return (
            <g key={i}>
              <rect
                x={-W / 2}
                y={bandY}
                width={W}
                height={bandHeight}
                fill={color}
                opacity={0.75}
              />
              {/* bordo superiore (skip primo) */}
              {i > 0 && (
                <line
                  x1={-W / 2}
                  y1={bandY}
                  x2={W / 2}
                  y2={bandY}
                  stroke="#e2e8f0"
                  strokeWidth={1 / zoom}
                />
              )}
              {/* etichetta sinistra */}
              <text
                x={-W / 2 + labelOffset}
                y={bandY + labelOffset}
                fill="#94a3b8"
                fontSize={labelSize}
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
                dominantBaseline="hanging"
                style={{ userSelect: 'none' }}
              >
                {label}
              </text>
              {/* numero grande in filigrana */}
              <text
                x={-W / 2 + labelOffset * 0.8}
                y={bandY + bandHeight / 2}
                fill={color === '#ffffff' ? '#f1f5f9' : color}
                fontSize={Math.min(120, 120 / zoom)}
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                dominantBaseline="middle"
                opacity={0.6}
                style={{ userSelect: 'none' }}
              >
                {i + 1}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
