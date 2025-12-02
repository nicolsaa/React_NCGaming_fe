// src/services/categoryService.ts
export interface CategoryDTO {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

const API_BASE_URL = 'http://localhost:8080/api/categories';

export const categoryService = {
    // Obtener todas las categorías
    async getAllCategories(): Promise<CategoryDTO[]> {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Obtener categoría por ID
    async getCategoryById(id: number): Promise<CategoryDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Categoría no encontrada');
                }
                throw new Error('Error al obtener categoría');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Crear categoría (solo admin)
    async createCategory(categoryData: { name: string; description?: string }, token: string): Promise<CategoryDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear categoría');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    // Actualizar categoría (solo admin)
    async updateCategory(id: number, categoryData: { name?: string; description?: string }, token: string): Promise<CategoryDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Categoría no encontrada');
                }
                throw new Error('Error al actualizar categoría');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // Eliminar categoría (solo admin)
    async deleteCategory(id: number, token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Categoría no encontrada');
                }
                throw new Error('Error al eliminar categoría');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    // Función para mapear categoría de frontend a backend
    mapCategoryForBackend(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'figuras': 'Figuras',
            'cartas': 'Cartas',
            'ropa': 'Ropa',
            'poleras': 'Ropa',
            'polerones': 'Ropa',
            'videojuegos': 'Videojuegos',
            'juegos': 'Videojuegos',
            'accesorios': 'Accesorios'
        };
        
        return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }
};