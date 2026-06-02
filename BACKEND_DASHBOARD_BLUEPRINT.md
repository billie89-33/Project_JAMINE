# 🚀 Backend API Blueprint for Jamine Admin Dashboard

เอกสารชุดนี้รวบรวมโครงสร้าง API, Models และ Controllers ที่จำเป็นสำหรับหน้า Admin Dashboard เพื่อให้ทีม Backend นำไปสร้าง Endpoints ให้ตรงกับที่ Frontend ออกแบบไว้ครับ

---

## 🛠️ ข้อมูลทางเทคนิค (Technical Info)
- **Base URL:** `/api/v1/admin/dashboard`
- **Response Format:** ทุก API ต้องส่งกลับในรูปแบบ JSON มาตรฐาน:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Authentication:** ระบบหน้าบ้านใช้ **HttpOnly Cookies** (ฝั่ง Backend ต้องตั้งค่า CORS ให้รองรับ `credentials: true`)

---

## 1. Mongoose Models (โครงสร้างข้อมูล)

### 🛒 Order Model (`models/Order.js`)
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  amount: { type: Number, required: true }, 
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
```

### 📦 Product Model (`models/Product.js`)
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sold: { type: Number, default: 0 }, 
  image: { type: String, required: true }, 
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
```

---

## 2. Controller Logic (`controllers/dashboardController.js`)

```javascript
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

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

// [GET] /summary
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
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [GET] /revenue-chart
exports.getRevenueChart = async (req, res) => {
  try {
    const { period } = req.query;
    const dateRange = getDateRange(period);
    const revenueData = await Order.aggregate([
      { $match: { date: dateRange, status: { $ne: 'Cancelled' } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, revenue: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: 1, _id: 0 } }
    ]);
    res.status(200).json({ success: true, data: revenueData });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [GET] /category-sales
exports.getCategorySales = async (req, res) => {
  try {
    const { period } = req.query;
    const dateRange = getDateRange(period);
    const sales = await Order.aggregate([
      { $match: { date: dateRange, status: { $ne: 'Cancelled' } } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'p' } },
      { $unwind: "$p" },
      { $group: { _id: "$p.category", sales: { $sum: "$items.quantity" } } },
      { $project: { category: "$_id", sales: 1, _id: 0 } }
    ]);
    const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-400', 'bg-cyan-400', 'bg-rose-400'];
    const data = sales.map((s, i) => ({ ...s, color: colors[i % colors.length] }));
    res.status(200).json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [GET] /recent-orders
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find().sort({ date: -1 }).limit(limit);
    res.status(200).json({ success: true, data: orders });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// [GET] /top-products
exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const products = await Product.find().sort({ sold: -1 }).limit(limit);
    res.status(200).json({ success: true, data: products });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
```

---

## 3. Routes (`routes/adminDashboardRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/summary', controller.getDashboardSummary);
router.get('/revenue-chart', controller.getRevenueChart);
router.get('/category-sales', controller.getCategorySales);
router.get('/recent-orders', controller.getRecentOrders);
router.get('/top-products', controller.getTopProducts);

module.exports = router;
```

---
*Generated by Gemini CLI*
