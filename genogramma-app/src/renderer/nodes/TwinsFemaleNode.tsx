import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'

export function TwinsFemaleNode({ data, selected }: NodeProps<PersonData>) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom-left" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="110" height="52" viewBox="0 0 110 52">
        <circle cx="26" cy="26" r="24" fill="white" stroke={color} strokeWidth={sw} />
        <circle cx="84" cy="26" r="24" fill="white" stroke={color} strokeWidth={sw} />
        <line x1="26" y1="2" x2="84" y2="2" stroke={color} strokeWidth={sw} />
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
