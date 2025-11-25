import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Gift } from 'lucide-react';

const Accessories: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();
    const accessories = getProductsByCategory('accesorios');

    // Accesorios destacados (featured = true)
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Accesorios y Complementos
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Completa tu setup gaming y estilo de vida geek con nuestros accesorios.
                    Desde tecnología hasta artículos de colección.
                </p>
            </div>

            {/* Todos los accesorios */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Todos los Accesorios</h2>
                    </div>

                    <Badge variant="secondary">{accessories.length} productos</Badge>
                </div>

                <ProductGrid products={accessories} loading={loading} />
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
