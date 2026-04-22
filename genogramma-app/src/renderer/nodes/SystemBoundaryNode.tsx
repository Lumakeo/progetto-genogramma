import { NodeProps, NodeResizer } from 'reactflow'
import { PersonData } from '../../shared/types'

export function SystemBoundaryNode({ selected }: NodeProps<PersonData>) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `2px dashed ${selected ? '#3b82f6' : '#64748b'}`,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={60}
        color="#3b82f6"
      />
    </div>
  )
}
