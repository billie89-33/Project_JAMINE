const CATEGORY_TEMPLATES = {
    'Keyboard': ['Brand', 'Switch', 'Layout', 'Connectivity'],
    'CPU': ['Brand', 'Socket', 'Cores', 'Threads'],
    'Monitor': ['Brand', 'Resolution', 'Refresh Rate', 'Screen Size', 'Panel Type', 'Response Time'],
    'Notebook': ['Brand', 'CPU', 'GPU', 'RAM', 'Storage', 'Screen Size'],
    'Gaming Mouse': ['Brand', 'DPI', 'Sensor', 'Weight', 'Connectivity']
};

const SpecFields = ({ category, specifications, onSpecChange }) => {
    const fields = CATEGORY_TEMPLATES[category] || [];

    return (
        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-inner">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                รายละเอียดคุณสมบัติสินค้า ({category})
            </h4>
            
            <div className="space-y-3">
                {fields.map((key) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-50 pb-2 last:border-none">
                        <span className="w-full sm:w-40 text-xs font-bold text-gray-600 mb-1 sm:mb-0">{key}</span>
                        <input 
                            type="text" 
                            placeholder={`กรอกข้อมูล ${key}`} 
                            value={specifications[key] || ''} 
                            onChange={(e) => onSpecChange(key, e.target.value)}
                            required={key === 'Brand'} // บังคับกรอกแบรนด์เพราะระบบใช้เก็บข้อมูลหลักหลังบ้าน
                            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecFields;