import { useEffect, useMemo, useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'

const voice = typeof window !== 'undefined' && window.speechSynthesis

export default function Flashcard({ item, onNext, onCorrect }) {
  const [step, setStep] = useState(1) // 1: Learn, 2: Recall, 3: Reinforce
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setStep(1)
    setInput('')
    setFeedback(null)
    if (item) speak(`${item.label}. ${item.phonics || ''}`)
  }, [item])

  const masked = useMemo(() => {
    if (!item?.label) return ''
    // Simple mask: hide middle letter(s)
    if (item.label.length <= 2) return item.label[0] + '_'
    const first = item.label[0]
    const last = item.label[item.label.length - 1]
    return `${first}${'_'.repeat(Math.max(1, item.label.length - 2))}${last}`
  }, [item])

  function speak(text) {
    if (!voice) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.pitch = 1.1
    utter.rate = 0.95
    speechSynthesis.speak(utter)
  }

  function check() {
    const correct = input.trim().toLowerCase() === (item?.label || '').toLowerCase()
    if (correct) {
      setFeedback('correct')
      speak('Well done!')
      onCorrect?.()
      setTimeout(() => {
        setStep(1)
        setFeedback(null)
        setInput('')
        onNext?.()
      }, 1200)
    } else {
      setFeedback('try')
      speak('Good try! Almost there!')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-orange-600">Step {step} of 3</div>
        <button onClick={() => speak(`${item.label}. ${item.phonics || ''}`)} className="text-orange-600 hover:text-orange-700">
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {step === 1 && (
        <div className="text-center">
          <div className="text-7xl md:text-8xl mb-4 select-none">
            {item.display || '✨'}
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-gray-900">{item.label}</div>
          {item.phonics && <div className="text-orange-600 mt-1 font-semibold">{item.phonics}</div>}
          <button onClick={() => setStep(2)} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold shadow">
            Try it
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <div className="text-6xl mb-3">{item.display || '✨'}</div>
          <div className="text-2xl font-bold tracking-wide text-gray-700 mb-3">{masked}</div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-center text-xl md:text-2xl border-2 border-orange-300 focus:border-orange-500 outline-none rounded-xl py-2"
            placeholder="Type the word"
          />
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={check} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold">Check</button>
            <button onClick={() => setStep(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-semibold">Back</button>
          </div>
          {feedback === 'try' && (
            <div className="mt-3 text-orange-600 font-semibold">Good try! Hint: {item.phonics || 'Listen again'}</div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="text-6xl mb-3">🎉</div>
          <div className="text-2xl font-bold text-green-600">Well done!</div>
        </div>
      )}
    </div>
  )
}
