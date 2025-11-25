import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { Bird, Zap, Flame, Bug, Droplet, Ghost, HandGrab, Snowflake, Sprout } from 'lucide-react';

const Cards: React.FC = () => {
  const { getProductsByCategory, loading } = useProducts();
  const cards: Product[] = getProductsByCategory('cartas');

  const cardTypes = [
    { name: 'Electrico', icon: Zap, count: cards.filter(p => p.name.toLowerCase().includes('Electrico')).length },
    { name: 'Fuego', icon: Flame, count: cards.filter(p => p.name.toLowerCase().includes('Fuego')).length },
    { name: 'Volador', icon: Bird, count: cards.filter(p => p.name.toLowerCase().includes('Volador')).length },
    { name: 'Bicho', icon: Bug, count: cards.filter(p => p.name.toLowerCase().includes('Bicho')).length },
    { name: 'Agua', icon: Droplet, count: cards.filter(p => p.name.toLowerCase().includes('Agua')).length },
    { name: 'Fantasma', icon: Ghost, count: cards.filter(p => p.name.toLowerCase().includes('Fantasma')).length },
    { name: 'Lucha', icon: HandGrab, count: cards.filter(p => p.name.toLowerCase().includes('Lucha')).length },
    { name: 'Hielo', icon: Snowflake, count: cards.filter(p => p.name.toLowerCase().includes('Hielo')).length },
    { name: 'Planta', icon: Sprout, count: cards.filter(p => p.name.toLowerCase().includes('Planta')).length },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="outline" className="mb-4 text-sm">
          Cartas Coleccionables
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cartas de Colección</h1>
        <p className="text-gray-600 max-w-2xl">
          Descubre cartas Pokémon. Encuentra sobres boosters, decks structure y cartas individuales raras.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {cardTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card key={type.name}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{type.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{type.count} productos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid de productos */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Todos los Productos</h2>
        <ProductGrid products={cards} loading={loading} />
      </div>

      {/* Información adicional */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">💡 Consejos para Coleccionistas</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Las cartas de edición limitada suelen aumentar su valor con el tiempo</li>
            <li>• Guarda tus cartas en protectores para mantener su estado</li>
            <li>• Verifica la autenticidad de las cartas raras antes de comprar</li>
            <li>• Los sobres boosters son perfectos para expandir tu colección</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cards;