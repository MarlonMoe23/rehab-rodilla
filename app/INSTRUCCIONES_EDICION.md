# 📝 Cómo editar tus ejercicios

## Archivo a editar: `ejercicios.json`

Este archivo contiene TODOS los ejercicios de tu rutina. Puedes editarlo con cualquier editor de texto (Notepad, VS Code, etc.)

---

## ✏️ Cambiar un ejercicio existente

Encuentra el ejercicio y modifica lo que necesites:

```json
{
  "name": "Extensión pasiva (talón elevado)",
  "tabata": "10m/0s/1/0",
  "note": "5-10 minutos continuos - ORO para extensión"
}
```

- **name**: Nombre del ejercicio
- **tabata**: Formato `Trabajo/Descanso/Rondas/Tabatas`
- **note**: Nota o instrucción (opcional)

---

## ➕ Agregar un nuevo ejercicio

Copia un ejercicio existente y pégalo DENTRO del periodo correspondiente (mañana/tarde/noche), separado con coma:

```json
"mañana": [
  {
    "name": "Ejercicio existente",
    "tabata": "10s/5s/15/1m",
    "note": "Nota"
  },
  {
    "name": "NUEVO EJERCICIO",
    "tabata": "5s/5s/20/1m",
    "note": "Nueva instrucción"
  }
]
```

⚠️ **IMPORTANTE**: No olvides la coma (`,`) entre ejercicios.

---

## ➖ Eliminar un ejercicio

Simplemente borra TODO el bloque del ejercicio:

```json
// ANTES (con 2 ejercicios)
"tarde": [
  {
    "name": "Deslizamientos de talón",
    "tabata": "3s/3s/15/1m",
    "note": "Flexión suave"
  },
  {
    "name": "Bomba de tobillo",
    "tabata": "2m/0s/1/0",
    "note": "bomba venosa"
  }
]

// DESPUÉS (eliminamos el segundo)
"tarde": [
  {
    "name": "Deslizamientos de talón",
    "tabata": "3s/3s/15/1m",
    "note": "Flexión suave"
  }
]
```

---

## 🕐 Agregar un nuevo periodo (ej: mediodía)

Agrega un nuevo bloque completo:

```json
{
  "mañana": [...],
  "mediodía": [
    {
      "name": "Ejercicio de mediodía",
      "tabata": "10s/5s/10/1m",
      "note": "Nota del ejercicio"
    }
  ],
  "tarde": [...],
  "noche": [...]
}
```

---

## ⚠️ Reglas importantes

1. **Siempre usa comillas dobles** (`"`) no simples (`'`)
2. **Las comas** separan elementos (pero NO después del último elemento de cada lista)
3. **Guarda el archivo** después de editarlo
4. **Recarga la app** en el navegador para ver los cambios

---

## 🔧 Validador JSON (si tienes errores)

Si la app no carga después de editar, copia TODO el contenido de `ejercicios.json` y pégalo en:

👉 https://jsonlint.com/

Te dirá dónde está el error (coma faltante, comilla mal cerrada, etc.)

---

## 📋 Ejemplo completo

```json
{
  "mañana": [
    {
      "name": "Ejercicio 1",
      "tabata": "10s/5s/15/1m",
      "note": "Instrucción opcional"
    },
    {
      "name": "Ejercicio 2",
      "tabata": "5s/3s/20/1m",
      "note": "Otra instrucción"
    }
  ],
  "tarde": [
    {
      "name": "Ejercicio tarde",
      "tabata": "15s/10s/10/1m",
      "note": "Nota"
    }
  ],
  "noche": [
    {
      "name": "Ejercicio noche",
      "tabata": "2m/0s/1/0",
      "note": "Ejercicio largo"
    }
  ]
}
```

---

¡Listo! Ahora puedes actualizar tus ejercicios sin tocar el código React. 🎉
