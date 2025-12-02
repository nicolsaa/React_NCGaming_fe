import type { User } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    role: string;
}

export const authService = {
    // Login
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        // Intento 1: enviar payload con 'email'
        let response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });

        // Si falla, intentar con 'username' en lugar de 'email'
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: credentials.email, password: credentials.password }),
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error en el inicio de sesión');
        }

        const authData: AuthResponse = await response.json();

        // Guardar token en localStorage
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({
            id: authData.id.toString(),
            username: authData.username,
            email: authData.email,
            role: authData.role,
            name: authData.username // Usamos username como name por defecto
        }));

        return authData;
    },

    // Logout
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
    },

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    // Obtener token
    getToken(): string | null {
        return localStorage.getItem('token');
    },

    // Obtener usuario actual
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    // Verificar si el token es válido (podrías agregar verificación de expiración)
    isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Aquí podrías verificar la expiración del token JWT
        // Por ahora solo verificamos que exista
        return true;
    }
};
