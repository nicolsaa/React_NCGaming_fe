# Banco de Memoria Geek_Shop — Contexto Activo

Enfoque de trabajo actual
- Alinear la documentación del memory bank con el trabajo frontend en curso (Carrito, Producto, Checkout) y los flujos de usuario.
- Capturar decisiones de diseño recientes sobre patrones de UI, gestión de estado y límites de componentes.

Cambios recientes
- Esqueleto de memory bank establecido con archivos núcleo: projectbrief.md y productContext.md.
- Primera alineación entre el contexto de producto y decisiones de arquitectura próximas.

Próximos pasos
- Documentar decisiones arquitectónicas actuales (enfoque de gestión de estado, flujo de datos y responsabilidades de componentes).
- Capturar notas de implementación y decisiones a medida que el proyecto evoluciona.
- Actualizar progress.md con estado, bloqueos y issues conocidos a medida que surgen.

Decisiones y consideraciones activas
- Gestión de estado: usar React Context para estado global (carrito, usuario, productos) complementado por hooks personalizados.
- Patrones UI: preferir separación contenedor/presentacional y componentes UI reutilizables.
- Accesibilidad: asegurar que los componentes sean accesibles (etiquetas ARIA, navegación por teclado).
- Rendimiento: memoización cuando corresponde y evitar re-renderizados innecesarios.

Patrones importantes y preferencias
- Memory Bank como referencia principal para historial de decisiones.
- Documentación exhaustiva de cambios para facilitar onboarding.
- Nombres consistentes y organización de archivos para reflejar límites de dominio.

Aprendizajes e insights del proyecto
- El banco de memoria debe reflejar decisiones y su razonamiento, no solo resultados.
- Actualizaciones regulares tras cambios significativos mejoran trazabilidad y continuidad.
