import React, { useState } from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GamepadIcon, Monitor, Smartphone, Cloud, Shield } from 'lucide-react';

const Games: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();
    const allGames = getProductsByCategory('videojuegos');

    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

    const platforms = [
        { id: 'all', name: 'Todas las Plataformas', icon: GamepadIcon },
        { id: 'nintendo', name: 'Nintendo Switch', icon: Monitor },
        { id: 'playstation', name: 'PlayStation', icon: Smartphone },
    ];

    const filteredGames = allGames.filter(game =>
        selectedPlatform === 'all' ||
        game.name.toLowerCase().includes(selectedPlatform)
    );

    const featuredGames = allGames.filter(game => game.featured).slice(0, 3);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Badge variant="outline" className="mb-4 text-sm">
                    Videojuegos
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Videojuegos</h1>
                <p className="text-gray-600 max-w-2xl">
                    Los mejores videojuegos para todas las plataformas.
                    Desde los últimos lanzamientos hasta clásicos atemporales.
                </p>
            </div>

            {/* Filtros por plataforma */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">Filtrar por Plataforma</h3>
                <div className="flex flex-wrap gap-3">
                    {platforms.map((platform) => {
                        const IconComponent = platform.icon;
                        return (
                            <Button
                                key={platform.id}
                                variant={selectedPlatform === platform.id ? "default" : "outline"}
                                className="flex items-center space-x-2"
                                onClick={() => setSelectedPlatform(platform.id)}
                            >
                                <IconComponent className="h-4 w-4" />
                                <span>{platform.name}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Grid de juegos */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Todos los Juegos</h2>
                    <Badge variant="secondary">
                        {filteredGames.length} juegos
                    </Badge>
                </div>
                <ProductGrid products={filteredGames} loading={loading} />
            </div>

            {/* Información de garantía */}
            <Card className="mt-12 bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">🛡️ Garantía en Videojuegos</h3>
                            <p className="text-sm text-gray-700">
                                Todos nuestros videojuegos incluyen garantía del fabricante.
                                Juegos originales y sellados. Soporte técnico disponible para
                                problemas de instalación o activación.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Games;