"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const ShareSelectionContext = createContext();

export function ShareSelectionProvider({ children }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelection = useCallback((id) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const isSelected = useCallback((id) => {
        return selectedIds.includes(id);
    }, [selectedIds]);

    return (
        <ShareSelectionContext.Provider value={{ selectedIds, toggleSelection, clearSelection, isSelected }}>
            {children}
        </ShareSelectionContext.Provider>
    );
}

export function useShareSelection() {
    const context = useContext(ShareSelectionContext);
    if (!context) {
        throw new Error('useShareSelection must be used within a ShareSelectionProvider');
    }
    return context;
}
