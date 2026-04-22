import { useState } from 'react'
import { Node, Edge } from 'reactflow'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { Download, FileJson, FolderOpen, Printer, ChevronDown } from 'lucide-react'
import { PersonData } from '../../../shared/types'

interface Props {
  getNodes: () => Node<PersonData>[]
  getEdges: () => Edge[]
  onLoad: (nodes: Node<PersonData>[], edges: Edge[]) => void
}

declare global {
  interface Window {
    api?: {
      saveFile: (content: string) => Promise<{ success: boolean }>
      openFile: () => Promise<{ success: boolean; content: string | null }>
    }
  }
}

export function ExportMenu({ getNodes, getEdges, onLoad }: Props) {
  const [open, setOpen] = useState(false)

  const exportPng = async () => {
    setOpen(false)
    const el = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!el) return
    const dataUrl = await toPng(el, { backgroundColor: '#f8fafc', pixelRatio: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'genogramma.png'
    a.click()
  }

  const exportPdf = async () => {
    setOpen(false)
    const el = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!el) return
    const dataUrl = await toPng(el, { backgroundColor: '#f8fafc', pixelRatio: 2 })
    const img = new Image()
    img.src = dataUrl
    await new Promise<void>((resolve) => { img.onload = () => resolve() })
    const w = img.width / 2
    const h = img.height / 2
    const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] })
    pdf.addImage(dataUrl, 'PNG', 0, 0, w, h)
    pdf.save('genogramma.pdf')
  }

  const saveProject = async () => {
    setOpen(false)
    const content = JSON.stringify({ nodes: getNodes(), edges: getEdges() }, null, 2)
    if (window.api) {
      await window.api.saveFile(content)
    } else {
      const blob = new Blob([content], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'genogramma.json'
      a.click()
    }
  }

  const openProject = async () => {
    setOpen(false)
    if (window.api) {
      const result = await window.api.openFile()
      if (result.success && result.content) {
        const data = JSON.parse(result.content)
        onLoad(data.nodes, data.edges)
      }
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          const data = JSON.parse(ev.target?.result as string)
          onLoad(data.nodes, data.edges)
        }
        reader.readAsText(file)
      }
      input.click()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        File <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[180px] py-1">
            <button onClick={openProject} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <FolderOpen size={14} /> Apri progetto
            </button>
            <button onClick={saveProject} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <FileJson size={14} /> Salva progetto
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button onClick={exportPng} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Download size={14} /> Esporta PNG
            </button>
            <button onClick={exportPdf} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Printer size={14} /> Esporta PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}
