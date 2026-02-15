import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, Dish, Invoice } from '../types';
import { INVENTORY_DATA, MENU_DATA } from '../data/mockData';

interface AppContextType {
    inventory: InventoryItem[];
    dishes: Dish[];
    invoices: Invoice[];
    addInventoryItem: (item: InventoryItem) => void;
    updateInventoryItem: (item: InventoryItem) => void;
    deleteInventoryItem: (id: string) => void;
    addDish: (dish: Dish) => void;
    updateDish: (dish: Dish) => void;
    deleteDish: (id: string) => void;
    addInvoice: (invoice: Invoice) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize state from localStorage or use mock data as fallback
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        const saved = localStorage.getItem('inventory');
        return saved ? JSON.parse(saved) : INVENTORY_DATA;
    });

    const [dishes, setDishes] = useState<Dish[]>(() => {
        const saved = localStorage.getItem('dishes');
        return saved ? JSON.parse(saved) : MENU_DATA;
    });

    const [invoices, setInvoices] = useState<Invoice[]>(() => {
        const saved = localStorage.getItem('invoices');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('dishes', JSON.stringify(dishes));
    }, [dishes]);

    useEffect(() => {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }, [invoices]);

    // Actions
    const addInventoryItem = (item: InventoryItem) => {
        setInventory(prev => [...prev, item]);
    };

    const updateInventoryItem = (updatedItem: InventoryItem) => {
        setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const deleteInventoryItem = (id: string) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    const addDish = (dish: Dish) => {
        setDishes(prev => [...prev, dish]);
    };

    const updateDish = (updatedDish: Dish) => {
        setDishes(prev => prev.map(dish => dish.id === updatedDish.id ? updatedDish : dish));
    };

    const deleteDish = (id: string) => {
        setDishes(prev => prev.filter(dish => dish.id !== id));
    };

    const addInvoice = (invoice: Invoice) => {
        setInvoices(prev => [...prev, invoice]);
        // Auto-update inventory quantities based on invoice items
        invoice.items.forEach(invoiceItem => {
            const inventoryItem = inventory.find(i => i.id === invoiceItem.itemId);
            if (inventoryItem) {
                updateInventoryItem({
                    ...inventoryItem,
                    quantity: inventoryItem.quantity + invoiceItem.quantity,
                    costPrice: invoiceItem.price, // Update last cost price
                    lastUpdated: new Date().toLocaleString('he-IL')
                });
            }
        });
    };

    return (
        <AppContext.Provider value={{
            inventory,
            dishes,
            invoices,
            addInventoryItem,
            updateInventoryItem,
            deleteInventoryItem,
            addDish,
            updateDish,
            deleteDish,
            addInvoice
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};