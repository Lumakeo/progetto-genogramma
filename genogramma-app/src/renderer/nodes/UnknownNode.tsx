import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'

export function UnknownNode({ data, selected }: NodeProps<PersonData>) {
  const color = selected ? '#3b82f6' : '#1e293b'
  const sw = selected ? 2.5 : 2
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="52" height="52" viewBox="0 0 52 52">
        <polygon
          points="26,2 50,26 26,50 2,26"
          fill="white"
          stroke={color}
          strokeWidth={sw}
        />
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
