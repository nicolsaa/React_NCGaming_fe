import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    User,
    Mail,
    Crown,
    LogOut,
    Shield,
    Calendar
} from 'lucide-react';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Si no hay usuario logeado, redirigir al login
    if (!user) {
        navigate('/login');
        return null;
    }

    const getRoleBadge = () => {
        if (user.role === 'ADMIN') {
            return (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrador
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <User className="h-3 w-3 mr-1" />
                Cliente
            </Badge>
        );
    };

    const getRoleIcon = () => {
        return user.role === 'ADMIN' ?
            <Shield className="h-4 w-4 text-red-500" /> :
            <User className="h-4 w-4 text-purple-500" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <Card className="shadow-2xl border-0">
                        <CardHeader className="text-center pb-4">
                            {/* Avatar */}
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
                                    <User className="h-8 w-8" />
                                </div>
                            </div>

                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </CardTitle>

                            <p className="text-gray-600 text-sm mt-1">
                                {user.email}
                            </p>

                            <div className="mt-3">
                                {getRoleBadge()}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Información del usuario */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-purple-500" />
                                    Información Personal
                                </h3>

                                <div className="space-y-3">
                                    {/* Nombre */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            Nombre:
                                        </span>
                                        <span className="text-gray-900 font-semibold">
                                            {user.name}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            Correo:
                                        </span>
                                        <span className="text-gray-900 font-semibold">
                                            {user.email}
                                        </span>
                                    </div>

                                    {/* Rol */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            {getRoleIcon()}
                                            <span className="ml-2">Tipo de usuario:</span>
                                        </span>
                                        <span className="text-gray-900 font-semibold">
                                            {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                                        </span>
                                    </div>

                                    {/* Miembro desde (mock) */}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            Miembro desde:
                                        </span>
                                        <span className="text-gray-900 font-semibold">
                                            {new Date().toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Estadísticas rápidas (mock) */}
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-purple-50 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-purple-600">5</div>
                                    <div className="text-xs text-purple-700">Pedidos</div>
                                </div>
                                <div className="bg-pink-50 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-pink-600">12</div>
                                    <div className="text-xs text-pink-700">Favoritos</div>
                                </div>
                            </div>

                            {/* Botón de cerrar sesión */}
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 py-3"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar Sesión
                            </Button>

                            {/* Enlaces rápidos */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    ¿Necesitas ayuda?{' '}
                                    <button
                                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                        onClick={() => navigate('/contact')}
                                    >
                                        Contáctanos
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarjetas adicionales para admin */}
                    {user.role === 'ADMIN' && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 bg-gradient-to-r from-red-50 to-orange-50">
                                <CardContent className="p-4 text-center">
                                    <Shield className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                    <p className="text-sm font-semibold text-gray-900">Panel Admin</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer hover:shadow-lg transition-shadow border-0 bg-gradient-to-r from-blue-50 to-cyan-50"
                                onClick={() => navigate('/admin-usuarios')}
                            >
                                <CardContent className="p-4 text-center">
                                    <User className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                    <p className="text-sm font-semibold text-gray-900">Gestión Usuarios</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;