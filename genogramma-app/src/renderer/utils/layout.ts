import { Node, Edge } from 'reactflow'
import { PersonData } from '../../shared/types'

const H_GAP = 180
const V_GAP = 220
const COUPLE_GAP = 140

const COUPLE_TYPES = new Set([
  'married', 'separated', 'divorced', 'cohabiting', 'separated-cohabiting'
])

export function computeLayout(nodes: Node<PersonData>[], edges: Edge[]): Node<PersonData>[] {
  if (nodes.length === 0) return nodes

  const parentChildEdges = edges.filter((e) => e.type === 'parent-child' || e.type === 'adoption-child')
  const coupleEdges = edges.filter((e) => COUPLE_TYPES.has(e.type || ''))

  // Build relationship maps
  const childrenOf: Record<string, string[]> = {}
  const parentsOf: Record<string, string[]> = {}
  for (const n of nodes) {
    childrenOf[n.id] = []
    parentsOf[n.id] = []
  }
  for (const e of parentChildEdges) {
    if (childrenOf[e.source]) childrenOf[e.source].push(e.target)
    if (parentsOf[e.target]) parentsOf[e.target].push(e.source)
  }

  // BFS to assign generational levels from parent-child edges
  const level: Record<string, number> = {}
  const roots = nodes.filter((n) => parentsOf[n.id].length === 0)
  for (const r of roots) level[r.id] = 0

  const queue = roots.map((r) => r.id)
  const visited = new Set<string>()

  while (queue.length) {
    const id = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    for (const child of childrenOf[id]) {
      const proposed = (level[id] ?? 0) + 1
      if (level[child] === undefined || level[child] < proposed) {
        level[child] = proposed
      }
      queue.push(child)
    }
  }

  // Unconnected nodes get level 0
  for (const n of nodes) {
    if (level[n.id] === undefined) level[n.id] = 0
  }

  // Equalize levels for couple partners (iterate until stable)
  let changed = true
  while (changed) {
    changed = false
    for (const e of coupleEdges) {
      const la = level[e.source] ?? 0
      const lb = level[e.target] ?? 0
      if (la !== lb) {
        const max = Math.max(la, lb)
        level[e.source] = max
        level[e.target] = max
        changed = true
      }
    }
  }

  // Group nodes by level
  const byLevel: Record<number, string[]> = {}
  for (const n of nodes) {
    const l = level[n.id]
    if (!byLevel[l]) byLevel[l] = []
    byLevel[l].push(n.id)
  }

  // Order nodes within each level: sort siblings by birth year desc (youngest left), keep couples adjacent
  const couplePartner: Record<string, string> = {}
  for (const e of coupleEdges) {
    couplePartner[e.source] = e.target
    couplePartner[e.target] = e.source
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  const birthSortKey = (id: string): [number, number, number] => {
    const d = nodeMap[id]?.data
    const y = parseInt(d?.birthYear || '0')
    const m = parseInt(d?.birthMonth || '0')
    const day = parseInt(d?.birthDay || '0')
    return [y, m, day]
  }

  // Sort descending: youngest (highest year) goes to the left (lower index)
  const sortByAge = (ids: string[]) =>
    ids.slice().sort((a, b) => {
      const [ya, ma, da] = birthSortKey(a)
      const [yb, mb, db] = birthSortKey(b)
      if (ya === 0 && yb === 0) return 0
      if (ya === 0) return 1
      if (yb === 0) return -1
      if (ya !== yb) return yb - ya
      if (ma !== mb) return mb - ma
      return db - da
    })

  const orderedByLevel: Record<number, string[]> = {}
  for (const [lvl, ids] of Object.entries(byLevel)) {
    const ordered: string[] = []
    const placed = new Set<string>()

    // Group by parent-set key so siblings stay together
    const families = new Map<string, string[]>()
    const noParent: string[] = []
    for (const id of ids) {
      const key = (parentsOf[id] || []).slice().sort().join(',')
      if (!key) {
        noParent.push(id)
      } else {
        if (!families.has(key)) families.set(key, [])
        families.get(key)!.push(id)
      }
    }

    const insertWithPartner = (id: string) => {
      if (placed.has(id)) return
      ordered.push(id)
      placed.add(id)
      const partner = couplePartner[id]
      if (partner && ids.includes(partner) && !placed.has(partner)) {
        ordered.push(partner)
        placed.add(partner)
      }
    }

    // Insert sibling groups sorted by age
    for (const siblings of families.values()) {
      for (const id of sortByAge(siblings)) insertWithPartner(id)
    }
    // Insert nodes without parents sorted by age
    for (const id of sortByAge(noParent)) insertWithPartner(id)

    orderedByLevel[Number(lvl)] = ordered
  }

  // Compute X positions: try to center parents over their children
  const pos: Record<string, { x: number; y: number }> = {}
  const sortedLevels = Object.keys(orderedByLevel).map(Number).sort((a, b) => a - b)

  // First pass: evenly spread each level
  for (const l of sortedLevels) {
    const ids = orderedByLevel[l]
    const totalW = (ids.length - 1) * H_GAP
    ids.forEach((id, i) => {
      pos[id] = { x: i * H_GAP - totalW / 2, y: l * V_GAP }
    })
  }

  // Second pass (bottom-up): center parents over their children's midpoint
  for (const l of [...sortedLevels].reverse()) {
    const ids = orderedByLevel[l]
    for (const id of ids) {
      const children = childrenOf[id]
      if (children.length === 0) continue
      const childXs = children.map((c) => pos[c]?.x ?? 0)
      const midX = (Math.min(...childXs) + Math.max(...childXs)) / 2

      // Move the node and its couple partner together
      const partner = couplePartner[id]
      if (partner && ids.includes(partner)) {
        const myIdx = ids.indexOf(id)
        const partnerIdx = ids.indexOf(partner)
        const isLeft = myIdx < partnerIdx
        pos[id] = { x: midX + (isLeft ? -COUPLE_GAP / 2 : COUPLE_GAP / 2), y: l * V_GAP }
        pos[partner] = { x: midX + (isLeft ? COUPLE_GAP / 2 : -COUPLE_GAP / 2), y: l * V_GAP }
      } else {
        pos[id] = { x: midX, y: l * V_GAP }
      }
    }
  }

  return nodes.map((n) => ({ ...n, position: pos[n.id] ?? n.position }))
}
