"use client";
import { useEffect, useState } from "react";
import exercisesData from "./ejercicios.json";

const getEcuadorDate = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
};

const getDayName = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  const name = d.toLocaleDateString('es-EC', { weekday: 'long' });
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getDayPlan = (dateStr) => {
  const dayName = getDayName(dateStr);
  return exercisesData[dayName] || null;
};

export default function Home() {
  const [today, setToday] = useState(getEcuadorDate);
  const [checks, setChecks] = useState({});
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  const dayName = getDayName(today);
  const dayPlan = getDayPlan(today);
  const ejercicios = dayPlan ? dayPlan.ejercicios : [];
  const totalExercises = ejercicios.length;

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

  const toggleCheck = (exerciseName) => {
    setChecks((prev) => ({
      ...prev,
      [exerciseName]: !prev?.[exerciseName],
    }));
  };

  const completedCount = Object.values(checks).filter(Boolean).length;
  const progress = totalExercises > 0
    ? Math.round((completedCount / totalExercises) * 100)
    : 0;

  const updateStreak = () => {
    if (typeof window === "undefined") return;

    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
      const plan = getDayPlan(key);
      if (!plan) break;

      const expected = plan.ejercicios.length;
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      const done = Object.values(data).filter(Boolean).length;

      if (expected > 0 && done === expected) count++;
      else break;
    }
    setStreak(count);
  };

  const last7Days = mounted
    ? Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
        const plan = getDayPlan(key);
        const expected = plan ? plan.ejercicios.length : 0;
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        const done = Object.values(data).filter(Boolean).length;
        return { date: key, done, expected };
      })
    : [];

  const weekTotals = last7Days.reduce(
    (acc, d) => ({ done: acc.done + d.done, expected: acc.expected + d.expected }),
    { done: 0, expected: 0 }
  );

  const weeklyAverage = mounted && weekTotals.expected > 0
    ? Math.round((weekTotals.done / weekTotals.expected) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-200 dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          🦵 Rehabilitación de Rodilla
        </h1>
        <p className="text-center mb-1 font-medium">Fecha: {today}</p>
        <p className="text-center mb-4 text-slate-600 dark:text-slate-400">
          {dayName}{dayPlan ? ` — ${dayPlan.titulo}` : ""}
        </p>

        {/* PROGRESO */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 font-medium">
            <span>Progreso de hoy</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-4">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {completedCount === 0 && totalExercises > 0 && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-xl text-center font-semibold text-red-700 dark:text-red-300">
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
                      d.expected > 0 && d.done === d.expected
                        ? "bg-green-500 dark:bg-green-600 text-white"
                        : d.done > 0
                        ? "bg-yellow-300 dark:bg-yellow-600 dark:text-slate-900"
                        : "bg-slate-300 dark:bg-slate-700"
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

        <div className="mb-8 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-md border border-slate-300 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💪 {dayName}{dayPlan ? ` — ${dayPlan.titulo}` : ""}
          </h2>

          {ejercicios.map((ex) => (
            <div key={ex.name} className="mb-4 pb-4 border-b dark:border-slate-700 last:border-0 last:pb-0">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checks?.[ex.name] || false}
                  onChange={() => toggleCheck(ex.name)}
                  className="w-5 h-5 accent-blue-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-medium">{ex.name}</div>
                  {ex.detail && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-mono mt-1">
                      {ex.detail}
                    </div>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm("¿Borrar toda la data guardada y empezar desde cero?")) {
              localStorage.clear();
              setChecks({});
              setStreak(0);
            }
          }}
          className="w-full mt-4 p-3 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 font-semibold text-sm"
        >
          🗑️ Resetear toda la data
        </button>

        <p className="text-center mt-10 text-sm text-slate-600 dark:text-slate-400 font-medium">
          "Constancia diaria = rodilla que vuelve a moverse"
        </p>
      </div>
    </main>
  );
}