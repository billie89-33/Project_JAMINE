src/
├── api/                # จัดการการเชื่อมต่อ Backend (Axios Config)
├── components/         # ส่วนประกอบที่ใช้ซ้ำ (Buttons, Modals, Navbar)
│   └── forms/          # เช่น KeyboardSpecs.jsx, CPUSpecs.jsx
├── context/            # ระบบ Auth เช็คสิทธิ์ User/GM (ใช้ useAuth)
├── layouts/            # "กรอบ" ของแต่ละส่วน (ใช้ <Outlet /> ข้างใน)
│   ├── MainLayout.jsx  # Layout สำหรับลูกค้า (Navbar/Footer)
│   └── AdminLayout.jsx # Layout สำหรับ GM (Sidebar)
├── pages/              # ไฟล์เนื้อหาของแต่ละหน้า (เน้นความสะอาด)
│   ├── common/         # Login, Register, Home
│   ├── user/           # Cart, Checkout, Profile
│   └── admin/          # Dashboard, AddProduct, ManageOrders
├── routes/             # !!! ศูนย์บัญชาการ (ไฟล์ที่คุณส่งรูปมา) !!!
│   ├── index.jsx       # รวมเส้นทางทั้งหมด (createBrowserRouter)
│   └── ProtectedRoute.jsx # ยามเฝ้าประตูเช็ค Role
├── App.jsx             # รวม Provider (Auth, Theme)
└── main.jsx            # จุดเริ่มต้นโปรเจกต์ (Render router)