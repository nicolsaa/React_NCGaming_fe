import type { User } from '@/types/index';

const API_BASE_URL = 'http://localhost:8080/api';

// Interface para crear usuario (sin ID)
interface CreateUserData {
    fullUsername: string;
    email: string;
    password: string;
    role?: string;
}

export const userService = {
    // Obtener todos los usuarios (solo admin)
    async getAllUsers(): Promise<User[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('No autorizado');
            }
            throw new Error('Error al obtener usuarios');
        }

        return response.json();
    },

    // Obtener usuario por ID
    async getUserById(id: string): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            }
            throw new Error('Error al obtener usuario');
        }

        return response.json();
    },

    // Crear usuario (registro) 
    async createUser(userData: CreateUserData): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...userData,
                role: userData.role || 'USER' // Valor por defecto
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear usuario');
        }

        return response.json();
    },

    // Actualizar usuario (requiere autenticación)
    async updateUser(id: string, userData: Partial<User>): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            }
            throw new Error('Error al actualizar usuario');
        }

        return response.json();
    },

    // Eliminar usuario (solo admin)
    async deleteUser(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            }
            throw new Error('Error al eliminar usuario');
        }
    },
};
