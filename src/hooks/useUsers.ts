import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { userService } from '@/services/userService';

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (userData: any) => Promise<User>;
    updateUser: (id: string, userData: Partial<User>) => Promise<User>;
    deleteUser: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const usersData = await userService.getAllUsers();
            setUsers(usersData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: any): Promise<User> => {
        try {
            setError(null);
            const newUser = await userService.createUser(userData);
            await fetchUsers(); // Recargar la lista
            return newUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
            setError(errorMessage);
            throw err;
        }
    };

    const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
        try {
            setError(null);
            const updatedUser = await userService.updateUser(id, userData);
            await fetchUsers(); // Recargar la lista para asegurar datos actualizados
            return updatedUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
            setError(errorMessage);
            throw err;
        }
    };

    const deleteUser = async (id: string): Promise<void> => {
        try {
            setError(null);
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
            setError(errorMessage);
            throw err;
        }
    };

    const refetch = fetchUsers;

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        refetch,
    };
};