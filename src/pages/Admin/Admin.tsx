import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Edit,
    Trash2,
    Package,
    Image,
    DollarSign,
    ShoppingCart
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}

const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        image: ''
    });

    // Categorías disponibles
    const categories = [
        { value: 'figuras', label: 'Figuras' },
        { value: 'cartas', label: 'Cartas' },
        { value: 'ropa', label: 'Ropa' },
        { value: 'juegos', label: 'Videojuegos' },
        { value: 'accesorios', label: 'Accesorios' },
    ];

    // Verificar permisos de administrador
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        loadProducts();
    }, [user, navigate]);

    // Cargar productos desde localStorage
    const loadProducts = () => {
        try {
            const savedProducts = localStorage.getItem('admin_products');
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    // Guardar productos en localStorage
    const saveProducts = (newProducts: Product[]) => {
        localStorage.setItem('admin_products', JSON.stringify(newProducts));
        setProducts(newProducts);
    };

    // Abrir modal para nuevo producto
    const handleNewProduct = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            stock: '',
            category: '',
            image: ''
        });
        setIsDialogOpen(true);
    };

    // Abrir modal para editar producto
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            image: product.image
        });
        setIsDialogOpen(true);
    };

    // Eliminar producto
    const handleDeleteProduct = (productId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        const updatedProducts = products.filter(p => p.id !== productId);
        saveProducts(updatedProducts);
    };

    // Guardar producto (crear o editar)
    const handleSaveProduct = () => {
        // Validaciones
        if (!formData.name || !formData.price || !formData.stock || !formData.category) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            image: formData.image || '/assets/images/Logo-sin-Fondo.png'
        };

        if (editingProduct) {
            // Editar producto existente
            const updatedProducts = products.map(p =>
                p.id === editingProduct.id
                    ? { ...p, ...productData }
                    : p
            );
            saveProducts(updatedProducts);
        } else {
            // Crear nuevo producto
            const newProduct: Product = {
                id: Date.now().toString(),
                ...productData
            };
            saveProducts([...products, newProduct]);
        }

        setIsDialogOpen(false);
    };

    // Obtener nombre de categoría
    const getCategoryName = (categoryValue: string) => {
        const category = categories.find(c => c.value === categoryValue);
        return category ? category.label : 'Sin categoría';
    };

    // Obtener color de badge por categoría
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            figuras: 'bg-purple-500',
            cartas: 'bg-blue-500',
            ropa: 'bg-pink-500',
            juegos: 'bg-green-500',
            accesorios: 'bg-orange-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Administración de Productos
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                Gestiona los productos de tu tienda
                            </p>
                        </div>
                        <Button
                            onClick={handleNewProduct}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </CardHeader>
                </Card>

                {/* Tabla de productos */}
                <Card className="border-0 shadow-2xl">
                    <CardContent className="p-0">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No hay productos registrados
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Comienza agregando tu primer producto
                                </p>
                                <Button onClick={handleNewProduct}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Producto
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product, index) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover border"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/assets/images/Logo-sin-Fondo.png';
                                                        }}
                                                    />
                                                    <span className="font-medium">{product.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                                    <span className="font-semibold">
                                                        {product.price.toLocaleString('es-CL')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <ShoppingCart className="h-4 w-4 text-blue-600 mr-1" />
                                                    <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                                                        {product.stock}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getCategoryColor(product.category)} text-white border-0`}>
                                                    {getCategoryName(product.category)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de producto */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProduct
                                    ? 'Modifica la información del producto.'
                                    : 'Agrega un nuevo producto a tu tienda.'
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Nombre */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Figura Goku Super Saiyan"
                                />
                            </div>

                            {/* Precio y Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Precio ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Categoría */}
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Imagen */}
                            <div className="grid gap-2">
                                <Label htmlFor="image">
                                    <Image className="h-4 w-4 inline mr-2" />
                                    URL de Imagen
                                </Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                <p className="text-sm text-gray-500">
                                    Opcional. Si no se proporciona, se usará una imagen por defecto.
                                </p>
                            </div>

                            {/* Vista previa de imagen */}
                            {formData.image && (
                                <div className="grid gap-2">
                                    <Label>Vista Previa</Label>
                                    <img
                                        src={formData.image}
                                        alt="Vista previa"
                                        className="w-full h-32 object-contain rounded-lg border"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveProduct}>
                                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Admin;