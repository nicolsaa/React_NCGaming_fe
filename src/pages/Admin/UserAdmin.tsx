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
    Plus,
    Edit,
    Trash2,
    Search,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    RefreshCw
} from 'lucide-react';
import type { User } from '@/types/index';

const UserAdmin: React.FC = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { users, loading, error, deleteUser, refetch } = useUsers();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Verificar permisos de administrador
    React.useEffect(() => {
        if (currentUser && currentUser.role !== 'ADMIN') {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Helper para obtener nombre a partir de firstName/lastName o username
    const getDisplayName = (u: User) => {
        if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`;
        if (u.username) return u.username;
        return '';
    };

    // Filtrar usuarios
    const filteredUsers = users.filter((user) =>
        getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Administración de Usuarios
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                {users.length} usuarios registrados en la plataforma
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
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Usuario
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Búsqueda y Filtros */}
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

                {/* Tabla de usuarios */}
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
                                                    {user.firstName && user.lastName && (
                                                        <div className="text-xs text-gray-400">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    )}
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
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {/* Implementar edición */ }}
                                                        disabled={user.id === currentUser.id}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={user.id === currentUser.id || actionLoading}
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

                {/* Dialog de confirmación para eliminar */}
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
