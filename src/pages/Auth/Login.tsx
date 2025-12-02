import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Mail,
    Lock,
    LogIn,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';

const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login: loginFromContext } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Navegación controlada en useEffect para evitar navegaciones durante render
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate('/'), 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            setError('El correo electrónico es requerido');
            return false;
        }

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

        try {
            setLoading(true);
            await loginFromContext({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe });
            setLoading(false);

            setSuccess(true);

            // La navegación se maneja en useEffect al detectar 'success'
        } catch (err) {
            setLoading(false);
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(errorMessage);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-gray-50">
            <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-purple-600">
                        Iniciar Sesión
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                        Bienvenido de vuelta a N&CGAMING
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">

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
                                    placeholder="usuario@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    required
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-9 w-9"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
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
                                disabled={loading}
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
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
