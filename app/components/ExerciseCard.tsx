"use client"
import { useState, useEffect } from "react"

type Props = {
  name: string
  prep: number
  work: number
  rest: number
  rounds: number
  tabatas: number
  restBetweenTabatas: number
}

type Phase =
  | "idle"
  | "prep"
  | "work"
  | "rest"
  | "restBetweenTabatas"
  | "done"

export default function ExerciseCard({
  name,
  prep,
  work,
  rest,
  rounds,
  tabatas,
  restBetweenTabatas,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentTabata, setCurrentTabata] = useState(1)

  // Temporizador
  useEffect(() => {
    if (phase === "idle" || phase === "done") return

    if (timeLeft === 0) {
      nextPhase()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, phase])

  function start() {
    setCurrentRound(1)
    setCurrentTabata(1)
    setPhase("prep")
    setTimeLeft(prep)
  }

  function nextPhase() {
    if (phase === "prep") {
      setPhase("work")
      setTimeLeft(work)
      return
    }

    if (phase === "work") {
      if (currentRound < rounds) {
        setPhase("rest")
        setTimeLeft(rest)
      } else {
        if (currentTabata < tabatas) {
          setPhase("restBetweenTabatas")
          setTimeLeft(restBetweenTabatas)
        } else {
          setPhase("done")
        }
      }
      return
    }

    if (phase === "rest") {
      setCurrentRound((r) => r + 1)
      setPhase("work")
      setTimeLeft(work)
      return
    }

    if (phase === "restBetweenTabatas") {
      setCurrentTabata((t) => t + 1)
      setCurrentRound(1)
      setPhase("work")
      setTimeLeft(work)
      return
    }
  }

  function getPhaseText() {
    switch (phase) {
      case "prep":
        return "Prepárate"
      case "work":
        return "Ejercicio"
      case "rest":
        return "Descanso"
      case "restBetweenTabatas":
        return "Descanso largo"
      case "done":
        return "Completado ✅"
      default:
        return "Listo"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6">
      <h2 className="text-xl font-bold mb-2">{name}</h2>

      <p className="text-sm text-gray-600 mb-3">
        {rounds} rondas × {tabatas} tabatas
      </p>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold">{getPhaseText()}</p>
        <p className="text-4xl font-bold">{timeLeft}s</p>
        <p className="text-sm text-gray-500">
          Ronda {currentRound}/{rounds} — Tabata {currentTabata}/{tabatas}
        </p>
      </div>

      {phase === "idle" && (
        <button
          onClick={start}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold"
        >
          Iniciar
        </button>
      )}

      {phase === "done" && (
        <button
          onClick={() => setPhase("idle")}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold"
        >
          Reiniciar
        </button>
      )}
    </div>
  )
}
