// src/components/admin/RoleManager.tsx
import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import type { User } from '@/types/index';

const RoleManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN'>('USER');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedUserId) {
            setMessage('Por favor selecciona un usuario');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await userService.assignRole(selectedUserId, selectedRole);

            setMessage(`✅ ${updatedUser.fullUsername || updatedUser.username} ahora es ${updatedUser.role}`);

            // Refrescar la lista desde la API para asegurar consistencia
            try {
                const refreshedUsers = await userService.getAllUsers();
                setUsers(refreshedUsers);
            } catch (refreshError) {
                // opcional: mantener la UI estable si falla
            }

            // Resetear selección
            setSelectedUserId('');
            setSelectedRole('USER');

        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios por rol
    const filteredUsers = filterRole === 'ALL'
        ? users
        : users.filter(user => user.role === filterRole);

    if (isLoadingUsers) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Roles de Usuarios</h2>
                <p className="text-gray-600 mb-6">Asigna roles USER o ADMIN a los usuarios del sistema</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo: Asignar rol */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Asignar Nuevo Rol</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Seleccionar Usuario
                                    </label>
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    >
                                        <option value="">-- Selecciona un usuario --</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.fullUsername || user.username} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nuevo Rol
                                    </label>
                                    <div className="flex flex-col space-y-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="USER"
                                                checked={selectedRole === 'USER'}
                                                onChange={() => setSelectedRole('USER')}
                                                className="h-4 w-4 text-blue-600"
                                                disabled={loading}
                                            />
                                            <span className="ml-2 text-gray-700">👤 Usuario Normal (USER)</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="ADMIN"
                                                checked={selectedRole === 'ADMIN'}
                                                onChange={() => setSelectedRole('ADMIN')}
                                                className="h-4 w-4 text-blue-600"
                                                disabled={loading}
                                            />
                                            <span className="ml-2 text-gray-700">⚙️ Administrador (ADMIN)</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAssignRole}
                                    disabled={!selectedUserId || loading}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${!selectedUserId || loading
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Procesando...
                                        </span>
                                    ) : 'Asignar Rol'}
                                </button>
                            </div>

                            {message && (
                                <div className={`mt-4 p-3 rounded-lg ${message.includes('✅')
                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel derecho: Lista de usuarios */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        Lista de Usuarios ({filteredUsers.length})
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilterRole('ALL')}
                                            className={`px-3 py-1 text-sm rounded-full ${filterRole === 'ALL'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => setFilterRole('USER')}
                                            className={`px-3 py-1 text-sm rounded-full ${filterRole === 'USER'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            USER
                                        </button>
                                        <button
                                            onClick={() => setFilterRole('ADMIN')}
                                            className={`px-3 py-1 text-sm rounded-full ${filterRole === 'ADMIN'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            ADMIN
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Creado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map(user => (
                                            <tr
                                                key={user.id}
                                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${user.id === selectedUserId ? 'bg-blue-50' : ''
                                                    }`}
                                                onClick={() => setSelectedUserId(user.id)}
                                            >
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {user.fullUsername || user.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                @{user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="text-gray-700">{user.email}</div>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManager;
