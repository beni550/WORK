import React from 'react';
import { LayoutDashboard, ShoppingCart, Utensils, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
        { id: 'inventory', label: 'מלאי ורכש', icon: ShoppingCart },
        { id: 'menu', label: 'הנדסת תפריט', icon: Utensils },
        { id: 'reports', label: 'דוחות', icon: BarChart3 },
        { id: 'team', label: 'צוות', icon: Users },
    ];

    return (
        <aside className="fixed top-0 right-0 h-full w-64 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Utensils className="text-white w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white">Resto<span className="text-emerald-500">Pro</span></h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id as ViewState)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
                            <span>{item.label}</span>
                            {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                    <Settings className="w-5 h-5" />
                    <span>הגדרות</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all mt-1">
                    <LogOut className="w-5 h-5" />
                    <span>התנתק</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;