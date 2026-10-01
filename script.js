const foods = [
 {id:1,name:"Truffle Cream Pasta",desc:"พาสต้าเห็ดทรัฟเฟิลซอสครีมเข้มข้น",price:289,cat:"main",emoji:"🍝"},
 {id:2,name:"Salmon Teriyaki",desc:"แซลมอนย่างซอสเทอริยากิ เสิร์ฟพร้อมข้าวญี่ปุ่น",price:329,cat:"japan",emoji:"🍣"},
 {id:3,name:"Tom Yum Goong",desc:"ต้มยำกุ้งรสจัดจ้านแบบไทย",price:249,cat:"thai",emoji:"🍲"},
 {id:4,name:"Beef Burger",desc:"เบอร์เกอร์เนื้อย่าง ชีส และซอสสูตรพิเศษ",price:259,cat:"main",emoji:"🍔"},
 {id:5,name:"Chicken Ramen",desc:"ราเมงไก่ซุปเข้มข้น เส้นเหนียวนุ่ม",price:229,cat:"japan",emoji:"🍜"},
 {id:6,name:"Pad Thai",desc:"ผัดไทยกุ้งสด เส้นเหนียวนุ่มรสกลมกล่อม",price:189,cat:"thai",emoji:"🥢"},
 {id:7,name:"Korean Fried Chicken",desc:"ไก่ทอดเกาหลีซอสเผ็ดหวานกรอบนอกนุ่มใน",price:219,cat:"main",emoji:"🍗"},
 {id:8,name:"Mango Smoothie",desc:"สมูทตี้มะม่วงสด หอมหวาน เย็นชื่นใจ",price:99,cat:"drink",emoji:"🥭"}
];

let cart = JSON.parse(localStorage.getItem("savoreCart") || "[]");
const menuGrid = document.getElementById("menuGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function money(n){ return "฿" + n.toLocaleString("th-TH"); }

function renderMenu(category="all"){
  menuGrid.innerHTML = foods.filter(f=>category==="all"||f.cat===category).map(f=>`
    <article class="food-card">
      <div class="food-pic">${f.emoji}</div>
      <div class="food-body">
        <h3>${f.name}</h3>
        <p>${f.desc}</p>
        <div class="food-bottom"><span class="price">${money(f.price)}</span><button class="add" onclick="addToCart(${f.id})">+</button></div>
      </div>
    </article>`).join("");
}
function save(){ localStorage.setItem("savoreCart",JSON.stringify(cart)); renderCart(); }
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  item ? item.qty++ : cart.push({id,qty:1});
  save(); showToast("เพิ่มเมนูลงตะกร้าแล้ว");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); save();
}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  const items=document.getElementById("cartItems");
  if(!cart.length){items.innerHTML='<p style="text-align:center;color:#777;padding:50px 0">ยังไม่มีสินค้าในตะกร้า 🛒</p>';}
  else items.innerHTML=cart.map(x=>{const f=foods.find(a=>a.id===x.id);return `
    <div class="cart-row"><div><strong>${f.name}</strong><br><small>${money(f.price)} × ${x.qty}</small></div>
    <div class="qty"><button onclick="changeQty(${f.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${f.id},1)">+</button></div></div>`}).join("");
  const total=cart.reduce((s,x)=>s+foods.find(f=>f.id===x.id).price*x.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}
function showCart(){cartPanel.classList.add("open");overlay.classList.add("show")}
function closeCart(){cartPanel.classList.remove("open");overlay.classList.remove("show")}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderMenu(btn.dataset.category);
}));
document.getElementById("cartBtn").onclick=showCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById("menuBtn").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("open"));

document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){showToast("กรุณาเพิ่มอาหารก่อนสั่งซื้อ");return;}
 closeCart();document.getElementById("checkoutModal").classList.add("show");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")e.currentTarget.classList.remove("show")});

document.getElementById("checkoutForm").onsubmit=e=>{
 e.preventDefault();
 const orderNo="SV"+Date.now().toString().slice(-6);
 cart=[];save();document.getElementById("checkoutModal").classList.remove("show");
 showToast("สั่งซื้อสำเร็จ! เลขที่ออเดอร์ #"+orderNo);
 e.target.reset();
};
document.getElementById("contactForm").onsubmit=e=>{e.preventDefault();showToast("ส่งข้อความเรียบร้อยแล้ว");e.target.reset()};
document.getElementById("promoBtn").onclick=()=>{navigator.clipboard?.writeText("SAVORE50");showToast("คัดลอกโค้ด SAVORE50 แล้ว")};

renderMenu();renderCart();
