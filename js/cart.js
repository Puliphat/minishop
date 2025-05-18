// --- ตัวแปรหลัก ---
let products = [];
let cart = {};

// --- การดึงข้อมูลและเริ่มต้นระบบ ---
const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    updateCartPage();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า:', error);
  }
};

// --- การจัดการข้อมูลตะกร้าสินค้า ---
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
};

const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// --- การอัพเดทหน้าตะกร้าสินค้า ---
const updateCartPage = () => {
  const cartItemsList = document.getElementById("cartItemsList");
  let totalPrice = 0;
  
  cartItemsList.innerHTML = '';
  
  // กรณีไม่มีสินค้าในตะกร้า
  if (Object.keys(cart).length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 6;
    emptyCell.textContent = 'ไม่มีสินค้าในตะกร้า';
    emptyCell.style.textAlign = 'center';
    emptyCell.style.padding = '30px';
    emptyRow.appendChild(emptyCell);
    cartItemsList.appendChild(emptyRow);
    document.getElementById('cartTotalAmount').textContent = '$0';
    return;
  }
  
  // วนลูปสร้างรายการสินค้าในตะกร้า
  for (const key of Object.keys(cart)) {
    const item = products.find((product) => product.id == key);
    
    if (item && cart[key] > 0) {
      const quantity = cart[key];
      const price = Math.round(item.price);
      const itemTotal = quantity * price;
      
      const row = document.createElement('tr');
      
      // สร้างแต่ละส่วนของรายการสินค้า
      const imgCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      imgCell.appendChild(img);
      
      const nameCell = document.createElement('td');
      nameCell.textContent = item.title;
      
      const priceCell = document.createElement('td');
      priceCell.textContent = '$' + price;
      
      // จำนวนสินค้า
      const quantityCell = document.createElement('td');
      const quantityControl = document.createElement('div');
      quantityControl.className = 'quantityControl';
      
      const decreaseBtn = document.createElement('button');
      decreaseBtn.textContent = '-';
      decreaseBtn.addEventListener('click', () => {
        if (cart[item.id] > 1) {
          cart[item.id]--;
          showNotification(`ลดจำนวน ${item.title} เหลือ ${cart[item.id]} ชิ้น`);
          updateCartPage();
          saveCartToLocalStorage();
        }
      });
      
      const quantitySpan = document.createElement('span');
      quantitySpan.className = 'quantity';
      quantitySpan.textContent = quantity;
      
      const increaseBtn = document.createElement('button');
      increaseBtn.textContent = '+';
      increaseBtn.addEventListener('click', () => {
        cart[item.id]++;
        showNotification(`เพิ่มจำนวน ${item.title} เป็น ${cart[item.id]} ชิ้น`);
        updateCartPage();
        saveCartToLocalStorage();
      });
      
      quantityControl.append(decreaseBtn, quantitySpan, increaseBtn);
      quantityCell.appendChild(quantityControl);
      
      const totalCell = document.createElement('td');
      totalCell.textContent = '$' + itemTotal;
      
      // ปุ่มลบสินค้า
      const removeCell = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.className = 'removeItem';
      removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      removeBtn.addEventListener('click', () => {
        showNotification(`ลบ ${item.title} ออกจากตะกร้าแล้ว`);
        delete cart[item.id];
        updateCartPage();
        saveCartToLocalStorage();
      });
      removeCell.appendChild(removeBtn);
      
      row.append(imgCell, nameCell, priceCell, quantityCell, totalCell, removeCell);
      cartItemsList.appendChild(row);
      
      totalPrice += itemTotal;
    }
  }
  
  document.getElementById('cartTotalAmount').textContent = '$' + totalPrice;
};

// --- ฟังก์ชันการจัดการตะกร้า ---
const clearCart = () => {
  if (Object.keys(cart).length === 0) {
    showNotification('ไม่มีสินค้าในตะกร้า');
    return;
  }
  
  if (confirm('ต้องการเคลียร์สินค้าทั้งหมดในตะกร้าหรือไม่?')) {
    cart = {};
    localStorage.removeItem('cart');
    showNotification('เคลียร์ตะกร้าสินค้าแล้ว');
    updateCartPage();
  }
};

// --- ระบบแจ้งเตือน ---
const showNotification = (message) => {
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }
  
  // สร้างเนื้อหาแจ้งเตือน
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-check-circle';
  icon.style.marginRight = '10px';
  icon.style.color = '#238ff5';
  icon.style.fontSize = '1.2rem';
  
  notification.innerHTML = '';
  notification.appendChild(icon);
  notification.appendChild(document.createTextNode(message));
  
  // แสดงการแจ้งเตือน
  notification.style.display = 'block';
  
  // รอเล็กน้อยก่อนแสดง animation เพื่อให้ CSS transition ทำงาน
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  // ซ่อนการแจ้งเตือนหลังจากแสดงครบ 3 วินาที
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);
};

// --- การชำระเงิน ---
const checkout = () => {
  if (Object.keys(cart).length === 0) {
    showNotification('ไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนชำระเงิน');
    return;
  }
  
  alert('ขอบคุณสำหรับการสั่งซื้อ!');
  cart = {};
  localStorage.removeItem('cart');
  updateCartPage();
};

// --- เริ่มการทำงาน ---
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
  fetchProducts();
  
  document.getElementById('clearCartBtn').addEventListener('click', clearCart);
  document.getElementById('checkout').addEventListener('click', checkout);
}); 