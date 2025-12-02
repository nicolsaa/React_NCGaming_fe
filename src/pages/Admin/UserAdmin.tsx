import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Trash2,
    Search,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    RefreshCw
} from 'lucide-react';
import type { User } from '@/types/index';
import { userService } from '@/services/userService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roleLabel = (r: string) => (r === 'ADMIN' ? 'Administrador' : 'Usuario');

const UserAdmin: React.FC = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { users, loading, error, deleteUser, refetch } = useUsers();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Estado para cambios de rol (optimista)
    const [roleDraft, setRoleDraft] = useState<Record<string, 'USER' | 'ADMIN'>>({});
    const [roleLoading, setRoleLoading] = useState<Record<string, boolean>>({});

    // Verificar permisos de administrador
    React.useEffect(() => {
        if (currentUser && currentUser.role !== 'ADMIN') {
            navigate('/');
        }
    }, [currentUser, navigate]);

 // Helper para obtener nombre a partir de name o username
    const getDisplayName = (u: User) => {
        if (u.name) return u.name;
        if (u.fullUsername) return u.fullUsername;
        if (u.username) return u.username;
        return '';
    };

    // Filtrar usuarios
    const filteredUsers = (users ?? []).filter((user) =>
        getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                setActionLoading(true);
                await deleteUser(userToDelete.id);
                await refetch();
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleRefresh = async () => {
        try {
            setActionLoading(true);
            await refetch();
        } catch (error) {
            console.error('Error al actualizar:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'ADMIN') {
            return (
                <Badge className="bg-red-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrador
                </Badge>
            );
        }
        return (
            <Badge variant="secondary">
                <UserIcon className="h-3 w-3 mr-1" />
                Usuario
            </Badge>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleChangeRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
        if (userId === currentUser?.id) {
            // Evitar cambiar el rol del usuario logueado desde la administración
            console.warn('No se puede cambiar tu propio rol desde la administración.');
            return;
        }
        const currentRole = (users?.find((u) => u.id === userId)?.role ?? 'USER') as 'USER' | 'ADMIN';
        // If no actual change, no-op
        if (currentRole === newRole) return;

        // Optimistic update: mostrar el nuevo rol de inmediato
        setRoleDraft((draft) => ({ ...draft, [userId]: newRole }));
        setRoleLoading((loading) => ({ ...loading, [userId]: true }));

        try {
            await userService.assignRole(userId, newRole);
            // Refrescar para asegurar consistencia
            await refetch();
            // Limpiar draft tras confirmación
            setRoleDraft((draft) => {
                const next = { ...draft };
                delete next[userId];
                return next;
            });
        } catch (err) {
            // Revertir si falla
            setRoleDraft((draft) => {
                const next = { ...draft };
                delete next[userId];
                return next;
            });
            console.error('Error al cambiar rol', err);
        } finally {
            setRoleLoading((loading) => {
                const next = { ...loading };
                delete next[userId];
                return next;
            });
        }
    };

    const roleValueForUser = (u: User) => {
        return (roleDraft[u.id] ?? u.role ?? 'USER') as 'USER' | 'ADMIN';
    };

    // Mostrar solo a admins
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */ }
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Administración de Usuarios
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                {(users ?? []).length} usuarios registrados en la plataforma
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={actionLoading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                            {/* Botón "Nuevo Usuario" eliminado */}
                        </div>
                    </CardHeader>
                </Card>

                {/* Búsqueda y Filtros */ }
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nombre, email o username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                                {filteredUsers.length} de {users.length} usuarios
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de usuarios */ }
                <Card className="border-0 shadow-2xl">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                <p className="text-gray-600 mt-2">Cargando usuarios...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-600 bg-red-50 p-4 rounded-lg max-w-md mx-auto">
                                    <p className="font-semibold">Error al cargar usuarios</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    className="mt-4"
                                >
                                    Reintentar
                                </Button>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <UserIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los usuarios aparecerán aquí cuando se registren'}
                                </p>
                                <Button onClick={handleRefresh}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Actualizar
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Registro</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {getDisplayName(user)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                {getRoleBadge(roleValueForUser(user))}
                                                <div className="ml-2" style={{ minWidth: 180 }}>
                                                    <Select
                                                        value={roleValueForUser(user)}
                                                        onValueChange={(val) => handleChangeRole(user.id, val as 'USER' | 'ADMIN')}
                                                        disabled={!!(roleLoading[user.id])}
                                                    >
                                                        <SelectTrigger size="sm" className="w-full">
                                                            <SelectValue>{roleLabel(roleValueForUser(user))}</SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="USER">Usuario</SelectItem>
                                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {/* Botón Edit (modificar) eliminado para cumplir con el requerimiento */}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={user.id === currentUser.id || actionLoading}
                                                        aria-label={`Eliminar ${getDisplayName(user)}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog de confirmación para eliminar */ }
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que quieres eliminar al usuario{" "}
                                <strong>{userToDelete ? getDisplayName(userToDelete) : ''}</strong>?
                                <br />
                                <span className="text-red-600 font-semibold">
                                    Esta acción no se puede deshacer.
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={actionLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Eliminando...' : 'Eliminar Usuario'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default UserAdmin;
