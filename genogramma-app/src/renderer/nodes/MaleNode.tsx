import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'
import { NodeLabel } from './NodeLabel'

export function MaleNode({ data, selected }: NodeProps<PersonData>) {
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <svg width="52" height="52" viewBox="0 0 52 52">
        <rect
          x="2" y="2" width="48" height="48"
          fill="white"
          stroke={selected ? '#3b82f6' : '#1e293b'}
          strokeWidth={selected ? 2.5 : 2}
        />
      </svg>
      <NodeLabel data={data} />
    </div>
  )
}
