import React, { useState } from 'react';
import { User, Shield, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { EMPLOYEE_DATA } from '../../data/mockData';
import { motion } from 'framer-motion';

const Team: React.FC = () => {
    const [employees, setEmployees] = useState(EMPLOYEE_DATA);

    const togglePermission = (id: string, perm: keyof typeof EMPLOYEE_DATA[0]['permissions']) => {
        setEmployees(employees.map(emp => {
            if (emp.id === id) {
                return {
                    ...emp,
                    permissions: {
                        ...emp.permissions,
                        [perm]: !emp.permissions[perm]
                    }
                };
            }
            return emp;
        }));
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">ניהול צוות</h2>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors">
                    + עובד חדש
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {employees.map((employee) => (
                    <Card key={employee.id} className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center relative">
                                <User className="w-6 h-6 text-slate-300" />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                                    employee.status === 'active' ? 'bg-emerald-500' : 
                                    employee.status === 'break' ? 'bg-amber-500' : 'bg-slate-500'
                                }`}></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{employee.name}</h3>
                                <span className="px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-300">
                                    {employee.role === 'admin' ? 'מנהל' : 
                                     employee.role === 'chef' ? 'שף ראשי' : 
                                     employee.role === 'shift_manager' ? 'אחמ״ש' : 'מלצר'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-8 flex-1 w-full md:w-auto justify-between md:justify-center border-t md:border-t-0 md:border-r border-slate-700 pt-4 md:pt-0 md:pr-6">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-slate-500">צפייה בעלויות</span>
                                <button 
                                    onClick={() => togglePermission(employee.id, 'viewCosts')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${employee.permissions.viewCosts ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${employee.permissions.viewCosts ? 'left-1' : 'left-7'}`} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-slate-500">עריכת תפריט</span>
                                <button 
                                    onClick={() => togglePermission(employee.id, 'editMenu')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${employee.permissions.editMenu ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${employee.permissions.editMenu ? 'left-1' : 'left-7'}`} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-slate-500">ניהול צוות</span>
                                <button 
                                    onClick={() => togglePermission(employee.id, 'manageTeam')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${employee.permissions.manageTeam ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${employee.permissions.manageTeam ? 'left-1' : 'left-7'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <Edit className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

export default Team;