import { NodeType } from '../../../shared/types'

interface SymbolItem {
  type: NodeType
  label: string
  preview: React.ReactNode
}

const symbols: SymbolItem[] = [
  {
    type: 'male',
    label: 'Maschio',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="1" y="1" width="30" height="30" fill="white" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'female',
    label: 'Femmina',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="white" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'unknown',
    label: 'Altro/N.S.',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <polygon points="16,1 31,16 16,31 1,16" fill="white" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'deceased-male',
    label: 'Maschio dec.',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="1" y="1" width="30" height="30" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="1" y1="1" x2="31" y2="31" stroke="#1e293b" strokeWidth="1.5" />
        <line x1="31" y1="1" x2="1" y2="31" stroke="#1e293b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    type: 'deceased-female',
    label: 'Femmina dec.',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="4" y1="4" x2="28" y2="28" stroke="#1e293b" strokeWidth="1.5" />
        <line x1="28" y1="4" x2="4" y2="28" stroke="#1e293b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    type: 'deceased-unknown',
    label: 'Altro dec.',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <polygon points="16,1 31,16 16,31 1,16" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="7" y1="7" x2="25" y2="25" stroke="#1e293b" strokeWidth="1.5" />
        <line x1="25" y1="7" x2="7" y2="25" stroke="#1e293b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    type: 'twins-male',
    label: 'Gemelli M',
    preview: (
      <svg width="56" height="28" viewBox="0 0 56 28">
        <rect x="1" y="4" width="22" height="22" fill="white" stroke="#1e293b" strokeWidth="2" />
        <rect x="33" y="4" width="22" height="22" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="12" y1="4" x2="44" y2="4" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'twins-female',
    label: 'Gemelle F',
    preview: (
      <svg width="56" height="28" viewBox="0 0 56 28">
        <circle cx="12" cy="16" r="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="44" cy="16" r="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="12" y1="5" x2="44" y2="5" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'foster-child',
    label: 'Figlio affid.',
    preview: (
      <svg width="32" height="40" viewBox="0 0 32 40">
        <line x1="16" y1="0" x2="16" y2="10" stroke="#1e293b" strokeWidth="2" />
        <circle cx="16" cy="26" r="14" fill="white" stroke="#1e293b" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'abortion-unknown',
    label: 'Aborto (ignoto)',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <polygon points="16,2 30,30 2,30" fill="#1e293b" />
      </svg>
    )
  },
  {
    type: 'abortion-male',
    label: 'Aborto/morte M',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="1" y="1" width="30" height="30" fill="#1e293b" />
      </svg>
    )
  },
  {
    type: 'abortion-female',
    label: 'Aborto/morte F',
    preview: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#1e293b" />
      </svg>
    )
  },
  {
    type: 'system-boundary',
    label: 'Confine sistema',
    preview: (
      <svg width="48" height="32" viewBox="0 0 48 32">
        <ellipse cx="24" cy="16" rx="22" ry="14" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    )
  }
]

interface Props {
  onAddNode: (type: NodeType) => void
}

export function Toolbar({ onAddNode }: Props) {
  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-[120px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto py-2 shrink-0">
      <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        Simboli
      </div>
      {symbols.map((s) => (
        <div
          key={s.type}
          draggable
          onDragStart={(e) => onDragStart(e, s.type)}
          onClick={() => onAddNode(s.type)}
          className="flex flex-col items-center px-2 py-2 cursor-grab hover:bg-slate-50 active:bg-slate-100 border-b border-slate-100 last:border-0 select-none"
          title={s.label}
        >
          <div className="flex items-center justify-center h-10">{s.preview}</div>
          <span className="text-[9px] text-slate-500 mt-1 text-center leading-tight">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
