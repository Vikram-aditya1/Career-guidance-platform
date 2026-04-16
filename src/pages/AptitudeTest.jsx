import { useEffect, useState } from 'react'
import { aptitudeQuestions, scoreToProfile } from '../data/aptitude.js'

const STORAGE_KEY = "aptitude_progress"

export function AptitudeTest() {
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState(null)

  // ✅ LOAD SAVED DATA
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) {
      setAnswers(saved.answers || {})
      setCurrent(saved.current || 0)
      setResult(saved.result || null)
    }
  }, [])

  // ✅ SAVE PROGRESS
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, current, result })
    )
  }, [answers, current, result])

  const q = aptitudeQuestions[current]

  function handleAnswer(index) {
    setAnswers({ ...answers, [q.id]: index })
  }

  function nextQuestion() {
    if (current < aptitudeQuestions.length - 1) {
      setCurrent(current + 1)
    }
  }

  function prevQuestion() {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  function handleSubmit() {
    const res = scoreToProfile(answers)
    setResult(res)

    // ✅ save for recommendations page
    localStorage.setItem("oscea_test_results", JSON.stringify(res))
    localStorage.setItem("userStream", res.streamHint)
  }

  function resetTest() {
    localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
    setCurrent(0)
    setResult(null)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* ================= TEST ================= */}
      {!result && (
        <div className="card p-6">

          <h2 className="text-lg font-extrabold mb-4">
            Question {current + 1} / {aptitudeQuestions.length}
          </h2>

         <p className="text-base font-semibold mb-4 text-slate-100">
            {q.question}
          </p>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all font-medium ${
  answers[q.id] === i
    ? "bg-indigo-600 text-white border-indigo-600"
    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={current === 0}
              className="px-4 py-2 rounded border"
            >
              Back
            </button>

            {current === aptitudeQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {result && (
        <div className="card p-6 mt-6">

          <h2 className="text-xl font-extrabold">
            🎯 Recommended Stream:
            <span className="text-indigo-600 ml-2">
              {result.streamHint}
            </span>
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {result.reason}
          </p>

          {/* SCORES */}
          <div className="mt-6">
            <h3 className="font-bold mb-3">Your Performance</h3>

            {Object.entries(result.scores).map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>{key}</span>
                  <span>{value}</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className="bg-indigo-500 h-2 rounded"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 🔁 RETAKE BUTTON */}
          <button
            onClick={resetTest}
            className="mt-6 px-4 py-2 border rounded"
          >
            Retake Test
          </button>

        </div>
      )}
    </div>
  )
}