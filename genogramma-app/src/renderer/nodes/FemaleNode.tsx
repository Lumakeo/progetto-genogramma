import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'
import { calcAge } from './ageUtils'

export function FemaleNode({ data, selected }: NodeProps<PersonData>) {
  const stroke = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const age = calcAge(data.birthYear)
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="24" fill="white" stroke={stroke} strokeWidth={sw} />
        {age !== null && (
          <text x="26" y="26" textAnchor="middle" dominantBaseline="central"
            fontSize="13" fontFamily="system-ui,sans-serif" fill={stroke}
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            {age}
          </text>
        )}
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
