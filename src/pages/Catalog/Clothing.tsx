import React, { useState } from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Clothing: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();

    // Todos los productos de ropa
    const allClothing = getProductsByCategory('ropa');

    const [selectedSize, setSelectedSize] = useState<string>('all');

    // Tallas disponibles
    const sizes = ['all', 'S', 'M', 'L', 'XL'];

    // Filtrado funcional por talla
    /*const filteredClothing = allClothing.filter(product => {
        if (selectedSize === 'all') return true;
        return product.sizes?.includes(selectedSize);
    });
    */
    return (
        <div className="container mx-auto px-4 py-8">

            {/* Header */}
            <div className="mb-8">
                <Badge variant="outline" className="mb-4 text-sm">Moda Geek</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Ropa y Merchandising</h1>
                <p className="text-gray-600 max-w-2xl">
                    Expresa tu pasión por el anime y gaming con nuestra colección de ropa.
                    Camisetas, hoodies y accesorios con diseños exclusivos.
                </p>
            </div>

            {/* Filtro por talla */}
            <div className="mb-8 space-y-4">
                <h3 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Talla
                </h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <Button
                            key={size}
                            variant={selectedSize === size ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSize(size)}
                        >
                            {size === 'all' ? 'Todas' : size}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Contador de productos filtrados */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                    Mostrando {allClothing.length} de {allClothing.length} productos
                </p>
                <Badge variant="secondary" className="flex items-center">
                    <Star className="h-3 w-3 mr-1" /> Diseños Exclusivos
                </Badge>
            </div>

            {/* Grid de productos filtrados */}
            <ProductGrid products={allClothing} loading={loading} />

            {/* Guía de tallas */}
            <Card className="mt-12">
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-3">📏 Guía de Tallas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><strong>S</strong><p className="text-gray-600">Pequeña</p></div>
                        <div><strong>M</strong><p className="text-gray-600">Mediana</p></div>
                        <div><strong>L</strong><p className="text-gray-600">Grande</p></div>
                        <div><strong>XL</strong><p className="text-gray-600">Extra Grande</p></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};

export default Clothing;