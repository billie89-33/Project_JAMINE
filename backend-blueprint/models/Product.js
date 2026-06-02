const mongoose = require('mongoose');

/**
 * 📦 Product Model Blueprint
 * สำหรับจัดการข้อมูลสินค้า
 */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sold: { type: Number, default: 0 }, // จำนวนที่ขายได้ (ใช้สำหรับ Top Selling)
  image: { type: String, required: true }, // URL รูปภาพ
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
