# Aprende Guitarra Acústica

App web para aprender guitarra acústica: acordes básicos y complejos con su diagrama y sonido, favoritos, ejercicio diario y tests por nivel. En el escritorio se muestra dentro de un iPhone; en el celular ocupa toda la pantalla.

Hecha con React y Vite.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Estructura

| Archivo | Contenido |
|---|---|
| `src/App.jsx` | Navegación (pila de pantallas), modo oscuro, racha y mejores puntajes |
| `src/common.jsx` | Tema, íconos, favoritos, barra superior y buscador |
| `src/data/chords.js` | Base de acordes y sonido (Web Audio) |
| `src/components/ChordDiagram.jsx` | Diagrama SVG de un acorde |
| `src/components/IOSFrame.jsx` | Marco de iPhone para la vista de escritorio |
| `src/screens/Screens.jsx` | Inicio, menú, lista y detalle de acordes |
| `src/screens/Extra.jsx` | Cómo tocar, ejercicio diario, elección de nivel y modo del test |
| `src/screens/TestRunner.jsx` | Preguntas del test y resultados |

Las fuentes (Manrope e Instrument Serif) están incluidas en `src/assets/fonts`.

## Despliegue en Cloudflare Pages

- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Versión de Node: la indica `.node-version` (22)
