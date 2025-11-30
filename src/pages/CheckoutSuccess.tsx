import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle,
    Home,
    Package,
    Truck,
    Mail,
    Heart
} from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
    const { user } = useAuth();
    const { clearCart, totalPrice } = useCart();
    const navigate = useNavigate();

    const [orderNumber, setOrderNumber] = useState('');
    const [orderDetails, setOrderDetails] = useState({
        total: 0,
        estimatedDelivery: ''
    });

    // Generar número de pedido
    const generateOrderNumber = (): string => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const A = letters[Math.floor(Math.random() * 26)];
        const B = letters[Math.floor(Math.random() * 26)];
        const C = letters[Math.floor(Math.random() * 26)];
        const num = String(Math.floor(Math.random() * 900000) + 100000);
        return `${A}${B}${C}-${num}`;
    };

    // Calcular fecha de entrega estimada
    const getEstimatedDelivery = (): string => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 días hábiles

        return deliveryDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        // Verificar autenticación
        if (!user) {
            navigate('/login');
            return;
        }

        // Generar detalles del pedido
        setOrderNumber(generateOrderNumber());
        setOrderDetails({
            total: totalPrice,
            estimatedDelivery: getEstimatedDelivery()
        });

        // Limpiar carrito después de una compra exitosa
        clearCart();

        // Opcional: Aquí podrías enviar los datos del pedido a tu backend
        // sendOrderToBackend(orderData);

    }, [user, navigate, clearCart, totalPrice]);

    if (!user) {
        return null; // Redirige a login
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
            <div className="container mx-auto px-4">
                {/* Tarjeta principal de confirmación */}
                <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
                    <CardContent className="text-center p-8">
                        {/* Icono de éxito */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                        </div>

                        {/* Título y mensaje */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            ¡Gracias por tu compra!
                        </h1>

                        <div className="flex justify-center mb-4">
                            <Heart className="h-8 w-8 text-pink-500" />
                        </div>

                        <p className="text-lg text-gray-600 mb-8">
                            Tu pedido ha sido procesado correctamente y está siendo preparado.
                        </p>

                        {/* Detalles del pedido */}
                        <Card className="mb-8 border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Resumen del Pedido
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">N° de pedido</span>
                                    <Badge variant="secondary" className="font-mono">
                                        {orderNumber}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Total pagado</span>
                                    <span className="text-xl font-bold text-green-600">
                                        ${orderDetails.total.toLocaleString('es-CL')}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-start space-x-3 text-sm text-gray-600">
                                    <Truck className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <div className="text-left">
                                        <span className="font-semibold">Entrega estimada: </span>
                                        {orderDetails.estimatedDelivery}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <div className="text-left">
                                        <span className="font-semibold">Confirmación enviada a: </span>
                                        {user.email}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información de seguimiento */}
                        <Card className="mb-8 border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    📦 ¿Qué sigue?
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1 text-left">
                                    <li>• Recibirás un email de confirmación con los detalles</li>
                                    <li>• Te notificaremos cuando tu pedido sea enviado</li>
                                    <li>• Podrás rastrear tu pedido desde tu perfil</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/" className="flex-1 sm:flex-none">
                                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                    <Home className="h-4 w-4 mr-2" />
                                    Volver al Inicio
                                </Button>
                            </Link>

                            <Link to="/perfil" className="flex-1 sm:flex-none">
                                <Button variant="outline" className="w-full">
                                    <Package className="h-4 w-4 mr-2" />
                                    Ver Mis Pedidos
                                </Button>
                            </Link>
                        </div>

                        {/* Mensaje adicional */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                                💝 <strong>¡Gracias por confiar en N&CGaming!</strong> Tu apoyo significa mucho para nosotros.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Información de contacto */}
                <Card className="max-w-2xl mx-auto mt-6 border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            ¿Necesitas ayuda?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Estamos aquí para ayudarte con cualquier pregunta sobre tu pedido.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Contactar Soporte
                            </Button>
                            <Button variant="outline" size="sm">
                                📱 Llamarnos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutSuccess;