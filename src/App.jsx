import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Home, User, Plus, Minus, Trash2, Send, ArrowLeft, Search, ImageIcon, Store, Truck, Edit3 } from 'lucide-react';

// === 1. 商品資料區 (更新為完整品項) ===
// 為了避免破圖，先使用高品質的茶色漸層佔位圖
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80';
const TEA_BAG_IMG = 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=400&q=80';

const INITIAL_DATA = {
  categories: [
    { id: 'jinxuan', name: '金萱茶', nameEn: 'Jin Xuan Tea', image: DEFAULT_IMG },
    { id: 'oolong', name: '烏龍茶', nameEn: 'Oolong Tea', image: DEFAULT_IMG },
    { id: 'gaba', name: 'GABA茶', nameEn: 'GABA Tea', image: DEFAULT_IMG },
    { id: 'black', name: '小葉種紅茶', nameEn: 'Black Tea', image: DEFAULT_IMG },
    { id: 'green', name: '綠茶', nameEn: 'Green Tea', image: DEFAULT_IMG },
    { id: 'white', name: '白茶', nameEn: 'White Tea', image: DEFAULT_IMG },
    { id: 'jasmine', name: '茉莉花茶', nameEn: 'Jasmine Tea', image: DEFAULT_IMG },
    { id: 'teabag', name: '茶包組', nameEn: 'Tea Bags', image: TEA_BAG_IMG },
  ],
  products: [
    // 金萱茶
    { id: 101, catId: 'jinxuan', name: '阿里山金萱茶', nameEn: 'Alishan Jin Xuan', desc: '帶有淡雅奶香與桂花香。', image: DEFAULT_IMG, roastOptions: [{ level: '輕焙', levelEn: 'Light', price: 1200 }, { level: '中焙', levelEn: 'Medium', price: 1300 }] },
    
    // 烏龍茶
    { id: 201, catId: 'oolong', name: '高山烏龍', nameEn: 'High Mountain Oolong', desc: '喉韻甘甜，回甘持久。', image: DEFAULT_IMG, roastOptions: [{ level: '輕焙', levelEn: 'Light', price: 1500 }, { level: '中焙', levelEn: 'Medium', price: 1600 }] },
    { id: 202, catId: 'oolong', name: '紅烏龍', nameEn: 'Red Oolong', desc: '熟果香氣，滋味醇厚。', image: DEFAULT_IMG, roastOptions: [{ level: '中重焙', levelEn: 'Medium-Heavy', price: 1600 }] },
    { id: 203, catId: 'oolong', name: '紅水烏龍', nameEn: 'Red Water Oolong', desc: '傳統發酵，水色琥珀。', image: DEFAULT_IMG, roastOptions: [{ level: '重發酵', levelEn: 'Heavy Fermentation', price: 1800 }] },
    { id: 204, catId: 'oolong', name: '白烏龍', nameEn: 'White Oolong', desc: '清香淡雅，如花香撲鼻。', image: DEFAULT_IMG, roastOptions: [{ level: '輕發酵', levelEn: 'Light Fermentation', price: 1500 }] },
    
    // GABA茶
    { id: 301, catId: 'gaba', name: '佳葉龍茶 (GABA)', nameEn: 'GABA Tea', desc: '富含γ-胺基丁酸，舒緩身心。', image: DEFAULT_IMG, roastOptions: [{ level: '標準', levelEn: 'Standard', price: 2000 }] },
    
    // 小葉種紅茶
    { id: 401, catId: 'black', name: '金芽紅茶', nameEn: 'Golden Bud Black Tea', desc: '毫香顯露，滋味甜潤。', image: DEFAULT_IMG, roastOptions: [{ level: '全發酵', levelEn: 'Fully Fermented', price: 1800 }] },
    { id: 402, catId: 'black', name: '蜜香紅茶', nameEn: 'Honey Black Tea', desc: '天然蜜香，小綠葉蟬叮咬。', image: DEFAULT_IMG, roastOptions: [{ level: '全發酵', levelEn: 'Fully Fermented', price: 2200 }] },
    
    // 綠茶
    { id: 501, catId: 'green', name: '精選綠茶', nameEn: 'Premium Green Tea', desc: '保留豐富兒茶素，清爽解膩。', image: DEFAULT_IMG, roastOptions: [{ level: '不發酵', levelEn: 'Unfermented', price: 1000 }] },
    
    // 白茶
    { id: 601, catId: 'white', name: '精選白茶', nameEn: 'Premium White Tea', desc: '毫香清鮮，自然萎凋。', image: DEFAULT_IMG, roastOptions: [{ level: '微發酵', levelEn: 'Slightly Fermented', price: 1600 }] },
    
    // 茉莉花茶
    { id: 701, catId: 'jasmine', name: '頂級茉莉花茶', nameEn: 'Jasmine Green Tea', desc: '新鮮茉莉花層層窨製。', image: DEFAULT_IMG, roastOptions: [{ level: '不發酵', levelEn: 'Unfermented', price: 1500 }] },
    
    // 茶包組
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
const LIFF_ID = "2010360336-i18Jsouu"; 
const SHIPPING_FEE = { '711': 60, 'home': 100 };

export default function TeaStoreApp() {
  const [appData] = useState(INITIAL_DATA);
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempOptions, setTempOptions] = useState({ roastObj: null, quantity: 1 });
  const [shippingMethod, setShippingMethod] = useState('711');
  const [orderNote, setOrderNote] = useState(''); // 新增：訂單備註

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

  // 處理點擊分類邏輯 (智慧判斷)
  const handleCategoryClick = (cat) => {
    const productsInCat = appData.products.filter(p => p.catId === cat.id);
    setSelectedCat(cat);
    
    // 如果該分類只有一個商品，直接彈出購買選項
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
    if (!tempOptions.roastObj) {
      alert("請選擇選項");
      return;
    }
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
    setSelectedCat(null); // 清除選擇的分類，方便繼續購物回首頁
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const itemsTotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  const currentShippingFee = cart.length > 0 ? SHIPPING_FEE[shippingMethod] : 0;
  const cartTotal = itemsTotal + currentShippingFee;

  const submitOrder = async () => {
    if (cart.length === 0) return;

    const orderText = cart.map(item => {
      // 根據品項判斷單位是「斤」還是「組」
      const unit = item.catId === 'teabag' ? '組' : '斤';
      return `・${item.name} (${item.roast}) x ${item.quantity}${unit} = $${item.totalPrice}`;
    }).join('\n');
    
    const shippingText = shippingMethod === '711' ? '7-11 店到店' : '宅配到府';
    const noteText = orderNote.trim() ? `\n📝 備註: ${orderNote}` : '';
    const message = `🍵 [好茶時光 - 新訂單]\n\n${orderText}\n\n📍 商品總計: $${itemsTotal}\n🚚 運費 (${shippingText}): $${currentShippingFee}${noteText}\n💰 總結帳金額: $${cartTotal}`;

    if (GOOGLE_SHEET_API_URL) {
      try {
        await fetch(GOOGLE_SHEET_API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'new_order', cart, shippingMethod, note: orderNote, total: cartTotal })
        });
      } catch (e) {
        console.error("儲存至資料庫失敗", e);
      }
    }

    if (window.liff && window.liff.isLoggedIn()) {
      await window.liff.sendMessages([{ type: 'text', text: message }]);
      window.liff.closeWindow();
    } else {
      const lineUrl = `https://line.me/R/oaMessage/@YOUR_LINE_ID?text=${encodeURIComponent(message)}`;
      window.location.href = lineUrl;
    }
  };

  // 外層容器：限制寬度並置中，模擬手機版型
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-[#8EBB9F] selection:text-white">
      <div className="w-full max-w-md bg-[#F9FCF9] text-[#3B5E46] relative shadow-2xl overflow-hidden flex flex-col h-screen">
        
        {/* 頂部 Header */}
        <header className="shrink-0 bg-[#537A5F] text-white pt-12 pb-10 px-6 rounded-b-[2rem] relative shadow-md overflow-hidden flex flex-col items-center justify-center text-center z-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-50"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 bg-[#43634D] rounded-full opacity-50"></div>
          
          <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-3 flex items-center justify-center border border-white/20 shadow-inner">
            <ImageIcon className="text-white/70" size={28} />
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold mb-1 tracking-wider">好茶時光</h1>
            <p className="text-[#C1E3CE] text-[10px] font-medium tracking-[0.2em] uppercase">Fine Tea Time</p>
          </div>
        </header>

        {/* 主要內容區塊 (可滾動) */}
        <main className="flex-1 overflow-y-auto px-5 pt-6 pb-32 relative z-10">
          
          {view === 'home' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#537A5F]">精選茶款</h2>
                  <span className="text-xs text-[#8EBB9F] uppercase tracking-wider font-semibold">Featured Teas</span>
                </div>
                <button className="p-2 bg-emerald-50 rounded-full text-[#537A5F] hover:bg-emerald-100 transition-colors">
                  <Search size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {appData.categories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-emerald-50/50 group flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3 text-center flex-1 flex flex-col justify-center">
                      <div className="font-bold text-base text-[#537A5F]">{cat.name}</div>
                      <div className="text-[9px] text-[#8EBB9F] mt-0.5 uppercase tracking-wider">{cat.nameEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'detail' && selectedCat && (
            <div className="space-y-6 animate-fade-in">
              <button 
                onClick={() => setView('home')} 
                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-sm font-bold border border-emerald-100/50 text-[#537A5F] hover:bg-emerald-50 transition-colors"
              >
                <ArrowLeft size={16} /> 
                <div className="flex flex-col text-left leading-tight">
                  <span>返回分類</span>
                  <span className="text-[9px] text-[#8EBB9F] font-normal uppercase">Back to Categories</span>
                </div>
              </button>
              
              <div className="px-2">
                <h2 className="text-2xl font-extrabold text-[#537A5F]">{selectedCat.name}</h2>
                <span className="text-xs text-[#8EBB9F] uppercase tracking-wider font-semibold">{selectedCat.nameEn}</span>
              </div>

              <div className="space-y-4">
                {appData.products.filter(p => p.catId === selectedCat.id).map(product => {
                  const minPrice = Math.min(...product.roastOptions.map(r => r.price));
                  const unit = product.catId === 'teabag' ? '組' : '斤';
                  
                  return (
                  <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product)}
                    className="relative flex items-center bg-[#537A5F] rounded-3xl p-3 pr-5 shadow-lg cursor-pointer hover:bg-[#43634D] transition-colors group"
                  >
                    <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-md shrink-0">
                      <img src={product.image} className="w-full h-full object-cover rounded-xl" alt={product.name} loading="lazy"/>
                    </div>
                    
                    <div className="ml-4 flex-1 text-white py-2">
                      <h3 className="font-bold text-lg leading-tight mb-0.5">{product.name}</h3>
                      <div className="text-[9px] text-[#C1E3CE] mb-1.5 uppercase tracking-wider line-clamp-1">{product.nameEn}</div>
                      
                      <p className="text-[11px] text-[#C1E3CE] mb-2 line-clamp-2 opacity-90 leading-snug">{product.desc}</p>
                      
                      <div className="font-bold tracking-wider text-emerald-200 flex items-baseline">
                        <span className="text-sm font-normal mr-1">$</span>
                        {minPrice} 
                        <span className="text-[10px] font-normal text-[#C1E3CE] ml-1">起 / {unit}</span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {view === 'cart' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 px-2">
                <button onClick={() => setView('home')} className="bg-white p-2.5 rounded-full shadow-sm text-[#537A5F] hover:bg-gray-50 border border-emerald-50">
                  <ArrowLeft size={20}/>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-[#537A5F] leading-tight">您的購物車</h2>
                  <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider font-semibold">Shopping Cart</div>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-emerald-50">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-[#8EBB9F] opacity-50" />
                  <p className="text-[#537A5F] font-bold">購物車還是空的唷！</p>
                  <p className="text-xs text-[#8EBB9F] mt-1 mb-6">Your cart is currently empty.</p>
                  <button 
                    onClick={() => setView('home')}
                    className="px-8 py-3 bg-[#537A5F] text-white rounded-full font-bold shadow-md hover:bg-[#43634D] transition-colors inline-flex items-center gap-2"
                  >
                    去逛逛茶款 <span className="text-[10px] opacity-70 uppercase font-normal">Go Shopping</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => {
                    const unit = item.catId === 'teabag' ? '組' : '斤';
                    return (
                    <div key={item.cartId} className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4 border border-emerald-50">
                      <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt=""/>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#537A5F] leading-tight text-sm">{item.name}</h3>
                        
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-[#537A5F] font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {item.roast}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            {item.quantity} {unit}
                          </span>
                        </div>
                        <div className="font-bold text-[#537A5F] mt-1.5">$ {item.totalPrice}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  )})}
                  
                  <div className="mt-6 p-5 bg-white rounded-3xl shadow-sm border border-emerald-50">
                    <div className="mb-4">
                      <h3 className="font-bold text-[#537A5F] leading-tight">選擇運送方式</h3>
                      <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider">Shipping Method</div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${shippingMethod === '711' ? 'border-[#537A5F] bg-emerald-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${shippingMethod === '711' ? 'bg-[#537A5F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Store size={20} />
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${shippingMethod === '711' ? 'text-[#537A5F]' : 'text-gray-600'}`}>7-11 店到店</div>
                            <div className="text-[10px] text-gray-400 uppercase">Store Pickup</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#8EBB9F] text-sm">+$ {SHIPPING_FEE['711']}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === '711' ? 'border-[#537A5F]' : 'border-gray-300'}`}>
                            {shippingMethod === '711' && <div className="w-2.5 h-2.5 bg-[#537A5F] rounded-full"></div>}
                          </div>
                        </div>
                      </label>

                      <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${shippingMethod === 'home' ? 'border-[#537A5F] bg-emerald-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${shippingMethod === 'home' ? 'bg-[#537A5F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Truck size={20} />
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${shippingMethod === 'home' ? 'text-[#537A5F]' : 'text-gray-600'}`}>宅配到府</div>
                            <div className="text-[10px] text-gray-400 uppercase">Home Delivery</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#8EBB9F] text-sm">+$ {SHIPPING_FEE['home']}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'home' ? 'border-[#537A5F]' : 'border-gray-300'}`}>
                            {shippingMethod === 'home' && <div className="w-2.5 h-2.5 bg-[#537A5F] rounded-full"></div>}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 備註欄位 */}
                  <div className="mt-4 p-5 bg-white rounded-3xl shadow-sm border border-emerald-50">
                    <div className="mb-3 flex items-center gap-2">
                      <Edit3 size={16} className="text-[#8EBB9F]" />
                      <h3 className="font-bold text-[#537A5F] leading-tight">訂單備註 (選填)</h3>
                    </div>
                    <textarea 
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="有什麼想告訴我們的嗎？ (例如：希望的到貨時段、包裝需求...)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-[#3B5E46] focus:outline-none focus:ring-2 focus:ring-[#8EBB9F] focus:border-transparent resize-none h-24"
                    ></textarea>
                  </div>

                  <div className="mt-8 p-6 bg-[#537A5F] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-20 -mr-10 -mt-10"></div>
                    
                    <div className="space-y-3 mb-6 relative z-10 text-sm">
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>商品總計</span> <span className="text-[10px] ml-1 uppercase opacity-70">Subtotal</span></div>
                        <span className="font-medium">$ {itemsTotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#C1E3CE]">
                        <div><span>運費</span> <span className="text-[10px] ml-1 uppercase opacity-70">Shipping Fee</span></div>
                        <span className="font-medium">$ {currentShippingFee}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-6 relative z-10 pt-4 border-t border-[#6C9A7C]/50">
                      <div>
                        <div className="font-medium">總結帳金額</div>
                        <div className="text-[10px] text-[#C1E3CE] uppercase mt-0.5">Total Amount</div>
                      </div>
                      <span className="font-bold text-3xl text-emerald-200">$ {cartTotal}</span>
                    </div>
                    
                    <button 
                      onClick={submitOrder}
                      className="w-full bg-white text-[#537A5F] py-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg hover:bg-gray-50 transition relative z-10"
                    >
                      <div className="flex items-center gap-2">
                        <Send size={18}/> <span>確認結帳並傳送訂單</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setView('home')}
                      className="w-full bg-transparent border border-[#8EBB9F] text-white mt-3 py-3 rounded-2xl font-bold flex flex-col items-center justify-center hover:bg-[#6C9A7C]/50 transition relative z-10 text-sm"
                    >
                      <span>繼續購物</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* 購物選項彈出框 (Bottom Sheet) */}
        {selectedProduct && tempOptions.roastObj && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm transition-opacity">
            {/* 點擊背景關閉 */}
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)}></div>
            
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 pb-10 shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-extrabold text-[#537A5F] leading-tight mb-1">{selectedProduct.name}</h3>
                  <div className="inline-block bg-emerald-50 text-[#537A5F] font-bold px-3 py-1 rounded-lg text-sm border border-emerald-100">
                    單價 $ {tempOptions.roastObj.price} / {selectedProduct.catId === 'teabag' ? '組' : '斤'}
                  </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0">✕</button>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="mb-3">
                  <label className="block text-sm text-[#537A5F] font-bold leading-tight">1. 選擇規格</label>
                  <span className="text-[10px] text-gray-400 uppercase">Select Options</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.roastOptions.map(roast => (
                    <button 
                      key={roast.level}
                      onClick={() => setTempOptions({...tempOptions, roastObj: roast})}
                      className={`flex-1 min-w-[30%] py-2.5 px-2 rounded-xl border-2 transition-all font-medium flex flex-col items-center justify-center ${
                        tempOptions.roastObj.level === roast.level 
                        ? 'bg-[#537A5F] text-white border-[#537A5F] shadow-md' 
                        : 'bg-white text-[#537A5F] border-gray-200 hover:border-[#8EBB9F]'
                      }`}
                    >
                      <span className="text-sm">{roast.level}</span>
                      <span className={`text-[9px] mt-0.5 uppercase ${tempOptions.roastObj.level === roast.level ? 'text-[#C1E3CE]' : 'text-gray-400'}`}>
                        {roast.levelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="mb-3">
                  <label className="block text-sm text-[#537A5F] font-bold leading-tight">2. 購買數量 ({selectedProduct.catId === 'teabag' ? '組' : '斤'})</label>
                  <span className="text-[10px] text-gray-400 uppercase">Quantity</span>
                </div>
                <div className="flex items-center gap-5 w-full bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
                  <button 
                    onClick={() => setTempOptions({...tempOptions, quantity: Math.max(1, tempOptions.quantity - 1)})}
                    className="bg-gray-50 p-3 rounded-xl text-[#537A5F] hover:bg-gray-100 transition-colors"
                  ><Minus size={18}/></button>
                  <span className="font-extrabold text-2xl flex-1 text-center text-[#537A5F]">{tempOptions.quantity}</span>
                  <button 
                    onClick={() => setTempOptions({...tempOptions, quantity: tempOptions.quantity + 1})}
                    className="bg-[#537A5F] text-white p-3 rounded-xl shadow-sm hover:bg-[#43634D] transition-colors"
                  ><Plus size={18}/></button>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className="w-full bg-[#537A5F] text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:bg-[#43634D] transition-colors flex justify-between items-center group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-base">加入購物車</span>
                </div>
                <div className="bg-white/20 px-4 py-1.5 rounded-xl group-hover:bg-white/30 transition-colors">
                  $ {tempOptions.roastObj.price * tempOptions.quantity}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 底部導覽列 (絕對定位在手機容器底部) */}
        <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-[#537A5F] text-white py-3 px-8 rounded-full flex justify-between items-center shadow-[0_10px_30px_-5px_rgba(83,122,95,0.7)] z-30 border border-white/10">
          <button 
            onClick={() => setView('home')} 
            className={`p-2 transition-colors flex flex-col items-center gap-1 ${view === 'home' || view === 'detail' ? 'text-white' : 'text-[#8EBB9F]'}`}
          >
            <Home size={22} />
            <span className="text-[8px] uppercase tracking-wider">Home</span>
          </button>
          <button 
            onClick={() => setView('cart')} 
            className={`p-2 relative transition-colors flex flex-col items-center gap-1 ${view === 'cart' ? 'text-emerald-200' : 'text-[#8EBB9F]'}`}
          >
            <div className="relative">
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-[#537A5F]">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-[8px] uppercase tracking-wider">Cart</span>
          </button>
          <button className="p-2 text-[#8EBB9F] hover:text-white transition-colors flex flex-col items-center gap-1">
            <User size={22} />
            <span className="text-[8px] uppercase tracking-wider">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}