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

// Suma/resta días a una fecha string YYYY-MM-DD
const addDays = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
};

// --- Utilidades de notas de progresión ---
// Cada ejercicio guarda su historial en localStorage bajo la clave `notas_${nombre}`
// Estructura: { "2026-08-01": "5kg, buena forma", "2026-07-28": "4kg" }

const getNotesHistory = (exerciseName) => {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(`notas_${exerciseName}`);
  return raw ? JSON.parse(raw) : {};
};

const saveNote = (exerciseName, dateStr, text) => {
  const history = getNotesHistory(exerciseName);
  if (text.trim() === "") {
    delete history[dateStr];
  } else {
    history[dateStr] = text;
  }
  localStorage.setItem(`notas_${exerciseName}`, JSON.stringify(history));
};

// Busca la nota más reciente ANTERIOR (o igual) a una fecha dada
const getLastNoteBefore = (exerciseName, dateStr) => {
  const history = getNotesHistory(exerciseName);
  const dates = Object.keys(history)
    .filter((d) => d < dateStr)
    .sort()
    .reverse();
  if (dates.length === 0) return null;
  return { date: dates[0], text: history[dates[0]] };
};

export default function Home() {
  const [today, setToday] = useState(getEcuadorDate);
  const [selectedDate, setSelectedDate] = useState(getEcuadorDate);
  const [checks, setChecks] = useState({});
  const [notes, setNotes] = useState({}); // notas del día seleccionado, por ejercicio
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  const dayName = getDayName(selectedDate);
  const dayPlan = getDayPlan(selectedDate);
  const ejercicios = dayPlan ? dayPlan.ejercicios : [];
  const totalExercises = ejercicios.length;

  // Actualizar la fecha real cada minuto (para racha y semana)
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getEcuadorDate());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Cargar checks y notas al cambiar la fecha seleccionada
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(selectedDate);
    if (saved) {
      setChecks(JSON.parse(saved));
    } else {
      setChecks({});
    }

    // Cargar la nota de CADA ejercicio para el día seleccionado (si existe)
    const plan = getDayPlan(selectedDate);
    const loadedNotes = {};
    if (plan) {
      plan.ejercicios.forEach((ex) => {
        const history = getNotesHistory(ex.name);
        loadedNotes[ex.name] = history[selectedDate] || "";
      });
    }
    setNotes(loadedNotes);

    updateStreak();
  }, [selectedDate]);

  // Guardar checks cuando cambien (solo si mounted)
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(selectedDate, JSON.stringify(checks));
    updateStreak();
  }, [checks, selectedDate, mounted]);

  // Recalcular racha cuando cambie el día real (today)
  useEffect(() => {
    updateStreak();
  }, [today]);

  const toggleCheck = (exerciseName) => {
    setChecks((prev) => ({
      ...prev,
      [exerciseName]: !prev?.[exerciseName],
    }));
  };

  const handleNoteChange = (exerciseName, text) => {
    setNotes((prev) => ({ ...prev, [exerciseName]: text }));
    saveNote(exerciseName, selectedDate, text);
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

  // Navegación días
  const goToPrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(today);

  return (
    <main className="min-h-screen bg-slate-200 dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          🦵 Rehabilitación de Rodilla
        </h1>

        {/* Selector de fecha */}
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <button
            onClick={goToPrevDay}
            className="px-3 py-1 bg-slate-300 dark:bg-slate-700 rounded-lg text-lg font-bold hover:bg-slate-400 dark:hover:bg-slate-600"
          >
            ◀
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={goToNextDay}
            className="px-3 py-1 bg-slate-300 dark:bg-slate-700 rounded-lg text-lg font-bold hover:bg-slate-400 dark:hover:bg-slate-600"
          >
            ▶
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 text-sm"
          >
            Hoy
          </button>
        </div>

        <p className="text-center mb-1 font-medium">Fecha seleccionada: {selectedDate}</p>
        <p className="text-center mb-4 text-slate-600 dark:text-slate-400">
          {dayName}{dayPlan ? ` — ${dayPlan.titulo}` : " (sin ejercicios)"}
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
          <div className="mb-6 p-2 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-xl text-center font-semibold text-red-700 dark:text-red-300">
            ⚠️ Aún no has hecho tus ejercicios para este día
          </div>
        )}

        <div className="mb-6 text-center text-lg font-semibold">
          🔥 Racha actual: {streak} día{streak !== 1 && "s"}
        </div>

        {mounted && (
          <>
            <div className="mb-8">
              <h3 className="font-semibold mb-2">📅 Últimos 7 días (reales)</h3>
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

        <div className="mb-8 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-md border border-slate-300 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💪 {dayName}{dayPlan ? ` — ${dayPlan.titulo}` : ""}
          </h2>

          {ejercicios.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No hay ejercicios programados para esta fecha.
            </p>
          ) : (
            ejercicios.map((ex) => {
              const lastNote = mounted ? getLastNoteBefore(ex.name, selectedDate) : null;
              return (
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

                  {/* Recordatorio de la última nota registrada */}
                  {lastNote && (
                    <div className="mt-2 ml-8 text-xs text-slate-500 dark:text-slate-400 italic">
                      Última vez ({lastNote.date}): {lastNote.text}
                    </div>
                  )}

                  {/* Cajón de nota para el día seleccionado */}
                  <input
                    type="text"
                    placeholder="Nota (peso, sensación, dolor...)"
                    value={notes?.[ex.name] || ""}
                    onChange={(e) => handleNoteChange(ex.name, e.target.value)}
                    className="mt-2 ml-8 w-[calc(100%-2rem)] px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={() => {
            if (confirm("¿Borrar toda la data guardada y empezar desde cero?")) {
              localStorage.clear();
              setChecks({});
              setNotes({});
              setStreak(0);
              setSelectedDate(today);
            }
          }}
          className="w-full mt-4 p-2 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 font-semibold text-sm"
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