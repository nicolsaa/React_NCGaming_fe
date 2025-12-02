import { describe, it, expect, beforeEach, vi } from 'vitest';
import { categoryService } from '@/services/categoryService';

describe('categoryService - basic tests', () => {
    beforeEach(() => {
        (globalThis as any).fetch = vi.fn();
    });

    it('getAllCategories - returns categories', async () => {
        const mockCategories = [
            { id: 1, name: 'Cartas', description: 'desc' }
        ];

        (globalThis as any).fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCategories,
            status: 200,
            headers: { get: (_: string) => 'application/json' }
        } as any);

        const cats = await categoryService.getAllCategories();
        expect(Array.isArray(cats)).toBe(true);
        expect(cats[0].name).toBe('Cartas');
    });

    it('getCategoryById - returns a category', async () => {
        const mockCat = { id: 1, name: 'Cartas' };

        (globalThis as any).fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCat,
            status: 200,
            headers: { get: (_: string) => 'application/json' }
        } as any);

        const c = await categoryService.getCategoryById(1);
        expect(c.name).toBe('Cartas');
    });

    it('mapCategoryForBackend - maps correctly', () => {
        expect(categoryService.mapCategoryForBackend('figuras')).toBe('Figuras');
    });

    it('getAllCategories - should throw on error', async () => {
        (globalThis as any).fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({}),
            headers: { get: (_: string) => 'application/json' }
        } as any);

        await expect(categoryService.getAllCategories()).rejects.toThrow('Error al obtener categorías');
    });
});
