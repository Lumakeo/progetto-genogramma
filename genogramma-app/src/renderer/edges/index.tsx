import { EdgeProps, getStraightPath, useStore } from 'reactflow'

const COUPLE_TYPES = new Set([
  'married', 'separated', 'divorced', 'cohabiting', 'separated-cohabiting'
])

function parallelPaths(
  sx: number, sy: number, tx: number, ty: number, offset: number
): [string, string] {
  const dx = tx - sx
  const dy = ty - sy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * offset
  const ny = (dx / len) * offset
  return [
    `M ${sx + nx} ${sy + ny} L ${tx + nx} ${ty + ny}`,
    `M ${sx - nx} ${sy - ny} L ${tx - nx} ${ty - ny}`
  ]
}

function slashPath(
  sx: number, sy: number, tx: number, ty: number,
  t: number, halfLen = 10
): string {
  const mx = sx + (tx - sx) * t
  const my = sy + (ty - sy) * t
  const dx = tx - sx
  const dy = ty - sy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * halfLen
  const ny = (dx / len) * halfLen
  return `M ${mx + nx} ${my + ny} L ${mx - nx} ${my - ny}`
}

function HitArea({ path }: { path: string }) {
  return <path d={path} fill="none" stroke="transparent" strokeWidth={14} />
}

function YearLabel({
  sourceX, sourceY, targetX, targetY, year, color
}: {
  sourceX: number; sourceY: number; targetX: number; targetY: number
  year: string; color: string
}) {
  const midX = (sourceX + targetX) / 2
  const midY = Math.min(sourceY, targetY)
  return (
    <text
      x={midX} y={midY - 7}
      textAnchor="middle"
      fontSize="11"
      fontFamily="system-ui,sans-serif"
      fill={color}
      style={{ userSelect: 'none', pointerEvents: 'none' }}
    >
      {year}
    </text>
  )
}

export function MarriedEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [p1, p2] = parallelPaths(sourceX, sourceY, targetX, targetY, 3.5)
  const [hit] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={hit} />
      <path d={p1} fill="none" stroke={color} strokeWidth={sw} />
      <path d={p2} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function SeparatedEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const slash = slashPath(sourceX, sourceY, targetX, targetY, 0.5)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={slash} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function DivorcedEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const s1 = slashPath(sourceX, sourceY, targetX, targetY, 0.42)
  const s2 = slashPath(sourceX, sourceY, targetX, targetY, 0.58)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={s1} fill="none" stroke={color} strokeWidth={sw} />
      <path d={s2} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function CohabitingEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 5" />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function SeparatedCohabitingEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const slash = slashPath(sourceX, sourceY, targetX, targetY, 0.5)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 5" />
      <path d={slash} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function ParentChildEdge({
  id, source, target, sourceX, sourceY, targetX, targetY, selected
}: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2

  const nodeInternals = useStore((s) => s.nodeInternals)
  const allEdges = useStore((s) => s.edges)

  // All parent-child edges from same source
  const sibEdges = allEdges.filter((e) => e.type === 'parent-child' && e.source === source)

  // Couple partner of source
  const coupleEdge = allEdges.find(
    (e) => COUPLE_TYPES.has(e.type ?? '') && (e.source === source || e.target === source)
  )
  const partnerId = coupleEdge
    ? (coupleEdge.source === source ? coupleEdge.target : coupleEdge.source)
    : null
  const partnerNode = partnerId ? nodeInternals.get(partnerId) : undefined

  // Trunk X: midpoint between source and partner centers (or just sourceX)
  const partnerCX = partnerNode?.positionAbsolute
    ? partnerNode.positionAbsolute.x + (partnerNode.width ?? 52) / 2
    : sourceX
  const trunkX = partnerId ? (sourceX + partnerCX) / 2 : sourceX

  // Sibling target center X values from nodeInternals
  const sibXs = sibEdges
    .map((e) => {
      const n = nodeInternals.get(e.target)
      if (!n?.positionAbsolute) return null
      return { id: e.target, cx: n.positionAbsolute.x + (n.width ?? 52) / 2 }
    })
    .filter((s): s is { id: string; cx: number } => s !== null)

  // Fallback: nodes not yet measured
  if (sibXs.length === 0) {
    const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
    return (
      <g>
        <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
        <path id={id} d={d} fill="none" stroke={color} strokeWidth={sw} />
      </g>
    )
  }

  const minX = Math.min(...sibXs.map((s) => s.cx))
  const maxX = Math.max(...sibXs.map((s) => s.cx))
  const barY = sourceY + (targetY - sourceY) * 0.45

  // Primary edge: leftmost sibling draws the trunk + horizontal bar
  const sorted = [...sibXs].sort((a, b) => a.cx - b.cx)
  const isPrimary = sorted[0]?.id === target || sibXs.length === 1

  const parts: string[] = []
  // Drop from bar to this child
  parts.push(`M ${targetX} ${barY} L ${targetX} ${targetY}`)

  if (isPrimary) {
    // Vertical trunk from parent(s) midpoint down to bar
    parts.push(`M ${trunkX} ${sourceY} L ${trunkX} ${barY}`)
    // Horizontal sibling bar
    if (sibXs.length > 1) {
      parts.push(`M ${minX} ${barY} L ${maxX} ${barY}`)
    } else if (Math.abs(trunkX - targetX) > 2) {
      // Single child but offset from trunk: draw elbow
      parts.push(`M ${trunkX} ${barY} L ${targetX} ${barY}`)
    }
  }

  const d = parts.join(' ')

  return (
    <g>
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
      <path id={id} d={d} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export const edgeTypes = {
  married: MarriedEdge,
  separated: SeparatedEdge,
  divorced: DivorcedEdge,
  cohabiting: CohabitingEdge,
  'separated-cohabiting': SeparatedCohabitingEdge,
  'parent-child': ParentChildEdge
}
