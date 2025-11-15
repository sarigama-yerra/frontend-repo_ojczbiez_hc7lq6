import { useEffect, useMemo, useRef, useState } from 'react'
import Hero from './components/Hero'
import Flashcard from './components/Flashcard'
import Quiz from './components/Quiz'
import Controls from './components/Controls'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [started, setStarted] = useState(false)
  const [categories, setCategories] = useState(["alphabets","numbers","colors","shapes","animals"])
  const [category, setCategory] = useState('alphabets')
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [points, setPoints] = useState(0)
  const [mode, setMode] = useState('flashcard') // flashcard | quiz
  const [timeLeft, setTimeLeft] = useState(300)

  const deviceIdRef = useRef(null)
  useEffect(() => {
    deviceIdRef.current = localStorage.getItem('snap_device') || crypto.randomUUID()
    localStorage.setItem('snap_device', deviceIdRef.current)
  }, [])

  useEffect(() => {
    fetch(`${baseUrl}/api/categories`).then(r=>r.json()).then(d=>{
      if (d.categories?.length) setCategories(d.categories)
    }).catch(()=>{})
  }, [baseUrl])

  useEffect(() => {
    if (!started) return
    setItems([])
    fetch(`${baseUrl}/api/items${category ? `?category=${encodeURIComponent(category)}` : ''}`)
      .then(r => r.json())
      .then(d => {
        setItems(d.items || [])
        setIndex(0)
      })
      .catch(()=>{})
  }, [started, category, baseUrl])

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => setTimeLeft((s)=> s>0? s-1 : 0), 1000)
    return () => clearInterval(t)
  }, [started])

  useEffect(() => {
    if (timeLeft === 0) {
      setMode('quiz')
    }
  }, [timeLeft])

  const currentItem = items[index]

  function nextItem() {
    setIndex((i) => (i + 1) % (items.length || 1))
  }

  async function handleScore(correct) {
    setPoints((p) => p + (correct ? 10 : 0))
    try {
      await fetch(`${baseUrl}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceIdRef.current,
          category,
          correct: correct ? 1 : 0,
          attempts: 1,
          points: correct ? 10 : 0,
          badge: correct ? 'Quick Learner' : undefined,
        })
      })
    } catch {}
  }

  const header = (
    <header className="w-full mx-auto max-w-5xl px-4 pt-6 flex items-center justify-between">
      <div className="text-2xl font-extrabold text-orange-600">Snap Learn</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full font-semibold text-gray-700">⭐ {points}</span>
        <button onClick={()=>setMode(mode==='flashcard'?'quiz':'flashcard')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full font-semibold">{mode==='flashcard'? 'Quiz Mode' : 'Flashcards'}</button>
      </div>
    </header>
  )

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
        {header}
        <main className="mx-auto max-w-5xl px-4">
          <Hero onStart={() => setStarted(true)} />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card title="Learn with Flashcards" desc="See, hear, and remember with friendly visuals." emoji="🃏" />
            <Card title="Quick Quizzes" desc="Short, colorful questions to check understanding." emoji="🎯" />
            <Card title="Earn Stars" desc="Collect points and badges as you learn!" emoji="⭐" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {header}

      <main className="mx-auto max-w-5xl px-4 py-6 flex flex-col items-center gap-6">
        <Controls categories={categories} current={category} onChange={setCategory} timeLeft={timeLeft} />

        {mode === 'flashcard' && currentItem && (
          <Flashcard item={currentItem} onNext={nextItem} onCorrect={() => handleScore(true)} />
        )}

        {mode === 'quiz' && (
          <Quiz category={category} baseUrl={baseUrl} onDone={() => setMode('flashcard')} onScore={handleScore} />
        )}

        {!currentItem && (
          <div className="text-gray-600">Loading playful cards...</div>
        )}
      </main>
    </div>
  )
}

function Card({ title, desc, emoji }) {
  return (
    <div className="bg-white/80 backdrop-blur border border-orange-100 rounded-3xl p-5 shadow">
      <div className="text-4xl">{emoji}</div>
      <div className="mt-2 text-lg font-bold text-gray-900">{title}</div>
      <div className="text-gray-600">{desc}</div>
    </div>
  )
}

export default App
