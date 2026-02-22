"use client";
import { useState } from "react";
import Link from "next/link";

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

const categories = [
  "All",
  "Fertilizers",
  "Seeds",
  "Equipment",
  "Pesticides",
  "Animal Feeds",
];

const inventoryItems = [
  {
    id: "INV-001",
    name: "DAP Fertilizer 50kg",
    sku: "DAP-50KG",
    category: "Fertilizers",
    price: 3500,
    stock: 124,
    reorderLevel: 20,
    unit: "Bags",
    status: "In Stock",
    statusClass: "bg-green-100 text-green-800",
    icon: "science",
  },
  {
    id: "INV-002",
    name: "Hybrid Maize Seeds H614",
    sku: "HMS-H614",
    category: "Seeds",
    price: 2000,
    stock: 12,
    reorderLevel: 30,
    unit: "Packs",
    status: "Low Stock",
    statusClass: "bg-orange-100 text-orange-800",
    icon: "grass",
  },
  {
    id: "INV-003",
    name: "Drip Irrigation Kit 1 Acre",
    sku: "DIK-1A",
    category: "Equipment",
    price: 15000,
    stock: 45,
    reorderLevel: 5,
    unit: "Sets",
    status: "In Stock",
    statusClass: "bg-green-100 text-green-800",
    icon: "water_drop",
  },
  {
    id: "INV-004",
    name: "Broad Spectrum Insecticide",
    sku: "BSI-500ML",
    category: "Pesticides",
    price: 850,
    stock: 200,
    reorderLevel: 50,
    unit: "Bottles",
    status: "In Stock",
    statusClass: "bg-green-100 text-green-800",
    icon: "bug_report",
  },
  {
    id: "INV-005",
    name: "Knapsack Sprayer 16L",
    sku: "KSP-16L",
    category: "Equipment",
    price: 3200,
    stock: 30,
    reorderLevel: 10,
    unit: "Units",
    status: "In Stock",
    statusClass: "bg-green-100 text-green-800",
    icon: "cleaning_services",
  },
  {
    id: "INV-006",
    name: "Layers Mash 70kg",
    sku: "LMF-70KG",
    category: "Animal Feeds",
    price: 3800,
    stock: 0,
    reorderLevel: 15,
    unit: "Bags",
    status: "Out of Stock",
    statusClass: "bg-red-100 text-red-800",
    icon: "egg",
  },
  {
    id: "INV-007",
    name: "CAN Fertilizer 50kg",
    sku: "CAN-50KG",
    category: "Fertilizers",
    price: 2800,
    stock: 67,
    reorderLevel: 25,
    unit: "Bags",
    status: "In Stock",
    statusClass: "bg-green-100 text-green-800",
    icon: "science",
  },
  {
    id: "INV-008",
    name: "Sunflower Seeds 10kg",
    sku: "SFS-10KG",
    category: "Seeds",
    price: 1500,
    stock: 8,
    reorderLevel: 20,
    unit: "Packs",
    status: "Low Stock",
    statusClass: "bg-orange-100 text-orange-800",
    icon: "grass",
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState<string | null>(null);
  const [addStockItem, setAddStockItem] = useState<InventoryItem | null>(null);
  const [addQty, setAddQty] = useState("");

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

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const totalValue = items.reduce((sum, i) => sum + i.price * i.stock, 0);
  const lowStockCount = items.filter((i) => i.status === "Low Stock").length;
  const outOfStockCount = items.filter(
    (i) => i.status === "Out of Stock",
  ).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
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
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Inventory Management
          </h2>
          <p className="text-gray-500 text-sm">
            Track and manage your stock levels, receive alerts and restock
            efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
        </div>
      </header>

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
              {filtered.map((item) => (
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
              ))}
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
  );
}
