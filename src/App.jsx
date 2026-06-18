import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Home, User, Plus, Minus, Trash2, Send, ArrowLeft, Search, ImageIcon, Store, Truck, Edit3, UserCircle, Phone, MapPin, X, Clock, RefreshCw } from 'lucide-react';

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

const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzJmuBcwu8rrU_WrDNrqBUQwpnCH4O_qy-Z1ZzyTRtPrl4VrvOLOcrFSK6BJWzshMod/exec"; 
const LIFF_ID = "2010360336-i18Jsouu"; 
const LINE_OA_ID = "@930nydzu"; 
const SHIPPING_FEE = { '711': 60, 'home': 100 };
const FREE_SHIPPING_THRESHOLD = 2000;

export default function TeaStoreApp() {
  const [appData] = useState(INITIAL_DATA);
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempOptions, setTempOptions] = useState({ roastObj: null, quantity: 1 });
  
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('711');
  const [shippingAddress, setShippingAddress] = useState(''); 
  const [orderNote, setOrderNote] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('teaOrderHistory') || '[]');
    setOrderHistory(history);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = isLargeFont ? '18px' : '16px';
  }, [isLargeFont]);

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
    const initialQty = product.catId === 'teabag' ? 1 : 0.5;
    setTempOptions({ roastObj: product.roastOptions[0], quantity: initialQty });
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

  const reorder = (pastOrderItems) => {
    const itemsWithNewId = pastOrderItems.map(item => ({...item, cartId: Date.now() + Math.random()}));
    setCart([...cart, ...itemsWithNewId]);
    setView('cart');
  };

  const itemsTotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  
  const currentShippingFee = itemsTotal >= FREE_SHIPPING_THRESHOLD 
    ? 0 
    : (cart.length > 0 ? SHIPPING_FEE[shippingMethod] : 0);
  
  const cartTotal = itemsTotal + currentShippingFee;

  const submitOrder = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setFormError('⚠️ 訂單無法送出：請確實填寫「姓名」、「電話」與「運送地址/門市」喔！');
      return;
    }
    setFormError(''); 

    const shippingText = shippingMethod === '711' ? '7-11 店到店' : '宅配到府';
    const noteText = orderNote.trim() ? `\n📝 備註: ${orderNote}` : '';
    
    const orderText = cart.map(item => {
      const unit = item.catId === 'teabag' ? '組' : '斤';
      return `・${item.name} (${item.roast}) x ${String(item.quantity)}${unit} = $${String(item.totalPrice)}`;
    }).join('\n');
    
    const textMessage = `🍵 [崧發茶園好茶時光 - 新訂單]\n\n👤 姓名: ${customerName}\n📱 電話: ${customerPhone}\n🚚 運送 (${shippingText}): ${shippingAddress}\n\n${orderText}\n\n📍 商品總計: $${String(itemsTotal)}\n📦 運費: $${String(currentShippingFee)}${noteText}\n💰 總結帳金額: $${String(cartTotal)}`;

    const flexMessage = {
      type: "bubble",
      body: {
        type: "box", layout: "vertical", paddingAll: "xl",
        contents: [
          { type: "text", text: "崧發茶園 訂單明細", weight: "bold", size: "xl", color: "#537A5F", wrap: true },
          { type: "separator", margin: "lg" },
          {
            type: "box", layout: "vertical", margin: "lg", spacing: "sm",
            contents: [
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "姓名", size: "sm", color: "#aaaaaa", flex: 1 }, { type: "text", text: String(customerName || '-'), size: "sm", color: "#333333", flex: 3, wrap: true } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "電話", size: "sm", color: "#aaaaaa", flex: 1 }, { type: "text", text: String(customerPhone || '-'), size: "sm", color: "#333333", flex: 3, wrap: true } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: shippingMethod === '711' ? "門市" : "地址", size: "sm", color: "#aaaaaa", flex: 1 }, { type: "text", text: String(shippingAddress || '-'), size: "sm", color: "#333333", flex: 3, wrap: true } ] }
            ]
          },
          { type: "separator", margin: "lg" },
          {
            type: "box", layout: "vertical", margin: "lg", spacing: "sm",
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
          {
            type: "box", layout: "vertical", margin: "lg", spacing: "sm",
            contents: [
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "商品總計", size: "sm", color: "#555555" }, { type: "text", text: `$${String(itemsTotal)}`, size: "sm", color: "#111111", align: "end" } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: currentShippingFee === 0 ? "運費 (滿額免運)" : "運費", size: "sm", color: currentShippingFee === 0 ? "#8EBB9F" : "#555555", weight: currentShippingFee === 0 ? "bold" : "regular" }, { type: "text", text: `$${String(currentShippingFee)}`, size: "sm", color: currentShippingFee === 0 ? "#8EBB9F" : "#111111", align: "end", weight: currentShippingFee === 0 ? "bold" : "regular" } ] }
            ]
          },
          { type: "separator", margin: "lg" },
          {
            type: "box", layout: "horizontal", margin: "lg",
            contents: [
              { type: "text", text: "結帳金額", size: "md", color: "#111111", weight: "bold" },
              { type: "text", text: `$${String(cartTotal)}`, size: "lg", color: "#537A5F", weight: "bold", align: "end" }
            ]
          }
        ]
      }
    };

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
        await fetch(GOOGLE_SHEET_API_URL, { method: 'POST', body: JSON.stringify({ action: 'new_order', customerName, customerPhone, shippingMethod, shippingAddress, note: orderNote, cart, total: cartTotal }) });
      } catch (e) { console.error("儲存失敗", e); }
    }

    const newOrderRecord = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      items: cart,
      total: cartTotal
    };
    
    const updatedHistory = [newOrderRecord, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem('teaOrderHistory', JSON.stringify(updatedHistory));

    if (window.liff && window.liff.isLoggedIn()) {
      try {
        await window.liff.sendMessages([{ type: 'flex', altText: `收到新訂單 (${customerName})：總計 $${String(cartTotal)}`, contents: flexMessage }]);
        window.liff.closeWindow(); 
      } catch (error) {
        setFormError(`⚠️ 圖卡失敗。改用純文字傳送...`);
        setTimeout(() => {
          const lineUrl = `https://line.me/R/oaMessage/${LINE_OA_ID}?text=${encodeURIComponent(textMessage)}`;
          window.location.href = lineUrl;
        }, 2000);
      }
    } else {
      const lineUrl = `https://line.me/R/oaMessage/${LINE_OA_ID}?text=${encodeURIComponent(textMessage)}`;
      window.location.href = lineUrl;
    }
  };

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : appData.products.filter(p => 
        p.name.includes(searchQuery) || 
        p.desc.includes(searchQuery) || 
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-[#EAEFEA] flex justify-center selection:bg-[#8EBB9F] selection:text-white font-sans transition-all duration-300">
      <div className="w-full md:max-w-2xl lg:max-w-4xl bg-[#F9FCF9] text-[#3B5E46] relative shadow-[0_0_50px_-15px_rgba(0,0,0,0.1)] flex flex-col min-h-screen pb-28">
        
        <header className="bg-[#537A5F] text-white pt-16 pb-12 px-6 md:rounded-b-[3.5rem] rounded-b-[2.5rem] relative shadow-lg overflow-hidden flex flex-col items-center justify-center text-center">
          <button 
            onClick={() => setIsLargeFont(!isLargeFont)}
            className="absolute top-6 right-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 transition-colors border border-white/30"
          >
            <span className="text-[10px]">A</span><span className="text-base">A</span>
          </button>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-50"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 bg-[#43634D] rounded-full opacity-50"></div>
          
          <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mb-4 flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
            <img 
              src="/logo.png" 
              alt="好茶時光" 
              className="w-full h-full object-cover z-20 relative"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <ImageIcon className="text-white/70 absolute z-10" size={32} />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-wider">好茶時光</h1>
            <p className="text-[#C1E3CE] text-xs md:text-sm font-medium tracking-[0.2em] uppercase mt-2">Fine Tea Time</p>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-10 mt-8 relative z-20">
          
          {/* 首頁 (包含搜尋與分類) */}
          {view === 'home' && (
            <div className="space-y-6">
              <div className="relative flex justify-center items-center px-2 mb-2">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-[#537A5F]">{isSearching ? '尋找茶款' : '精選茶款'}</h2>
                  <span className="text-xs text-[#8EBB9F] uppercase tracking-wider font-semibold">{isSearching ? 'Search' : 'Featured Teas'}</span>
                </div>
                <button 
                  onClick={() => { setIsSearching(!isSearching); setSearchQuery(''); }}
                  className={`absolute right-0 p-2.5 rounded-full transition-colors ${isSearching ? 'bg-[#537A5F] text-white shadow-md' : 'bg-emerald-50 text-[#537A5F] hover:bg-emerald-100'}`}
                >
                  {isSearching ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              {/* 搜尋框 */}
              {isSearching && (
                <div className="px-2 animate-slide-up">
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8EBB9F]" />
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="請輸入茶款名稱或關鍵字..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border-2 border-emerald-100 rounded-2xl py-4 pl-12 pr-4 text-[#537A5F] font-medium focus:outline-none focus:border-[#537A5F] focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}
              
              {/* 搜尋結果列表 (移除圖片，改為純文字置中) */}
              {isSearching && searchQuery.trim() !== '' ? (
                <div className="space-y-4">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">找不到符合「{searchQuery}」的茶款</div>
                  ) : (
                    searchResults.map(product => {
                      const minPrice = Math.min(...product.roastOptions.map(r => r.price));
                      return (
                      <div 
                        key={product.id} 
                        onClick={() => handleProductClick(product)}
                        className="bg-[#537A5F] rounded-[2rem] p-5 shadow-md cursor-pointer hover:bg-[#43634D] transition-colors text-center"
                      >
                        <div className="text-white">
                          <h3 className="font-bold text-xl leading-tight mb-1">{product.name}</h3>
                          <p className="text-xs text-[#C1E3CE] mb-3 opacity-80">{product.desc}</p>
                          <div className="font-bold text-emerald-200 inline-block bg-white/10 px-4 py-1.5 rounded-xl text-sm">$ {minPrice} 起</div>
                        </div>
                      </div>
                    )})
                  )}
                </div>
              ) : !isSearching && (
                /* 原始分類大項列表 (保留分類的圖片) */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
                  {appData.categories.map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-emerald-50 group flex flex-col"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#E2E8E4]">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }} />
                      </div>
                      <div className="p-4 md:p-5 text-center flex-1 flex flex-col justify-center">
                        <div className="font-bold text-lg text-[#537A5F]">{cat.name}</div>
                        <div className="text-[10px] text-[#8EBB9F] mt-1 uppercase tracking-widest">{cat.nameEn}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 分類詳情頁 (單純品項，移除照片位子) */}
          {view === 'detail' && selectedCat && (
            <div className="space-y-6 animate-fade-in md:max-w-3xl md:mx-auto">
              <div className="relative flex justify-center items-center px-2 border-b border-gray-100 pb-5 mb-2">
                <button onClick={() => setView('home')} className="absolute left-0 flex items-center justify-center bg-white w-10 h-10 rounded-full shadow-sm border border-emerald-100 text-[#537A5F] hover:bg-emerald-50 transition-colors">
                  <ArrowLeft size={20} /> 
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-[#537A5F]">{selectedCat.name}</h2>
                  <span className="text-sm text-[#8EBB9F] uppercase tracking-wider font-semibold block mt-1">{selectedCat.nameEn}</span>
                </div>
              </div>

              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                {appData.products.filter(p => p.catId === selectedCat.id).map(product => {
                  const minPrice = Math.min(...product.roastOptions.map(r => r.price));
                  return (
                  <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product)}
                    className="bg-[#537A5F] rounded-[2rem] p-6 shadow-xl cursor-pointer hover:bg-[#43634D] transition-colors text-center group"
                  >
                    <div className="text-white">
                      <h3 className="font-bold text-xl leading-tight mb-1">{product.name}</h3>
                      <div className="text-[10px] text-[#C1E3CE] mb-3 font-light uppercase tracking-wider">{product.nameEn}</div>
                      <p className="text-sm text-[#C1E3CE] mb-5 opacity-90 leading-relaxed">{product.desc}</p>
                      <div className="font-bold tracking-wider text-emerald-200 bg-white/10 py-2.5 px-5 rounded-xl inline-block">
                        <span className="text-sm font-normal mr-1">$</span>{minPrice} 
                        <span className="text-[10px] font-normal text-[#C1E3CE] ml-1">起 / {product.catId === 'teabag' ? '組' : '斤'}</span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* 會員歷史紀錄頁面 */}
          {view === 'profile' && (
            <div className="space-y-6 animate-fade-in md:max-w-2xl md:mx-auto">
              <div className="flex flex-col items-center gap-2 px-2 mb-8 text-center">
                <div className="bg-[#537A5F] p-3.5 rounded-full text-white shadow-md">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#537A5F] leading-tight">會員紀錄</h2>
                  <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider font-semibold mt-1">Order History</div>
                </div>
              </div>

              {orderHistory.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                  <Clock size={48} className="mx-auto mb-4 text-[#8EBB9F] opacity-50" />
                  <p className="text-[#537A5F] font-bold text-lg">尚無訂單紀錄</p>
                  <p className="text-xs text-[#8EBB9F] mt-1">您過去的購買明細會顯示在這裡。</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {orderHistory.map(order => (
                    <div key={order.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-emerald-50">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                        <div className="text-sm text-gray-500 flex items-center gap-1.5"><Clock size={14}/> {order.date}</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-[#537A5F] font-medium">{item.name} <span className="text-xs text-gray-400">({item.roast})</span></span>
                            <span className="text-gray-600">x{item.quantity} {item.catId === 'teabag' ? '組' : '斤'}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="font-bold text-[#537A5F]">總計 $ {order.total}</span>
                        <button 
                          onClick={() => reorder(order.items)}
                          className="flex items-center gap-1.5 bg-[#537A5F] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#43634D] transition-colors"
                        >
                          <RefreshCw size={14} /> 再次購買
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 購物車頁面 */}
          {view === 'cart' && (
            <div className="space-y-6 animate-fade-in md:max-w-2xl md:mx-auto">
              <div className="relative flex justify-center items-center px-2 mb-4">
                <button onClick={() => setView('home')} className="absolute left-0 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm text-[#537A5F] hover:bg-emerald-50 border border-emerald-100">
                  <ArrowLeft size={20}/>
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-[#537A5F] leading-tight">購物車</h2>
                  <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider font-semibold mt-1">Shopping Cart</div>
                </div>
              </div>

              {/* 免運進度條提示 */}
              <div className="bg-gradient-to-r from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm">
                <div className="bg-[#537A5F] text-white p-2 rounded-full"><Truck size={18} /></div>
                <div className="flex-1">
                  {itemsTotal >= FREE_SHIPPING_THRESHOLD ? (
                    <div className="font-bold text-[#537A5F]">🎉 太棒了！本單已享免運費</div>
                  ) : (
                    <>
                      <div className="font-bold text-[#537A5F] text-sm">滿 $2000 即享免運費</div>
                      <div className="text-xs text-[#8EBB9F] mt-0.5">還差 <span className="font-bold text-red-400">${FREE_SHIPPING_THRESHOLD - itemsTotal}</span> 即可達標</div>
                    </>
                  )}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-[#8EBB9F] opacity-50" />
                  <p className="text-[#537A5F] font-bold text-lg">購物車還是空的唷！</p>
                  <button onClick={() => setView('home')} className="mt-6 px-8 py-3 bg-[#537A5F] text-white rounded-full font-bold shadow-md hover:bg-[#43634D]">
                    去逛逛茶款
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map(item => (
                    <div key={item.cartId} className="bg-white p-5 rounded-[2rem] shadow-sm flex flex-col gap-3 border border-emerald-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#537A5F] text-lg leading-tight">{item.name}</h3>
                          <div className="text-[9px] text-gray-400 uppercase mb-2 mt-1">{item.nameEn}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-colors shrink-0">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                      <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-1">
                        <p className="text-xs text-[#8EBB9F] font-medium bg-emerald-50 inline-block px-3 py-1.5 rounded-lg">
                          {item.roast} · {item.quantity} {item.catId === 'teabag' ? '組' : `斤 ${item.quantity === 0.5 ? '(半斤)' : ''}`}
                        </p>
                        <div className="font-bold text-[#537A5F] text-xl">$ {item.totalPrice}</div>
                      </div>
                    </div>
                  ))}

                  {/* 繼續購物按鈕 */}
                  <button 
                    onClick={() => setView('home')} 
                    className="w-full py-4 border-2 border-dashed border-[#8EBB9F] text-[#537A5F] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                  >
                    <Plus size={20} /> 繼續選購其他茶款
                  </button>
                  
                  <div className="mt-8 p-6 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                    <div className="mb-5 flex items-center gap-2">
                      <UserCircle size={20} className="text-[#537A5F]" />
                      <div>
                        <h3 className="font-bold text-[#537A5F] text-lg leading-tight">訂購人資訊 (必填)</h3>
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

                  <div className="mt-4 p-6 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                    <div className="mb-5">
                      <h3 className="font-bold text-[#537A5F] text-lg leading-tight">選擇運送方式 (必填)</h3>
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
                      <h3 className="font-bold text-[#537A5F] text-lg leading-tight">訂單備註 (選填)</h3>
                    </div>
                    <textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="有什麼想告訴我們的嗎？(例如：希望的出貨時間等)" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-[#537A5F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8EBB9F] focus:bg-white transition-all resize-none h-28"/>
                  </div>

                  <div className="mt-8 p-8 bg-[#537A5F] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#6C9A7C] rounded-full opacity-20 -mr-12 -mt-12"></div>
                    <div className="space-y-4 mb-6 relative z-10 text-sm">
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>商品總計</span></div>
                        <span className="font-medium text-lg">$ {itemsTotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>運費</span></div>
                        <span className="font-medium text-lg">
                          {currentShippingFee === 0 ? <span className="text-emerald-200 font-bold">滿額免運 ($0)</span> : `$ ${currentShippingFee}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-8 relative z-10 pt-5 border-t border-[#6C9A7C]/50">
                      <div>
                        <div className="font-medium text-lg">總結帳金額</div>
                      </div>
                      <span className="font-bold text-4xl text-emerald-200">$ {cartTotal}</span>
                    </div>
                    
                    {formError && (
                      <div className="bg-red-500/20 border border-red-400 text-red-100 text-xs font-bold p-3 rounded-xl mb-4 relative z-10 text-center animate-bounce">
                        {formError}
                      </div>
                    )}

                    <button onClick={submitOrder} className="w-full bg-white text-[#537A5F] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 transition relative z-10 text-lg">
                      <Send size={20}/> <span>確認送出訂單</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

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
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                <div className="mb-3 flex justify-between items-end">
                  <label className="block text-sm text-[#537A5F] font-bold leading-tight">
                    2. 購買數量 ({selectedProduct.catId === 'teabag' ? '組' : '斤'})
                  </label>
                  {selectedProduct.catId !== 'teabag' && <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">可選 0.5 斤 (半斤)</span>}
                </div>
                <div className="flex items-center gap-5 w-full bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                  <button 
                    onClick={() => {
                      const step = selectedProduct.catId === 'teabag' ? 1 : 0.5;
                      const minQty = selectedProduct.catId === 'teabag' ? 1 : 0.5;
                      setTempOptions({...tempOptions, quantity: Math.max(minQty, tempOptions.quantity - step)});
                    }} 
                    className="bg-gray-50 p-3 rounded-lg text-[#537A5F] hover:bg-gray-100 transition-colors"
                  ><Minus size={20}/></button>
                  <span className="font-extrabold text-2xl flex-1 text-center text-[#537A5F]">
                    {tempOptions.quantity} {tempOptions.quantity === 0.5 ? <span className="text-sm text-gray-400 font-normal">(半斤)</span> : ''}
                  </span>
                  <button 
                    onClick={() => {
                      const step = selectedProduct.catId === 'teabag' ? 1 : 0.5;
                      setTempOptions({...tempOptions, quantity: tempOptions.quantity + step});
                    }} 
                    className="bg-[#537A5F] text-white p-3 rounded-lg shadow-sm hover:bg-[#43634D] transition-colors"
                  ><Plus size={20}/></button>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className={`w-full py-4 px-6 rounded-2xl font-bold shadow-xl transition-colors flex justify-between items-center group ${tempOptions.roastObj ? 'bg-[#537A5F] text-white hover:bg-[#43634D]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!tempOptions.roastObj}
              >
                <div className="flex flex-col text-left">
                  <span className="text-lg">加入購物車</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                  $ {tempOptions.roastObj ? tempOptions.roastObj.price * tempOptions.quantity : 0}
                </div>
              </button>
            </div>
          </div>
        )}

        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-full md:max-w-md bg-[#537A5F] text-white py-3 px-8 rounded-full flex justify-between items-center shadow-[0_10px_40px_-10px_rgba(83,122,95,0.6)] z-40 border border-white/10">
          <button onClick={() => {setView('home'); setIsSearching(false);}} className={`p-2 transition-colors flex flex-col items-center gap-1.5 ${view === 'home' || view === 'detail' ? 'text-white' : 'text-[#8EBB9F]'}`}>
            <Home size={22} />
            <span className="text-[10px] font-bold">首頁</span>
          </button>
          <button onClick={() => setView('cart')} className={`p-2 relative transition-colors flex flex-col items-center gap-1.5 ${view === 'cart' ? 'text-emerald-200' : 'text-[#8EBB9F]'}`}>
            <div className="relative">
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-[#537A5F]">{cart.length}</span>}
            </div>
            <span className="text-[10px] font-bold">購物車</span>
          </button>
          <button onClick={() => setView('profile')} className={`p-2 transition-colors flex flex-col items-center gap-1.5 ${view === 'profile' ? 'text-white' : 'text-[#8EBB9F]'}`}>
            <User size={22} />
            <span className="text-[10px] font-bold">會員紀錄</span>
          </button>
        </nav>
      </div>
    </div>
  );
}