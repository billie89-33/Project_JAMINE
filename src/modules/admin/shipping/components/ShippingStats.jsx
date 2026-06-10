import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const ShippingStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
                title="ที่ต้องจัดส่ง" 
                value={stats?.toShip || 0} 
                icon={Clock} 
                colorClass="bg-amber-50 text-amber-600"
            />
            <StatCard 
                title="กำลังดำเนินการ" 
                value={stats?.toProcess || 0} 
                icon={Package} 
                colorClass="bg-blue-50 text-blue-600"
            />
            <StatCard 
                title="ระหว่างขนส่ง" 
                value={stats?.inTransit || 0} 
                icon={Truck} 
                colorClass="bg-purple-50 text-purple-600"
            />
            <StatCard 
                title="ส่งสำเร็จวันนี้" 
                value={stats?.completed || 0} 
                icon={CheckCircle} 
                colorClass="bg-emerald-50 text-emerald-600"
            />
        </div>
    );
};

export default ShippingStats;
