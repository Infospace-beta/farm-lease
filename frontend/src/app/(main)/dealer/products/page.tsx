"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";
import { dealerApi } from "@/lib/services/api";

const categories = [
  "All Products",
  "Fertilizers",
  "Seeds",
  "Equipment",
  "Pesticides",
  "Animal Feeds",
];

interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  price: number;
  stock: number;
  unit: string;
  status: string;
  statusClass: string;
  icon: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  const stock = Number(p.stock ?? p.quantity ?? 0);
  const isVisible = p.is_visible ?? p.is_active ?? true;
  const status = stock === 0 ? "OUT OF STOCK" : stock < 20 ? "LOW STOCK" : isVisible ? "ACTIVE" : "HIDDEN";
  const statusClass = stock === 0 ? "bg-red-500 text-white" : stock < 20 ? "bg-orange-500 text-white" : isVisible ? "bg-green-500 text-white" : "bg-gray-500 text-white";
  return {
    id: String(p.id),
    name: p.name ?? p.title ?? "Product",
    category: p.category ?? p.category_name ?? "General",
    desc: p.description ?? p.desc ?? "",
    price: Number(p.price ?? 0),
    stock,
    unit: p.unit ?? "Units",
    status,
    statusClass,
    icon: p.icon ?? "inventory_2",
  };
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  current_stock: number;
  unit: string;
  reorder_level?: number;
  last_updated?: string;
}

interface InventoryAlert {
  product_id: number;
  product_name: string;
  current_stock: number;
  reorder_level: number;
}

export default function ProductsPage() {
  const [tab, setTab] = useState<"products" | "inventory">("products");

  // Products tab state
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Inventory tab state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [stockUpdates, setStockUpdates] = useState<Record<number, string>>({});
  const [updatingStock, setUpdatingStock] = useState<number | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    dealerApi.myProducts()
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setItems(raw.map(mapProduct));
      })
      .catch(() => setError("Could not load products. Please try again."))
      .finally(() => setLoading(false));
  };

  const loadInventory = () => {
    setInventoryLoading(true);
    setInventoryError(null);
    Promise.all([dealerApi.inventory(), dealerApi.inventoryAlerts()])
      .then(([invRes, alertRes]) => {
        const invRaw = Array.isArray(invRes.data) ? invRes.data : (invRes.data?.results ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInventoryItems(invRaw.map((i: any) => ({
          id: i.id ?? i.product_id,
          name: i.name ?? i.product_name ?? "Product",
          category: i.category ?? "General",
          current_stock: Number(i.current_stock ?? i.stock ?? i.quantity ?? 0),
          unit: i.unit ?? "Units",
          reorder_level: i.reorder_level ?? 10,
          last_updated: i.updated_at ?? i.last_updated,
        })));
        const alertRaw = Array.isArray(alertRes.data) ? alertRes.data : (alertRes.data?.results ?? []);
        setInventoryAlerts(alertRaw);
      })
      .catch(() => setInventoryError("Could not load inventory data."))
      .finally(() => setInventoryLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (tab === "inventory" && inventoryItems.length === 0 && !inventoryLoading) {
      loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    dealerApi.deleteProduct(Number(id)).catch(() => { });
    setItems((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted");
  };

  const handleUpdateStock = async (productId: number) => {
    const qty = Number(stockUpdates[productId]);
    if (isNaN(qty) || qty < 0) return;
    setUpdatingStock(productId);
    try {
      await dealerApi.updateStock(productId, qty);
      setInventoryItems((prev) =>
        prev.map((i) => i.id === productId ? { ...i, current_stock: qty } : i)
      );
      setStockUpdates((prev) => { const n = { ...prev }; delete n[productId]; return n; });
      showToast("Stock updated successfully");
    } catch {
      showToast("Failed to update stock. Please try again.");
    } finally {
      setUpdatingStock(null);
    }
  };

  const filtered = useMemo(() => items.filter((p) => {
    const matchCat = activeCategory === "All Products" || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [items, activeCategory, search]);


  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-sidebar-bg text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="My Products"
        subtitle="Manage your product catalog, pricing, stock visibility and inventory."
      >
        {tab === "products" && (
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-base">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857]"
            />
          </div>
        )}
        <Link
          href="/dealer/products/add"
          className="flex px-5 py-2.5 text-sm bg-sidebar-bg text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-sidebar-bg/20"
        >
          <span className="material-icons-round text-sm">add</span>
          New Product
        </Link>
      </DealerPageHeader>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 lg:px-8 pt-4 border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${tab === "products" ? "text-[#047857] border-[#047857] bg-emerald-50" : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"}`}
        >
          <span className="material-icons-round text-base">inventory_2</span>
          Products
        </button>
        <button
          onClick={() => setTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${tab === "inventory" ? "text-[#047857] border-[#047857] bg-emerald-50" : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"}`}
        >
          <span className="material-icons-round text-base">warehouse</span>
          Inventory
          {inventoryAlerts.length > 0 && (
            <span className="ml-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5">
              {inventoryAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* ═══ PRODUCTS TAB ═══ */}
      {tab === "products" && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${activeCategory === cat ? "bg-sidebar-bg text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                {cat}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 bg-white rounded-xl text-gray-500 hover:bg-gray-50">
              <span className="material-icons-round text-base">tune</span>
              Filters
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                  <div className="h-44 bg-gray-100 rounded-t-3xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-8 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-icons-round text-6xl text-red-200 mb-4">error_outline</span>
              <p className="text-lg font-bold text-gray-500">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-5 px-6 py-2.5 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <span className="material-icons-round text-5xl mb-3 block">inventory_2</span>
              <p className="font-semibold text-gray-500">
                {items.length === 0 ? "You haven't added any products yet." : "No products match your search."}
              </p>
              {items.length === 0 ? (
                <a href="/dealer/products/add" className="mt-4 inline-block px-5 py-2 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition">
                  Add Your First Product
                </a>
              ) : (
                <button onClick={() => { setSearch(""); setActiveCategory("All Products"); }} className="mt-4 px-5 py-2 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
                  <div className="relative h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <span className="material-icons-round text-[80px] text-gray-200 group-hover:scale-110 transition-transform duration-500">{product.icon}</span>
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.statusClass}`}>{product.status}</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-800 mb-1.5 text-sm leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>{product.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{product.desc}</p>
                    <div className="flex justify-between items-center text-xs py-3 border-t border-gray-100 mb-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Price</p>
                        <p className="font-bold text-gray-800">Ksh {product.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Stock</p>
                        <p className={`font-bold ${product.stock === 0 ? "text-red-600" : product.stock < 20 ? "text-orange-600" : "text-gray-800"}`}>{product.stock} {product.unit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dealer/products/add?id=${product.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#047857] text-white text-xs font-bold rounded-xl hover:opacity-90 transition">
                        <span className="material-icons-round text-sm">edit</span>
                        Edit
                      </Link>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition">
                        <span className="material-icons-round text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ INVENTORY TAB ═══ */}
      {tab === "inventory" && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
          {inventoryLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#047857]" />
            </div>
          )}

          {inventoryError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center mb-4">
              <p className="text-sm text-red-600">{inventoryError}</p>
              <button onClick={loadInventory} className="mt-2 text-sm font-semibold text-red-700 hover:underline">
                Retry
              </button>
            </div>
          )}

          {!inventoryLoading && !inventoryError && (
            <>
              {/* Low stock alerts banner */}
              {inventoryAlerts.length > 0 && (
                <div className="mb-5 rounded-xl bg-orange-50 border border-orange-200 p-4 flex items-start gap-3">
                  <span className="material-icons-round text-orange-500 text-xl mt-0.5">warning_amber</span>
                  <div>
                    <p className="text-sm font-bold text-orange-800 mb-1">
                      {inventoryAlerts.length} item{inventoryAlerts.length !== 1 ? "s" : ""} running low on stock
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {inventoryAlerts.map((a) => (
                        <span key={a.product_id} className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
                          {a.product_name} ({a.current_stock} left)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {inventoryItems.length === 0 ? (
                <div className="py-24 text-center text-gray-400">
                  <span className="material-icons-round text-5xl mb-3 block">warehouse</span>
                  <p className="font-semibold text-gray-500">No inventory records yet.</p>
                  <p className="text-sm mt-1">Add products to start tracking inventory.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
                      Stock Levels
                    </h3>
                    <button
                      onClick={loadInventory}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#047857] transition-colors font-medium"
                    >
                      <span className="material-icons-round text-sm">refresh</span>
                      Refresh
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-6 py-3 text-left">Product</th>
                          <th className="px-6 py-3 text-left">Category</th>
                          <th className="px-6 py-3 text-right">Current Stock</th>
                          <th className="px-6 py-3 text-right">Reorder At</th>
                          <th className="px-6 py-3 text-left">Status</th>
                          <th className="px-6 py-3 text-right">Update Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {inventoryItems.map((item) => {
                          const isLow = item.current_stock <= (item.reorder_level ?? 10);
                          const isOut = item.current_stock === 0;
                          return (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                              <td className="px-6 py-4 text-gray-500 text-xs">{item.category}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`font-bold ${isOut ? "text-red-600" : isLow ? "text-orange-600" : "text-gray-800"}`}>
                                  {item.current_stock} {item.unit}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-gray-400 text-xs">
                                {item.reorder_level ?? 10} {item.unit}
                              </td>
                              <td className="px-6 py-4">
                                {isOut ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                    <span className="material-icons-round text-xs">error</span>Out of Stock
                                  </span>
                                ) : isLow ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                    <span className="material-icons-round text-xs">warning</span>Low Stock
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    <span className="material-icons-round text-xs">check_circle</span>In Stock
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder={String(item.current_stock)}
                                    value={stockUpdates[item.id] ?? ""}
                                    onChange={(e) => setStockUpdates((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                    className="w-20 text-right text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857]"
                                  />
                                  <button
                                    onClick={() => handleUpdateStock(item.id)}
                                    disabled={!stockUpdates[item.id] || updatingStock === item.id}
                                    className="px-3 py-1.5 bg-[#047857] text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    {updatingStock === item.id ? (
                                      <span className="material-icons-round text-sm animate-spin">refresh</span>
                                    ) : (
                                      <span className="material-icons-round text-sm">save</span>
                                    )}
                                    Save
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
