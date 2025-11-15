import { useEffect, useState } from 'react'

export default function Quiz({ category, baseUrl, onDone, onScore }) {
  const [quiz, setQuiz] = useState(null)
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setSelected(null)
    fetch(`${baseUrl}/api/quiz?category=${encodeURIComponent(category)}`)
      .then(r => r.json())
      .then(setQuiz)
      .catch(() => setQuiz(null))
  }, [category, baseUrl])

  function choose(opt) {
    if (!quiz || selected) return
    setSelected(opt)
    const correct = opt.key === quiz.answer.key
    setStatus(correct ? 'correct' : 'wrong')
    onScore?.(correct)
    setTimeout(() => {
      onDone?.()
    }, 1000)
  }

  if (!quiz) return <div className="text-center text-gray-600">Loading quiz...</div>

  return (
    <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 border border-blue-100">
      <div className="text-center text-xl font-bold text-blue-700 mb-4">{quiz.question}</div>
      <div className="grid grid-cols-2 gap-3">
        {quiz.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => choose(opt)}
            className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center text-lg font-semibold transition ${selected?.key === opt.key ? (status === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-blue-200 hover:border-blue-400'}`}
          >
            <div className="text-4xl mb-1">{opt.display || '✨'}</div>
            <div>{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
