const mongoose = require('mongoose');

/**
 * 🛒 Order Model Blueprint
 * สำหรับจัดการข้อมูลการสั่งซื้อ
 */
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  amount: { type: Number, required: true }, // ยอดรวมสุทธิ (Total)
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
