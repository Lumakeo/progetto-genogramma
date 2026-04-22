import { EdgeProps, getStraightPath } from 'reactflow'

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

export function MarriedEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [p1, p2] = parallelPaths(sourceX, sourceY, targetX, targetY, 3.5)
  const [hit] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={hit} />
      <path d={p1} fill="none" stroke={color} strokeWidth={sw} />
      <path d={p2} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export function SeparatedEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const slash = slashPath(sourceX, sourceY, targetX, targetY, 0.5)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
      <path d={slash} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export function DivorcedEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
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
    </g>
  )
}

export function CohabitingEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 5" />
    </g>
  )
}

export function SeparatedCohabitingEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const slash = slashPath(sourceX, sourceY, targetX, targetY, 0.5)
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="8 5" />
      <path d={slash} fill="none" stroke={color} strokeWidth={sw} />
    </g>
  )
}

export function ParentChildEdge({ sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <g>
      <HitArea path={path} />
      <path d={path} fill="none" stroke={color} strokeWidth={sw} />
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
