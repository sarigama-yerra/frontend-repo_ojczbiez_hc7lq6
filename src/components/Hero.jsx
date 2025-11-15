import Spline from '@splinetool/react-spline'
import { Sparkles, PlayCircle } from 'lucide-react'

export default function Hero({ onStart }) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/95Gu7tsx2K-0F3oi/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />

      <div className="relative h-full flex flex-col items-center justify-end pb-10 text-center">
        <div className="flex items-center gap-2 text-orange-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Playful • Creative • Smart</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          Snap Learn
        </h1>
        <p className="mt-3 max-w-xl text-gray-600">Fun, interactive learning for little explorers. Learn letters, numbers, colors and more with friendly sounds and happy rewards.</p>
        <button onClick={onStart} className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition">
          <PlayCircle className="w-5 h-5" /> Start Learning
        </button>
      </div>
    </section>
  )
}
