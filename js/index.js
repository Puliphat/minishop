let products = [];
const cart = {};

// --- การจัดการข้อมูลตะกร้าสินค้า ---
const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    Object.assign(cart, JSON.parse(savedCart));
  }
};

const updateCartBadge = () => {
  const cartBadge = document.getElementById('cartBadge');
  let totalItems = 0;
  
  for (const key in cart) {
    totalItems += cart[key];
  }
  
  cartBadge.textContent = totalItems;
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

// --- การสร้างแสดงสินค้า ---
const createCard = (product) => {
  const productCard = document.createElement("div");
  productCard.className = "productCard";

  const productThumbnail = document.createElement("img");
  productThumbnail.className = "productThumbnail";
  productThumbnail.src = product.thumbnail;
  productThumbnail.alt = product.title;

  const productBottomSheet = document.createElement("div");
  productBottomSheet.className = "productBottomSheet";

  const productInfo = document.createElement("div");
  productInfo.className = "productInfo";

  const productName = document.createElement("strong");
  productName.className = "productName";
  productName.innerText = product.title;

  const productPrice = document.createElement("div");
  productPrice.className = "productPrice";
  productPrice.innerText = "$" + (Math.round(product.price));

  const addToCart = document.createElement("button");
  addToCart.className = "addToCart";
  addToCart.innerText = "+";

  productInfo.append(productName, productPrice);
  productBottomSheet.append(productInfo, addToCart);
  productCard.append(productThumbnail, productBottomSheet);

  document.querySelector("#productList").appendChild(productCard);

  // การเพิ่มสินค้าลงตะกร้า
  addToCart.addEventListener("click", () => {
    if (cart[product.id] === undefined) cart[product.id] = 0;
    cart[product.id] = cart[product.id] + 1;
    
    showNotification(`เพิ่ม ${product.title} ลงในตะกร้าแล้ว`);
    saveCartToLocalStorage();
    updateCartBadge();
  });
};

// --- ดึงข้อมูลสินค้าจาก API ---
const fetchProduct = () => {
  fetch('https://fakestoreapi.com/products')
    .then((res) => res.json())
    .then((productResponse) => {
      products = productResponse; 

      products.forEach((product) => {
        createCard({
          ...product,
          thumbnail: product.image
        });
      });
      
      loadCartFromLocalStorage();
      updateCartBadge();
    });
};


document.addEventListener('DOMContentLoaded', () => {
  fetchProduct();
});