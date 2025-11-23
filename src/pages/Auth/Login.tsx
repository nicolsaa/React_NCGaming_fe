import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import {
    Mail,
    Lock,
    LogIn,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            setError('El correo electrónico es requerido');
            return false;
        }

        // Validación simple de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un correo electrónico válido');
            return false;
        }

        if (!formData.password) {
            setError('La contraseña es requerida');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simular proceso de login - en producción conectarías con tu API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verificar credenciales mock - en una app real esto vendría del backend
            const mockUsers = [
                { email: 'admin@duoc.cl', password: 'admin123', name: 'Administrador', role: 'ADMIN' },
                { email: 'usuario@duoc.cl', password: 'user123', name: 'Usuario Demo', role: 'USER' },
            ];

            const user = mockUsers.find(
                u => u.email === formData.email && u.password === formData.password
            );

            if (!user) {
                setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
                return;
            }

            // Crear objeto usuario
            const userData = {
                id: Math.random().toString(36).substr(2, 9),
                email: user.email,
                name: user.name,
                role: user.role as 'USER' | 'ADMIN'
            };

            // Loguear al usuario
            login(userData);

            // Guardar preferencia "recordarme" si está marcada
            if (formData.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            setSuccess(true);

            // Redirigir después de mostrar el mensaje de éxito
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            setError('Error al iniciar sesión. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (role: 'USER' | 'ADMIN') => {
        const demoUsers = {
            USER: { email: 'usuario@duoc.cl', password: 'user123' },
            ADMIN: { email: 'admin@duoc.cl', password: 'admin123' }
        };

        setFormData(prev => ({
            ...prev,
            ...demoUsers[role]
        }));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url(/assets/images/login.jpg)'
            }}
        >
            <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-purple-600">
                        Iniciar Sesión
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                        Bienvenido de vuelta a N&CGAMING
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Botones de demo rápido */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDemoLogin('USER')}
                            className="text-xs"
                        >
                            Demo Usuario
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDemoLogin('ADMIN')}
                            className="text-xs"
                        >
                            Demo Admin
                        </Button>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="usuario@duoc.cl"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Tu contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-9 w-9"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Recordarme */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) =>
                                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                                }
                            />
                            <Label
                                htmlFor="rememberMe"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Recordar mi sesión
                            </Label>
                        </div>

                        {/* Mensajes de error/éxito */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    ¡Inicio de sesión exitoso! Redirigiendo...
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Botón de login */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            disabled={isLoading || success}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Iniciar Sesión
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">O</span>
                        </div>
                    </div>

                    {/* Redes sociales (opcional) */}
                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" className="w-full" type="button">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                            Twitter
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z" />
                            </svg>
                            Pinterest
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.015 2c-5.519 0-9.985 4.481-9.985 9.985 0 4.419 2.865 8.162 6.821 9.485.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.223 1.65-.334 2.5-.335.85.001 1.7.112 2.5.335 1.91-1.296 2.75-1.026 2.75-1.026.544 1.378.201 2.397.099 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.335-.012 2.415-.012 2.743 0 .267.18.578.688.482 3.955-1.324 6.82-5.066 6.82-9.485 0-5.504-4.466-9.985-9.985-9.985z" />
                            </svg>
                            GitHub
                        </Button>
                    </div>

                    {/* Enlace a registro */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;