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

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🦵 Rehabilitación de Rodilla
      </h1>
      <p className="text-center mb-8">Fecha: {today}</p>

      {Object.entries(exercises).map(([period, list]) => (
        <div key={period} className="mb-8 bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 capitalize">🌅 {period}</h2>
          {list.map((ex) => (
            <label key={ex} className="flex items-center mb-2 space-x-3">
              <input
                type="checkbox"
                checked={checks?.[period]?.[ex] || false}
                onChange={() => toggleCheck(period, ex)}
                className="w-5 h-5"
              />
              <span>{ex}</span>
            </label>
          ))}
        </div>
      ))}

      <p className="text-center mt-10 text-sm text-gray-600">
        “Constancia diaria = rodilla que vuelve a moverse”
      </p>
    </main>
  );
}
