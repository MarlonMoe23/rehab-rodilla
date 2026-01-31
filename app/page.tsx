import ExerciseCard from "./components/ExerciseCard"

export default function Home() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Rehabilitación de Rodilla
      </h1>

      <ExerciseCard
        name="Extensión pasiva con talón elevado"
        prep={10}
        work={300} // 5 minutos
        rest={0}
        rounds={1}
        tabatas={1}
        restBetweenTabatas={0}
      />

      <ExerciseCard
        name="Contracción de cuádriceps"
        prep={5}
        work={10}
        rest={10}
        rounds={15}
        tabatas={1}
        restBetweenTabatas={0}
      />

      <ExerciseCard
        name="Elevación de pierna recta"
        prep={5}
        work={5}
        rest={10}
        rounds={15}
        tabatas={1}
        restBetweenTabatas={0}
      />

      <ExerciseCard
        name="Deslizamientos de talón"
        prep={5}
        work={10}
        rest={10}
        rounds={15}
        tabatas={1}
        restBetweenTabatas={0}
      />

      <ExerciseCard
        name="Bomba de tobillo"
        prep={5}
        work={60}
        rest={0}
        rounds={1}
        tabatas={1}
        restBetweenTabatas={0}
      />
    </main>
  )
}
