import { useCallback, useRef, DragEvent, forwardRef, useImperativeHandle } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  ConnectionMode
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../../nodes'
import { edgeTypes } from '../../edges'
import { NodeType, EdgeType, PersonData } from '../../../shared/types'
import { BandBackground } from './BandBackground'
import { computeLayout } from '../../utils/layout'

let nodeIdCounter = Date.now()
const getId = () => `node_${nodeIdCounter++}`

export interface CanvasHandle {
  addNode: (type: NodeType, position?: { x: number; y: number }) => void
  getNodes: () => Node<PersonData>[]
  getEdges: () => Edge[]
  loadData: (nodes: Node<PersonData>[], edges: Edge[]) => void
  updateNodeData: (id: string, data: Partial<PersonData>) => void
  deleteNode: (id: string) => void
  updateEdgeType: (id: string, type: string) => void
  deleteEdge: (id: string) => void
  autoLayout: () => void
}

interface Props {
  onNodeSelect: (node: Node<PersonData> | null) => void
  onEdgeSelect: (edge: Edge | null) => void
  selectedEdgeType: EdgeType
  generationCount: number
}

export const Canvas = forwardRef<CanvasHandle, Props>(function Canvas(
  { onNodeSelect, onEdgeSelect, selectedEdgeType, generationCount },
  ref
) {
  const [nodes, setNodes] = useNodesState<PersonData>([])
  const [edges, setEdges] = useEdgesState([])
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null)
  const selectedEdgeTypeRef = useRef(selectedEdgeType)
  selectedEdgeTypeRef.current = selectedEdgeType

  useImperativeHandle(ref, () => ({
    addNode(type: NodeType, position?: { x: number; y: number }) {
      const pos = position || { x: 300 + Math.random() * 150, y: 300 + Math.random() * 100 }
      const newNode: Node<PersonData> = {
        id: getId(),
        type,
        position: pos,
        data: { label: '', adjectives: [] },
        style: type === 'system-boundary' ? { width: 200, height: 120 } : undefined,
        zIndex: type === 'system-boundary' ? -1 : 0
      }
      setNodes((nds) => [...nds, newNode])
      onNodeSelect(newNode)
    },
    getNodes: () => nodes,
    getEdges: () => edges,
    loadData(newNodes: Node<PersonData>[], newEdges: Edge[]) {
      setNodes(newNodes)
      setEdges(newEdges)
      onNodeSelect(null)
    },
    updateNodeData(id: string, data: Partial<PersonData>) {
      setNodes((nds) =>
        nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
      )
    },
    deleteNode(id: string) {
      setNodes((nds) => nds.filter((n) => n.id !== id))
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
      onNodeSelect(null)
    },
    updateEdgeType(id: string, type: string) {
      setEdges((eds) => eds.map((e) => e.id === id ? { ...e, type } : e))
    },
    deleteEdge(id: string) {
      setEdges((eds) => eds.filter((e) => e.id !== id))
      onEdgeSelect(null)
    },
    autoLayout() {
      setNodes((nds) => {
        const laid = computeLayout(nds, edges)
        setTimeout(() => rfInstanceRef.current?.fitView({ padding: 0.15, duration: 400 }), 50)
        return laid
      })
    }
  }), [nodes, edges, setNodes, setEdges, onNodeSelect, onEdgeSelect])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: selectedEdgeTypeRef.current }, eds))
    },
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<PersonData>) => {
      onNodeSelect(node)
      onEdgeSelect(null)
    },
    [onNodeSelect, onEdgeSelect]
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onEdgeSelect(edge)
      onNodeSelect(null)
    },
    [onEdgeSelect, onNodeSelect]
  )

  const onPaneClick = useCallback(() => {
    onNodeSelect(null)
    onEdgeSelect(null)
  }, [onNodeSelect, onEdgeSelect])

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('nodeType') as NodeType
      if (!type || !reactFlowWrapper.current || !rfInstanceRef.current) return
      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = rfInstanceRef.current.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
      })
      const newNode: Node<PersonData> = {
        id: getId(),
        type,
        position,
        data: { label: '', adjectives: [] },
        style: type === 'system-boundary' ? { width: 200, height: 120 } : undefined,
        zIndex: type === 'system-boundary' ? -1 : 0
      }
      setNodes((nds) => [...nds, newNode])
      onNodeSelect(newNode)
    },
    [setNodes, onNodeSelect]
  )

  return (
    <div ref={reactFlowWrapper} className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={(rf) => { rfInstanceRef.current = rf }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: selectedEdgeType }}
        connectionMode={ConnectionMode.Loose}
        fitView
        deleteKeyCode="Delete"
        minZoom={0.2}
        maxZoom={2}
      >
        <BandBackground generationCount={generationCount} bandHeight={280} />
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          maskColor="rgba(0,0,0,0.05)"
        />
      </ReactFlow>
    </div>
  )
})
