import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'
import { calcAgeAtDeath } from './ageUtils'

export function DeceasedUnknownNode({ data, selected }: NodeProps<PersonData>) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const age = calcAgeAtDeath(data.birthYear, data.deathYear)
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="52" height="52" viewBox="0 0 52 52">
        <polygon points="26,2 50,26 26,50 2,26" fill="white" stroke={color} strokeWidth={sw} />
        <line x1="11" y1="11" x2="41" y2="41" stroke={color} strokeWidth={sw} />
        <line x1="41" y1="11" x2="11" y2="41" stroke={color} strokeWidth={sw} />
        {age !== null && (
          <text x="26" y="12" textAnchor="middle" dominantBaseline="central"
            fontSize="9" fontFamily="system-ui,sans-serif" fill={color}
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            {age}
          </text>
        )}
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
