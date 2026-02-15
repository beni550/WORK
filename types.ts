export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    supplier: string;
    quantity: number;
    unit: string;
    costPrice: number;
    lowStockThreshold: number;
    lastUpdated: string;
}

export interface IngredientRef {
    itemId: string;
    amount: number;
}

export interface Dish {
    id: string;
    name: string;
    category: 'starters' | 'mains' | 'drinks' | 'desserts';
    ingredients: IngredientRef[];
    laborCost: number; // Calculated labor cost in currency
    laborTime: number; // in minutes
    sellingPrice: number;
    sales: number; // For dashboard stats
}

export interface InvoiceItem {
    itemId: string;
    quantity: number;
    price: number;
}

export interface Invoice {
    id: string;
    supplier: string;
    date: string;
    totalAmount: number;
    items: InvoiceItem[];
}

export interface Employee {
    id: string;
    name: string;
    role: 'admin' | 'chef' | 'shift_manager' | 'waiter';
    status: 'active' | 'break' | 'offline';
    permissions: {
        viewCosts: boolean;
        editMenu: boolean;
        manageTeam: boolean;
    };
}

export interface SalesData {
    name: string;
    revenue: number;
    cost: number;
}

export interface Alert {
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
    time: string;
}

export type ViewState = 'dashboard' | 'inventory' | 'menu' | 'reports' | 'team';