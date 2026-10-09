const MENU = [
  {id:"burger",name:"Signature Burger",category:"Mains",price:185,emoji:"🍔",desc:"Smash-seared beef, aged cheddar, caramelized onion and house sauce."},
  {id:"chicken",name:"Golden Fried Chicken",category:"Mains",price:220,emoji:"🍗",desc:"Crisp, golden coating with a tender center and chef's seasoning."},
  {id:"steak",name:"House Steak Plate",category:"Mains",price:395,emoji:"🥩",desc:"A hearty steak plate with herb butter and seasonal sides."},
  {id:"pasta",name:"Creamy Truffle Pasta",category:"Pasta",price:245,emoji:"🍝",desc:"Silky cream sauce, parmesan and a fragrant truffle finish."},
  {id:"spaghetti",name:"Classic Spaghetti",category:"Pasta",price:155,emoji:"🍝",desc:"Comforting tomato sauce, savory meat and a parmesan finish."},
  {id:"fries",name:"Truffle Parmesan Fries",category:"Sides",price:95,emoji:"🍟",desc:"Golden fries tossed with parmesan and aromatic herbs."},
  {id:"salad",name:"Garden Fresh Salad",category:"Sides",price:125,emoji:"🥗",desc:"Crisp greens, bright vegetables and a light house dressing."},
  {id:"tea",name:"Iced Citrus Tea",category:"Drinks",price:75,emoji:"🍹",desc:"A refreshing citrus tea served chilled."},
  {id:"coffee",name:"Cold Brew Coffee",category:"Drinks",price:90,emoji:"☕",desc:"Smooth slow-steeped coffee with deep, mellow notes."}
];
const DISCOUNT_THRESHOLD = 500;
const DISCOUNT_RATE = 0.10;
const cart = {};
let activeCategory = "All";
let toastTimer;

const money = n => "₱" + n.toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});
const $ = id => document.getElementById(id);

function renderMenu(){
  const items = MENU.filter(item => activeCategory === "All" || item.category === activeCategory);
  $("menuGrid").innerHTML = items.map((item,index)=>`
    <article class="menu-card">
      <div class="food-art"><span class="food-index">NO. ${String(MENU.indexOf(item)+1).padStart(2,"0")}</span><span class="food-category">${item.category}</span><span class="food-emoji" aria-hidden="true">${item.emoji}</span></div>
      <div class="menu-info"><div class="menu-title-row"><h3>${item.name}</h3><span class="price">${money(item.price)}</span></div>
      <p>${item.desc}</p><button class="add-button" data-add="${item.id}">＋ ADD TO ORDER</button></div>
    </article>`).join("");
}
function getSubtotal(){return MENU.reduce((sum,item)=>sum+item.price*(cart[item.id]||0),0)}
function renderCart(){
  const ordered = MENU.filter(item=>(cart[item.id]||0)>0);
  $("headerCount").textContent = ordered.reduce((n,item)=>n+cart[item.id],0);
  if(!ordered.length){
    $("cartItems").innerHTML='<div class="empty-cart">Your bag is waiting for something delicious.</div>';
  } else {
    $("cartItems").innerHTML=ordered.map(item=>`
      <div class="cart-item"><div><h3>${item.name}</h3><span class="item-sub">${money(item.price)} each</span></div>
      <div class="cart-right"><div class="cart-line-price">${money(item.price*cart[item.id])}</div><div class="quantity-control"><button aria-label="Decrease ${item.name}" data-change="${item.id}" data-delta="-1">−</button><span>${cart[item.id]}</span><button aria-label="Increase ${item.name}" data-change="${item.id}" data-delta="1">＋</button></div></div></div>`).join("");
  }
  const subtotal=getSubtotal(), discount=subtotal>=DISCOUNT_THRESHOLD?subtotal*DISCOUNT_RATE:0, total=subtotal-discount;
  $("subtotal").textContent=money(subtotal); $("discount").textContent="−"+money(discount); $("total").textContent=money(total);
  $("discountProgress").style.width=Math.min(100,subtotal/DISCOUNT_THRESHOLD*100)+"%";
  $("discountMessage").textContent=subtotal>=DISCOUNT_THRESHOLD?"You've unlocked 10% off your order.":`Add ${money(DISCOUNT_THRESHOLD-subtotal)} to unlock 10% off.`;
  $("checkoutButton").disabled=!ordered.length;
  $("checkoutButton").style.opacity=ordered.length?"1":".48";
}
function showToast(message){
  $("toast").textContent=message; $("toast").classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200);
}
function openReceipt(){
  const ordered=MENU.filter(item=>(cart[item.id]||0)>0);
  if(!ordered.length){showToast("Add an item before checking out.");return;}
  const subtotal=getSubtotal(),discount=subtotal>=DISCOUNT_THRESHOLD?subtotal*DISCOUNT_RATE:0,total=subtotal-discount;
  const now=new Date();
  $("receiptNumber").textContent=`ORDER NG-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${Math.floor(1000+Math.random()*9000)} · ${now.toLocaleString()}`;
  $("receiptLines").innerHTML=ordered.map(item=>`<div class="receipt-line"><span>${item.name} × ${cart[item.id]}</span><span>${money(item.price*cart[item.id])}</span></div>`).join("");
  $("receiptTotals").innerHTML=`<div class="receipt-line"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="receipt-line"><span>Discount (10%)</span><span>−${money(discount)}</span></div><div class="receipt-line grand"><span>TOTAL DUE</span><span>${money(total)}</span></div>`;
  $("receiptModal").classList.add("show");$("receiptModal").setAttribute("aria-hidden","false");
}
$("menuGrid").addEventListener("click",e=>{
  const button=e.target.closest("[data-add]");if(!button)return;
  cart[button.dataset.add]=(cart[button.dataset.add]||0)+1;renderCart();
  const item=MENU.find(x=>x.id===button.dataset.add);showToast(`${item.name} added to your order.`);
});
$("cartItems").addEventListener("click",e=>{
  const button=e.target.closest("[data-change]");if(!button)return;
  const id=button.dataset.change;cart[id]=(cart[id]||0)+Number(button.dataset.delta);
  if(cart[id]<=0)delete cart[id];renderCart();
});
$("categories").addEventListener("click",e=>{
  const button=e.target.closest("[data-category]");if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".category").forEach(el=>el.classList.toggle("active",el===button));renderMenu();
});
$("checkoutButton").addEventListener("click",openReceipt);
$("closeReceipt").addEventListener("click",()=>{$("receiptModal").classList.remove("show");$("receiptModal").setAttribute("aria-hidden","true")});
$("receiptModal").addEventListener("click",e=>{if(e.target===$("receiptModal"))$("closeReceipt").click()});
$("printReceipt").addEventListener("click",()=>window.print());
$("newOrder").addEventListener("click",()=>{Object.keys(cart).forEach(key=>delete cart[key]);renderCart();$("closeReceipt").click();window.scrollTo({top:0,behavior:"smooth"});showToast("Ready for your next order.")});
$("cartJump").addEventListener("click",()=>$("order").scrollIntoView({behavior:"smooth"}));
$("year").textContent=new Date().getFullYear();
renderMenu();renderCart();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
