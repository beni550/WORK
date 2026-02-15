import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, action }) => {
    return (
        <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export const StatCard: React.FC<{
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ElementType;
    color?: string;
}> = ({ title, value, trend, trendUp, icon: Icon, color = 'emerald' }) => {
    return (
        <Card className="relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500 transition-all duration-300 group-hover:w-1.5`} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <h4 className="text-2xl font-bold text-white">{value}</h4>
                </div>
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                        {trend}
                    </span>
                    <span className="text-xs text-slate-500">מהתקופה הקודמת</span>
                </div>
            )}
        </Card>
    );
};