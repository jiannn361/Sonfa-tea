import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Home, User, Plus, Minus, Trash2, Send, ArrowLeft, Search, ImageIcon, Store, Truck } from 'lucide-react';

// === 1. 商品資料區 ===
const INITIAL_DATA = {
  categories: [
    { id: 'oolong', name: '烏龍茶', nameEn: 'Oolong Tea', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80' },
    { id: 'black', name: '紅茶', nameEn: 'Black Tea', image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&w=400&q=80' },
    { id: 'green', name: '綠茶', nameEn: 'Green Tea', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=400&q=80' },
    { id: 'white', name: '白茶', nameEn: 'White Tea', image: 'https://images.unsplash.com/photo-1599557451480-1a74d284f18c?auto=format&fit=crop&w=400&q=80' },
  ],
  products: [
    { 
      id: 1, catId: 'oolong', name: '阿里山金萱', nameEn: 'Alishan Jin Xuan', desc: '帶有淡雅奶香與桂花香，口感滑順。', 
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=400&q=80',
      roastOptions: [
        { level: '輕焙', levelEn: 'Light', price: 1200 },
        { level: '中焙', levelEn: 'Medium', price: 1300 }
      ] 
    },
    { 
      id: 2, catId: 'oolong', name: '高山冷礦烏龍', nameEn: 'High Mountain Cold Oolong', desc: '喉韻甘甜，冷礦味十足，回甘持久。', 
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
      roastOptions: [
        { level: '輕焙', levelEn: 'Light', price: 1500 },
        { level: '中焙', levelEn: 'Medium', price: 1600 },
        { level: '重焙', levelEn: 'Heavy', price: 1700 }
      ] 
    },
    { 
      id: 3, catId: 'black', name: '日月潭紅玉', nameEn: 'Sun Moon Lake Ruby Black', desc: '天然肉桂香與薄荷香，久泡不澀。', 
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
      roastOptions: [
        { level: '中焙', levelEn: 'Medium', price: 1800 }
      ] 
    },
  ]
};

// === 2. 系統設定 ===
const GOOGLE_SHEET_API_URL = ""; 
const LIFF_ID = ""; 
const SHIPPING_FEE = { '711': 60, 'home': 100 };

export default function TeaStoreApp() {
  const [appData] = useState(INITIAL_DATA);
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempOptions, setTempOptions] = useState({ roastObj: null, quantity: 1 });
  const [shippingMethod, setShippingMethod] = useState('711');

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setTempOptions({ roastObj: product.roastOptions[0], quantity: 1 });
  };

  const addToCart = () => {
    if (!tempOptions.roastObj) {
      alert("請選擇烘焙程度");
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
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const itemsTotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  const currentShippingFee = cart.length > 0 ? SHIPPING_FEE[shippingMethod] : 0;
  const cartTotal = itemsTotal + currentShippingFee;

  const submitOrder = async () => {
    if (cart.length === 0) return;

    const orderText = cart.map(item => 
      `・${item.name} (${item.roast}) x ${item.quantity}斤 = $${item.totalPrice}`
    ).join('\n');
    
    const shippingText = shippingMethod === '711' ? '7-11 店到店' : '宅配到府';
    const message = `🍵 [好茶時光 - 新訂單]\n\n${orderText}\n\n📍 商品總計: $${itemsTotal}\n🚚 運費 (${shippingText}): $${currentShippingFee}\n💰 總結帳金額: $${cartTotal}`;

    if (GOOGLE_SHEET_API_URL) {
      try {
        await fetch(GOOGLE_SHEET_API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'new_order', cart, shippingMethod, total: cartTotal })
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

  return (
    <div className="min-h-screen bg-[#F9FCF9] text-[#3B5E46] font-sans pb-28 selection:bg-[#8EBB9F] selection:text-white">
      
      <header className="bg-[#537A5F] text-white pt-16 pb-12 px-6 rounded-b-[2.5rem] relative shadow-lg overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-50"></div>
        <div className="absolute top-10 -left-10 w-32 h-32 bg-[#43634D] rounded-full opacity-50"></div>
        
        <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-4 flex items-center justify-center border border-white/20 shadow-inner">
          <ImageIcon className="text-white/70" size={32} />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-1 tracking-wider">好茶時光</h1>
          <p className="text-[#C1E3CE] text-xs font-medium tracking-[0.2em] uppercase">Fine Tea Time</p>
        </div>
      </header>

      <main className="px-5 mt-6 relative z-20">
        
        {view === 'home' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div>
                <h2 className="text-2xl font-extrabold text-[#537A5F]">精選茶款</h2>
                <span className="text-xs text-[#8EBB9F] uppercase tracking-wider font-semibold">Featured Teas</span>
              </div>
              <Search className="text-[#8EBB9F]" size={20} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {appData.categories.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => { setSelectedCat(cat); setView('detail'); }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-emerald-50 group"
                >
                  <div className="overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-bold text-lg text-[#537A5F]">{cat.name}</div>
                    <div className="text-[10px] text-[#8EBB9F] mt-0.5 uppercase tracking-widest">{cat.nameEn}</div>
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
              className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-sm font-bold border border-emerald-100 text-[#537A5F] hover:bg-emerald-50 transition-colors"
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

            <div className="space-y-5">
              {appData.products.filter(p => p.catId === selectedCat.id).map(product => {
                const minPrice = Math.min(...product.roastOptions.map(r => r.price));
                
                return (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product)}
                  className="relative flex items-center bg-[#537A5F] rounded-[2rem] p-4 pr-6 shadow-xl my-8 cursor-pointer hover:bg-[#43634D] transition-colors group"
                >
                  <div className="w-28 h-32 -ml-8 bg-[#E2E8E4] rounded-2xl p-1 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img src={product.image} className="w-full h-full object-cover rounded-xl" alt={product.name}/>
                  </div>
                  
                  <div className="ml-4 flex-1 text-white">
                    <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                    <div className="text-[10px] text-[#C1E3CE] mb-2 font-light uppercase tracking-wider line-clamp-1">{product.nameEn}</div>
                    
                    <p className="text-xs text-[#C1E3CE] mb-3 line-clamp-2 opacity-80">{product.desc}</p>
                    
                    <div className="font-bold tracking-wider text-emerald-200">
                      <span className="text-sm font-normal mr-1">$</span>
                      {minPrice} 
                      <span className="text-[10px] font-normal text-[#C1E3CE] ml-1">起 / 斤 (Start from)</span>
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
              <button onClick={() => setView('detail')} className="bg-white p-2.5 rounded-full shadow-sm text-[#537A5F] hover:bg-gray-50">
                <ArrowLeft size={20}/>
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#537A5F] leading-tight">您的購物車</h2>
                <div className="text-[10px] text-[#8EBB9F] uppercase tracking-wider font-semibold">Shopping Cart</div>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
                <ShoppingBag size={48} className="mx-auto mb-4 text-[#8EBB9F] opacity-50" />
                <p className="text-[#537A5F] font-bold">購物車還是空的唷！</p>
                <p className="text-xs text-[#8EBB9F] mt-1 mb-6">Your cart is currently empty.</p>
                <button 
                  onClick={() => setView('home')}
                  className="px-8 py-3 bg-[#537A5F] text-white rounded-full font-bold shadow-md hover:bg-[#43634D] transition-colors"
                >
                  去逛逛茶款 <span className="text-[10px] ml-1 opacity-70 uppercase font-normal">Go Shopping</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.cartId} className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center gap-4 border border-emerald-50">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt=""/>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#537A5F] leading-tight">{item.name}</h3>
                      <div className="text-[9px] text-gray-400 uppercase mb-1">{item.nameEn}</div>
                      
                      <p className="text-xs text-[#8EBB9F] font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded-md">
                        {item.roast} · {item.quantity} 斤
                      </p>
                      <div className="font-bold text-[#537A5F] mt-1">$ {item.totalPrice}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                ))}
                
                <div className="mt-6 p-5 bg-white rounded-[2rem] shadow-sm border border-emerald-50">
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
                        <input type="radio" name="shipping" value="711" checked={shippingMethod === '711'} onChange={() => setShippingMethod('711')} className="w-5 h-5 accent-[#537A5F]"/>
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
                        <input type="radio" name="shipping" value="home" checked={shippingMethod === 'home'} onChange={() => setShippingMethod('home')} className="w-5 h-5 accent-[#537A5F]"/>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#537A5F] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#6C9A7C] rounded-full opacity-20 -mr-10 -mt-10"></div>
                  
                  <div className="space-y-3 mb-6 relative z-10 text-sm">
                    <div className="flex justify-between items-center text-[#C1E3CE]">
                      <div>
                        <span>商品總計</span> <span className="text-[10px] ml-1 uppercase opacity-70">Subtotal</span>
                      </div>
                      <span className="font-medium">$ {itemsTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#C1E3CE]">
                      <div>
                        <span>運費</span> <span className="text-[10px] ml-1 uppercase opacity-70">Shipping Fee</span>
                      </div>
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
                    className="w-full bg-white text-[#537A5F] py-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg hover:bg-gray-100 transition relative z-10"
                  >
                    <div className="flex items-center gap-2">
                      <Send size={18}/> <span>傳送訂單至 LINE</span>
                    </div>
                    <span className="text-[10px] font-normal text-gray-500 uppercase mt-0.5">Send Order via LINE</span>
                  </button>

                  <button 
                    onClick={() => setView('home')}
                    className="w-full bg-transparent border border-[#8EBB9F] text-white mt-3 py-3.5 rounded-2xl font-bold flex flex-col items-center justify-center hover:bg-[#6C9A7C]/50 transition relative z-10"
                  >
                    <span>繼續購物</span>
                    <span className="text-[9px] font-normal text-[#C1E3CE] uppercase mt-0.5">Continue Shopping</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedProduct && tempOptions.roastObj && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-12 shadow-2xl relative animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#537A5F] leading-tight">{selectedProduct.name}</h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 mb-2">{selectedProduct.nameEn}</p>
                <div className="inline-block bg-emerald-50 text-[#537A5F] font-bold px-3 py-1 rounded-lg text-sm border border-emerald-100">
                  單價 $ {tempOptions.roastObj.price} / 斤
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 bg-gray-50 hover:bg-gray-100 p-2.5 rounded-full transition-colors">✕</button>
            </div>
            
            <div className="mb-6 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
              <div className="mb-3">
                <label className="block text-sm text-[#537A5F] font-bold leading-tight">1. 選擇烘焙程度</label>
                <span className="text-[10px] text-gray-400 uppercase">Select Roast Level</span>
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
                <label className="block text-sm text-[#537A5F] font-bold leading-tight">2. 購買數量 (斤)</label>
                <span className="text-[10px] text-gray-400 uppercase">Quantity (Catty)</span>
              </div>
              <div className="flex items-center gap-5 w-full bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                <button 
                  onClick={() => setTempOptions({...tempOptions, quantity: Math.max(1, tempOptions.quantity - 1)})}
                  className="bg-gray-50 p-3 rounded-lg text-[#537A5F] hover:bg-gray-100 transition-colors"
                ><Minus size={20}/></button>
                <span className="font-extrabold text-2xl flex-1 text-center text-[#537A5F]">{tempOptions.quantity}</span>
                <button 
                  onClick={() => setTempOptions({...tempOptions, quantity: tempOptions.quantity + 1})}
                  className="bg-[#537A5F] text-white p-3 rounded-lg shadow-sm hover:bg-[#43634D] transition-colors"
                ><Plus size={20}/></button>
              </div>
            </div>

            <button 
              onClick={addToCart}
              className="w-full bg-[#537A5F] text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:bg-[#43634D] transition-colors flex justify-between items-center group"
            >
              <div className="flex flex-col text-left">
                <span className="text-lg">加入購物車</span>
                <span className="text-[10px] text-[#C1E3CE] uppercase font-normal">Add to Cart</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                $ {tempOptions.roastObj.price * tempOptions.quantity}
              </div>
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#537A5F] text-white py-3 px-8 rounded-full flex justify-between items-center shadow-[0_10px_40px_-10px_rgba(83,122,95,0.6)] z-40 border border-white/10">
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
  );
}