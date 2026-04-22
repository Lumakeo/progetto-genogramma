import { Node } from 'reactflow'
import { PersonData, EdgeType } from '../../../shared/types'
import { X, Plus, Trash2 } from 'lucide-react'

interface Props {
  selectedNode: Node<PersonData> | null
  selectedEdgeType?: EdgeType
  onNodeChange: (id: string, data: Partial<PersonData>) => void
  onDeleteNode: (id: string) => void
  onClose: () => void
}

const edgeTypeLabels: Record<EdgeType, string> = {
  married: 'Sposati (=)',
  separated: 'Separati (//)',
  divorced: 'Divorziati (//=)',
  cohabiting: 'Conviventi (---)',
  'separated-cohabiting': 'Sep. convivenza',
  'parent-child': 'Genitore-figlio'
}

export function PropertiesPanel({ selectedNode, onNodeChange, onDeleteNode, onClose }: Props) {
  if (!selectedNode) return null

  const data = selectedNode.data

  const updateData = (field: keyof PersonData, value: unknown) => {
    onNodeChange(selectedNode.id, { [field]: value })
  }

  const updateAdjective = (index: number, value: string) => {
    const adjectives = [...(data.adjectives || [])]
    adjectives[index] = value
    updateData('adjectives', adjectives)
  }

  const addAdjective = () => {
    const adjectives = [...(data.adjectives || []), '']
    updateData('adjectives', adjectives)
  }

  const removeAdjective = (index: number) => {
    const adjectives = (data.adjectives || []).filter((_, i) => i !== index)
    updateData('adjectives', adjectives)
  }

  return (
    <div className="w-[240px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-700">Proprietà</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Nome</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => updateData('label', e.target.value)}
            placeholder="Nome"
            className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Data di nascita</label>
          <div className="flex gap-1">
            <input
              type="text"
              value={data.birthDay || ''}
              onChange={(e) => updateData('birthDay', e.target.value)}
              placeholder="GG"
              maxLength={2}
              className="w-10 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={data.birthMonth || ''}
              onChange={(e) => updateData('birthMonth', e.target.value)}
              placeholder="MM"
              maxLength={2}
              className="w-10 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={data.birthYear || ''}
              onChange={(e) => updateData('birthYear', e.target.value)}
              placeholder="AAAA"
              maxLength={4}
              className="flex-1 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Data di morte</label>
          <div className="flex gap-1">
            <input
              type="text"
              value={data.deathDay || ''}
              onChange={(e) => updateData('deathDay', e.target.value)}
              placeholder="GG"
              maxLength={2}
              className="w-10 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={data.deathMonth || ''}
              onChange={(e) => updateData('deathMonth', e.target.value)}
              placeholder="MM"
              maxLength={2}
              className="w-10 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={data.deathYear || ''}
              onChange={(e) => updateData('deathYear', e.target.value)}
              placeholder="AAAA"
              maxLength={4}
              className="flex-1 text-sm border border-slate-200 rounded px-1.5 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Professione</label>
          <input
            type="text"
            value={data.profession || ''}
            onChange={(e) => updateData('profession', e.target.value)}
            placeholder="Es. Insegnante"
            className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-500">Aggettivi</label>
            <button
              onClick={addAdjective}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-0.5 text-xs"
            >
              <Plus size={12} /> Aggiungi
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {(data.adjectives || []).map((adj, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="text"
                  value={adj}
                  onChange={(e) => updateAdjective(i, e.target.value)}
                  placeholder={`Aggettivo ${i + 1}`}
                  className="flex-1 text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => removeAdjective(i)}
                  className="p-1 text-slate-300 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {(data.adjectives || []).length === 0 && (
              <p className="text-xs text-slate-400 italic">Nessun aggettivo</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Note</label>
          <textarea
            value={data.notes || ''}
            onChange={(e) => updateData('notes', e.target.value)}
            placeholder="Note libere..."
            rows={3}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <div className="pt-1 border-t border-slate-100">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full text-sm text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded px-2 py-1.5 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Elimina elemento
          </button>
        </div>
      </div>
    </div>
  )
}
