const CATEGORY_TEMPLATES = {
    'Keyboard': ['Brand', 'Switch Name', 'Connectivity', 'Localization', 'Materiel', 'Dimensions', 'Weight', 'Type', 'Lighting', 'Color', 'WIRED/WIRELESS', 'USB Port', 'Wireless Frequency', 'Battery Type and Quantity', 'Warranty'],
    'CPU': ['Brand', 'Socket', 'Cores', 'Threads'],
    'Monitor': ['Brand', 'Display Size (in.)', 'Panel Size (in.)', 'Resolution', 'Resolution Type', 'Display color', 'Brightness', 'Display color', 'Contrast ratio', 'Response Time', 'Aspect Ratio', 'Refresh Rate', 'Aspect Ratio', 'Refresh Rate', 'Screen Curvature', 'Pixel Pitch (H x V)', 'Viewing Angle (CR≧10)', 'Display Surface', 'Flicker free', 'Low Blue Light', 'Connectivity', 'Optimum Resolution', 'Power Consumption', 'Dimension (W x H x D)', 'Weight (Esti.)', 'Color', 'HDR Support', 'Adaptive Sync', 'Accessory in box', 'Mechanical', 'Color Gamuts', 'Built-in Speaker', 'Warranty'],
    'Notebook': ['Brand', 'CPU', 'GPU', 'RAM', 'Storage', 'Screen Size'],
    'Gaming Mouse': ['Brand', 'Scroll Whell', 'Macro Keys', 'Interface', 'Number of buttons', 'Sensor Resolution', 'Dimensions', 'Color', 'Battery Life ', 'Battery Type', 'Sensor technology', 'Wireless technology', 'Click life span', 'Sensor technology', 'Warranty'],
    'Graphics Card': ['Brand', 'Series', 'GPU Chipset', 'Video Memory (VRAM)', 'Memory Type', 'Core Clock', 'Memory Clock', 'Interface', 'Max Resolution', 'DirectX Support', 'Ports (HDMI/DP)', 'Power Connector', 'Recommended PSU', 'Dimensions', 'Warranty'],
    'RAM': ['Brand', 'Series', 'Model', 'Capacity', 'Memory Type (DDR)', 'Speed (MHz)', 'Latency (CAS)', 'Voltage', 'Color', 'RGB Lighting', 'Warranty'],
    'Mainboard': ['Brand', 'Series', 'Socket', 'Chipset', 'Form Factor', 'Memory Slots', 'Max Memory Support', 'Memory Channel', 'Storage (SATA/M.2)', 'Expansion Slots', 'Rear I/O Ports', 'Onboard Audio', 'Onboard LAN/WiFi', 'Warranty']
}; 

/**
 * 🛠️ SpecFields Component
 * แสดงผลช่องกรอกคุณสมบัติสินค้าตามหมวดหมู่ที่เลือก
 * 💡 แก้ไขบั๊ก Focus Jumping โดยการใช้ uniqueId ผสมชื่อ Category
 */
const SpecFields = ({ category, specifications, onSpecChange }) => {
    const fields = CATEGORY_TEMPLATES[category] || [];                 
  
    return (
        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-inner">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                รายละเอียดคุณสมบัติสินค้า ({category})
            </h4>
            
            <div className="space-y-3">
                {fields.map((key) => {
                    // 🌟 1. สร้าง Unique ID: ป้องกันเบราว์เซอร์สับสนเมื่อสลับหมวดหมู่
                    // เช่น "Keyboard-Brand" จะแยกขาดจาก "CPU-Brand"
                    const uniqueId = `${category}-${key}`.replace(/\s+/g, '-');

                    return (
                        <div key={uniqueId} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-50 pb-2 last:border-none">
                            {/* 🌟 2. ใช้ <label> พร้อม htmlFor: ช่วยเรื่อง Accessibility และแก้บั๊กจิ้มไม่ติด */}
                            <label 
                                htmlFor={uniqueId}
                                className="w-full sm:w-40 text-xs font-bold text-gray-600 mb-1 sm:mb-0 cursor-pointer"
                            >
                                {key}
                            </label>
                            
                            <input 
                                id={uniqueId} // 🌟 3. ผูก id ให้ตรงกับ label
                                type="text" 
                                placeholder={`กรอกข้อมูล ${key}`} 
                                value={specifications[key] || ''} 
                                onChange={(e) => onSpecChange(key, e.target.value)}
                                required={key === 'Brand'} 
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-500"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpecFields;
