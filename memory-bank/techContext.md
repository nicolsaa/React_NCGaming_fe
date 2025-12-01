# Geek_Shop Memory Bank — Tech Context

Tecnologías utilizadas
- Frontend: React + TypeScript, SPA basada en Vite.
- Gestión de estado: React Context con hooks personalizados.
- Red y API: cliente API envoltorio (src/utils/api.ts) que usa fetch con manejo de errores centralizado.
- Tipado: TypeScript con definiciones en src/types/ (interfaces y tipos de negocio).
- Construcción y herramientas: ESLint, Prettier, configuración de TypeScript, configuraciones de tsconfig.* para proyectos TS.

Entorno de desarrollo y configuración
- Entorno recomendado: Node.js LTS y npm/yarn.
- Comandos típicos del proyecto:
  - npm install
  - npm run dev (o npm run start) para desarrollo local
  - npm run build para producción
  - npm run lint / npm run format para mantenimiento de código
- Estructura de configuración:
  - vite.config.ts, tsconfig.*.json, eslint.config.js, prettier.config.js presentes en raíz.
  - memory-bank para documentación independiente.

Restricciones técnicas
- Compatibilidad: código TypeScript con configuración de config de TS y JSX/TSX.
- Rendimiento: evitar renders innecesarios y memoización cuando corresponda.
- Accesibilidad: componentes deben soportar keyboard navigation y ARIA cuando aplica.

Dependencias y librerías
- React, React-DOM, TypeScript.
- Vite (bundle y dev server).
- ESLint, Prettier.
- Cualquier librería adicional se debe documentar en memory-bank/techContext.md al introducirla.

Patrones de uso y prácticas
- Uso de Context para estado global (carrito, usuario, productos) con tokens de tipo y useX hooks.
- Organización de código: carpetas src/, components/, context/, hooks/, services/, pages/, utils/.
- Enfoque de pruebas: aún no se han definido; planificar testing en futuras actualizaciones del Memory Bank.

Notas sobre la integración
- Mantener sincronía entre memory-bank y código fuente para evitar drift.
- Documentar decisiones técnicas y cambios clave para onboarding.
