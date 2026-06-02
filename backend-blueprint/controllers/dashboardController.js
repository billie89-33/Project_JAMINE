const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * 📊 Admin Dashboard Controller
 * รวม Logic การคำนวณสถิติทั้งหมดสำหรับหน้า Dashboard
 */

// ฟังก์ชันช่วยคำนวณช่วงเวลา (Helper)
const getDateRange = (period) => {
  const now = new Date();
  let start = new Date();
  
  switch(period) {
    case 'today': start.setHours(0,0,0,0); break;
    case 'week': start.setDate(now.getDate() - 7); break;
    case 'month': start.setMonth(now.getMonth() - 1); break;
    case 'year': start.setFullYear(now.getFullYear() - 1); break;
    default: start.setDate(now.getDate() - 7);
  }
  return { $gte: start, $lte: now };
};

// 1. ดึงภาพรวมสถิติ (Balance, Orders, Customers)
exports.getDashboardSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const dateRange = getDateRange(period);

    const balance = await Order.aggregate([
      { $match: { date: dateRange, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const summary = {
      balance: { value: balance[0]?.total || 0, trend: '+15%' },
      orders: { value: await Order.countDocuments({ date: dateRange }), trend: '+5%' },
      customers: { value: await User.countDocuments({ createdAt: dateRange }), trend: '+2%' }
    };

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ดึงข้อมูลกราฟรายได้ (Revenue Trend)
exports.getRevenueChart = async (req, res) => {
  try {
    const { period } = req.query;
    const dateRange = getDateRange(period);

    const revenueData = await Order.aggregate([
      { $match: { date: dateRange, status: { $ne: 'Cancelled' } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
          revenue: { $sum: '$amount' } 
        } 
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: 1, _id: 0 } }
    ]);

    res.status(200).json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. ดึงสัดส่วนยอดขายตามหมวดหมู่ (Category Sales)
exports.getCategorySales = async (req, res) => {
  try {
    const { period } = req.query;
    const dateRange = getDateRange(period);

    const categorySales = await Order.aggregate([
      { $match: { date: dateRange, status: { $ne: 'Cancelled' } } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'p' } },
      { $unwind: "$p" },
      { $group: { _id: "$p.category", sales: { $sum: "$items.quantity" } } },
      { $project: { category: "$_id", sales: 1, _id: 0 } }
    ]);

    const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-400', 'bg-cyan-400', 'bg-rose-400'];
    const formattedData = categorySales.map((item, index) => ({
        ...item,
        color: colors[index % colors.length]
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. ดึงรายการออเดอร์ล่าสุด
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find().sort({ date: -1 }).limit(limit);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. ดึงสินค้าขายดี
exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const products = await Product.find().sort({ sold: -1 }).limit(limit);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
