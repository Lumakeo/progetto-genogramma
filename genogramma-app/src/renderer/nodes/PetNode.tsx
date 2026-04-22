import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'

export function PetNode({ data, selected }: NodeProps<PersonData>) {
  const stroke = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  const swSm = selected ? 2 : 1.5

  return (
    <div className="relative flex flex-col items-center" style={{ width: 52 }}>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" style={{ top: 26 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: 26 }} />
      <svg width="52" height="52" viewBox="0 0 52 52">
        {/* Pad palmare */}
        <ellipse cx="26" cy="34" rx="13" ry="10" fill="white" stroke={stroke} strokeWidth={sw} />
        {/* 4 pad dita */}
        <ellipse cx="11" cy="20" rx="5" ry="6" fill="white" stroke={stroke} strokeWidth={swSm} />
        <ellipse cx="20" cy="14" rx="5" ry="6" fill="white" stroke={stroke} strokeWidth={swSm} />
        <ellipse cx="31" cy="14" rx="5" ry="6" fill="white" stroke={stroke} strokeWidth={swSm} />
        <ellipse cx="40" cy="20" rx="5" ry="6" fill="white" stroke={stroke} strokeWidth={swSm} />
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
