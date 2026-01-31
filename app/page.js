"use client";
import { useEffect, useState } from "react";

const exercises = {
  mañana: [
    "Extensión pasiva (talón elevado)",
    "Contracción de cuádriceps",
    "Elevación de pierna recta",
  ],
  tarde: ["Deslizamientos de talón", "Bomba de tobillo"],
  noche: [
    "Extensión pasiva (talón elevado)",
    "Contracción de cuádriceps",
    "Elevación de pierna recta",
  ],
};

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const [checks, setChecks] = useState({});
  const [streak, setStreak] = useState(0);

  const totalExercises = Object.values(exercises).flat().length;

  useEffect(() => {
    const saved = localStorage.getItem(today);
    if (saved) setChecks(JSON.parse(saved));
  }, [today]);

  useEffect(() => {
    localStorage.setItem(today, JSON.stringify(checks));
    updateStreak();
  }, [checks]);

  const toggleCheck = (period, exercise) => {
    setChecks((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [exercise]: !prev?.[period]?.[exercise],
      },
    }));
  };

  const completedCount = Object.values(checks)
    .flatMap((p) => Object.values(p || {}))
    .filter(Boolean).length;

  const progress = Math.round((completedCount / totalExercises) * 100);

  const updateStreak = () => {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      const data = JSON.parse(localStorage.getItem(key) || "{}");

      const done = Object.values(data)
        .flatMap((p) => Object.values(p || {}))
        .filter(Boolean).length;

      if (done === totalExercises) count++;
      else break;
    }
    setStreak(count);
  };

  const getIcon = (period) =>
    period === "mañana" ? "🌅" : period === "tarde" ? "☀️" : "🌙";

  // 📅 ÚLTIMOS 7 DÍAS
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    const done = Object.values(data)
      .flatMap((p) => Object.values(p || {}))
      .filter(Boolean).length;
    return { date: key, done };
  });

  const weeklyAverage = Math.round(
    (last7Days.reduce((acc, d) => acc + d.done, 0) /
      (totalExercises * 7)) *
      100
  );

  return (
    <main className="min-h-screen bg-slate-200 p-6 text-slate-900">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          🦵 Rehabilitación de Rodilla
        </h1>
        <p className="text-center mb-4 font-medium">Fecha: {today}</p>

        {/* PROGRESO */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 font-medium">
            <span>Progreso de hoy</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* AVISO SI NO HA HECHO NADA */}
        {completedCount === 0 && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-xl text-center font-semibold text-red-700">
            ⚠️ Aún no has hecho tus ejercicios hoy
          </div>
        )}

        {/* RACHA */}
        <div className="mb-6 text-center text-lg font-semibold">
          🔥 Racha actual: {streak} día{streak !== 1 && "s"}
        </div>

        {/* CALENDARIO MINI */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">📅 Últimos 7 días</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {last7Days.map((d) => (
              <div
                key={d.date}
                className={`p-2 rounded-lg ${
                  d.done === totalExercises
                    ? "bg-green-500 text-white"
                    : d.done > 0
                    ? "bg-yellow-300"
                    : "bg-slate-300"
                }`}
              >
                {new Date(d.date).getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN SEMANAL */}
        <div className="mb-8 text-center font-medium">
          📈 Cumplimiento últimos 7 días: {weeklyAverage}%
        </div>

        {Object.entries(exercises).map(([period, list]) => (
          <div
            key={period}
            className="mb-8 bg-white p-5 rounded-2xl shadow-md border border-slate-300"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 capitalize">
              {getIcon(period)} {period}
            </h2>

            {list.map((ex) => (
              <label key={ex} className="flex items-center mb-3 gap-3 font-medium">
                <input
                  type="checkbox"
                  checked={checks?.[period]?.[ex] || false}
                  onChange={() => toggleCheck(period, ex)}
                  className="w-5 h-5 accent-blue-600"
                />
                <span>{ex}</span>
              </label>
            ))}
          </div>
        ))}

        <p className="text-center mt-10 text-sm text-slate-600 font-medium">
          “Constancia diaria = rodilla que vuelve a moverse”
        </p>
      </div>
    </main>
  );
}
