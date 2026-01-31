"use client"
import { useEffect, useState } from "react"

const exercises = [
  {
    name: "Extensión pasiva con talón elevado",
    prep: 10,
    work: 300,
    rest: 0,
    rounds: 1,
    tabatas: 1,
    restBetweenTabatas: 0,
  },
  {
    name: "Contracción de cuádriceps en extensión",
    prep: 5,
    work: 10,
    rest: 5,
    rounds: 15,
    tabatas: 1,
    restBetweenTabatas: 0,
  },
  {
    name: "Elevación de pierna recta",
    prep: 5,
    work: 5,
    rest: 5,
    rounds: 15,
    tabatas: 1,
    restBetweenTabatas: 0,
  },
  {
    name: "Deslizamientos de talón",
    prep: 5,
    work: 5,
    rest: 5,
    rounds: 15,
    tabatas: 1,
    restBetweenTabatas: 0,
  },
  {
    name: "Bomba venosa de tobillo",
    prep: 5,
    work: 60,
    rest: 0,
    rounds: 1,
    tabatas: 1,
    restBetweenTabatas: 0,
  },
]

export default function Home() {
  const [completedToday, setCompletedToday] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("rehab-completed")
    if (saved) setCompletedToday(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("rehab-completed", JSON.stringify(completedToday))
  }, [completedToday])

  const toggleExercise = (name) => {
    setCompletedToday((prev) =>
      prev.includes(name)
        ? prev.filter((e) => e !== name)
        : [...prev, name]
    )
  }

  const progress = Math.round(
    (completedToday.length / exercises.length) * 100
  )

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Rehabilitación de Rodilla</h1>

      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            height: 20,
            background: "#ddd",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#4caf50",
            }}
          />
        </div>
        <p>{progress}% completado hoy</p>
      </div>

      {exercises.map((ex) => {
        const done = completedToday.includes(ex.name)
        return (
          <div
            key={ex.name}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              background: done ? "#e8f5e9" : "#fff",
            }}
          >
            <h3>{ex.name}</h3>

            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
              ⏳ Prep: {ex.prep}s | 💪 Trabajo: {ex.work}s | 😮‍💨 Descanso: {ex.rest}s  
              <br />
              🔁 Rondas: {ex.rounds} | 📦 Tabatas: {ex.tabatas} | 🧊 Entre tabatas: {ex.restBetweenTabatas}s
            </div>

            <button
              onClick={() => toggleExercise(ex.name)}
              style={{
                marginTop: 10,
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: done ? "#2e7d32" : "#1976d2",
                color: "white",
                cursor: "pointer",
              }}
            >
              {done ? "✔ Completado" : "Marcar como hecho"}
            </button>
          </div>
        )
      })}
    </main>
  )
}
