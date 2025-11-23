import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Headphones,
    Smartphone,
    Laptop,
    Watch,
    Zap,
    Gift
} from 'lucide-react';

const Accessories: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();
    const accessories = getProductsByCategory('accesorios');

    const accessoryTypes = [
        {
            name: 'Audio',
            icon: Headphones,
            description: 'Audífonos, altavoces y más',
            count: accessories.filter(p => p.name.toLowerCase().includes('audífono') || p.name.toLowerCase().includes('audio')).length
        },
        {
            name: 'Móviles',
            icon: Smartphone,
            description: 'Fundas, protectores y accesorios',
            count: accessories.filter(p => p.name.toLowerCase().includes('móvil') || p.name.toLowerCase().includes('phone')).length
        },
        {
            name: 'PC & Laptop',
            icon: Laptop,
            description: 'Teclados, mouse y accesorios',
            count: accessories.filter(p => p.name.toLowerCase().includes('teclado') || p.name.toLowerCase().includes('mouse')).length
        },
        {
            name: 'Wearables',
            icon: Watch,
            description: 'Relojes y pulseras inteligentes',
            count: accessories.filter(p => p.name.toLowerCase().includes('reloj') || p.name.toLowerCase().includes('pulsera')).length
        },
    ];

    const popularAccessories = accessories
        .filter(acc => acc.featured)
        .slice(0, 4);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Badge variant="outline" className="mb-4 text-sm">
                    Accesorios Geek
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Accesorios y Complementos</h1>
                <p className="text-gray-600 max-w-2xl">
                    Completa tu setup gaming y estilo de vida geek con nuestros accesorios.
                    Desde tecnología hasta artículos de colección.
                </p>
            </div>

            {/* Categorías de accesorios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {accessoryTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                        <Card key={type.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <IconComponent className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="font-semibold mb-1">{type.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                                <Badge variant="secondary">{type.count} productos</Badge>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Accesorios populares */}
            {popularAccessories.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <h2 className="text-2xl font-semibold">Accesorios Populares</h2>
                    </div>
                    <ProductGrid products={popularAccessories} loading={false} />
                </div>
            )}

            {/* Todos los accesorios */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Todos los Accesorios</h2>
                    </div>
                    <Badge variant="secondary">
                        {accessories.length} productos
                    </Badge>
                </div>
                <ProductGrid products={accessories} loading={loading} />
            </div>

            {/* Banner de regalo */}
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <CardContent className="p-8 text-center">
                    <Gift className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">¡Perfectos para Regalar!</h3>
                    <p className="opacity-90 mb-4">
                        Nuestros accesorios son el regalo ideal para cualquier ocasión.
                        Envío gratis en compras mayores a $50.
                    </p>
                    <Badge variant="secondary" className="bg-white text-purple-600">
                        Envío Gratis Disponible
                    </Badge>
                </CardContent>
            </Card>
        </div>
    );
};

export default Accessories;