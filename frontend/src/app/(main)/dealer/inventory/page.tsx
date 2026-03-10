"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";
import { dealerApi } from "@/lib/services/api";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorderLevel: number;
  unit: string;
  status: string;
  statusClass: string;
  icon: string;
};

function getStatus(
  stock: number,
  reorderLevel: number,
): { status: string; statusClass: string } {
  if (stock === 0)
    return { status: "Out of Stock", statusClass: "bg-red-100 text-red-800" };
  if (stock <= reorderLevel)
    return {
      status: "Low Stock",
      statusClass: "bg-orange-100 text-orange-800",
    };
  return { status: "In Stock", statusClass: "bg-green-100 text-green-800" };
}

const CATEGORY_ICONS: Record<string, string> = {
  Fertilizers: "science",
  Seeds: "grass",
  Equipment: "build",
  Pesticides: "bug_report",
  "Animal Feeds": "egg",
};

function mapItem(p: any): InventoryItem {
  const stock = Number(p.stock_quantity ?? p.stock ?? 0);
  const reorderLevel = Number(p.reorder_level ?? p.reorderLevel ?? 10);
  const category: string = p.category ?? "Other";
  const { status, statusClass } = getStatus(stock, reorderLevel);
  return {
    id: p.id ? `INV-${String(p.id).padStart(3, "0")}` : "—",
    name: p.name ?? p.product_name ?? "—",
    sku: p.sku ?? p.product_code ?? `SKU-${p.id ?? "???"}`,
    category,
    price: parseFloat(p.price ?? 0),
    stock,
    reorderLevel,
    unit: p.unit ?? "Units",
    status,
    statusClass,
    icon: CATEGORY_ICONS[category] ?? "inventory_2",
  };
}

const categories = [
  "All",
  "Fertilizers",
  "Seeds",
  "Equipment",
  "Pesticides",
  "Animal Feeds",
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState<string | null>(null);
  const [addStockItem, setAddStockItem] = useState<InventoryItem | null>(null);
  const [addQty, setAddQty] = useState("");

  useEffect(() => {
    dealerApi
      .inventory()
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setItems(raw.map(mapItem));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const deleteItem = (id: string) => {
    if (!confirm("Delete this item from inventory?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast("Item deleted");
  };

  const confirmAddStock = () => {
    if (!addStockItem || !addQty) return;
    const qty = parseInt(addQty);
    if (isNaN(qty) || qty <= 0) return;
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== addStockItem.id) return i;
        const newStock = i.stock + qty;
        const { status, statusClass } = getStatus(newStock, i.reorderLevel);
        return { ...i, stock: newStock, status, statusClass };
      }),
    );
    setAddStockItem(null);
    setAddQty("");
    showToast(`Added ${qty} units to stock`);
  };

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchCat =
          activeCategory === "All" || item.category === activeCategory;
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        const matchSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchStatus && matchSearch;
      }),
    [items, activeCategory, statusFilter, search],
  );

  const totalValue = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.stock, 0),
    [items],
  );
  const lowStockCount = useMemo(
    () => items.filter((i) => i.status === "Low Stock").length,
    [items],
  );
  const outOfStockCount = useMemo(
    () => items.filter((i) => i.status === "Out of Stock").length,
    [items],
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Add Stock Modal */}
      {addStockItem && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-1">Add Stock</h3>
            <p className="text-sm text-gray-500 mb-4">{addStockItem.name}</p>
            <input
              type="number"
              min="1"
              value={addQty}
              onChange={(e) => setAddQty(e.target.value)}
              placeholder="Quantity to add"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#047857]/30"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAddStock}
                className="flex-1 bg-[#047857] text-white text-sm py-2 rounded-lg hover:opacity-90"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setAddStockItem(null);
                  setAddQty("");
                }}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Inventory Management"
        subtitle="Track and manage your stock levels, receive alerts and restock efficiently."
      >
        <button
          onClick={() =>
            showToast("CSV import is not available in demo mode")
          }
          className="flex px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 shadow-sm"
        >
          <span className="material-icons-round text-base">upload</span>
          Import CSV
        </button>
        <button
          onClick={() => setAddStockItem(items[0])}
          className="flex px-5 py-2.5 text-sm bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-[#0f392b]/20"
        >
          <span className="material-icons-round text-sm">add</span>
          Add Stock
        </button>
      </DealerPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Items",
              value: String(items.length),
              icon: "inventory_2",
              bg: "bg-emerald-50",
              color: "text-[#047857]",
            },
            {
              label: "Low Stock",
              value: String(lowStockCount),
              icon: "warning",
              bg: "bg-orange-50",
              color: "text-orange-600",
            },
            {
              label: "Out of Stock",
              value: String(outOfStockCount),
              icon: "remove_shopping_cart",
              bg: "bg-red-50",
              color: "text-red-600",
            },
            {
              label: "Total Value",
              value: `Ksh ${(totalValue / 1000).toFixed(0)}K`,
              icon: "payments",
              bg: "bg-blue-50",
              color: "text-blue-600",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <span className={`material-icons-round ${c.color}`}>
                  {c.icon}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  {c.label}
                </p>
                <p className="text-xl font-bold text-gray-800">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857]"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 text-gray-600"
              >
                <option>All</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <span className="material-icons-round text-base">tune</span>
                Filters
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === cat ? "bg-[#0f392b] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Product
                  </th>
                  <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    SKU
                  </th>
                  <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Category
                  </th>
                  <th className="text-right py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Unit Price
                  </th>
                  <th className="text-right py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Stock
                  </th>
                  <th className="text-right py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Reorder Level
                  </th>
                  <th className="text-center py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="text-center py-4 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [0, 1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      {[0, 1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="py-4 px-5">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="material-icons-round text-gray-400 text-lg">
                              {item.icon}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-xs text-gray-400 font-mono">
                        {item.sku}
                      </td>
                      <td className="py-4 px-5 text-xs text-gray-600 font-semibold">
                        {item.category}
                      </td>
                      <td className="py-4 px-5 text-right text-sm font-bold text-gray-700">
                        Ksh {item.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span
                          className={`text-sm font-bold ${item.stock === 0 ? "text-red-600" : item.stock <= item.reorderLevel ? "text-orange-600" : "text-gray-800"}`}
                        >
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right text-sm text-gray-400">
                        {item.reorderLevel}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.statusClass}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <Link
                            href={`/dealer/products/add?id=${item.id}`}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#047857] transition"
                            title="Edit"
                          >
                            <span className="material-icons-round text-base">
                              edit
                            </span>
                          </Link>
                          <button
                            onClick={() => setAddStockItem(item)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="Add Stock"
                          >
                            <span className="material-icons-round text-base">
                              add_circle
                            </span>
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"
                            title="Delete"
                          >
                            <span className="material-icons-round text-base">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))
                }
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {items.length} items
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs bg-[#047857] text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
