import { Timer } from 'lucide-react'

export default function Controls({ categories, current, onChange, timeLeft }) {
  return (
    <div className="w-full max-w-xl flex items-center justify-between gap-3">
      <select
        className="flex-1 bg-white/80 backdrop-blur border border-orange-200 rounded-2xl px-4 py-3 font-semibold text-gray-700"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map(c => (
          <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-orange-200 rounded-2xl px-4 py-3">
        <Timer className="w-5 h-5 text-orange-600" />
        <span className="font-bold text-gray-800">{timeLeft}s</span>
      </div>
    </div>
  )
}
