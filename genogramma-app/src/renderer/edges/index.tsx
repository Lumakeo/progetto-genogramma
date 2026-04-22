import { EdgeProps, getStraightPath, useStore } from 'reactflow'

const COUPLE_TYPES = new Set([
  'married', 'separated', 'divorced', 'cohabiting', 'separated-cohabiting'
])

// ─── utilities ────────────────────────────────────────────────────────────────

function parallelPaths(
  sx: number, sy: number, tx: number, ty: number, offset: number
): [string, string] {
  const dx = tx - sx, dy = ty - sy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * offset, ny = (dx / len) * offset
  return [
    `M ${sx + nx} ${sy + ny} L ${tx + nx} ${ty + ny}`,
    `M ${sx - nx} ${sy - ny} L ${tx - nx} ${ty - ny}`
  ]
}

function slashPath(sx: number, sy: number, tx: number, ty: number, t: number, halfLen = 10): string {
  const mx = sx + (tx - sx) * t, my = sy + (ty - sy) * t
  const dx = tx - sx, dy = ty - sy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * halfLen, ny = (dx / len) * halfLen
  return `M ${mx + nx} ${my + ny} L ${mx - nx} ${my - ny}`
}

function zigzagPath(sx: number, sy: number, tx: number, ty: number, steps = 7, amp = 7): string {
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = sx + (tx - sx) * t, y = sy + (ty - sy) * t
    const dx = tx - sx, dy = ty - sy
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = (-dy / len), ny = (dx / len)
    const off = (i % 2 === 0 ? 1 : -1) * amp
    pts.push(`${x + nx * off} ${y + ny * off}`)
  }
  return `M ${pts.join(' L ')}`
}

function HitArea({ path }: { path: string }) {
  return <path d={path} fill="none" stroke="transparent" strokeWidth={14} />
}

function YearLabel({ sourceX, sourceY, targetX, targetY, year, color }: {
  sourceX: number; sourceY: number; targetX: number; targetY: number; year: string; color: string
}) {
  const midX = (sourceX + targetX) / 2
  const midY = Math.min(sourceY, targetY)
  return (
    <text x={midX} y={midY - 7} textAnchor="middle" fontSize="11"
      fontFamily="system-ui,sans-serif" fill={color}
      style={{ userSelect: 'none', pointerEvents: 'none' }}>
      {year}
    </text>
  )
}

// ─── couple edges ─────────────────────────────────────────────────────────────

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
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={slashPath(sourceX, sourceY, targetX, targetY, 0.5)} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

export function DivorcedEdge({ sourceX, sourceY, targetX, targetY, selected, data }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={slashPath(sourceX, sourceY, targetX, targetY, 0.42)} fill="none" stroke={color} strokeWidth={sw} />
      <path d={slashPath(sourceX, sourceY, targetX, targetY, 0.58)} fill="none" stroke={color} strokeWidth={sw} />
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
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 5" />
      <path d={slashPath(sourceX, sourceY, targetX, targetY, 0.5)} fill="none" stroke={color} strokeWidth={sw} />
      {data?.year && <YearLabel sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} year={String(data.year)} color={color} />}
    </g>
  )
}

// ─── parent-child (with sibship bar + twins diagonal support) ─────────────────

export function ParentChildEdge({
  id, source, target, sourceX, sourceY, targetX, targetY, selected
}: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2

  const nodeInternals = useStore((s) => s.nodeInternals)
  const allEdges = useStore((s) => s.edges)

  const sibEdges = allEdges.filter((e) => e.type === 'parent-child' && e.source === source)

  // Couple partner → trunk X at midpoint between the two parents
  const coupleEdge = allEdges.find(
    (e) => COUPLE_TYPES.has(e.type ?? '') && (e.source === source || e.target === source)
  )
  const partnerId = coupleEdge
    ? (coupleEdge.source === source ? coupleEdge.target : coupleEdge.source)
    : null
  const partnerNode = partnerId ? nodeInternals.get(partnerId) : undefined
  const partnerCX = partnerNode?.positionAbsolute
    ? partnerNode.positionAbsolute.x + (partnerNode.width ?? 52) / 2
    : sourceX
  const trunkX = partnerId ? (sourceX + partnerCX) / 2 : sourceX

  // Trunk start Y: center of the couple line (y=26 inside the SVG of the parent)
  const sourceNodeInternal = nodeInternals.get(source)
  const trunkStartY = sourceNodeInternal?.positionAbsolute
    ? sourceNodeInternal.positionAbsolute.y + 26
    : sourceY

  // Sibling center X values
  const sibXs = sibEdges
    .map((e) => {
      const n = nodeInternals.get(e.target)
      if (!n?.positionAbsolute) return null
      return { id: e.target, cx: n.positionAbsolute.x + (n.width ?? 52) / 2 }
    })
    .filter((s): s is { id: string; cx: number } => s !== null)

  if (sibXs.length === 0) {
    const d = `M ${trunkX} ${trunkStartY} L ${targetX} ${targetY}`
    return (
      <g>
        <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
        <path id={id} d={d} fill="none" stroke={color} strokeWidth={sw} />
      </g>
    )
  }

  const minX = Math.min(...sibXs.map((s) => s.cx))
  const maxX = Math.max(...sibXs.map((s) => s.cx))
  const barY = trunkStartY + (targetY - trunkStartY) * 0.55

  const sorted = [...sibXs].sort((a, b) => a.cx - b.cx)
  const isPrimary = sorted[0]?.id === target || sibXs.length === 1

  // Check if this target has a twins sibling → diagonal drop
  const twinEdge = allEdges.find(
    (e) => e.type === 'twins' && (e.source === target || e.target === target)
  )
  const twinSibId = twinEdge
    ? (twinEdge.source === target ? twinEdge.target : twinEdge.source)
    : null
  const twinSibNode = twinSibId ? nodeInternals.get(twinSibId) : undefined
  const twinSibCX = twinSibNode?.positionAbsolute
    ? twinSibNode.positionAbsolute.x + (twinSibNode.width ?? 52) / 2
    : null
  // Apex X for twins diagonal: midpoint between the two twins
  const apexX = twinSibCX !== null ? (targetX + twinSibCX) / 2 : targetX

  const parts: string[] = []
  // Drop from bar to this child (diagonal if twins, vertical otherwise)
  parts.push(`M ${apexX} ${barY} L ${targetX} ${targetY}`)

  if (isPrimary) {
    parts.push(`M ${trunkX} ${trunkStartY} L ${trunkX} ${barY}`)
    if (sibXs.length > 1) {
      parts.push(`M ${minX} ${barY} L ${maxX} ${barY}`)
    } else if (Math.abs(trunkX - apexX) > 2) {
      parts.push(`M ${trunkX} ${barY} L ${apexX} ${barY}`)
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

// ─── adoption-child (dashed sibship bar) ──────────────────────────────────────

export function AdoptionChildEdge({
  id, source, target, sourceX, sourceY, targetX, targetY, selected
}: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2

  const nodeInternals = useStore((s) => s.nodeInternals)
  const allEdges = useStore((s) => s.edges)

  const sibEdges = allEdges.filter((e) => e.type === 'adoption-child' && e.source === source)

  const coupleEdge = allEdges.find(
    (e) => COUPLE_TYPES.has(e.type ?? '') && (e.source === source || e.target === source)
  )
  const partnerId = coupleEdge
    ? (coupleEdge.source === source ? coupleEdge.target : coupleEdge.source)
    : null
  const partnerNode = partnerId ? nodeInternals.get(partnerId) : undefined
  const partnerCX = partnerNode?.positionAbsolute
    ? partnerNode.positionAbsolute.x + (partnerNode.width ?? 52) / 2
    : sourceX
  const trunkX = partnerId ? (sourceX + partnerCX) / 2 : sourceX

  const sourceNodeInternal = nodeInternals.get(source)
  const trunkStartY = sourceNodeInternal?.positionAbsolute
    ? sourceNodeInternal.positionAbsolute.y + 26
    : sourceY

  const sibXs = sibEdges
    .map((e) => {
      const n = nodeInternals.get(e.target)
      if (!n?.positionAbsolute) return null
      return { id: e.target, cx: n.positionAbsolute.x + (n.width ?? 52) / 2 }
    })
    .filter((s): s is { id: string; cx: number } => s !== null)

  if (sibXs.length === 0) {
    const d = `M ${trunkX} ${trunkStartY} L ${targetX} ${targetY}`
    return (
      <g>
        <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
        <path id={id} d={d} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 4" />
      </g>
    )
  }

  const minX = Math.min(...sibXs.map((s) => s.cx))
  const maxX = Math.max(...sibXs.map((s) => s.cx))
  const barY = trunkStartY + (targetY - trunkStartY) * 0.55

  const sorted = [...sibXs].sort((a, b) => a.cx - b.cx)
  const isPrimary = sorted[0]?.id === target || sibXs.length === 1

  const parts: string[] = []
  parts.push(`M ${targetX} ${barY} L ${targetX} ${targetY}`)
  if (isPrimary) {
    parts.push(`M ${trunkX} ${trunkStartY} L ${trunkX} ${barY}`)
    if (sibXs.length > 1) parts.push(`M ${minX} ${barY} L ${maxX} ${barY}`)
    else if (Math.abs(trunkX - targetX) > 2) parts.push(`M ${trunkX} ${barY} L ${targetX} ${barY}`)
  }

  const d = parts.join(' ')

  return (
    <g>
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
      <path id={id} d={d} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 4" />
    </g>
  )
}

// ─── twins (thin V between twin tops) ────────────────────────────────────────

export function TwinsEdge({ id, source, target, selected }: EdgeProps) {
  const nodeInternals = useStore((s) => s.nodeInternals)
  const srcNode = nodeInternals.get(source)
  const tgtNode = nodeInternals.get(target)

  if (!srcNode?.positionAbsolute || !tgtNode?.positionAbsolute) return null

  const srcCX = srcNode.positionAbsolute.x + (srcNode.width ?? 52) / 2
  const srcTopY = srcNode.positionAbsolute.y
  const tgtCX = tgtNode.positionAbsolute.x + (tgtNode.width ?? 52) / 2
  const tgtTopY = tgtNode.positionAbsolute.y
  const apexX = (srcCX + tgtCX) / 2
  const apexY = Math.min(srcTopY, tgtTopY) - 14

  const d = `M ${srcCX} ${srcTopY} L ${apexX} ${apexY} L ${tgtCX} ${tgtTopY}`
  const color = selected ? '#3b82f6' : '#475569'

  return (
    <g>
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
      <path id={id} d={d} fill="none" stroke={color} strokeWidth={selected ? 2 : 1.5} />
    </g>
  )
}

// ─── emotional relationship edges ─────────────────────────────────────────────

export function CloseEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const midX = (sourceX + targetX) / 2, midY = (sourceY + targetY) / 2
  const dx = targetX - sourceX, dy = targetY - sourceY
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * 28, ny = (dx / len) * 28
  const d = `M ${sourceX} ${sourceY} Q ${midX + nx} ${midY + ny} ${targetX} ${targetY}`
  const [hit] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={hit} />
      <path d={d} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export function ConflictualEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const d = zigzagPath(sourceX, sourceY, targetX, targetY)
  const [hit] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={hit} />
      <path d={d} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export function DistantEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#94a3b8'
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 4" />
    </g>
  )
}

export function CutOffEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const b1a = slashPath(sourceX, sourceY, targetX, targetY, 0.35, 12)
  const b1b = slashPath(sourceX, sourceY, targetX, targetY, 0.38, 12)
  const b2a = slashPath(sourceX, sourceY, targetX, targetY, 0.62, 12)
  const b2b = slashPath(sourceX, sourceY, targetX, targetY, 0.65, 12)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={b1a} fill="none" stroke={color} strokeWidth={sw} />
      <path d={b1b} fill="none" stroke={color} strokeWidth={sw} />
      <path d={b2a} fill="none" stroke={color} strokeWidth={sw} />
      <path d={b2b} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

// ─── registry ─────────────────────────────────────────────────────────────────

export const edgeTypes = {
  married: MarriedEdge,
  separated: SeparatedEdge,
  divorced: DivorcedEdge,
  cohabiting: CohabitingEdge,
  'separated-cohabiting': SeparatedCohabitingEdge,
  'parent-child': ParentChildEdge,
  'adoption-child': AdoptionChildEdge,
  twins: TwinsEdge,
  close: CloseEdge,
  conflictual: ConflictualEdge,
  distant: DistantEdge,
  'cut-off': CutOffEdge,
}
