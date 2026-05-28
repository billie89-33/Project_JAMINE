import { useState } from 'react';

export const useDashboard = () => {
    const [stats] = useState({
        orders: { value: '5,312', trend: '-2.29%', color: 'text-red-400' },
        profit: { value: '$8,312', trend: '+2.29%', color: 'text-green-400' },
        customers: { value: '$15,312', trend: '+5.16%', color: 'text-green-400' },
        balance: { value: '$35.64k', trend: '', color: '' }
    });

    const [salesByCategory] = useState([
        { name: 'Notebook', value: '$1200.42', color: 'bg-blue-500' },
        { name: 'Computer Hardware', value: '$353.42', color: 'bg-orange-400' },
        { name: 'Monitor', value: '$413.31', color: 'bg-pink-500' },
        { name: 'Keyboard', value: '$235.72', color: 'bg-cyan-400' },
        { name: 'Mouse', value: '$125.00', color: 'bg-purple-500' }
    ]);

    return {
        stats,
        salesByCategory
    };
};
