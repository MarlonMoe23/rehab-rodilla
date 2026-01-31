"use client";
import { useEffect, useState } from "react";

const exercises = {
  mañana: [
    "Extensión pasiva (talón elevado)",
    "Contracción de cuádriceps",
    "Elevación de pierna recta",
  ],
  tarde: [
    "Deslizamientos de talón",
    "Bomba de tobillo",
  ],
  noche: [
    "Extensión pasiva (talón elevado)",
    "Contracción de cuádriceps",
    "Elevación de pierna recta",
  ],
};

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const [checks, setChecks] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(today);
    if (saved) setChecks(JSON.parse(saved));
  }, [today]);

  useEffect(() => {
    localStorage.setItem(today, JSON.stringify(checks));
  }, [checks, today]);

  const toggleCheck = (period, exercise) => {
    setChecks((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [exercise]: !prev?.[period]?.[exercise],
      },
    }));
  };

  const getIcon = (period) => {
    if (period === "mañana") return "🌅";
    if (period === "tarde") return "☀️";
    return "🌙";
  };

  return (
    <main className="min-h-screen bg-slate-200 p-6 text-slate-900">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          🦵 Rehabilitación de Rodilla
        </h1>
        <p className="text-center mb-8 text-slate-700 font-medium">
          Fecha: {today}
        </p>

        {Object.entries(exercises).map(([period, list]) => (
          <div
            key={period}
            className="mb-8 bg-white p-5 rounded-2xl shadow-md border border-slate-300"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 capitalize text-slate-800">
              {getIcon(period)} {period}
            </h2>

            {list.map((ex) => (
              <label
                key={ex}
                className="flex items-center mb-3 gap-3 text-slate-800 font-medium"
              >
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
