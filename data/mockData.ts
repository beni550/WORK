import { InventoryItem, Dish, Employee, SalesData, Alert } from '../types';

export const INVENTORY_DATA: InventoryItem[] = [
    { id: '1', name: 'קמח פיצה 00', category: 'יבשים', supplier: 'קמח הארץ', quantity: 450, unit: 'ק"ג', costPrice: 6.5, lowStockThreshold: 50, lastUpdated: 'היום, 08:00' },
    { id: '2', name: 'עגבניות תמר', category: 'ירקות', supplier: 'ירקות השדה', quantity: 25, unit: 'ק"ג', costPrice: 12, lowStockThreshold: 10, lastUpdated: 'היום, 07:30' },
    { id: '3', name: 'גבינת מוצרלה', category: 'מקרר', supplier: 'מחלבות הצפון', quantity: 12, unit: 'ק"ג', costPrice: 42, lowStockThreshold: 15, lastUpdated: 'אתמול, 16:00' },
    { id: '4', name: 'שמן זית כתית', category: 'יבשים', supplier: 'שמן בוטיק', quantity: 60, unit: 'ליטר', costPrice: 38, lowStockThreshold: 10, lastUpdated: '01/10/2023' },
    { id: '5', name: 'בזיליקום טרי', category: 'ירקות', supplier: 'ירקות השדה', quantity: 2, unit: 'ק"ג', costPrice: 80, lowStockThreshold: 1, lastUpdated: 'היום, 09:00' },
    { id: '6', name: 'פסטה פנה', category: 'יבשים', supplier: 'איטליה הקטנה', quantity: 100, unit: 'ק"ג', costPrice: 8, lowStockThreshold: 20, lastUpdated: '05/10/2023' },
];

export const MENU_DATA: Dish[] = [
    { 
        id: '1', 
        name: 'פיצה מרגריטה', 
        category: 'mains', 
        ingredients: [
            { itemId: '1', amount: 0.2 }, // 200g flour
            { itemId: '2', amount: 0.15 }, // 150g tomatoes
            { itemId: '3', amount: 0.15 }  // 150g cheese
        ],
        laborTime: 12,
        laborCost: 7, // Approx
        sellingPrice: 58, 
        sales: 120 
    },
    { 
        id: '2', 
        name: 'פוקצ׳ה הבית', 
        category: 'starters', 
        ingredients: [
            { itemId: '1', amount: 0.25 },
            { itemId: '4', amount: 0.05 }
        ],
        laborTime: 8,
        laborCost: 4.5,
        sellingPrice: 28, 
        sales: 85 
    },
    { 
        id: '3', 
        name: 'פסטה שמנת פטריות', 
        category: 'mains', 
        ingredients: [
            { itemId: '6', amount: 0.2 }
        ],
        laborTime: 15,
        laborCost: 8.75,
        sellingPrice: 64, 
        sales: 90 
    },
    { 
        id: '4', 
        name: 'קולה זירו', 
        category: 'drinks', 
        ingredients: [],
        laborTime: 1,
        laborCost: 0.5,
        sellingPrice: 14, 
        sales: 200 
    },
    { 
        id: '5', 
        name: 'טירמיסו', 
        category: 'desserts', 
        ingredients: [],
        laborTime: 20,
        laborCost: 12,
        sellingPrice: 42, 
        sales: 45 
    },
];

export const EMPLOYEE_DATA: Employee[] = [
    { id: '1', name: 'דני לוי', role: 'admin', status: 'active', permissions: { viewCosts: true, editMenu: true, manageTeam: true } },
    { id: '2', name: 'רונית כהן', role: 'chef', status: 'active', permissions: { viewCosts: true, editMenu: false, manageTeam: false } },
    { id: '3', name: 'יוסי אבני', role: 'shift_manager', status: 'break', permissions: { viewCosts: false, editMenu: false, manageTeam: true } },
    { id: '4', name: 'נועה שחר', role: 'waiter', status: 'offline', permissions: { viewCosts: false, editMenu: false, manageTeam: false } },
];

export const SALES_CHART_DATA: SalesData[] = [
    { name: 'א', revenue: 4000, cost: 2400 },
    { name: 'ב', revenue: 3000, cost: 1398 },
    { name: 'ג', revenue: 9800, cost: 6000 },
    { name: 'ד', revenue: 3908, cost: 2780 },
    { name: 'ה', revenue: 4890, cost: 1890 },
    { name: 'ו', revenue: 12390, cost: 4800 },
    { name: 'ש', revenue: 14490, cost: 5300 },
];

export const ALERTS_DATA: Alert[] = [
    { id: '1', type: 'warning', message: 'מלאי מוצרלה נמוך מהמוגדר', time: 'לפני 10 דקות' },
    { id: '2', type: 'info', message: 'הזמנת רכש #4023 אושרה', time: 'לפני שעה' },
    { id: '3', type: 'success', message: 'שיא מכירות חדש בצהריים!', time: 'לפני 3 שעות' },
    { id: '4', type: 'warning', message: 'עלייה במחיר העגבניות (15%⇧)', time: 'אתמול' },
];