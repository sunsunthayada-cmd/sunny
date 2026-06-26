// --- ม็อกข้อมูลเริ่มต้น (Mock Data) ---
let products = [
    { id: 1, name: "ปากกา", price: 50, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSArgw7JOaL4cUZUw_ruC4lwlWLPuInKdjuaenCd8qOkA&s=10" },
    { id: 2, name: "สมุดบันทึก", price: 65, img: "https://api.chulabook.com/images/1630058890638.jpg" },
    { id: 3, name: "สีไม้", price: 95, img: "https://cdn.ennxo.com/uploads/products/640/62701169060c43edb6342d3030bbad63.jpg" },
    { id: 4, name: "กระเป๋าดินสอ", price: 160, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPA7QBcKT_xfyg6aidt2p6uHez8cMjCl_5OL-hp0Jj9iYBZSyVuiVu7Po&s=10" } ,
    { id: 5, name: "เมจิก", price: 95, img: "https://image.makewebcdn.com/makeweb/m_1920x0/cR3tP63kr/Product01/12_%E0%B8%9B%E0%B8%B2%E0%B8%81%E0%B8%81%E0%B8%B2%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B9%80%E0%B8%81%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%A1%E0%B8%88%E0%B8%B4_%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B9%89%E0%B8%B2_H_110_%E0%B8%8A%E0%B8%B8%E0%B8%9412_%E0%B8%AA%E0%B8%B5.jpg" }
];

let staffMembers = [
    { id: 1, name: "เด็กหญิงณัชชา", role: "ผู้จัดการร้าน" },
    { id: 2, name: "นายเฟียสคุง ตั้งใจทำงาน", role: "พนักงานแคชเชียร์" }
];

let cart = [];
let orders = [];

// --- การควบคุมระบบสลับหน้า (SPA Navigation) ---
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page-section');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-target');

        // ตรวจสอบความปลอดภัยระบบหลังบ้าน
        if (targetPage === 'admin-page' && !sessionStorage.getItem('isAdminLoggedIn')) {
            alert('กรุณาเข้าสู่ระบบก่อนใช้งานระบบหลังบ้าน');
            switchPage('login-page');
            return;
        }

        switchPage(targetPage);
        
        // ปิดเมนูแฮมเบอร์เกอร์บนมือถืออัตโนมัติหลังกดลิงก์
        navMenu.classList.remove('open');
    });
});

function switchPage(pageId) {
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // อัปเดต Active Link สถานะปัจจุบัน
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// แฮมเบอร์เกอร์ทอกเกิลบน Mobile
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});


// --- ระบบจัดการหน้ากิ๊ฟช็อป / ตะกร้าสินค้า ---
function renderProducts() {
    const displayArea = document.getElementById('products-display');
    if (!displayArea) return;
    
    displayArea.innerHTML = '';
    products.forEach(product => {
        displayArea.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} บาท</p>
                <button class="btn" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-plus"></i> ลงตะกร้า</button>
            </div>
        `;
    });
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        itemInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
};

function updateCartUI() {
    const cartItemsWrapper = document.getElementById('cart-items');
    const cartTotalText = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsWrapper.innerHTML = '<p class="empty-cart">ไม่มีสินค้าในตะกร้า</p>';
        cartTotalText.innerText = '0';
        return;
    }

    cartItemsWrapper.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItemsWrapper.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>${item.price * item.quantity} บ.</span>
            </div>
        `;
    });
    
    cartTotalText.innerText = total;
}

// กดปุ่มสั่งซื้อจากตะกร้า
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('กรุณาเลือกสินค้าลงตะกร้าก่อนสั่งซื้อ');
        return;
    }
    
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('th-TH'),
        total: totalAmount,
        status: 'รอยืนยันการชำระเงิน'
    };
    
    orders.push(newOrder);
    cart = []; // เคลียร์ตะกร้า
    updateCartUI();
    renderOrders();
    
    alert(`สั่งซื้อสำเร็จ! เลขที่ออเดอร์ของคุณคือ: ${orderId} \nกรุณาไปที่เมนูแจ้งชำระเงิน`);
    switchPage('order-page');
});

// แสดงออเดอร์ของลูกค้า
function renderOrders() {
    const listTable = document.getElementById('order-history-list');
    if(orders.length === 0) {
        listTable.innerHTML = `<tr><td colspan="4" style="text-align:center;">ยังไม่มีประวัติการสั่งซื้อ</td></tr>`;
        return;
    }
    
    listTable.innerHTML = '';
    orders.forEach(order => {
        listTable.innerHTML += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.date}</td>
                <td>${order.total} บาท</td>
                <td><span style="color: #E6A23C; font-weight:500;">${order.status}</span></td>
            </tr>
        `;
    });
}

// ยื่นเอกสารฟอร์มยืนยันชำระเงิน
document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const orderIdInput = document.getElementById('pay-order-id').value.trim();
    
    const targetOrder = orders.find(o => o.id === orderIdInput);
    if(targetOrder) {
        targetOrder.status = 'ตรวจสอบแล้ว ชำระเงินเรียบร้อย';
        alert('ระบบได้รับข้อมูลการแจ้งโอนเงินแล้ว ขอบคุณค่ะ');
        renderOrders();
        document.getElementById('payment-form').reset();
        switchPage('order-page');
    } else {
        alert('ไม่พบเลขที่ออเดอร์นี้ในระบบ กรุณาตรวจสอบอีกครั้ง');
    }
});


// --- ระบบล็อกอินหลังบ้านและระบบแผงควบคุมแอดมิน ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if (user === 'admin' && pass === '1234') {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        alert('เข้าสู่ระบบผู้ดูแลเรียบร้อย');
        document.getElementById('login-form').reset();
        switchPage('admin-page');
        renderAdminDashboard();
    } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    alert('ออกจากระบบหลังบ้านแล้ว');
    switchPage('home-page');
});

// การจัดการแท็บย่อยใน Admin (สต็อก vs พนักงาน)
const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminTabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

function renderAdminDashboard() {
    renderStockTable();
    renderStaffTable();
}

// [ฟังก์ชันหลังบ้าน] : แสดงและลบสต็อกสินค้า
function renderStockTable() {
    const container = document.getElementById('admin-stock-list');
    container.innerHTML = '';
    products.forEach(product => {
        container.innerHTML += `
            <tr>
                <td><img src="${product.img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>${product.name}</td>
                <td>${product.price} บาท</td>
                <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash"></i> ลบ</button></td>
            </tr>
        `;
    });
}

// [ฟังก์ชันหลังบ้าน] : เพิ่มสินค้าใหม่ในสต็อก
document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const price = parseInt(document.getElementById('prod-price').value);
    let img = document.getElementById('prod-img').value.trim();
    
    if(!img) {
        img = `https://picsum.photos/250/200?random=${Math.floor(Math.random() * 100)}`;
    }
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, price, img });
    
    renderStockTable();
    renderProducts(); // อัปเดตหน้าแรกผู้ใช้ด้วย
    document.getElementById('add-product-form').reset();
    alert('เพิ่มสินค้าชิ้นใหม่ลงสโตร์สำเร็จ');
});

window.deleteProduct = function(id) {
    if(confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้าชิ้นนี้ออกจากคลังสต็อก?')) {
        products = products.filter(p => p.id !== id);
        renderStockTable();
        renderProducts();
    }
};

// [ฟังก์ชันหลังบ้าน] : แสดงพนักงาน
function renderStaffTable() {
    const container = document.getElementById('admin-staff-list');
    container.innerHTML = '';
    staffMembers.forEach(staff => {
        container.innerHTML += `
            <tr>
                <td>${staff.name}</td>
                <td>${staff.role}</td>
                <td><button class="btn btn-danger" onclick="deleteStaff(${staff.id})"><i class="fa-solid fa-user-xmark"></i> ลบพนักงาน</button></td>
            </tr>
        `;
    });
}

// [ฟังก์ชันหลังบ้าน] : เพิ่มรายชื่อพนักงาน
document.getElementById('add-staff-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('staff-name').value;
    const role = document.getElementById('staff-role').value;
    
    const newId = staffMembers.length > 0 ? Math.max(...staffMembers.map(s => s.id)) + 1 : 1;
    staffMembers.push({ id: newId, name, role });
    
    renderStaffTable();
    document.getElementById('add-staff-form').reset();
    alert('เพิ่มพนักงานคนใหม่เรียบร้อย');
});

window.deleteStaff = function(id) {
    if(confirm('ต้องการถอนสิทธิ์หรือลบพนักงานคนนี้ใช่ไหม?')) {
        staffMembers = staffMembers.filter(s => s.id !== id);
        renderStaffTable();
    }
};


// --- ดำเนินการเมื่อโหลดหน้าเว็บครั้งแรก ---
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderOrders();
});
