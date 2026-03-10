"use client";
import { useState, useEffect, useMemo } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

// ── Types ────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating?: number;
  reviews?: number;
  category: string;
  badge?: string | null;
  badgeColor?: string;
  icon?: string;
  image?: string | null;
  dealer?: number;
}

const categories = [
  "All Categories",
  "Fertilizers & Soil",
  "Certified Seeds",
  "Agro-Chemicals",
  "Farm Tools",
  "Machinery",
];

// Map API response fields to our Product type
function mapApiProduct(p: Record<string, unknown>): Product {
  return {
    id: p.id as number,
    name: (p.name ?? p.product_name ?? "Unnamed Product") as string,
    description: (p.description ?? p.details ?? "") as string,
    price: Number(p.price ?? p.unit_price ?? 0),
    rating: p.rating ? Number(p.rating) : undefined,
    reviews: p.reviews ? Number(p.reviews) : undefined,
    category: (p.category ?? p.product_category ?? "Other") as string,
    badge: (p.badge ?? null) as string | null,
    badgeColor: (p.badge_color ?? "") as string,
    icon: (p.icon ?? "inventory_2") as string,
    image: (p.image ?? null) as string | null,
    dealer: p.dealer as number | undefined,
  };
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // ── API products ──────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchProducts = (showLoader = true) => {
    if (showLoader) setProductsLoading(true);
    setProductsError(null);
    lesseeApi
      .shopProducts()
      .then((res) => {
        const data = (res.data?.results ?? res.data) as Record<string, unknown>[];
        setProducts(Array.isArray(data) ? data.map(mapApiProduct) : []);
      })
      .catch(() => setProductsError("Could not load products. Please try again."))
      .finally(() => { if (showLoader) setProductsLoading(false); });
  };

  useEffect(() => { 
    fetchProducts(); 
    // Poll for new products every 3 seconds
    const interval = setInterval(() => fetchProducts(false), 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Cart: productId → quantity ─────────────────────────────
  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("fl_shop_cart") ?? "{}"); } catch { return {}; }
  });
  const cartTotal = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Persist cart to localStorage
  useEffect(() => {
    try { localStorage.setItem("fl_shop_cart", JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart]);

  function addToCart(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function removeFromCart(id: number) {
    setCart((prev) => {
      const next = { ...prev };
      if ((next[id] ?? 0) > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }

  // ── Shop favourites ────────────────────────────────────────
  const [shopFavs, setShopFavs] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set<number>();
    try {
      const arr = JSON.parse(localStorage.getItem("fl_shop_favs") ?? "[]") as number[];
      return new Set(arr);
    } catch { return new Set<number>(); }
  });

  // Persist shop favs to localStorage
  useEffect(() => {
    try { localStorage.setItem("fl_shop_favs", JSON.stringify([...shopFavs])); } catch { /* ignore */ }
  }, [shopFavs]);

  function toggleShopFav(id: number) {
    setShopFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Cart drawer visibility
  const [showCart, setShowCart] = useState(false);

  const filtered = useMemo(() => products.filter(
    (p) =>
      (activeCategory === "All Categories" || p.category === activeCategory) &&
      (!searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  ), [products, activeCategory, searchQuery]);

  const cartItems = useMemo(() => products.filter((p) => (cart[p.id] ?? 0) > 0), [products, cart]);
  const cartValue = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="Agro-Dealer Marketplace"
        subtitle="Source quality inputs from certified dealers"
      >
        <div className="relative w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-gray-700 placeholder-gray-400"
          />
        </div>
        {/* Cart button */}
        <button
          onClick={() => setShowCart((v) => !v)}
          className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
        >
          <span className="material-icons-round text-[22px]">shopping_cart</span>
          {cartTotal > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#13ec80] text-sidebar-bg text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {cartTotal}
            </span>
          )}
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-hidden flex relative">
        {/* ── Main content ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                  ? "bg-sidebar-bg text-white border-sidebar-bg shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#047857] hover:text-[#047857]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                    <div className="h-8 bg-gray-200 rounded-xl mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-icons-round text-6xl text-red-200 mb-4">error_outline</span>
              <p className="text-lg font-bold text-gray-500">{productsError}</p>
              <button
                onClick={() => fetchProducts()}
                className="mt-5 px-6 py-2.5 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-icons-round text-6xl text-gray-200 mb-4">search_off</span>
              <p className="text-lg font-bold text-gray-400">No products found</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All Categories"); }}
                className="mt-4 px-5 py-2 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-[#047857]/20 transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-gradient-to-br from-sidebar-bg/5 to-emerald-50 flex items-center justify-center">
                    <span className="material-icons-round text-[#047857]/20 text-[80px]">
                      {product.icon}
                    </span>
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 ${product.badgeColor} text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shadow`}
                      >
                        {product.badge}
                      </span>
                    )}
                    {/* Favourites heart */}
                    <button
                      onClick={() => toggleShopFav(product.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all ${shopFavs.has(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/80 hover:bg-white text-gray-400 hover:text-red-400"
                        }`}
                    >
                      <span className="material-icons-round text-lg">
                        {shopFavs.has(product.id) ? "favorite" : "favorite_border"}
                      </span>
                    </button>
                    <span className="absolute bottom-3 left-3 bg-white/90 text-[10px] font-semibold text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`material-icons-round text-sm ${s <= Math.floor(product.rating ?? 0) ? "text-amber-400" : "text-gray-200"
                            }`}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <h4
                      className="font-bold text-gray-900 mb-1.5 leading-tight"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-extrabold text-sidebar-bg">
                        Ksh {product.price.toLocaleString()}
                      </span>
                      {/* Add / qty control */}
                      {(cart[product.id] ?? 0) > 0 ? (
                        <div className="flex items-center gap-1 bg-sidebar-bg rounded-xl px-2 py-1">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-white w-5 h-5 flex items-center justify-center hover:text-[#13ec80] transition-colors"
                          >
                            <span className="material-icons-round text-base">remove</span>
                          </button>
                          <span className="text-white font-bold text-sm w-5 text-center">
                            {cart[product.id]}
                          </span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="text-white w-5 h-5 flex items-center justify-center hover:text-[#13ec80] transition-colors"
                          >
                            <span className="material-icons-round text-base">add</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product.id)}
                          className="flex items-center gap-1.5 bg-sidebar-bg hover:bg-[#1c4a3a] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          <span className="material-icons-round text-sm">add_shopping_cart</span>
                          Add
                        </button>
                      )}
                    </div>

                    <button className="w-full border border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white text-xs font-semibold py-2 rounded-xl transition-all">
                      <span className="flex items-center justify-center gap-1">
                        <span className="material-icons-round text-sm">headset_mic</span>
                        Connect with Dealer
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Cart Drawer ─────────────────────────────────── */}
        {showCart && (
          <>
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 z-10"
              onClick={() => setShowCart(false)}
            />
            {/* Panel */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl z-20 flex flex-col border-l border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3
                  className="font-bold text-lg text-gray-800"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Cart ({cartTotal} item{cartTotal !== 1 ? "s" : ""})
                </h3>
                <div className="flex items-center gap-2">
                  {cartTotal > 0 && (
                    <button
                      onClick={() => {
                        setCart({});
                        localStorage.removeItem("fl_shop_cart");
                      }}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="material-icons-round text-xl">close</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="material-icons-round text-5xl text-gray-200 mb-3">
                      shopping_cart
                    </span>
                    <p className="text-sm text-gray-400 font-medium">Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-[#047857]/40 text-2xl">{p.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 leading-tight truncate">{p.name}</p>
                        <p className="text-xs text-[#047857] font-semibold">
                          Ksh {(p.price * (cart[p.id] ?? 0)).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-sidebar-bg rounded-lg px-1.5 py-1 shrink-0">
                        <button onClick={() => removeFromCart(p.id)} className="text-white hover:text-[#13ec80]">
                          <span className="material-icons-round text-sm">remove</span>
                        </button>
                        <span className="text-white font-bold text-xs w-4 text-center">{cart[p.id]}</span>
                        <button onClick={() => addToCart(p.id)} className="text-white hover:text-[#13ec80]">
                          <span className="material-icons-round text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-gray-500">Total</span>
                    <span className="text-xl font-extrabold text-sidebar-bg">
                      Ksh {cartValue.toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full bg-[#047857] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition-colors text-sm">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
