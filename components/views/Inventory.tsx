import React, { useState } from 'react';
import { Search, Plus, ScanLine, Filter, AlertCircle, CheckCircle2, Trash2, Edit, X, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['ירקות', 'יבשים', 'מקרר', 'קפואים', 'משקאות', 'אריזות', 'כללי'];
const UNITS = ['ק"ג', 'גרם', 'ליטר', 'מ"ל', 'יחידות', 'מארז', 'בקבוק'];

const Inventory: React.FC = () => {
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        name: '', category: 'כללי', supplier: '', quantity: 0, unit: 'ק"ג', costPrice: 0, lowStockThreshold: 5
    });

    // Scan Simulation State
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    const filteredItems = inventory.filter(item => 
        item.name.includes(searchTerm) || item.supplier.includes(searchTerm) || item.category.includes(searchTerm)
    );

    const getStatus = (qty: number, threshold: number) => {
        if (qty <= threshold) return 'critical';
        if (qty <= threshold * 1.5) return 'low';
        return 'ok';
    };

    const handleOpenModal = (item?: InventoryItem) => {
        if (item) {
            setFormData(item);
            setIsEditing(true);
        } else {
            setFormData({
                name: '', category: 'כללי', supplier: '', quantity: 0, unit: 'ק"ג', costPrice: 0, lowStockThreshold: 5
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.supplier) return;

        const newItem: InventoryItem = {
            id: isEditing ? formData.id! : Date.now().toString(),
            name: formData.name!,
            category: formData.category || 'כללי',
            supplier: formData.supplier!,
            quantity: Number(formData.quantity),
            unit: formData.unit || 'ק"ג',
            costPrice: Number(formData.costPrice),
            lowStockThreshold: Number(formData.lowStockThreshold),
            lastUpdated: new Date().toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })
        };

        if (isEditing) {
            updateInventoryItem(newItem);
        } else {
            addInventoryItem(newItem);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
            deleteInventoryItem(id);
        }
    };

    const handleScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        setTimeout(() => {
            setIsScanning(false);
            addInventoryItem({ 
                id: Date.now().toString(), 
                name: 'פרמזן איטלקי', 
                category: 'מקרר', 
                supplier: 'מחלבות הצפון', 
                quantity: 5, 
                unit: 'ק"ג', 
                costPrice: 90,
                lowStockThreshold: 5,
                lastUpdated: new Date().toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })
            });
        }, 2200);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">מלאי ורכש</h2>
                    <p className="text-slate-400 mt-1">ניהול חומרי גלם בזמן אמת</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleScan}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        <ScanLine className="w-5 h-5" />
                        <span>סריקת חשבונית</span>
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>פריט חדש</span>
                    </button>
                </div>
            </div>

            <Card className="min-h-[600px]">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="חיפוש פריט, ספק או קטגוריה..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 pr-10 pl-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all">
                        <Filter className="w-4 h-4" />
                        <span>סינון מתקדם</span>
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-slate-900/50 text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">שם הפריט</th>
                                <th className="px-6 py-4">ספק</th>
                                <th className="px-6 py-4">כמות במלאי</th>
                                <th className="px-6 py-4">מחיר עלות</th>
                                <th className="px-6 py-4">סטטוס</th>
                                <th className="px-6 py-4">עדכון אחרון</th>
                                <th className="px-6 py-4">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredItems.map((item) => {
                                const status = getStatus(item.quantity, item.lowStockThreshold);
                                return (
                                <tr key={item.id} className="hover:bg-slate-700/20 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div>{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{item.supplier}</td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        {item.quantity} <span className="text-slate-500 text-xs">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">₪{item.costPrice}</td>
                                    <td className="px-6 py-4">
                                        {status === 'ok' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> תקין
                                            </span>
                                        )}
                                        {status === 'low' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <AlertCircle className="w-3.5 h-3.5" /> נמוך
                                            </span>
                                        )}
                                        {status === 'critical' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                <AlertCircle className="w-3.5 h-3.5" /> קריטי
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{item.lastUpdated}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(item)}
                                                className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            לא נמצאו פריטים. נסה לשנות את החיפוש או הוסף פריט חדש.
                        </div>
                    )}
                </div>
            </Card>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-white">
                                    {isEditing ? 'עריכת פריט מלאי' : 'הוספת פריט חדש'}
                                </h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">שם הפריט</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="לדוגמה: קמח 00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">קטגוריה</label>
                                        <select 
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">ספק</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.supplier}
                                            onChange={e => setFormData({...formData, supplier: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="שם הספק"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">כמות</label>
                                            <input 
                                                required
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                value={formData.quantity}
                                                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">יחידה</label>
                                            <select 
                                                value={formData.unit}
                                                onChange={e => setFormData({...formData, unit: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                            >
                                                {UNITS.map(unit => (
                                                    <option key={unit} value={unit}>{unit}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">מחיר עלות (₪)</label>
                                        <input 
                                            required
                                            type="number" 
                                            min="0"
                                            step="0.01"
                                            value={formData.costPrice}
                                            onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">סף התראה (כמות נמוכה)</label>
                                        <input 
                                            required
                                            type="number" 
                                            min="0"
                                            value={formData.lowStockThreshold}
                                            onChange={e => setFormData({...formData, lowStockThreshold: Number(e.target.value)})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-medium"
                                    >
                                        ביטול
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{isEditing ? 'שמור שינויים' : 'הוסף פריט'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Scanning Modal Simulation */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
                        >
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <ScanLine className="w-10 h-10 text-indigo-400" />
                                <motion.div 
                                    className="absolute inset-0 border-2 border-indigo-500 rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">סורק חשבונית...</h3>
                            <p className="text-slate-400 mb-6">המערכת מפענחת את הנתונים ומעדכנת את המלאי באופן אוטומטי</p>
                            
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-indigo-500"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <div className="mt-2 text-right text-xs text-indigo-400 font-mono">
                                {scanProgress}% הושלם
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Inventory;