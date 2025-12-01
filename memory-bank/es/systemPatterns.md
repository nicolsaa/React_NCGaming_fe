# Banco de Memoria Geek_Shop — Patrones del Sistema

Visión general de la arquitectura
- Frontend: React + TypeScript, SPA basada en Vite
- Capas: Capa UI (componentes presentacionales), Capa de Aplicación (gestión de estado, enrutamiento), Capa de Datos (API/servicios)
- Módulos clave: componentes, páginas, contexto, hooks, servicios
- Despliegue/compilación: recursos estáticos estándar, bundle de producción optimizado

Patrones de diseño en uso
- Contenedor / Presentacional: contenedores gestionan datos/comportamiento; los componentes presentacionales renderizan la UI
- Hooks personalizados: lógica específica del dominio encapsulada en hooks (p. ej., useCart, useProducts)
- Gestión de estado basada en Context: React Context para estado global (carrito, usuario, productos) con proveedores dedicados
- Composición de componentes: componentes UI reutilizables con contratos de props claros
- Adaptador/Fachada para API: un único cliente API abstrae detalles de fetch/axios y manejo de errores
- Separación de preocupaciones: límites claros entre UI, estado y acceso a datos

Relaciones y responsabilidades de los componentes
- Las páginas orquestan la UI componiendo componentes reutilizables (ProductGrid, ProductCard, ProductDetail, CartItem, Navbar, etc.)
- ProductGrid -> ProductCard (pantalla) -> ProductDetail (vista detallada)
- CartContext proporciona el estado del carrito a todas las páginas; los componentes se suscriben a través de hooks
- AuthContext gestiona la sesión de usuario y el control de acceso
- Los componentes UI son sin estado o mínimamente estatales, con comportamiento impulsado por context y props

Rutas de implementación críticas
- Ruta de obtención de datos: cliente API -> hooks de datos personalizados (p. ej., useProducts, useCart) -> UI componentes
- Propagación de estado: acciones enviadas en componentes actualizan Context; los componentes dependientes se vuelven a renderizar automáticamente
- Carga y manejo de errores: patrones consistentes en todas las obtenciones de datos con retroalimentación al usuario
- Accesibilidad: navegación por teclado, atributos ARIA, HTML semántico adecuado

Dependencias e notas de integración
- Alinear con techContext.md para restricciones del entorno de desarrollo
- Asegurar que la Documentación del Banco de Memoria se vincule con la estructura real del código para evitar drift
- Planificar estrategias de prueba y procedimientos de despliegue en futuras actualizaciones del Memory Bank
