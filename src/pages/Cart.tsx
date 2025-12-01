import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    Check,
    ShoppingBag
} from 'lucide-react';

const Cart: React.FC = () => {
    const { user } = useAuth();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    } = useCart();
    const navigate = useNavigate();

    // Verificar autenticación
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleClearCart = () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            clearCart();
        }
    };

    const handleCheckout = () => {
        // Aquí iría la lógica para procesar la compra
        // Por ahora solo redirigimos a una página de confirmación
        navigate('/checkout');
    };

    if (!user) {
        return null; // Redirige a login
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
                        <CardContent className="text-center py-16">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Tu carrito está vacío
                            </h2>

                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Descubre nuestros productos y encuentra algo especial para ti
                            </p>

                            <Link to="/">
                                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Seguir Comprando
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Carrito de Compras
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleClearCart}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Vaciar Carrito
                        </Button>
                    </CardHeader>
                </Card>

                {/* Tabla de productos */}
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2">Producto</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="text-center">Cantidad</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.product.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/images/Logo-sin-Fondo.png';
                                                    }}
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {item.product.name}
                                                    </h3>
                                                    <Badge variant="outline" className="mt-1">
                                                        {item.product.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-semibold text-gray-900">
                                                ${item.product.price.toLocaleString('es-CL')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                    className="h-8 w-8"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="font-semibold w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                    className="h-8 w-8"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-bold text-purple-600">
                                                ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Resumen y acciones */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Botones de acción */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-2xl">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/" className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Seguir Comprando
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={handleCheckout}
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Confirmar Compra
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen del total */}
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardHeader>
                            <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Productos ({totalItems})</span>
                                <span className="font-semibold">
                                    ${totalPrice.toLocaleString('es-CL')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Envío</span>
                                <span className="font-semibold text-green-600">
                                    {totalPrice > 50000 ? 'Gratis' : '$5.000'}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-purple-600">
                                    ${totalPrice.toLocaleString('es-CL')}
                                </span>
                            </div>

                            {totalPrice < 50000 && (
                                <div className="text-sm text-center text-gray-600 bg-white p-2 rounded-lg border">
                                    ¡Faltan ${(50000 - totalPrice).toLocaleString('es-CL')} para envío gratis!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Información adicional */}
                <Card className="mt-6 border-0 shadow-2xl">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <Check className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="font-semibold mb-1">Compra Segura</h4>
                                <p className="text-sm text-gray-600">Pago 100% protegido</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="font-semibold mb-1">Envío Rápido</h4>
                                <p className="text-sm text-gray-600">Recibe en 2-4 días</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                    <Check className="h-6 w-6 text-purple-600" />
                                </div>
                                <h4 className="font-semibold mb-1">Garantía</h4>
                                <p className="text-sm text-gray-600">30 días para devolver</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Cart;