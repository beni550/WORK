import React, { useState } from 'react';
import { BarChart3, Download, Calendar, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: '1/10', sales: 4000, profit: 2400 },
  { name: '2/10', sales: 3000, profit: 1398 },
  { name: '3/10', sales: 9800, profit: 6800 },
  { name: '4/10', sales: 3908, profit: 2780 },
  { name: '5/10', sales: 4800, profit: 1890 },
  { name: '6/10', sales: 3800, profit: 2390 },
  { name: '7/10', sales: 4300, profit: 3490 },
];

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState('weekly');

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">דוחות וניתוחים</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
                        <FileText className="w-4 h-4" />
                        Excel
                    </button>
                </div>
            </div>

            <Card>
                <div className="flex gap-4 border-b border-slate-700 pb-4 mb-6">
                    {['daily', 'weekly', 'monthly', 'quarterly'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab 
                                ? 'bg-emerald-500 text-white' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {tab === 'daily' && 'יומי'}
                            {tab === 'weekly' && 'שבועי'}
                            {tab === 'monthly' && 'חודשי'}
                            {tab === 'quarterly' && 'רבעוני'}
                        </button>
                    ))}
                    <div className="mr-auto flex items-center gap-2 text-slate-400 text-sm bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                        <Calendar className="w-4 h-4" />
                        <span>01/10/2023 - 07/10/2023</span>
                    </div>
                </div>

                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                cursor={{fill: '#334155', opacity: 0.2}}
                            />
                            <Legend />
                            <Bar dataKey="sales" name="מכירות" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" name="רווח" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="בזבוז ופחת">
                    <div className="flex items-center justify-center h-[200px] text-slate-500 flex-col gap-2">
                        <BarChart3 className="w-10 h-10 opacity-20" />
                        <p>אין נתונים לתקופה זו</p>
                    </div>
                </Card>
                <Card title="ביצועי עובדים">
                    <div className="space-y-4">
                        {[
                            { name: 'דני לוי', sales: 12400, hours: 45 },
                            { name: 'נועה שחר', sales: 9800, hours: 38 },
                            { name: 'רוני כהן', sales: 8500, hours: 32 },
                        ].map((emp, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">{emp.name[0]}</div>
                                    <span className="text-slate-200">{emp.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-emerald-400">₪{emp.sales}</div>
                                    <div className="text-xs text-slate-500">{emp.hours} שעות</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Reports;