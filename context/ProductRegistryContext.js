"use client";

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ProductRegistryContext = createContext();

export function ProductRegistryProvider({ children }) {
    const [registry, setRegistry] = useState({});

    /**
     * Registers a product in the global registry.
     * @param {Object} product - The product object to register.
     */
    const registerProduct = useCallback((product) => {
        if (!product?.id) return;
        
        const productId = String(product.id);
        
        setRegistry((prev) => {
            // Already have it? Check if we should update (e.g., if we got more fields)
            // For now, simple overwrite or skip if same
            if (prev[productId] && JSON.stringify(prev[productId]) === JSON.stringify(product)) {
                return prev;
            }
            
            return {
                ...prev,
                [productId]: product
            };
        });
    }, []);

    /**
     * Registers multiple products at once.
     * @param {Array} products - Array of product objects.
     */
    const registerProducts = useCallback((products) => {
        if (!Array.isArray(products)) return;
        
        setRegistry((prev) => {
            const next = { ...prev };
            let changed = false;
            
            products.forEach((p) => {
                if (!p?.id) return;
                const id = String(p.id);
                if (next[id] && JSON.stringify(next[id]) === JSON.stringify(p)) return;
                next[id] = p;
                changed = true;
            });
            
            return changed ? next : prev;
        });
    }, []);

    /**
     * Retrieves a product from the registry.
     * @param {string|number} id - Product ID.
     */
    const getProduct = useCallback((id) => {
        if (!id) return null;
        return registry[String(id)] || null;
    }, [registry]);

    const value = useMemo(() => ({
        registry,
        registerProduct,
        registerProducts,
        getProduct
    }), [registry, registerProduct, registerProducts, getProduct]);

    return (
        <ProductRegistryContext.Provider value={value}>
            {children}
        </ProductRegistryContext.Provider>
    );
}

export function useProductRegistry() {
    const context = useContext(ProductRegistryContext);
    if (!context) {
        throw new Error('useProductRegistry must be used within a ProductRegistryProvider');
    }
    return context;
}
