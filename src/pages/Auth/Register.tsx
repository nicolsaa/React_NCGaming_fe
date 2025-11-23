import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Lock,
    UserPlus,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: searchParams.get('email') || '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0;

        if (password.length > 7) strength += 20;
        if (password.match(/[a-z]/)) strength += 20;
        if (password.match(/[A-Z]/)) strength += 20;
        if (password.match(/[0-9]/)) strength += 20;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 20;

        return strength;
    };

    const getPasswordStrengthColor = (strength: number): string => {
        if (strength < 40) return 'bg-red-500';
        if (strength < 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = (strength: number): string => {
        if (strength < 40) return 'Débil';
        if (strength < 80) return 'Media';
        return 'Fuerte';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear errors when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('El nombre completo es requerido');
            return false;
        }

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

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        if (passwordStrength < 40) {
            setError('La contraseña es demasiado débil');
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
            // Simular registro exitoso - en producción conectarías con tu API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Crear usuario mock
            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                email: formData.email,
                name: formData.name,
                role: 'USER' as const
            };

            // Loguear al usuario automáticamente después del registro
            login(newUser);

            setSuccess(true);

            // Redirigir después de mostrar el mensaje de éxito
            setTimeout(() => {
                navigate('/perfil');
            }, 2000);

        } catch (err) {
            setError('Error al crear la cuenta. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
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
                        Crear Cuenta
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                        Únete a nuestra comunidad geek
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nombre completo
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

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
                            <Label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Crea una contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10"
                                    minLength={6}
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

                            {/* Indicador de fortaleza de contraseña */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <Progress
                                        value={passwordStrength}
                                        className={`h-2 ${getPasswordStrengthColor(passwordStrength)}`}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Fortaleza:</span>
                                        <span className={getPasswordStrengthColor(passwordStrength).replace('bg-', 'text-')}>
                                            {getPasswordStrengthText(passwordStrength)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirmar contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirma tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10"
                                    minLength={6}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-9 w-9"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Mensajes de error/éxito */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    ¡Registro exitoso! Redirigiendo...
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Botón de registro */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            disabled={isLoading || success}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Crear Cuenta
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Enlace a login */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;