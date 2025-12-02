import type { User } from '@/types/index';

const API_BASE_URL = 'http://localhost:8080/api';

// Interface para crear usuario
interface CreateUserData {
    username: string;
    fullUsername?: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}

interface ApiUser {
    id: any;
    username?: string;
    fullUsername?: string;
    full_username?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
}
const mapApiUserToUser = (u: ApiUser): User => ({
    id: String(u.id ?? ''),
    username: (u.username ?? '') as string,
    fullUsername: (u.fullUsername ?? u.full_username ?? '') as string,
    email: (u.email ?? '') as string,
    role: ((u.role ?? 'USER') as 'USER' | 'ADMIN'),
    createdAt: (u.createdAt ?? u.created_at ?? '') as string,
    updatedAt: (u.updatedAt ?? u.updated_at ?? '') as string
});

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

        const apiUsers: any[] = await response.json();
        const users: User[] = apiUsers.map(mapApiUserToUser);
        return users;
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

        const apiUser = await response.json();
        return mapApiUserToUser(apiUser);
    },

    // Crear usuario (registro) 
    async createUser(userData: CreateUserData): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                fullUsername: userData.fullUsername || userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'USER'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear usuario');
        }

        const newUserRaw = await response.json();
        return mapApiUserToUser(newUserRaw);
    },

    // Actualizar usuario (requiere autenticación)
    async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'password'>>): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                full_username: userData.fullUsername,
                email: userData.email,
                role: userData.role
            }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            }
            throw new Error('Error al actualizar usuario');
        }

        const updatedUserRaw = await response.json();
        return mapApiUserToUser(updatedUserRaw);
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

    // Método para asignar rol
    async assignRole(userId: string | number, role: 'USER' | 'ADMIN'): Promise<User> {
        const token = localStorage.getItem('token');
        const userIdStr = userId.toString();

        const response = await fetch(`${API_BASE_URL}/users/${userIdStr}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ role }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Rol inválido. Use USER o ADMIN');
            }
            if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            }
            if (response.status === 401) {
                throw new Error('No autorizado');
            }

            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || 'Error desconocido'}`);
        }

        const updatedUserRaw = await response.json();
        return mapApiUserToUser(updatedUserRaw);
    },

    // Método para obtener usuarios por rol
    async getUsersByRole(role: 'USER' | 'ADMIN'): Promise<User[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const apiUsers = await response.json();
        const users = apiUsers.map(mapApiUserToUser);
        return users.filter((u: User) => u.role === role);
    },

    // Método para buscar usuarios
    async searchUsers(query: string): Promise<User[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al buscar usuarios');
        }

        const apiUsers2 = await response.json();
        const users2 = apiUsers2.map(mapApiUserToUser);
        const lowerQuery = query.toLowerCase();
        return users2.filter((u: User) =>
            u.username.toLowerCase().includes(lowerQuery) ||
            (u.fullUsername ?? '').toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );
    }
};
