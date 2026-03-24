"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RawProduct {
  id: number;
  name?: string;
  product_name?: string;
  description?: string;
  details?: string;
  price?: number | string;
  unit_price?: number | string;
  category?: string;
  product_category?: string;
  images?: { image: string; is_primary?: boolean }[];
  dealer?: number;
  dealer_name?: string;
  stock?: number;
  quantity?: number;
  unit?: string;
  summary?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  dealerId: number;
  dealerName: string;
  stock: number;
  unit: string;
}

interface Dealer {
  id: number;
  name: string;
  productCount: number;
  categories: string[];
}

const DEALER_ICONS: Record<string, string> = {
  "Fertilizers & Soil": "eco",
  "Certified Seeds": "grass",
  "Agro-Chemicals": "science",
  "Farm Tools": "agriculture",
  Machinery: "precision_manufacturing",
  Other: "inventory_2",
};

const CATEGORIES = [
  "All Categories",
  "Fertilizers & Soil",
  "Certified Seeds",
  "Agro-Chemicals",
  "Farm Tools",
  "Machinery",
];

const KENYA_COUNTIES = [
  "All Counties",
  "Nairobi", "Kiambu", "Nakuru", "Meru", "Machakos",
  "Kakamega", "Kisumu", "Uasin Gishu", "Laikipia", "Mombasa",
  "Kilifi", "Nyeri", "Murang'a", "Embu", "Nyamira",
];

function dealerLocation(id: number): string {
  return KENYA_COUNTIES[1 + (id % (KENYA_COUNTIES.length - 1))];
}

function mapProduct(p: RawProduct): Product {
  const img =
    p.images?.find((i) => i.is_primary)?.image ?? p.images?.[0]?.image ?? null;
  return {
    id: p.id,
    name: String(p.name ?? p.product_name ?? "Unnamed Product"),
    description: String(p.description ?? p.summary ?? p.details ?? ""),
    price: Number(p.price ?? p.unit_price ?? 0),
    category: String(p.category ?? p.product_category ?? "Other"),
    image: img,
    dealerId: Number(p.dealer ?? 0),
    dealerName: String(p.dealer_name ?? "Unknown Dealer"),
    stock: Number(p.stock ?? p.quantity ?? 0),
    unit: String(p.unit ?? "unit"),
  };
}

// ─── Dealer Card ──────────────────────────────────────────────────────────────
function DealerCard({
  dealer,
  onClick,
}: {
  dealer: Dealer;
  onClick: () => void;
}) {
  const loc = dealerLocation(dealer.id);
  const primaryCat = dealer.categories[0] ?? "Other";
  const icon = DEALER_ICONS[primaryCat] ?? "storefront";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-sidebar-bg hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Header strip */}
      <div className="h-24 bg-linear-to- from-sidebar-bg to-[#1a5c42] flex items-center justify-center relative">
        <span className="material-icons-round text-white/20 text-7xl select-none">
          {icon}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
            <span className="material-icons-round text-[#13ec80] text-3xl">{icon}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 bg-[#13ec80]/20 border border-[#13ec80]/40 text-[#13ec80] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <span className="material-icons-round text-[10px]">verified</span> Verified
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-sidebar-bg transition-colors">
          {dealer.name}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <span className="material-icons-round text-[13px]">place</span>
          <span>{loc}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-slate-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-sidebar-bg">{dealer.productCount}</div>
            <div className="text-[10px] text-slate-500">Products</div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-sidebar-bg">{dealer.categories.length}</div>
            <div className="text-[10px] text-slate-500">Categories</div>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {dealer.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
          {dealer.categories.length > 3 && (
            <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
              +{dealer.categories.length - 3}
            </span>
          )}
        </div>

        <button className="w-full bg-sidebar-bg group-hover:bg-[#0d2e22] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
          <span className="material-icons-round text-base">storefront</span>
          Browse Products
        </button>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  cart,
  favs,
  crossDealers,
  onAddToCart,
  onRemoveFromCart,
  onFav,
  onQuery,
}: {
  product: Product;
  cart: Record<number, number>;
  favs: Set<number>;
  crossDealers: Dealer[];
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onFav: () => void;
  onQuery: () => void;
}) {
  const qty = cart[product.id] ?? 0;
  const isFaved = favs.has(product.id);
  const icon = DEALER_ICONS[product.category] ?? "inventory_2";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col group">
      <div className="relative h-44 bg-linear-to- from-emerald-50 to-slate-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="material-icons-round text-sidebar-bg/15 text-7xl select-none">
            {icon}
          </span>
        )}
        <button
          onClick={onFav}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
            isFaved
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-400 hover:text-rose-500"
          }`}
        >
          <span className="material-icons-round text-lg">
            {isFaved ? "favorite" : "favorite_border"}
          </span>
        </button>
        <span className="absolute bottom-3 left-3 bg-white/90 text-[10px] font-semibold text-slate-600 px-2.5 py-1 rounded-full border border-slate-100">
          {product.category}
        </span>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-3 left-3 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-slate-800/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2 flex-1">
          {product.description}
        </p>

        {crossDealers.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5 mb-2.5 flex items-start gap-1.5">
            <span className="material-icons-round text-blue-500 text-[13px] mt-0.5 shrink-0">
              info
            </span>
            <p className="text-[10px] text-blue-700 leading-relaxed">
              Also at: {crossDealers.map((d) => d.name).join(", ")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-extrabold text-sidebar-bg">
              Ksh {product.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">/{product.unit}</span>
          </div>

          {qty > 0 ? (
            <div className="flex items-center gap-1 bg-sidebar-bg rounded-xl px-2 py-1">
              <button
                onClick={onRemoveFromCart}
                className="text-white hover:text-[#13ec80] transition-colors"
              >
                <span className="material-icons-round text-sm">remove</span>
              </button>
              <span className="text-white font-bold text-sm w-5 text-center">{qty}</span>
              <button
                onClick={onAddToCart}
                className="text-white hover:text-[#13ec80] transition-colors"
              >
                <span className="material-icons-round text-sm">add</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-sidebar-bg hover:bg-[#0d2e22] disabled:opacity-40 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            >
              <span className="material-icons-round text-sm">add_shopping_cart</span>
              Add
            </button>
          )}
        </div>

        <button
          onClick={onQuery}
          className="mt-2 w-full border border-slate-200 text-slate-600 hover:border-sidebar-bg hover:text-sidebar-bg text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <span className="material-icons-round text-sm">headset_mic</span>
          Ask Dealer
        </button>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({
  products,
  cart,
  onClose,
  onRemove,
  onAdd,
  onCheckout,
}: {
  products: Product[];
  cart: Record<number, number>;
  onClose: () => void;
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
  onCheckout: () => void;
}) {
  const cartItems = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const total = cartItems.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const count = cartItems.reduce((s, p) => s + (cart[p.id] ?? 0), 0);

  return (
    <>
      <div
        className="absolute inset-0 bg-black/30 z-20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white z-30 shadow-2xl flex flex-col border-l border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Cart ({count})</h3>
          <div className="flex items-center gap-3">
            {count > 0 && (
              <button
                onClick={() =>
                  cartItems.forEach((p) => {
                    for (let i = 0; i < (cart[p.id] ?? 0); i++) onRemove(p.id);
                  })
                }
                className="text-xs text-red-400 hover:text-red-600"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-icons-round text-5xl text-slate-200 mb-3">
                shopping_cart
              </span>
              <p className="text-sm text-slate-400">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((p) => (
              <div key={p.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
                  <span className="material-icons-round text-sidebar-bg/30 text-2xl">
                    {DEALER_ICONS[p.category] ?? "inventory_2"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-sidebar-bg font-semibold">
                    Ksh {(p.price * (cart[p.id] ?? 0)).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-sidebar-bg rounded-lg px-1.5 py-1 shrink-0">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="text-white hover:text-[#13ec80]"
                  >
                    <span className="material-icons-round text-xs">remove</span>
                  </button>
                  <span className="text-white font-bold text-xs w-4 text-center">
                    {cart[p.id]}
                  </span>
                  <button
                    onClick={() => onAdd(p.id)}
                    className="text-white hover:text-[#13ec80]"
                  >
                    <span className="material-icons-round text-xs">add</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-800">
              <span>Total</span>
              <span className="text-sidebar-bg">Ksh {total.toLocaleString()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-sidebar-bg hover:bg-[#0d2e22] text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Query Modal ──────────────────────────────────────────────────────────────
function QueryModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!msg.trim()) return;
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-sidebar-bg rounded-xl flex items-center justify-center">
            <span className="material-icons-round text-white">headset_mic</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Ask About This Product</h3>
            <p className="text-xs text-slate-500">
              {product.name} · {product.dealerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <span className="material-icons-round text-4xl text-emerald-500">
              check_circle
            </span>
            <p className="text-sm font-semibold text-slate-700">
              Query sent! The dealer will respond shortly.
            </p>
          </div>
        ) : (
          <>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={4}
              placeholder="Ask about availability, pricing, delivery, bulk discounts..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!msg.trim()}
                className="flex-1 bg-sidebar-bg text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-[#0d2e22] transition-colors"
              >
                Send Query
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state machine: dealers grid → products grid
  const [view, setView] = useState<"dealers" | "products">("dealers");
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  // Filters
  const [county, setCounty] = useState("All Counties");
  const [category, setCategory] = useState("All Categories");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showGlobalResults, setShowGlobalResults] = useState(false);

  // Cart – persisted to localStorage
  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("fl_shop_cart") ?? "{}");
    } catch {
      return {};
    }
  });
  const [showCart, setShowCart] = useState(false);

  // Favourites
  const [favs, setFavs] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      return new Set<number>(
        JSON.parse(localStorage.getItem("fl_shop_favs") ?? "[]")
      );
    } catch {
      return new Set();
    }
  });

  // Query modal
  const [queryProduct, setQueryProduct] = useState<Product | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  // ── Fetch all products ──────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await lesseeApi.shopProducts();
      const data = (res.data?.results ?? res.data) as RawProduct[];
      setAllProducts(Array.isArray(data) ? data.map(mapProduct) : []);
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    localStorage.setItem("fl_shop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("fl_shop_favs", JSON.stringify([...favs]));
  }, [favs]);

  // ── Derive dealers from products ────────────────────────────────────────────
  const dealers = useMemo<Dealer[]>(() => {
    const map = new Map<number, { name: string; cats: Set<string>; count: number }>();
    for (const p of allProducts) {
      if (!p.dealerId) continue;
      const existing = map.get(p.dealerId);
      if (existing) {
        existing.cats.add(p.category);
        existing.count++;
      } else {
        map.set(p.dealerId, {
          name: p.dealerName,
          cats: new Set([p.category]),
          count: 1,
        });
      }
    }
    return [...map.entries()].map(([id, d]) => ({
      id,
      name: d.name,
      productCount: d.count,
      categories: [...d.cats],
    }));
  }, [allProducts]);

  const filteredDealers = useMemo(() => {
    if (county === "All Counties") return dealers;
    return dealers.filter((d) => dealerLocation(d.id) === county);
  }, [dealers, county]);

  // Products for the selected dealer (with category filter)
  const dealerProducts = useMemo(() => {
    if (!selectedDealer) return [];
    return allProducts.filter(
      (p) =>
        p.dealerId === selectedDealer.id &&
        (category === "All Categories" || p.category === category)
    );
  }, [allProducts, selectedDealer, category]);

  // Cross-dealer availability: product id → other dealers that carry same name
  const productAvailability = useMemo(() => {
    const nameMap = new Map<string, Product[]>();
    for (const p of allProducts) {
      const key = p.name.toLowerCase().trim();
      const arr = nameMap.get(key) ?? [];
      arr.push(p);
      nameMap.set(key, arr);
    }
    const result = new Map<number, Dealer[]>();
    for (const [, prods] of nameMap) {
      if (prods.length < 2) continue;
      for (const p of prods) {
        const others = prods
          .filter((q) => q.dealerId !== p.dealerId)
          .map((q) => dealers.find((d) => d.id === q.dealerId))
          .filter(Boolean) as Dealer[];
        if (others.length > 0) result.set(p.id, others);
      }
    }
    return result;
  }, [allProducts, dealers]);

  // Global search across all dealers
  const globalResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allProducts, globalSearch]);

  // ── Cart helpers ────────────────────────────────────────────────────────────
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  const addToCart = (id: number) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const removeFromCart = (id: number) =>
    setCart((prev) => {
      const next = { ...prev };
      if ((next[id] ?? 0) > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const toggleFav = (id: number) =>
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setCategory("All Categories");
    setView("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToDealers = () => {
    setView("dealers");
    setSelectedDealer(null);
    setGlobalSearch("");
    setShowGlobalResults(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Query modal */}
      {queryProduct && (
        <QueryModal
          product={queryProduct}
          onClose={() => setQueryProduct(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-sidebar-bg text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-none">
          <span className="material-icons-round text-[#13ec80] text-lg">check_circle</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Page header */}
      <LesseePageHeader
        title={
          view === "dealers"
            ? "Agro-Dealer Marketplace"
            : selectedDealer?.name ?? "Products"
        }
        subtitle={
          view === "dealers"
            ? `${filteredDealers.length} certified dealers available`
            : `${dealerProducts.length} products · ${dealerLocation(selectedDealer?.id ?? 0)}`
        }
      >
        {/* Global cross-dealer search */}
        <div className="relative">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search all products…"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setShowGlobalResults(true);
              }}
              onFocus={() => globalSearch && setShowGlobalResults(true)}
              onBlur={() => setTimeout(() => setShowGlobalResults(false), 200)}
              className="w-56 lg:w-64 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg"
            />
          </div>

          {showGlobalResults && globalResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
              {globalResults.slice(0, 12).map((p) => {
                const others = productAvailability.get(p.id) ?? [];
                return (
                  <button
                    key={p.id}
                    onMouseDown={() => {
                      const d = dealers.find((d) => d.id === p.dealerId);
                      if (d) openDealer(d);
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="material-icons-round text-sidebar-bg/40 text-xl mt-0.5 shrink-0">
                      {DEALER_ICONS[p.category] ?? "inventory_2"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {p.dealerName} · Ksh {p.price.toLocaleString()}
                      </p>
                      {others.length > 0 && (
                        <p className="text-[10px] text-blue-600 mt-0.5">
                          Also at: {others.map((d) => d.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart button */}
        <button
          onClick={() => setShowCart((v) => !v)}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-sidebar-bg transition-colors"
        >
          <span className="material-icons-round text-[22px]">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#13ec80] text-sidebar-bg text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>
      </LesseePageHeader>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex relative bg-[#f8fafc]">
        {/* Cart drawer */}
        {showCart && (
          <CartDrawer
            products={allProducts}
            cart={cart}
            onClose={() => setShowCart(false)}
            onRemove={removeFromCart}
            onAdd={addToCart}
            onCheckout={() => {
              showToast("Checkout coming soon!");
              setShowCart(false);
            }}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* ── DEALERS VIEW ──────────────────────────────────────────────── */}
          {view === "dealers" && (
            <>
              {/* Location filter */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="material-icons-round text-slate-400 text-[18px]">
                    place
                  </span>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {county !== "All Counties" && (
                  <button
                    onClick={() => setCounty("All Counties")}
                    className="text-xs text-sidebar-bg font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span className="material-icons-round text-sm">close</span>
                    Clear
                  </button>
                )}
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden animate-pulse"
                    >
                      <div className="h-24 bg-slate-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                        <div className="h-14 bg-slate-100 rounded" />
                        <div className="h-9 bg-slate-100 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center py-16">
                  <span className="material-icons-round text-4xl text-slate-300 mb-2">
                    cloud_off
                  </span>
                  <p className="text-slate-500 text-sm mb-4">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="bg-sidebar-bg text-white px-5 py-2 rounded-xl text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filteredDealers.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="material-icons-round text-5xl text-slate-200 mb-3">
                    storefront
                  </span>
                  <p className="text-slate-600 font-semibold mb-1">
                    No dealers in this location
                  </p>
                  <p className="text-slate-400 text-sm mb-4">
                    Try a different county or view all dealers.
                  </p>
                  <button
                    onClick={() => setCounty("All Counties")}
                    className="text-sidebar-bg font-semibold text-sm border border-sidebar-bg px-5 py-2 rounded-xl hover:bg-sidebar-bg hover:text-white transition-colors"
                  >
                    View All Dealers
                  </button>
                </div>
              )}

              {/* Dealer cards grid */}
              {!loading && !error && filteredDealers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                  {filteredDealers.map((dealer) => (
                    <DealerCard
                      key={dealer.id}
                      dealer={dealer}
                      onClick={() => openDealer(dealer)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── PRODUCTS VIEW ─────────────────────────────────────────────── */}
          {view === "products" && selectedDealer && (
            <>
              {/* Toolbar: back + category pills */}
              <div className="flex items-center gap-3 mb-5 overflow-x-auto">
                <button
                  onClick={backToDealers}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-sidebar-bg bg-white border border-slate-200 px-3 py-2 rounded-xl hover:border-sidebar-bg transition-colors shrink-0"
                >
                  <span className="material-icons-round text-base">arrow_back</span>
                  All Dealers
                </button>

                <div className="flex gap-1.5 overflow-x-auto flex-1 pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                        category === cat
                          ? "bg-sidebar-bg text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-sidebar-bg hover:text-sidebar-bg"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Empty category */}
              {dealerProducts.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="material-icons-round text-5xl text-slate-200 mb-3">
                    inventory
                  </span>
                  <p className="text-slate-600 font-semibold mb-1">
                    No products in this category
                  </p>
                  <button
                    onClick={() => setCategory("All Categories")}
                    className="mt-3 text-sidebar-bg font-semibold text-sm border border-sidebar-bg px-5 py-2 rounded-xl hover:bg-sidebar-bg hover:text-white transition-colors"
                  >
                    Show All Categories
                  </button>
                </div>
              )}

              {/* Product cards grid */}
              {dealerProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                  {dealerProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cart={cart}
                      favs={favs}
                      crossDealers={productAvailability.get(product.id) ?? []}
                      onAddToCart={() => {
                        addToCart(product.id);
                        showToast(`${product.name} added to cart`);
                      }}
                      onRemoveFromCart={() => removeFromCart(product.id)}
                      onFav={() => toggleFav(product.id)}
                      onQuery={() => setQueryProduct(product)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
