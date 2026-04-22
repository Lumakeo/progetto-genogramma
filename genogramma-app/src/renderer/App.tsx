import { useState, useCallback, useRef } from 'react'
import { Node, Edge, ReactFlowProvider } from 'reactflow'
import { Toolbar } from './components/Toolbar'
import { PropertiesPanel } from './components/PropertiesPanel'
import { EdgePanel } from './components/EdgePanel'
import { ExportMenu } from './components/ExportMenu'
import { Canvas, CanvasHandle } from './components/Canvas'
import { NodeType, EdgeType, PersonData } from '../shared/types'

const EDGE_TYPES: { type: EdgeType; label: string }[] = [
  { type: 'parent-child', label: 'Genitore-figlio' },
  { type: 'married', label: 'Sposati (=)' },
  { type: 'separated', label: 'Separati (//)' },
  { type: 'divorced', label: 'Divorziati (//=)' },
  { type: 'cohabiting', label: 'Conviventi (---)' },
  { type: 'separated-cohabiting', label: 'Sep. convivenza' }
]

export default function App() {
  const [selectedNode, setSelectedNode] = useState<Node<PersonData> | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [selectedEdgeType, setSelectedEdgeType] = useState<EdgeType>('parent-child')
  const [generationCount, setGenerationCount] = useState(3)
  const canvasRef = useRef<CanvasHandle>(null)

  const handleNodeSelect = useCallback((node: Node<PersonData> | null) => {
    setSelectedNode(node)
  }, [])

  const handleEdgeSelect = useCallback((edge: Edge | null) => {
    setSelectedEdge(edge)
  }, [])

  const handleEdgeTypeChange = useCallback((id: string, type: EdgeType) => {
    canvasRef.current?.updateEdgeType(id, type)
    setSelectedEdge((prev) => prev?.id === id ? { ...prev, type } : prev)
  }, [])

  const handleEdgeDataChange = useCallback((id: string, data: Record<string, unknown>) => {
    canvasRef.current?.updateEdgeData(id, data)
    setSelectedEdge((prev) => prev?.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev)
  }, [])

  const handleDeleteEdge = useCallback((id: string) => {
    canvasRef.current?.deleteEdge(id)
    setSelectedEdge(null)
  }, [])

  const handleNodeChange = useCallback((id: string, data: Partial<PersonData>) => {
    canvasRef.current?.updateNodeData(id, data)
    setSelectedNode((prev) =>
      prev?.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev
    )
  }, [])

  const handleDeleteNode = useCallback((id: string) => {
    canvasRef.current?.deleteNode(id)
    setSelectedNode(null)
  }, [])

  const handleAddNode = useCallback((type: NodeType) => {
    canvasRef.current?.addNode(type)
  }, [])

  const handleLoad = useCallback((nodes: Node<PersonData>[], edges: Edge[]) => {
    canvasRef.current?.loadData(nodes, edges)
    setSelectedNode(null)
  }, [])

  const getExportData = useCallback(() => ({
    nodes: canvasRef.current?.getNodes() || [],
    edges: canvasRef.current?.getEdges() || []
  }), [])

  const handleAutoLayout = useCallback(() => {
    canvasRef.current?.autoLayout()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top bar */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shrink-0 z-10">
        <span className="font-semibold text-slate-800 text-sm tracking-tight">Genogramma</span>
        <div className="flex-1" />
        <ExportMenu getNodes={() => canvasRef.current?.getNodes() || []} getEdges={() => canvasRef.current?.getEdges() || []} onLoad={handleLoad} />
        {/* Generazioni stepper */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 whitespace-nowrap">Generazioni:</span>
          <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-white">
            <button
              onClick={() => setGenerationCount((n) => Math.max(1, n - 1))}
              disabled={generationCount <= 1}
              className="px-2 py-1 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium leading-none"
            >
              −
            </button>
            <span className="px-2 py-1 text-sm font-semibold text-slate-700 min-w-[24px] text-center select-none">
              {generationCount}
            </span>
            <button
              onClick={() => setGenerationCount((n) => Math.min(7, n + 1))}
              disabled={generationCount >= 7}
              className="px-2 py-1 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium leading-none"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAutoLayout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="Ordina automaticamente i blocchi per generazione"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="5" y="1" width="4" height="3" rx="0.5" />
            <rect x="1" y="8" width="4" height="3" rx="0.5" />
            <rect x="9" y="8" width="4" height="3" rx="0.5" />
            <line x1="7" y1="4" x2="7" y2="6" />
            <line x1="7" y1="6" x2="3" y2="6" />
            <line x1="7" y1="6" x2="11" y2="6" />
            <line x1="3" y1="6" x2="3" y2="8" />
            <line x1="11" y1="6" x2="11" y2="8" />
          </svg>
          Auto Layout
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Relazione:</span>
          <select
            value={selectedEdgeType}
            onChange={(e) => setSelectedEdgeType(e.target.value as EdgeType)}
            className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {EDGE_TYPES.map((et) => (
              <option key={et.type} value={et.type}>{et.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar onAddNode={handleAddNode} />
        <ReactFlowProvider>
          <Canvas
            ref={canvasRef}
            selectedEdgeType={selectedEdgeType}
            generationCount={generationCount}
            onNodeSelect={handleNodeSelect}
            onEdgeSelect={handleEdgeSelect}
          />
        </ReactFlowProvider>
        {selectedNode && (
          <PropertiesPanel
            selectedNode={selectedNode}
            onNodeChange={handleNodeChange}
            onDeleteNode={handleDeleteNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
        {selectedEdge && !selectedNode && (
          <EdgePanel
            edge={selectedEdge}
            onTypeChange={handleEdgeTypeChange}
            onDataChange={handleEdgeDataChange}
            onDelete={handleDeleteEdge}
            onClose={() => setSelectedEdge(null)}
          />
        )}
      </div>
    </div>
  )
}
