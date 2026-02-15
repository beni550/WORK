import React, { useState, useMemo } from 'react';
import { Calculator, ChefHat, DollarSign, Save, Plus, Trash2, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { IngredientRef, Dish } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MenuEngineering: React.FC = () => {
    const { inventory, addDish } = useAppContext();
    
    // Form State
    const [dishName, setDishName] = useState('');
    const [category, setCategory] = useState<Dish['category']>('mains');
    const [laborTime, setLaborTime] = useState(15); // minutes
    const [hourlyWage, setHourlyWage] = useState(35); // NIS
    const [recipe, setRecipe] = useState<IngredientRef[]>([]);
    const [sellingPrice, setSellingPrice] = useState<number>(0);
    
    // Helper State
    const [selectedIngredientId, setSelectedIngredientId] = useState('');
    const [targetFC, setTargetFC] = useState(30); // Target Food Cost %
    const [savedMessage, setSavedMessage] = useState(false);

    // --- CALCULATIONS ---
    
    // 1. Calculate Total Food Cost (Sum of all ingredients)
    const totalFoodCost = useMemo(() => {
        return recipe.reduce((total, item) => {
            const invItem = inventory.find(i => i.id === item.itemId);
            if (!invItem) return total;
            return total + (invItem.costPrice * item.amount);
        }, 0);
    }, [recipe, inventory]);

    // 2. Calculate Labor Cost
    const laborCost = useMemo(() => {
        return (laborTime / 60) * hourlyWage;
    }, [laborTime, hourlyWage]);

    // 3. Total Cost (Prime Cost)
    const totalPrimeCost = totalFoodCost + laborCost;

    // 4. Metrics based on Selling Price
    const profit = sellingPrice - totalPrimeCost;
    const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (totalFoodCost / sellingPrice) * 100 : 0;

    // 5. Recommended Price based on Target FC%
    const recommendedPrice = targetFC > 0 ? totalFoodCost / (targetFC / 100) : 0;

    // --- ACTIONS ---

    const addIngredient = () => {
        if (!selectedIngredientId) return;
        
        // Prevent duplicates
        if (recipe.find(r => r.itemId === selectedIngredientId)) {
            alert("המרכיב כבר קיים במתכון");
            return;
        }

        setRecipe([...recipe, { itemId: selectedIngredientId, amount: 0 }]);
        setSelectedIngredientId('');
    };

    const updateIngredientAmount = (itemId: string, amount: number) => {
        setRecipe(prev => prev.map(item => 
            item.itemId === itemId ? { ...item, amount } : item
        ));
    };

    const removeIngredient = (itemId: string) => {
        setRecipe(prev => prev.filter(item => item.itemId !== itemId));
    };

    const handleSaveDish = () => {
        if (!dishName) {
            alert("נא להזין שם מנה");
            return;
        }
        if (recipe.length === 0) {
            alert("נא להוסיף מרכיבים למנה");
            return;
        }
        if (sellingPrice <= 0) {
            alert("נא לקבוע מחיר מכירה");
            return;
        }

        const newDish: Dish = {
            id: Date.now().toString(),
            name: dishName,
            category,
            ingredients: recipe,
            laborTime,
            laborCost,
            sellingPrice,
            sales: 0 // New dish starts with 0 sales
        };

        addDish(newDish);
        
        // Success Feedback
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
        
        // Reset Form
        setDishName('');
        setRecipe([]);
        setSellingPrice(0);
        setLaborTime(15);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]"
        >
            {/* --- LEFT PANEL: BUILDER --- */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold text-white">הנדסת תפריט</h2>
                        <p className="text-slate-400 mt-1">בניית מנה וחישוב עלויות</p>
                    </div>
                    <button 
                        onClick={handleSaveDish}
                        disabled={savedMessage}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium shadow-lg transition-all ${
                            savedMessage 
                            ? 'bg-green-500 text-white cursor-default' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95'
                        }`}
                    >
                        {savedMessage ? <CheckCircleIcon /> : <Save className="w-5 h-5" />}
                        <span>{savedMessage ? 'נשמר בהצלחה!' : 'שמור מנה בתפריט'}</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {/* Basic Info Card */}
                    <Card title="פרטי המנה">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">שם המנה</label>
                                <input 
                                    type="text" 
                                    value={dishName}
                                    onChange={(e) => setDishName(e.target.value)}
                                    placeholder="לדוגמה: המבורגר קלאסי"
                                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">קטגוריה</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as Dish['category'])}
                                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="starters">ראשונות</option>
                                    <option value="mains">עיקריות</option>
                                    <option value="desserts">קינוחים</option>
                                    <option value="drinks">שתייה</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Ingredients Card */}
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-emerald-400" />
                                הרכב המנה (Food Cost)
                            </h4>
                        </div>
                        
                        {/* Add Ingredient Bar */}
                        <div className="flex gap-2 mb-6 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                            <select 
                                value={selectedIngredientId}
                                onChange={(e) => setSelectedIngredientId(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-sm focus:ring-emerald-500"
                            >
                                <option value="">בחר חומר גלם מהמלאי...</option>
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.unit}) - ₪{item.costPrice}
                                    </option>
                                ))}
                            </select>
                            <button 
                                onClick={addIngredient}
                                disabled={!selectedIngredientId}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Recipe List */}
                        <div className="space-y-3">
                            {recipe.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 bg-slate-900/20">
                                    <PieChart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    עדיין לא הוספו מרכיבים למנה
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {recipe.map((item) => {
                                        const invItem = inventory.find(i => i.id === item.itemId);
                                        if (!invItem) return null;
                                        const cost = item.amount * invItem.costPrice;
                                        
                                        return (
                                            <motion.div 
                                                key={item.itemId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex items-center gap-4 bg-slate-800 p-3 rounded-xl border border-slate-700/50 group hover:border-slate-600 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-200">{invItem.name}</div>
                                                    <div className="text-xs text-slate-500">מחיר יחידה: ₪{invItem.costPrice} / {invItem.unit}</div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.01"
                                                        value={item.amount || ''}
                                                        onChange={(e) => updateIngredientAmount(item.itemId, parseFloat(e.target.value))}
                                                        className="w-20 bg-transparent text-center text-white focus:outline-none font-mono"
                                                        placeholder="0"
                                                    />
                                                    <span className="text-slate-500 text-sm px-2 border-r border-slate-700">{invItem.unit}</span>
                                                </div>

                                                <div className="w-24 text-left">
                                                    <div className="text-sm text-emerald-400 font-mono font-bold">₪{cost.toFixed(2)}</div>
                                                </div>

                                                <button 
                                                    onClick={() => removeIngredient(item.itemId)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>
                        
                        {/* Total Food Cost Summary */}
                        {recipe.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end items-center gap-4">
                                <span className="text-slate-400">סה"כ עלות חומרי גלם:</span>
                                <span className="text-xl font-bold text-white font-mono">₪{totalFoodCost.toFixed(2)}</span>
                            </div>
                        )}
                    </Card>

                    {/* Labor Card */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <UsersIcon />
                                עלות עבודה (Labor Cost)
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">זמן הכנה (דקות)</label>
                                <input 
                                    type="number" 
                                    value={laborTime}
                                    onChange={(e) => setLaborTime(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">שכר שעתי (₪)</label>
                                <input 
                                    type="number" 
                                    value={hourlyWage}
                                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-left">
                            <span className="text-slate-500 text-sm ml-2">עלות משוערת:</span>
                            <span className="text-white font-mono font-bold">₪{laborCost.toFixed(2)}</span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* --- RIGHT PANEL: ANALYSIS --- */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card className="bg-slate-800 border-emerald-500/20 shadow-emerald-500/5 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-blue-500" />
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-emerald-400" />
                        ניתוח רווחיות
                    </h3>

                    <div className="flex-1 space-y-6">
                        {/* Cost Breakdown */}
                        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Food Cost</span>
                                <span className="text-white font-mono">₪{totalFoodCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Labor Cost</span>
                                <span className="text-white font-mono">₪{laborCost.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-slate-700 my-2" />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span className="text-slate-200">Prime Cost</span>
                                <span className="text-red-400 font-mono">₪{totalPrimeCost.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className="block text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                מחיר מכירה ללקוח (₪)
                            </label>
                            <input 
                                type="number" 
                                value={sellingPrice || ''}
                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-emerald-500/30 text-white text-3xl font-bold text-center rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                            />
                        </div>

                        {/* Profit Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl text-center border transition-colors ${profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                <div className="text-xs text-slate-400 mb-1">רווח גולמי (₪)</div>
                                <div className={`text-2xl font-black font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {profit >= 0 ? '+' : ''}₪{profit.toFixed(2)}
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl text-center border transition-colors ${marginPercent >= 15 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                <div className="text-xs text-slate-400 mb-1">אחוז רווח (%)</div>
                                <div className={`text-2xl font-black font-mono ${marginPercent >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>
                                    {marginPercent.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* FC % Meter */}
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Food Cost Actual</span>
                                <span className={`text-xl font-bold font-mono ${foodCostPercent > 35 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {foodCostPercent.toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${foodCostPercent > 35 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(foodCostPercent, 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                                <span>0%</span>
                                <span>יעד: {targetFC}%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Helper Tool */}
                    <div className="mt-auto pt-6 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                            <TrendingUp className="w-3 h-3" />
                            מחשבון עזר לקביעת מחיר
                        </div>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="15" 
                                max="50" 
                                value={targetFC} 
                                onChange={(e) => setTargetFC(Number(e.target.value))}
                                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-xs font-mono text-indigo-300 w-8">{targetFC}%</span>
                        </div>
                        <div className="mt-2 text-center bg-indigo-500/10 rounded-lg py-2 border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/20 transition-colors"
                             onClick={() => setSellingPrice(Math.ceil(recommendedPrice))}
                        >
                            <span className="text-xs text-indigo-300">מחיר מומלץ: </span>
                            <span className="font-bold text-indigo-400 font-mono">₪{recommendedPrice.toFixed(0)}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

// Simple Icon wrapper for cleanliness
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
)

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
)

export default MenuEngineering;