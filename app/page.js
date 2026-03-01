"use client";
import { useEffect, useState } from "react";
import exercisesData from "./ejercicios.json";

const getEcuadorDate = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
};

export default function Home() {
  const [today, setToday] = useState(getEcuadorDate);
  const [checks, setChecks] = useState({});
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  const exercises = exercisesData;
  const totalExercises = Object.values(exercises).flat().length;

  // Detectar cambio de día cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getEcuadorDate();
      setToday((prev) => {
        if (prev !== newDate) {
          setChecks({});
        }
        return newDate;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(today);
    if (saved) setChecks(JSON.parse(saved));
    updateStreak();
  }, [today]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(today, JSON.stringify(checks));
    updateStreak();
  }, [checks, mounted]);

  const toggleCheck = (period, exerciseName) => {
    setChecks((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [exerciseName]: !prev?.[period]?.[exerciseName],
      },
    }));
  };

  const completedCount = Object.values(checks)
    .flatMap((p) => Object.values(p || {}))
    .filter(Boolean).length;

  const progress = Math.round((completedCount / totalExercises) * 100);

  const updateStreak = () => {
    if (typeof window === "undefined") return;

    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
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
    period === "mañana" ? "🌅" : period === "tarde" ? "☀️" : "🤸";

  const last7Days = mounted
    ? Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        const done = Object.values(data)
          .flatMap((p) => Object.values(p || {}))
          .filter(Boolean).length;
        return { date: key, done };
      })
    : [];

  const weeklyAverage = mounted
    ? Math.round(
        (last7Days.reduce((acc, d) => acc + d.done, 0) /
          (totalExercises * 7)) *
          100
      )
    : 0;

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

        {completedCount === 0 && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-xl text-center font-semibold text-red-700">
            ⚠️ Aún no has hecho tus ejercicios hoy
          </div>
        )}

        <div className="mb-6 text-center text-lg font-semibold">
          🔥 Racha actual: {streak} día{streak !== 1 && "s"}
        </div>

        {mounted && (
          <>
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
                    {new Date(d.date + "T12:00:00").getDate()}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 text-center font-medium">
              📈 Cumplimiento últimos 7 días: {weeklyAverage}%
            </div>
          </>
        )}

        {Object.entries(exercises).map(([period, list]) => (
          <div
            key={period}
            className="mb-8 bg-white p-5 rounded-2xl shadow-md border border-slate-300"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 capitalize">
              {getIcon(period)} {period}
            </h2>

            {list.map((ex) => (
              <div key={ex.name} className="mb-4 pb-4 border-b last:border-0 last:pb-0">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checks?.[period]?.[ex.name] || false}
                    onChange={() => toggleCheck(period, ex.name)}
                    className="w-5 h-5 accent-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{ex.name}</div>
                    <div className="text-sm text-blue-600 font-mono mt-1">
                      {ex.tabata}
                    </div>
                    {ex.note && (
                      <div className="text-xs text-slate-600 mt-1">
                        {ex.note}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        ))}

        {/* INFO TABATA */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-xl">
          <h3 className="font-semibold mb-2 text-blue-900">ℹ️ Formato Tabata</h3>
          <p className="text-sm text-blue-800">
            <strong>Trabajo/Descanso/Rondas/Tabatas</strong>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Ejemplo: <code className="bg-blue-100 px-1 rounded">10s/5s/15/1</code> = 10 seg trabajo, 5 seg descanso, 15 rondas, 1 tabata
          </p>
        </div>

        <p className="text-center mt-10 text-sm text-slate-600 font-medium">
          "Constancia diaria = rodilla que vuelve a moverse"
        </p>
      </div>
    </main>
  );
}