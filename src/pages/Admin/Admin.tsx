// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { useProducts } from '@/context/ProductsContext';
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
import { Textarea } from '@/components/ui/textarea';
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
    Image as ImageIcon,
    DollarSign,
    ShoppingCart,
    Loader2,
    AlertCircle,
    CheckCircle,
    Upload
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProductImage from '@/components/ui/ProductImage';
import { ImageUtils } from '@/utils/imageUtils';

// Interface actualizada
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    featured?: boolean;
}

const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { refreshProducts } = useProducts();

    const [products, setProducts] = useState<Product[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryName: '',
        image: ''
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Categorías disponibles
    const categories = [
        { value: 'figuras', label: 'Figuras' },
        { value: 'cartas', label: 'Cartas' },
        { value: 'ropa', label: 'Ropa' },
        { value: 'videojuegos', label: 'Videojuegos' },
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

    // Cargar productos desde backend
    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No autenticado. Por favor, inicie sesión.');
            }

            const backendProducts = await productService.getAllProducts();
            setProducts(backendProducts);
            setSuccess('Productos cargados correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error loading products:', error);
            setError(`Error al cargar productos: ${error.message}`);
            
            // Fallback a localStorage
            try {
                const savedProducts = localStorage.getItem('admin_products');
                if (savedProducts) {
                    setProducts(JSON.parse(savedProducts));
                    setError('Usando datos locales (fallback)');
                }
            } catch (localError) {
                console.error('Error loading from localStorage:', localError);
            }
        } finally {
            setLoadingProducts(false);
        }
    };

    // Validar formulario
    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};
        
        if (!formData.name.trim()) {
            errors.name = 'El nombre del producto es obligatorio';
        }
        
        if (!formData.description.trim()) {
            errors.description = 'La descripción es obligatoria';
        }
        
        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0) {
            errors.price = 'El precio debe ser un número válido ≥ 0';
        }
        
        const stock = parseInt(formData.stock);
        if (isNaN(stock) || stock < 0) {
            errors.stock = 'El stock debe ser un número válido ≥ 0';
        }
        
        if (!formData.categoryName) {
            errors.category = 'Debe seleccionar una categoría';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Abrir modal para nuevo producto
    const handleNewProduct = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            categoryName: '',
            image: ''
        });
        setFormErrors({});
        setError(null);
        setIsDialogOpen(true);
    };

    // Abrir modal para editar producto
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            categoryName: product.category,
            image: product.image
        });
        setFormErrors({});
        setError(null);
        setIsDialogOpen(true);
    };

    // Eliminar producto
    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No autenticado. Por favor, inicie sesión.');
            }

            await productService.deleteProduct(productId, token);
            
            // Actualizar lista local
            setProducts(products.filter(p => p.id !== productId));
            await refreshProducts(); // Actualizar contexto global
            
            setSuccess('✅ Producto eliminado correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error deleting product:', error);
            setError(`❌ Error al eliminar producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos desde JSON
    const handleLoadFromJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target?.result as string);
                    
                    // Validar estructura mínima
                    if (!jsonData.name || !jsonData.categoryName) {
                        setError('JSON inválido: debe contener name y categoryName');
                        return;
                    }
                    
                    // Mapear datos del JSON al formulario
                    setFormData({
                        name: jsonData.name || '',
                        description: jsonData.description || '',
                        price: jsonData.price?.toString() || '',
                        stock: jsonData.stock?.toString() || '',
                        categoryName: (jsonData.categoryName || '').toLowerCase(),
                        image: jsonData.image || ''
                    });
                    
                    setSuccess('✅ Datos cargados desde JSON');
                    setTimeout(() => setSuccess(null), 2000);
                    
                } catch (error: any) {
                    setError(`❌ Error al parsear JSON: ${error.message}`);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    };

    // Guardar producto (crear o editar)
    const handleSaveProduct = async () => {
        // Validar formulario
        if (!validateForm()) {
            setError('❌ Por favor, corrija los errores en el formulario');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No autenticado. Por favor, inicie sesión.');
            }

            // Preparar datos para enviar
                                const productData = {
                                    name: formData.name,
                                    description: formData.description,
                                    price: parseFloat(formData.price),
                                    stock: parseInt(formData.stock),
                                    categoryName: formData.categoryName,
                                    image: formData.image || ImageUtils.getDefaultImage()
                                };

            console.log('Enviando datos al backend:', productData);

            let savedProduct: Product;
            
            if (editingProduct) {
                // ACTUALIZAR producto existente
                savedProduct = await productService.updateProduct(
                    editingProduct.id,
                    productData,
                    token
                );
                
                // Actualizar lista local
                setProducts(products.map(p =>
                    p.id === savedProduct.id ? savedProduct : p
                ));
                
                setSuccess(`✅ Producto "${savedProduct.name}" actualizado correctamente`);
                
            } else {
                // CREAR nuevo producto
                savedProduct = await productService.createProduct(
                    productData,
                    token
                );
                
                // Agregar a lista local
                setProducts([...products, savedProduct]);
                
                setSuccess(`✅ Producto "${savedProduct.name}" creado correctamente`);
                
                // Resetear formulario si es creación
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    categoryName: '',
                    image: ''
                });
            }
            
            // Actualizar contexto global
            await refreshProducts();
            
            // Cerrar modal después de 2 segundos si fue exitoso
            setTimeout(() => {
                setIsDialogOpen(false);
                setTimeout(() => setSuccess(null), 1000);
            }, 2000);
            
        } catch (error: any) {
            console.error('Error guardando producto:', error);
            
            // Manejar errores específicos
            let errorMessage = error.message || 'Error al guardar el producto';
            
            if (errorMessage.includes('401') || errorMessage.includes('No autorizado')) {
                errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
            } else if (errorMessage.includes('categoría') || errorMessage.includes('category')) {
                errorMessage = 'Categoría no válida. Verifique que la categoría exista en el sistema.';
            } else if (errorMessage.includes('duplicado') || errorMessage.includes('exist')) {
                errorMessage = 'Ya existe un producto con ese nombre.';
            } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
                errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
            }
            
            setError(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
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
            poleras: 'bg-pink-400',
            polerones: 'bg-pink-300',
            videojuegos: 'bg-green-500',
            accesorios: 'bg-orange-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    if (loadingProducts) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-600">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Notificaciones globales */}
                <div className="mb-6 space-y-3">
                    {error && (
                        <Alert variant="destructive" className="animate-in slide-in-from-top">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="font-medium">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert className="animate-in slide-in-from-top bg-green-50 text-green-800 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="font-medium">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Header */}
                <Card className="mb-6 border-0 shadow-2xl bg-gradient-to-r from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                🛠️ Administración de Productos
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                                Gestiona el catálogo de productos ({products.length} productos)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={loadProducts}
                                disabled={loading || loadingProducts}
                                className="gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : null}
                                Actualizar
                            </Button>
                            <Button
                                onClick={handleNewProduct}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 shadow-lg"
                                disabled={loading}
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo Producto
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Tabla de productos */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                    <CardContent className="p-0">
                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <Package className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No hay productos registrados
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Comienza agregando productos a tu catálogo. Puedes crearlos manualmente o importar desde un archivo JSON.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button 
                                        onClick={handleNewProduct} 
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar Primer Producto
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleLoadFromJSON}
                                        className="gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Importar desde JSON
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center">#</TableHead>
                                            <TableHead className="min-w-[300px]">Producto</TableHead>
                                            <TableHead className="min-w-[120px]">Precio</TableHead>
                                            <TableHead className="min-w-[100px]">Stock</TableHead>
                                            <TableHead className="min-w-[120px]">Categoría</TableHead>
                                            <TableHead className="min-w-[100px] text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product, index) => (
                                            <TableRow 
                                                key={product.id} 
                                                className="hover:bg-gray-50 transition-colors group"
                                            >
                                                <TableCell className="text-center font-medium text-gray-500">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative flex-shrink-0">
                                                            <ProductImage
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-12 h-12 rounded-lg border border-gray-200"
                                                                fallbackSrc={ImageUtils.getDefaultImage()}
                                                                objectFit="cover"
                                                            />
                                                            {/* Badge de stock bajo */}
                                                            {product.stock < 5 && product.stock > 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white">
                                                                    {product.stock}
                                                                </span>
                                                            )}
                                                            {product.stock === 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white">
                                                                    0
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {product.description?.substring(0, 60)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <DollarSign className="h-4 w-4 text-green-600 mr-1 flex-shrink-0" />
                                                        <span className="font-semibold text-gray-900">
                                                            {product.price.toLocaleString('es-CL')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <ShoppingCart className={`h-4 w-4 mr-1 flex-shrink-0 ${
                                                            product.stock > 10 
                                                                ? 'text-green-600' 
                                                                : product.stock > 0 
                                                                ? 'text-orange-500' 
                                                                : 'text-red-600'
                                                        }`} />
                                                        <span className={`font-semibold ${
                                                            product.stock > 10 
                                                                ? 'text-green-700' 
                                                                : product.stock > 0 
                                                                ? 'text-orange-600' 
                                                                : 'text-red-700'
                                                        }`}>
                                                            {product.stock}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        className={`${getCategoryColor(product.category)} text-white border-0 font-medium px-3 py-1`}
                                                    >
                                                        {getCategoryName(product.category)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditProduct(product)}
                                                            disabled={loading}
                                                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            disabled={loading}
                                                            className="h-8 w-8 p-0"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de producto */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {editingProduct ? '✏️ Editar Producto' : '🆕 Nuevo Producto'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProduct
                                    ? 'Modifica la información del producto existente.'
                                    : 'Agrega un nuevo producto al catálogo de la tienda.'
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="name" className="font-medium text-gray-700">
                                        Nombre del Producto *
                                    </Label>
                                    {formErrors.name && (
                                        <span className="text-xs text-red-500 font-medium">
                                            {formErrors.name}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formErrors.name) setFormErrors({...formErrors, name: ''});
                                    }}
                                    placeholder="Ej: Figura Goku Super Saiyan"
                                    disabled={loading}
                                    className={formErrors.name ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                />
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="description" className="font-medium text-gray-700">
                                        Descripción *
                                    </Label>
                                    {formErrors.description && (
                                        <span className="text-xs text-red-500 font-medium">
                                            {formErrors.description}
                                        </span>
                                    )}
                                </div>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (formErrors.description) setFormErrors({...formErrors, description: ''});
                                    }}
                                    placeholder="Describe las características, materiales, dimensiones, etc..."
                                    rows={3}
                                    disabled={loading}
                                    className={formErrors.description ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                />
                            </div>

                            {/* Precio y Stock */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="price" className="font-medium text-gray-700">
                                            Precio (CLP) *
                                        </Label>
                                        {formErrors.price && (
                                            <span className="text-xs text-red-500 font-medium">
                                                {formErrors.price}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => {
                                            setFormData({ ...formData, price: e.target.value });
                                            if (formErrors.price) setFormErrors({...formErrors, price: ''});
                                        }}
                                        placeholder="0.00"
                                        disabled={loading}
                                        className={formErrors.price ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="stock" className="font-medium text-gray-700">
                                            Stock *
                                        </Label>
                                        {formErrors.stock && (
                                            <span className="text-xs text-red-500 font-medium">
                                                {formErrors.stock}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => {
                                            setFormData({ ...formData, stock: e.target.value });
                                            if (formErrors.stock) setFormErrors({...formErrors, stock: ''});
                                        }}
                                        placeholder="0"
                                        disabled={loading}
                                        className={formErrors.stock ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </div>
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="category" className="font-medium text-gray-700">
                                        Categoría *
                                    </Label>
                                    {formErrors.category && (
                                        <span className="text-xs text-red-500 font-medium">
                                            {formErrors.category}
                                        </span>
                                    )}
                                </div>
                                <Select
                                    value={formData.categoryName}
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, categoryName: value });
                                        if (formErrors.category) setFormErrors({...formErrors, category: ''});
                                    }}
                                    disabled={loading}
                                >
                                    <SelectTrigger className={formErrors.category ? 'border-red-300 focus-visible:ring-red-500' : ''}>
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                <span className="flex items-center gap-2">
                                                    {category.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Imagen */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="font-medium text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    URL de Imagen
                                </Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg o /ruta/local/imagen.png"
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500">
                                    Opcional. Si no se proporciona, se usará: <code className="text-xs bg-gray-100 px-1 rounded">{ImageUtils.getDefaultImage()}</code>
                                </p>
                            </div>

                            {/* Vista previa de imagen */}
                            <div className="space-y-2 pt-4 border-t">
                                <Label className="font-medium text-gray-700">
                                    Vista Previa
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <ProductImage
                                        src={formData.image || ImageUtils.getDefaultImage()}
                                        alt="Vista previa del producto"
                                        className="w-full h-48 rounded-lg"
                                        objectFit="contain"
                                        fallbackSrc={ImageUtils.getDefaultImage()}
                                    />
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        {formData.image ? '📸 Imagen personalizada' : '🖼️ Imagen por defecto'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadFromJSON}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    Cargar JSON
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFormData({
                                            name: '',
                                            description: '',
                                            price: '',
                                            stock: '',
                                            categoryName: '',
                                            image: ''
                                        });
                                        setFormErrors({});
                                    }}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    Limpiar
                                </Button>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={handleSaveProduct} 
                                    disabled={loading}
                                    className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            {editingProduct ? 'Actualizando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        <>
                                            {editingProduct ? '💾 Guardar Cambios' : '✨ Crear Producto'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Admin;
