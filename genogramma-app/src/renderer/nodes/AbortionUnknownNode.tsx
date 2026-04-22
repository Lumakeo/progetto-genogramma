import { Handle, Position, NodeProps } from 'reactflow'
import { PersonData } from '../../shared/types'

export function AbortionUnknownNode({ selected }: NodeProps<PersonData>) {
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} id="top" />
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon
          points="20,2 38,38 2,38"
          fill={selected ? '#3b82f6' : '#1e293b'}
        />
      </svg>
    </div>
  )
}
