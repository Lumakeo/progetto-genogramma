import { Edge } from 'reactflow'
import { X, Trash2 } from 'lucide-react'
import { EdgeType } from '../../../shared/types'

const EDGE_TYPE_LABELS: { type: EdgeType; label: string }[] = [
  { type: 'parent-child', label: 'Genitore-figlio' },
  { type: 'married', label: 'Sposati (doppia linea)' },
  { type: 'separated', label: 'Separati (un taglio)' },
  { type: 'divorced', label: 'Divorziati (due tagli)' },
  { type: 'cohabiting', label: 'Conviventi (tratteggiata)' },
  { type: 'separated-cohabiting', label: 'Sep. convivenza' },
]

interface Props {
  edge: Edge
  onTypeChange: (id: string, type: EdgeType) => void
  onDataChange: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function EdgePanel({ edge, onTypeChange, onDataChange, onDelete, onClose }: Props) {
  return (
    <div className="w-[240px] bg-white border-l border-slate-200 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-700">Collegamento</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Tipo di relazione</label>
          <select
            value={edge.type || 'parent-child'}
            onChange={(e) => onTypeChange(edge.id, e.target.value as EdgeType)}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {EDGE_TYPE_LABELS.map((et) => (
              <option key={et.type} value={et.type}>{et.label}</option>
            ))}
          </select>
        </div>

        {edge.type !== 'parent-child' && (
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Anno relazione</label>
            <input
              type="text"
              value={(edge.data?.year as string) || ''}
              onChange={(e) => onDataChange(edge.id, { year: e.target.value })}
              placeholder="es. 1998"
              maxLength={4}
              className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="pt-1 border-t border-slate-100">
          <button
            onClick={() => onDelete(edge.id)}
            className="w-full text-sm text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded px-2 py-1.5 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Elimina collegamento
          </button>
        </div>
      </div>
    </div>
  )
}
