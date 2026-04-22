import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'
import { calcAge } from './ageUtils'

export function TwinsMaleNode({ data, selected }: NodeProps<PersonData>) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const age = calcAge(data.birthYear)
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom-left" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="110" height="52" viewBox="0 0 110 52">
        <rect x="2" y="2" width="48" height="48" fill="white" stroke={color} strokeWidth={sw} />
        <rect x="60" y="2" width="48" height="48" fill="white" stroke={color} strokeWidth={sw} />
        <line x1="26" y1="2" x2="84" y2="2" stroke={color} strokeWidth={sw} />
        {age !== null && (
          <text x="26" y="26" textAnchor="middle" dominantBaseline="central"
            fontSize="13" fontFamily="system-ui,sans-serif" fill={color}
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            {age}
          </text>
        )}
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
