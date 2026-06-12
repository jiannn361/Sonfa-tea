import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Home, User, Plus, Minus, Trash2, Send, ArrowLeft, Search, ImageIcon, Store, Truck, Edit3, UserCircle, Phone, MapPin } from 'lucide-react';

// === 1. 商品資料區 ===
const DEFAULT_IMG = '/tea-placeholder.jpg'; 
const TEA_BAG_IMG = '/teabag.jpg';

const INITIAL_DATA = {
  categories: [
    { id: 'jinxuan', name: '金萱茶', nameEn: 'Jin Xuan Tea', image: '/cat-jinxuan.jpg' },
    { id: 'oolong', name: '烏龍茶', nameEn: 'Oolong Tea', image: '/cat-oolong.jpg' },
    { id: 'gaba', name: 'GABA茶', nameEn: 'GABA Tea', image: '/cat-gaba.jpg' },
    { id: 'black', name: '小葉種紅茶', nameEn: 'Black Tea', image: '/cat-black.jpg' },
    { id: 'green', name: '綠茶', nameEn: 'Green Tea', image: '/cat-green.jpg' },
    { id: 'white', name: '白茶', nameEn: 'White Tea', image: '/cat-white.jpg' },
    { id: 'jasmine', name: '茉莉花茶', nameEn: 'Jasmine Tea', image: '/cat-jasmine.jpg' },
    { id: 'teabag', name: '茶包組', nameEn: 'Tea Bags', image: '/cat-teabag.jpg' },
  ],
  products: [
    { id: 101, catId: 'jinxuan', name: '阿里山金萱茶', nameEn: 'Alishan Jin Xuan', desc: '帶有淡雅奶香與桂花香。', image: '/prod-jinxuan.jpg', roastOptions: [{ level: '輕焙', levelEn: 'Light', price: 1200 }, { level: '中焙', levelEn: 'Medium', price: 1300 }] },
    { id: 201, catId: 'oolong', name: '高山烏龍', nameEn: 'High Mountain Oolong', desc: '喉韻甘甜，回甘持久。', image: '/prod-oolong1.jpg', roastOptions: [{ level: '輕焙', levelEn: 'Light', price: 1500 }, { level: '中焙', levelEn: 'Medium', price: 1600 }] },
    { id: 202, catId: 'oolong', name: '紅烏龍', nameEn: 'Red Oolong', desc: '熟果香氣，滋味醇厚。', image: '/prod-oolong2.jpg', roastOptions: [{ level: '中重焙', levelEn: 'Medium-Heavy', price: 1600 }] },
    { id: 203, catId: 'oolong', name: '紅水烏龍', nameEn: 'Red Water Oolong', desc: '傳統發酵，水色琥珀。', image: '/prod-oolong3.jpg', roastOptions: [{ level: '重發酵', levelEn: 'Heavy Fermentation', price: 1800 }] },
    { id: 204, catId: 'oolong', name: '白烏龍', nameEn: 'White Oolong', desc: '清香淡雅，如花香撲鼻。', image: '/prod-oolong4.jpg', roastOptions: [{ level: '輕發酵', levelEn: 'Light Fermentation', price: 1500 }] },
    { id: 301, catId: 'gaba', name: '佳葉龍茶 (GABA)', nameEn: 'GABA Tea', desc: '富含γ-胺基丁酸，舒緩身心。', image: '/prod-gaba.jpg', roastOptions: [{ level: '標準', levelEn: 'Standard', price: 2000 }] },
    { id: 401, catId: 'black', name: '金芽紅茶', nameEn: 'Golden Bud Black Tea', desc: '毫香顯露，滋味甜潤。', image: '/prod-black1.jpg', roastOptions: [{ level: '全發酵', levelEn: 'Fully Fermented', price: 1800 }] },
    { id: 402, catId: 'black', name: '蜜香紅茶', nameEn: 'Honey Black Tea', desc: '天然蜜香，小綠葉蟬叮咬。', image: '/prod-black2.jpg', roastOptions: [{ level: '全發酵', levelEn: 'Fully Fermented', price: 2200 }] },
    { id: 501, catId: 'green', name: '精選綠茶', nameEn: 'Premium Green Tea', desc: '保留豐富兒茶素，清爽解膩。', image: '/prod-green.jpg', roastOptions: [{ level: '不發酵', levelEn: 'Unfermented', price: 1000 }] },
    { id: 601, catId: 'white', name: '精選白茶', nameEn: 'Premium White Tea', desc: '毫香清鮮，自然萎凋。', image: '/prod-white.jpg', roastOptions: [{ level: '微發酵', levelEn: 'Slightly Fermented', price: 1600 }] },
    { id: 701, catId: 'jasmine', name: '頂級茉莉花茶', nameEn: 'Jasmine Green Tea', desc: '新鮮茉莉花層層窨製。', image: '/prod-jasmine.jpg', roastOptions: [{ level: '不發酵', levelEn: 'Unfermented', price: 1500 }] },
    { id: 801, catId: 'teabag', name: '原片茶包組 (50包/組)', nameEn: 'Tea Bag Set (50pcs)', desc: '方便沖泡，隨時享受好茶。', image: TEA_BAG_IMG, roastOptions: [
      { level: '紅茶', levelEn: 'Black Tea', price: 600 },
      { level: '烏龍茶', levelEn: 'Oolong Tea', price: 600 },
      { level: 'GABA茶', levelEn: 'GABA Tea', price: 800 },
      { level: '綠茶', levelEn: 'Green Tea', price: 500 },
      { level: '花茶', levelEn: 'Floral Tea', price: 600 }
    ] },
  ]
};

// === 2. 系統設定 ===
const GOOGLE_SHEET_API_URL = ""; 
const LIFF_ID = "2010360336-i18Jsouu"; // 您的 LIFF ID
// ⚠️ 重要：請務必將下方的 ID 換成您自己的官方帳號 ID（一定要包含 @）
const LINE_OA_ID = "@930nydzu"; 
const SHIPPING_FEE = { '711': 60, 'home': 100 };

export default function TeaStoreApp() {
  const [appData] = useState(INITIAL_DATA);
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempOptions, setTempOptions] = useState({ roastObj: null, quantity: 1 });
  
  // 訂單資訊狀態
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('711');
  const [shippingAddress, setShippingAddress] = useState(''); 
  const [orderNote, setOrderNote] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const initLiff = async () => {
      if (!LIFF_ID) return;
      try {
        await import('https://static.line-scdn.net/liff/edge/2/sdk.js');
        await window.liff.init({ liffId: LIFF_ID });
      } catch (e) {
        console.error('LIFF 初始化失敗', e);
      }
    };
    initLiff();
  }, []);

  const handleCategoryClick = (cat) => {
    const productsInCat = appData.products.filter(p => p.catId === cat.id);
    setSelectedCat(cat);
    if (productsInCat.length === 1) {
      handleProductClick(productsInCat[0]);
    } else {
      setView('detail');
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setTempOptions({ roastObj: product.roastOptions[0], quantity: 1 });
  };

  const addToCart = () => {
    if (!tempOptions.roastObj) return;
    const newItem = {
      ...selectedProduct,
      roast: tempOptions.roastObj.level,
      price: tempOptions.roastObj.price,
      quantity: tempOptions.quantity,
      totalPrice: tempOptions.roastObj.price * tempOptions.quantity,
      cartId: Date.now()
    };
    setCart([...cart, newItem]);
    setView('cart');
    setTempOptions({ roastObj: null, quantity: 1 });
    setSelectedProduct(null);
    setSelectedCat(null); 
    setFormError(''); 
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const itemsTotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  const currentShippingFee = cart.length > 0 ? SHIPPING_FEE[shippingMethod] : 0;
  const cartTotal = itemsTotal + currentShippingFee;

  const submitOrder = async () => {
    if (cart.length === 0) return;

    // 必填欄位檢查
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setFormError('⚠️ 訂單無法送出：請確實填寫「姓名」、「電話」與「運送地址/門市」喔！');
      return;
    }
    setFormError(''); 

    const shippingText = shippingMethod === '711' ? '7-11 店到店' : '宅配到府';
    const noteText = orderNote.trim() ? `\n📝 備註: ${orderNote}` : '';
    
    // === 1. 純文字版本 (當備用) ===
    const orderText = cart.map(item => {
      const unit = item.catId === 'teabag' ? '組' : '斤';
      return `・${item.name} (${item.roast}) x ${String(item.quantity)}${unit} = $${String(item.totalPrice)}`;
    }).join('\n');
    const textMessage = `🍵 [崧發茶園好茶時光 - 新訂單]\n\n👤 姓名: ${customerName}\n📱 電話: ${customerPhone}\n🚚 運送 (${shippingText}): ${shippingAddress}\n\n${orderText}\n\n📍 商品總計: $${String(itemsTotal)}\n📦 運費: $${String(currentShippingFee)}${noteText}\n💰 總結帳金額: $${String(cartTotal)}`;

    // === 2. 安全的 Flex Message 結構 (最標準、最乾淨寫法) ===
    const flexMessage = {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "xl",
        contents: [
          // 標題
          {
            type: "text",
            text: "好茶時光 訂單明細",
            weight: "bold",
            size: "xl",
            color: "#537A5F",
            wrap: true
          },
          { type: "separator", margin: "lg" },
          // 訂購人資訊
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: "姓名", size: "sm", color: "#aaaaaa", flex: 1 },
                  { type: "text", text: String(customerName || '-'), size: "sm", color: "#333333", flex: 3, wrap: true }
                ]
              },
              {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: "電話", size: "sm", color: "#aaaaaa", flex: 1 },
                  { type: "text", text: String(customerPhone || '-'), size: "sm", color: "#333333", flex: 3, wrap: true }
                ]
              },
              {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: shippingMethod === '711' ? "門市" : "地址", size: "sm", color: "#aaaaaa", flex: 1 },
                  { type: "text", text: String(shippingAddress || '-'), size: "sm", color: "#333333", flex: 3, wrap: true }
                ]
              }
            ]
          },
          { type: "separator", margin: "lg", style: "dashed" },
          // 購物明細清單
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: cart.map(item => {
              const unit = item.catId === 'teabag' ? '組' : '斤';
              return {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: `${String(item.name)}(${String(item.roast)}) x${String(item.quantity)}${unit}`, size: "sm", color: "#333333", flex: 3, wrap: true },
                  { type: "text", text: `$${String(item.totalPrice)}`, size: "sm", color: "#111111", align: "end", flex: 1, weight: "bold" }
                ]
              };
            })
          },
          { type: "separator", margin: "lg" },
          // 總計項目
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: "商品總計", size: "sm", color: "#555555" },
                  { type: "text", text: `$${String(itemsTotal)}`, size: "sm", color: "#111111", align: "end" }
                ]
              },
              {
                type: "box", layout: "horizontal", contents: [
                  { type: "text", text: "運費", size: "sm", color: "#555555" },
                  { type: "text", text: `$${String(currentShippingFee)}`, size: "sm", color: "#111111", align: "end" }
                ]
              }
            ]
          },
          { type: "separator", margin: "lg" },
          // 總結帳金額
          {
            type: "box",
            layout: "horizontal",
            margin: "lg",
            contents: [
              { type: "text", text: "結帳金額", size: "md", color: "#111111", weight: "bold" },
              { type: "text", text: `$${String(cartTotal)}`, size: "lg", color: "#537A5F", weight: "bold", align: "end" }
            ]
          }
        ]
      }
    };

    // 動態加入備註 (如果有填寫的話)
    if (orderNote && orderNote.trim()) {
      flexMessage.body.contents.push({
        type: "box", layout: "horizontal", margin: "lg", contents: [
          { type: "text", text: "備註", size: "sm", color: "#aaaaaa", flex: 1 },
          { type: "text", text: String(orderNote), size: "sm", color: "#333333", flex: 3, wrap: true }
        ]
      });
    }

    if (GOOGLE_SHEET_API_URL) {
      try {
        await fetch(GOOGLE_SHEET_API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'new_order', customerName, customerPhone, shippingMethod, shippingAddress, note: orderNote, cart, total: cartTotal })
        });
      } catch (e) {
        console.error("儲存失敗", e);
      }
    }

    // === 3. 傳送訊息邏輯 ===
    if (window.liff && window.liff.isLoggedIn()) {
      try {
        // 嘗試傳送圖卡
        await window.liff.sendMessages([{ 
          type: 'flex', 
          altText: `收到新訂單 (${customerName})：總計 $${String(cartTotal)}`, 
          contents: flexMessage 
        }]);
        window.liff.closeWindow(); 
      } catch (error) {
        console.error("圖卡失敗", error);
        setFormError(`⚠️ 圖卡失敗。改用純文字傳送...`);
        // 失敗時，強制跳轉回傳純文字
        setTimeout(() => {
          const lineUrl = `https://line.me/R/oaMessage/${LINE_OA_ID}?text=${encodeURIComponent(textMessage)}`;
          window.location.href = lineUrl;
        }, 2000);
      }
    } else {
      // 沒在 LINE 裡面開啟的話，傳純文字
      const lineUrl = `https://line.me/R/oaMessage/${LINE_OA_ID}?text=${encodeURIComponent(textMessage)}`;
      window.location.href = lineUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEFEA] flex justify-center selection:bg-[#8EBB9F] selection:text-white font-sans">
      <div className="w-full md:max-w-2xl lg:max-w-4xl bg-[#F9FCF9] text-[#3B5E46] relative shadow-[0_0_50px_-15px_rgba(0,0,0,0.1)] flex flex-col min-h-screen pb-28">
        
        <header className="bg-[#537A5F] text-white pt-16 pb-12 px-6 md:rounded-b-[3.5rem] rounded-b-[2.5rem] relative shadow-lg overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-50"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 bg-[#43634D] rounded-full opacity-50"></div>
          
          <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mb-4 flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
            <ImageIcon className="text-white/70" size={32} />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-wider">好茶時光</h1>
            <p className="text-[#C1E3CE] text-xs md:text-sm font-medium tracking-[0.2em] uppercase mt-2">Fine Tea Time</p>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-10 mt-8 relative z-20">
          
          {view === 'home' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#537A5F]">精選茶款</h2>
                  <span className="text-xs text-[#8EBB9F] uppercase tracking-wider font-semibold">Featured Teas</span>
                </div>
                <button className="p-2 bg-emerald-50 rounded-full text-[#537A5F] hover:bg-emerald-100 transition-colors">
                  <Search size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {appData.categories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-emerald-50 group flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#E2E8E4]">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}
                      />
                    </div>
                    <div className="p-4 md:p-5 text-center flex-1 flex flex-col justify-center">
                      <div className="font-bold text-lg text-[#537A5F]">{cat.name}</div>
                      <div className="text-[10px] text-[#8EBB9F] mt-1 uppercase tracking-widest">{cat.nameEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {view === 'detail' && selectedCat && (
            <div className="space-y-6 animate-fade-in md:max-w-3xl md:mx-auto">
              <button 
                onClick={() => setView('home')} 
                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-sm font-bold border border-emerald-100 text-[#537A5F] hover:bg-emerald-50 transition-colors w-max"
              >
                <ArrowLeft size={16} /> 
                <div className="flex flex-col text-left leading-tight">
                  <span>返回分類</span>
                  <span className="text-[9px] text-[#8EBB9F] font-normal uppercase">Back</span>
                </div>
              </button>
              
              <div className="px-2 text-center md:text-left border-b border-gray-100 pb-4">
                <h2 className="text-3xl font-extrabold text-[#537A5F]">{selectedCat.name}</h2>
                <span className="text-sm text-[#8EBB9F] uppercase tracking-wider font-semibold">{selectedCat.nameEn}</span>
              </div>

              <div className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                {appData.products.filter(p => p.catId === selectedCat.id).map(product => {
                  const minPrice = Math.min(...product.roastOptions.map(r => r.price));
                  return (
                  <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product)}
                    className="relative flex items-center bg-[#537A5F] rounded-[2rem] p-4 pr-6 shadow-xl cursor-pointer hover:bg-[#43634D] transition-colors group"
                  >
                    <div className="w-28 h-32 md:w-32 md:h-36 -ml-8 bg-[#E2E8E4] rounded-2xl p-1 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img src={product.image} className="w-full h-full object-cover rounded-xl" alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}/>
                    </div>
                    <div className="ml-4 flex-1 text-white">
                      <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                      <div className="text-[10px] text-[#C1E3CE] mb-2 font-light uppercase tracking-wider line-clamp-1">{product.nameEn}</div>
                      <p className="text-xs text-[#C1E3CE] mb-3 line-clamp-2 opacity-80 leading-relaxed">{product.desc}</p>
                      <div className="font-bold tracking-wider text-emerald-200">
                        <span className="text-sm font-normal mr-1">$</span>
                        {minPrice} 
                        <span className="text-[10px] font-normal text-[#C1E3CE] ml-1">起 / {product.catId === 'teabag' ? '組' : '斤'}</span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {}
          {view === 'cart' && (
            <div className="space-y-6 animate-fade-in md:max-w-2xl md:mx-auto">
              <div className="flex items-center gap-4 px-2">
                <button onClick={() => setView('home')} className="bg-white p-2.5 rounded-full shadow-sm text-[#537A5F] hover:bg-emerald-50">
                  <ArrowLeft size={20}/>
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-[#537A5F] leading-tight">您的購物車</h2>
                  <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider font-semibold">Shopping Cart</div>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-[#8EBB9F] opacity-50" />
                  <p className="text-[#537A5F] font-bold text-lg">購物車還是空的唷！</p>
                  <p className="text-xs text-[#8EBB9F] mt-1 mb-8">Your cart is currently empty.</p>
                  <button 
                    onClick={() => setView('home')}
                    className="px-8 py-3 bg-[#537A5F] text-white rounded-full font-bold shadow-md hover:bg-[#43634D] transition-colors"
                  >
                    去逛逛茶款 <span className="text-[10px] ml-1 opacity-70 uppercase font-normal">Go Shopping</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map(item => (
                    <div key={item.cartId} className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center gap-4 border border-emerald-50 hover:shadow-md transition-shadow">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}/>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#537A5F] text-lg leading-tight">{item.name}</h3>
                        <div className="text-[9px] text-gray-400 uppercase mb-2">{item.nameEn}</div>
                        <p className="text-xs text-[#8EBB9F] font-medium bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">
                          {item.roast} · {item.quantity} {item.catId === 'teabag' ? '組' : '斤'}
                        </p>
                        <div className="font-bold text-[#537A5F] mt-1.5 text-lg">$ {item.totalPrice}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-3 rounded-2xl transition-colors">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  
                  {/* 訂購人資訊 */}
                  <div className="mt-8 p-6 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                    <div className="mb-5 flex items-center gap-2">
                      <UserCircle size={20} className="text-[#537A5F]" />
                      <div>
                        <h3 className="font-bold text-[#537A5F] text-lg leading-tight">訂購人資訊 (必填)</h3>
                        <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider">Customer Info</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-[#537A5F] mb-1.5">真實姓名</label>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="例如：王小明" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-[#537A5F] focus:outline-none focus:ring-2 focus:ring-[#8EBB9F] transition-all"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#537A5F] mb-1.5">聯絡電話</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="例如：0912345678" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-10 text-sm text-[#537A5F] focus:outline-none focus:ring-2 focus:ring-[#8EBB9F] transition-all"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 運送方式 */}
                  <div className="mt-4 p-6 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                    <div className="mb-5">
                      <h3 className="font-bold text-[#537A5F] text-lg leading-tight">選擇運送方式 (必填)</h3>
                      <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider">Shipping Method</div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className={`flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${shippingMethod === '711' ? 'border-[#537A5F] bg-emerald-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${shippingMethod === '711' ? 'bg-[#537A5F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <Store size={20} />
                            </div>
                            <div>
                              <div className={`font-bold text-sm ${shippingMethod === '711' ? 'text-[#537A5F]' : 'text-gray-600'}`}>7-11 店到店</div>
                              <div className="text-[10px] text-gray-400 uppercase">Store Pickup</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#8EBB9F] text-sm">+$ {SHIPPING_FEE['711']}</span>
                            <input type="radio" name="shipping" value="711" checked={shippingMethod === '711'} onChange={() => {setShippingMethod('711'); setShippingAddress('');}} className="w-5 h-5 accent-[#537A5F]"/>
                          </div>
                        </div>
                        {shippingMethod === '711' && (
                          <div className="mt-4 pt-4 border-t border-emerald-100/50 animate-slide-up">
                            <label className="block text-xs font-bold text-[#537A5F] mb-1.5">收件門市名稱或店號</label>
                            <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                              <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="例如：7-11 圓山門市" className="w-full bg-white border border-emerald-200 rounded-lg p-3 pl-9 text-sm text-[#537A5F] focus:outline-none focus:ring-2 focus:ring-[#8EBB9F]"/>
                            </div>
                          </div>
                        )}
                      </label>

                      <label className={`flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${shippingMethod === 'home' ? 'border-[#537A5F] bg-emerald-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${shippingMethod === 'home' ? 'bg-[#537A5F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <Truck size={20} />
                            </div>
                            <div>
                              <div className={`font-bold text-sm ${shippingMethod === 'home' ? 'text-[#537A5F]' : 'text-gray-600'}`}>宅配到府</div>
                              <div className="text-[10px] text-gray-400 uppercase">Home Delivery</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#8EBB9F] text-sm">+$ {SHIPPING_FEE['home']}</span>
                            <input type="radio" name="shipping" value="home" checked={shippingMethod === 'home'} onChange={() => {setShippingMethod('home'); setShippingAddress('');}} className="w-5 h-5 accent-[#537A5F]"/>
                          </div>
                        </div>
                        {shippingMethod === 'home' && (
                          <div className="mt-4 pt-4 border-t border-emerald-100/50 animate-slide-up">
                            <label className="block text-xs font-bold text-[#537A5F] mb-1.5">完整收件地址</label>
                            <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                              <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="例如：台北市信義區信義路五段7號" className="w-full bg-white border border-emerald-200 rounded-lg p-3 pl-9 text-sm text-[#537A5F] focus:outline-none focus:ring-2 focus:ring-[#8EBB9F]"/>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 p-6 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                    <div className="mb-4 flex items-center gap-2">
                      <Edit3 size={20} className="text-[#537A5F]" />
                      <div>
                        <h3 className="font-bold text-[#537A5F] text-lg leading-tight">訂單備註 (選填)</h3>
                        <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider">Order Notes</div>
                      </div>
                    </div>
                    <textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="有什麼想告訴我們的嗎？(例如：希望的出貨時間等)" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-[#537A5F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8EBB9F] focus:bg-white transition-all resize-none h-28"/>
                  </div>

                  <div className="mt-8 p-8 bg-[#537A5F] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#6C9A7C] rounded-full opacity-20 -mr-12 -mt-12"></div>
                    <div className="space-y-4 mb-6 relative z-10 text-sm">
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>商品總計</span> <span className="text-[10px] ml-1 uppercase opacity-70">Subtotal</span></div>
                        <span className="font-medium text-lg">$ {itemsTotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>運費</span> <span className="text-[10px] ml-1 uppercase opacity-70">Shipping Fee</span></div>
                        <span className="font-medium text-lg">$ {currentShippingFee}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-8 relative z-10 pt-5 border-t border-[#6C9A7C]/50">
                      <div>
                        <div className="font-medium text-lg">總結帳金額</div>
                        <div className="text-[10px] text-[#C1E3CE] uppercase mt-0.5">Total Amount</div>
                      </div>
                      <span className="font-bold text-4xl text-emerald-200">$ {cartTotal}</span>
                    </div>
                    
                    {formError && (
                      <div className="bg-red-500/20 border border-red-400 text-red-100 text-xs font-bold p-3 rounded-xl mb-4 relative z-10 text-center animate-bounce">
                        {formError}
                      </div>
                    )}

                    <button onClick={submitOrder} className="w-full bg-white text-[#537A5F] py-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg hover:bg-gray-100 transition relative z-10 text-lg">
                      <div className="flex items-center gap-2"><Send size={20}/> <span>確認送出訂單</span></div>
                      <span className="text-[10px] font-normal text-gray-500 uppercase mt-0.5">Send Order</span>
                    </button>
                    <button onClick={() => setView('home')} className="w-full bg-transparent border border-[#8EBB9F] text-white mt-4 py-3.5 rounded-2xl font-bold flex flex-col items-center justify-center hover:bg-[#6C9A7C]/50 transition relative z-10">
                      <span>繼續購物</span>
                      <span className="text-[9px] font-normal text-[#C1E3CE] uppercase mt-0.5">Continue Shopping</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {}
        {selectedProduct && tempOptions.roastObj && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center md:items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 pb-8 shadow-2xl relative animate-slide-up">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#537A5F] leading-tight">{selectedProduct.name}</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 mb-3">{selectedProduct.nameEn}</p>
                  <div className="inline-block bg-emerald-50 text-[#537A5F] font-bold px-3 py-1.5 rounded-lg text-sm border border-emerald-100">
                    單價 $ {tempOptions.roastObj.price} / {selectedProduct.catId === 'teabag' ? '組' : '斤'}
                  </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 bg-gray-50 hover:bg-gray-100 p-2.5 rounded-full transition-colors">✕</button>
              </div>
              
              <div className="mb-6 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                <div className="mb-3">
                  <label className="block text-sm text-[#537A5F] font-bold leading-tight">
                    {selectedProduct.catId === 'teabag' ? '1. 選擇茶包口味' : '1. 選擇烘焙程度'}
                  </label>
                  <span className="text-[10px] text-gray-400 uppercase">Select Options</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {selectedProduct.roastOptions.map(roast => (
                    <button 
                      key={roast.level}
                      onClick={() => setTempOptions({...tempOptions, roastObj: roast})}
                      className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl border-2 transition-all font-medium flex flex-col items-center justify-center ${
                        tempOptions.roastObj.level === roast.level 
                        ? 'bg-[#537A5F] text-white border-[#537A5F] shadow-md' 
                        : 'bg-white text-[#537A5F] border-gray-200 hover:border-[#8EBB9F]'
                      }`}
                    >
                      <span>{roast.level}</span>
                      <span className={`text-[9px] mt-0.5 uppercase ${tempOptions.roastObj.level === roast.level ? 'text-[#C1E3CE]' : 'text-gray-400'}`}>
                        {roast.levelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                <div className="mb-3">
                  <label className="block text-sm text-[#537A5F] font-bold leading-tight">
                    2. 購買數量 ({selectedProduct.catId === 'teabag' ? '組' : '斤'})
                  </label>
                  <span className="text-[10px] text-gray-400 uppercase">Quantity</span>
                </div>
                <div className="flex items-center gap-5 w-full bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                  <button onClick={() => setTempOptions({...tempOptions, quantity: Math.max(1, tempOptions.quantity - 1)})} className="bg-gray-50 p-3 rounded-lg text-[#537A5F] hover:bg-gray-100 transition-colors"><Minus size={20}/></button>
                  <span className="font-extrabold text-2xl flex-1 text-center text-[#537A5F]">{tempOptions.quantity}</span>
                  <button onClick={() => setTempOptions({...tempOptions, quantity: tempOptions.quantity + 1})} className="bg-[#537A5F] text-white p-3 rounded-lg shadow-sm hover:bg-[#43634D] transition-colors"><Plus size={20}/></button>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className={`w-full py-4 px-6 rounded-2xl font-bold shadow-xl transition-colors flex justify-between items-center group ${tempOptions.roastObj ? 'bg-[#537A5F] text-white hover:bg-[#43634D]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!tempOptions.roastObj}
              >
                <div className="flex flex-col text-left">
                  <span className="text-lg">加入購物車</span>
                  <span className="text-[10px] text-white/70 uppercase font-normal">Add to Cart</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                  $ {tempOptions.roastObj ? tempOptions.roastObj.price * tempOptions.quantity : 0}
                </div>
              </button>
            </div>
          </div>
        )}

        {}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-full md:max-w-md bg-[#537A5F] text-white py-3 px-8 rounded-full flex justify-between items-center shadow-[0_10px_40px_-10px_rgba(83,122,95,0.6)] z-40 border border-white/10">
          <button onClick={() => setView('home')} className={`p-2 transition-colors flex flex-col items-center gap-1 ${view === 'home' || view === 'detail' ? 'text-white' : 'text-[#8EBB9F]'}`}>
            <Home size={24} />
            <span className="text-[9px] uppercase tracking-wider">Home</span>
          </button>
          <button onClick={() => setView('cart')} className={`p-2 relative transition-colors flex flex-col items-center gap-1 ${view === 'cart' ? 'text-emerald-200' : 'text-[#8EBB9F]'}`}>
            <div className="relative">
              <ShoppingBag size={24} />
              {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-[#537A5F]">{cart.length}</span>}
            </div>
            <span className="text-[9px] uppercase tracking-wider">Cart</span>
          </button>
          <button className="p-2 text-[#8EBB9F] hover:text-white transition-colors flex flex-col items-center gap-1">
            <User size={24} />
            <span className="text-[9px] uppercase tracking-wider">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}