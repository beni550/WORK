import React from 'react';
import { TrendingUp, DollarSign, PieChart, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Card, StatCard } from '../ui/Card';
import { SALES_CHART_DATA, ALERTS_DATA } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const { dishes } = useAppContext();

    const pieData = [
        { name: 'עיקריות', value: 45, color: '#10b981' }, // emerald-500
        { name: 'ראשונות', value: 25, color: '#3b82f6' }, // blue-500
        { name: 'שתייה', value: 20, color: '#f59e0b' },   // amber-500
        { name: 'קינוחים', value: 10, color: '#ec4899' },  // pink-500
    ];

    // Calculate total revenue from dishes (simple mock calculation based on sales)
    const totalRevenue = dishes.reduce((acc, dish) => acc + (dish.sellingPrice * (dish.sales || 0)), 0);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">לוח בקרה</h2>
                    <p className="text-slate-400 mt-1">סקירה כללית לפעילות היום</p>
                </div>
                <div className="text-left">
                    <div className="text-sm text-slate-400">עדכון אחרון</div>
                    <div className="font-mono text-emerald-400">14:32:05</div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="הכנסות (משוער)" 
                    value={`₪${totalRevenue.toLocaleString()}`}
                    trend="+12.5%" 
                    trendUp={true} 
                    icon={DollarSign} 
                    color="emerald"
                />
                <StatCard 
                    title="רווח נקי" 
                    value="₪3,850" 
                    trend="+8.2%" 
                    trendUp={true} 
                    icon={TrendingUp} 
                    color="blue"
                />
                <StatCard 
                    title="עלות מזון (FC)" 
                    value="28.4%" 
                    trend="-1.2%" 
                    trendUp={true} 
                    icon={PieChart} 
                    color="amber"
                />
                <StatCard 
                    title="עלות עבודה (LC)" 
                    value="32.1%" 
                    trend="+2.4%" 
                    trendUp={false} 
                    icon={Users} 
                    color="purple"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 min-h-[400px]" title="הכנסות מול הוצאות" subtitle="7 ימים אחרונים">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SALES_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={(value) => `₪${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f1f5f9' }}
                                />
                                <Area type="monotone" dataKey="revenue" name="הכנסות" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                <Area type="monotone" dataKey="cost" name="הוצאות" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Sales Mix Pie */}
                <Card title="התפלגות מכירות" subtitle="לפי מחלקות">
                    <div className="h-[220px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                     itemStyle={{ color: '#fff' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">45%</span>
                            <span className="text-xs text-slate-400">עיקריות</span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-slate-300">{item.name}</span>
                                <span className="mr-auto text-sm font-bold text-slate-100">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Activity Feed */}
                <Card title="עדכונים והתראות" className="lg:col-span-1 h-full">
                    <div className="space-y-4">
                        {ALERTS_DATA.map((alert) => (
                            <div key={alert.id} className="flex gap-4 p-3 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 transition-colors cursor-pointer border-r-2 border-transparent hover:border-emerald-500">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    alert.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                    alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                    'bg-blue-500/10 text-blue-500'
                                }`}>
                                    {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                                     alert.type === 'success' ? <TrendingUp className="w-5 h-5" /> : 
                                     <Package className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{alert.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Best Sellers */}
                <Card title="מנות מובילות" className="lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-700">
                                    <th className="pb-3 font-normal">שם המנה</th>
                                    <th className="pb-3 font-normal">קטגוריה</th>
                                    <th className="pb-3 font-normal">מחיר מכירה</th>
                                    <th className="pb-3 font-normal">עלות מזון</th>
                                    <th className="pb-3 font-normal">נמכרו השבוע</th>
                                    <th className="pb-3 font-normal">מגמה</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {dishes.slice(0, 3).map((item) => {
                                    // Calculate food cost (sum of ingredient costs)
                                    // Note: This requires access to inventory which is also in context, 
                                    // but for simplicity in this view we might skip detailed calculation 
                                    // or assume a fixed % if we don't want to drag in all inventory data here.
                                    // For now, let's just use the item.laborCost as a placeholder for cost logic
                                    // since we redefined Dish type. Real app would lookup ingredients.
                                    const estimatedFoodCost = item.laborCost * 3; // Mock approx
                                    const fcPercent = Math.round((estimatedFoodCost / item.sellingPrice) * 100);

                                    return (
                                    <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors group">
                                        <td className="py-4 font-medium text-white">{item.name}</td>
                                        <td className="py-4 text-slate-400">
                                            <span className="px-2 py-1 rounded-full bg-slate-700 text-xs">{item.category}</span>
                                        </td>
                                        <td className="py-4 text-slate-300">₪{item.sellingPrice}</td>
                                        <td className="py-4 text-slate-300">
                                            {fcPercent}%
                                        </td>
                                        <td className="py-4 text-white font-bold">{item.sales}</td>
                                        <td className="py-4">
                                            {(item.sales || 0) > 100 ? (
                                                <div className="flex items-center text-emerald-500 text-xs font-bold gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded">
                                                    <ArrowUpRight className="w-3 h-3" />
                                                    פופולרי
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-slate-500 text-xs gap-1">
                                                    <ArrowDownRight className="w-3 h-3" />
                                                    יציב
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </motion.div>
    );
};

export default Dashboard;