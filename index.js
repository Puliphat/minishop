let products = [];
const cart = {};

// nav

// อัพเดทตะกร้าสินค้า
const updateCart = () => {
  let totolPrice = 0;
   
 // ลบ child อันเก่าทิ้งเพราะตอนต่อเข้าไปใหม่มันมีค่าเก่าเข้ามาด้วย
 document.querySelector("#cartSummary_items").replaceChildren([]);

  // object.keys ที่ดึงมาเป็น string เราจึงทำให้ == แค่เปรียบเทียบค่าไม่เปรียบเทียบชนิด
  for (const key of Object.keys(cart)) {
    const item = products.find((product) => {
      return product.id == key;
    });
    
    const quantity = cart[key];
    const price = (Math.round(item.price));

    const itemRow = document.createElement("tr");

    const itemName = document.createElement("td");
    itemName.innerText = item.title;

    const itemQuantity = document.createElement("td");
    itemQuantity.innerText = quantity;

    const itemPrice = document.createElement("td");
    itemPrice.innerText = "$" + quantity * price;

    itemRow.append(itemName, itemQuantity, itemPrice);
    document.querySelector("#cartSummary_items").appendChild(itemRow);

    totolPrice = totolPrice + price * quantity;
  }
  // ราคารวมทั้งหมดทำงานหลังจาก for loop การเลือกสินค้าจนครบ
  document.querySelector("#cartSummary_total").innerText =  "$" + totolPrice;

};

// เคลียตะกร้าสินค้า
const clearCart = () => {
  for (const key in cart) {
    delete cart[key]; 
  }
  // ลบข้อมูลจาก localStorage
  localStorage.removeItem('cart');

  updateCart();
};

// สร้างปุ่มเคลียร์สินค้า
const clearButton = document.createElement("button");
clearButton.className = "clearButton"
clearButton.innerText = "เคลียสินค้า";
clearButton.onclick = clearCart;

// สร้างมา Wrap clearbutton ไว้แต่ง css flex
const buttonWrapper = document.createElement("div");

buttonWrapper.className = "buttonWrapper";
buttonWrapper.appendChild(clearButton);

document.querySelector("#cartSummary").appendChild(buttonWrapper);


// document.querySelector("#cartSummary").appendChild(clearButton);



// main

// สร้างการ์ดโดยใช้ js แทน html
const createCard = (product) => {
  const productCard = document.createElement("div");
  productCard.className = "productCard";

  const productThumbnail = document.createElement("img");
  productThumbnail.className = "productThumbnail";
  productThumbnail.src = product.thumbnail;

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

  // อย่าลืม append ตามโครงสร้าง html
  productInfo.append(productName, productPrice);
  productBottomSheet.append(productInfo, addToCart);
  productCard.append(productThumbnail, productBottomSheet);

  document.querySelector("#productList").appendChild(productCard);

  // เริ่มการทำงาน (รับของเข้าตะกร้า)
  addToCart.addEventListener("click", () => {
    // ถ้า value ของคีย์เป็น undefined ให้มาทำเป็น int หรือเป็น 0 ก่อน
    if (cart[product.id] === undefined) cart[product.id] = 0;
    cart[product.id] = cart[product.id] + 1;

    updateCart();
  });
};

// อย่าลืมใช้ .style เพราะกำลังแก้ css
// function ไว้ซ่อนหน้าตะกร้าสินค้า
const hookViewCart = () => {
     const viewCartButton = document.querySelector("#viewCart");
     viewCartButton.addEventListener("click", ()=> {
        const cartSummary = document.querySelector("#cartSummary")
        const display = cartSummary.style.display;

        if (display === "none"){
            cartSummary.style.display = "block";
        } else {
            cartSummary.style.display = "none";
        }
     });
};



// เชื่อม API
const fetchProduct = () => {
  fetch("https://dummyjson.com/products?limit=32&skip=87&select=title,price,thumbnail")
    .then((res) => res.json())
    .then((productResponse) => {
      products = productResponse.products;

      products.forEach((product) => {
        createCard(product);
      });
    });
};

fetchProduct();
hookViewCart();