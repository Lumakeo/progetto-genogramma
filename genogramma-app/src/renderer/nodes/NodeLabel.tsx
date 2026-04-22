import { PersonData } from '../../shared/types'

interface Props {
  data: PersonData
}

function formatDate(day?: string, month?: string, year?: string): string {
  const parts = [day, month, year].map((v) => v?.trim()).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1 && year) return year
  return parts.join('/')
}

export function NodeLabel({ data }: Props) {
  const birth = formatDate(data.birthDay, data.birthMonth, data.birthYear)
  const death = formatDate(data.deathDay, data.deathMonth, data.deathYear)
  const hasInfo = data.label || data.profession || birth || death
  if (!hasInfo) return null

  return (
    <div className="text-center mt-1 max-w-[110px]">
      {data.label && (
        <div className="text-xs font-medium text-slate-800 leading-tight truncate">
          {data.label}
        </div>
      )}
      {data.profession && (
        <div className="text-[10px] text-slate-500 leading-tight truncate">
          {data.profession}
        </div>
      )}
      {birth && (
        <div className="text-[10px] text-slate-500 leading-tight">
          n.&nbsp;{birth}
        </div>
      )}
      {death && (
        <div className="text-[10px] text-slate-500 leading-tight">
          †&nbsp;{death}
        </div>
      )}
    </div>
  )
}
