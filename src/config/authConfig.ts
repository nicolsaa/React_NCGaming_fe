// Centralized authentication configuration
export interface AdminConfig {
    enabled: boolean;
    email?: string;
    password?: string;
}

export interface AuthConfig {
    useRealAuth: boolean;
    adminSimulation: AdminConfig;
    backendLoginEndpoint: string;
}

// Configuración por defecto y entorno:
// - useRealAuth: activa la autenticación real con backend para usuarios normales
// - adminSimulation: credenciales para iniciar sesión como admin de forma simulada (útil para pruebas)
//   - VITE_ADMIN_SIM_ENABLED puede activar/desactivar la simulación (true/false)
export const authConfig: AuthConfig = {
    useRealAuth: true,
    adminSimulation: {
        enabled: (typeof import.meta.env?.VITE_ADMIN_SIM_ENABLED === 'string')
            ? import.meta.env.VITE_ADMIN_SIM_ENABLED === 'true'
            : true,
        email: import.meta.env?.VITE_ADMIN_EMAIL ?? 'admin@duoc.cl',
        password: import.meta.env?.VITE_ADMIN_PASSWORD ?? 'admin123'
    },
    backendLoginEndpoint: import.meta.env?.VITE_BACKEND_LOGIN_ENDPOINT ?? '/api/login'
};
