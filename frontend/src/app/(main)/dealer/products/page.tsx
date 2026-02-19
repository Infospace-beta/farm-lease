"use client";
import { useState } from "react";
import Link from "next/link";

const categories = [
  "All Products",
  "Fertilizers",
  "Seeds",
  "Equipment",
  "Pesticides",
  "Animal Feeds",
];

const products = [
  {
    id: "P1",
    name: "DAP Fertilizer 50kg Bag",
    category: "Fertilizers",
    desc: "High-grade Di-Ammonium Phosphate fertilizer in 50kg bags. Ideal for planting season application.",
    price: 3500,
    stock: 124,
    unit: "Units",
    status: "ACTIVE",
    statusClass: "bg-green-500 text-white",
    icon: "science",
  },
  {
    id: "P2",
    name: "Hybrid Maize Seeds H614",
    category: "Seeds",
    desc: "High-yielding open-pollinated hybrid variety. Drought tolerant. 10kg packs.",
    price: 2000,
    stock: 12,
    unit: "Units",
    status: "LOW STOCK",
    statusClass: "bg-orange-500 text-white",
    icon: "grass",
  },
  {
    id: "P3",
    name: "Drip Irrigation Kit 1 Acre",
    category: "Equipment",
    desc: "Complete drip irrigation setup for 1 acre. Includes pipes, emitters, and filters.",
    price: 15000,
    stock: 45,
    unit: "Units",
    status: "ACTIVE",
    statusClass: "bg-green-500 text-white",
    icon: "water_drop",
  },
  {
    id: "P4",
    name: "Broad Spectrum Insecticide",
    category: "Pesticides",
    desc: "Fast-acting insecticide for control of aphids, thrips, whiteflies and cutworms. 500ml.",
    price: 850,
    stock: 200,
    unit: "Bottles",
    status: "HIDDEN",
    statusClass: "bg-gray-500 text-white",
    icon: "bug_report",
  },
  {
    id: "P5",
    name: "Knapsack Sprayer 16L",
    category: "Equipment",
    desc: "Durable manual knapsack sprayer with adjustable nozzle. Suitable for all crop types.",
    price: 3200,
    stock: 30,
    unit: "Units",
    status: "ACTIVE",
    statusClass: "bg-green-500 text-white",
    icon: "cleaning_services",
  },
  {
    id: "P6",
    name: "Layers Mash 70kg",
    category: "Animal Feeds",
    desc: "Premium nutrient-rich complete feed for commercial laying hens. High egg production formula.",
    price: 3800,
    stock: 0,
    unit: "Bags",
    status: "OUT OF STOCK",
    statusClass: "bg-red-500 text-white",
    icon: "egg",
  },
];

export default function ProductsPage() {
  const [items, setItems] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted");
  };

  const filtered = items.filter((p) => {
    const matchCat =
      activeCategory === "All Products" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            My Products
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your product catalog, pricing and stock visibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <Link
            href="/dealer/products/add"
            className="flex px-5 py-2.5 text-sm bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-[#0f392b]/20"
          >
            <span className="material-icons-round text-sm">add</span>
            New Product
          </Link>
        </div>
      </header>

      {/* Category Filter + Filters button */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${activeCategory === cat ? "bg-[#0f392b] text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col"
          >
            {/* Image Area */}
            <div className="relative h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
              <span className="material-icons-round text-[80px] text-gray-200 group-hover:scale-110 transition-transform duration-500">
                {product.icon}
              </span>
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.statusClass}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                {product.category}
              </p>
              <h3
                className="font-bold text-gray-800 mb-1.5 text-sm leading-tight"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {product.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                {product.desc}
              </p>

              <div className="flex justify-between items-center text-xs py-3 border-t border-gray-100 mb-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                    Price
                  </p>
                  <p className="font-bold text-gray-800">
                    Ksh {product.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                    Stock
                  </p>
                  <p
                    className={`font-bold ${product.stock === 0 ? "text-red-600" : product.stock < 20 ? "text-orange-600" : "text-gray-800"}`}
                  >
                    {product.stock} {product.unit}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dealer/products/add?id=${product.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#047857] text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                >
                  <span className="material-icons-round text-sm">edit</span>
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition"
                >
                  <span className="material-icons-round text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
