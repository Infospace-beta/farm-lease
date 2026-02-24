"use client";
import { useState } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

const categories = [
  "All Categories",
  "Fertilizers & Soil",
  "Certified Seeds",
  "Agro-Chemicals",
  "Farm Tools",
  "Machinery",
];

const products = [
  {
    id: 1,
    name: "YaraMila Planting Fertilizer",
    description:
      "Balanced NPK fertilizer ideal for planting season. Promotes strong root development and early growth.",
    price: 3500,
    rating: 4.8,
    reviews: 124,
    category: "Fertilizers & Soil",
    badge: "Top Rated",
    badgeColor: "bg-[#13ec80] text-[#0f392b]",
    icon: "science",
  },
  {
    id: 2,
    name: "DK 777 Hybrid Maize",
    description:
      "High-yielding certified hybrid maize seed. Drought-tolerant and disease-resistant variety for Kenyan conditions.",
    price: 850,
    rating: 4.9,
    reviews: 237,
    category: "Certified Seeds",
    badge: null,
    badgeColor: "",
    icon: "grass",
  },
  {
    id: 3,
    name: "Roundup Herbicide 1L",
    description:
      "Systemic herbicide for effective control of annual and perennial weeds. Non-selective post-emergence.",
    price: 1200,
    rating: 4.5,
    reviews: 89,
    category: "Agro-Chemicals",
    badge: null,
    badgeColor: "",
    icon: "sanitizer",
  },
  {
    id: 4,
    name: "Knapsack Sprayer 20L",
    description:
      "Heavy-duty manual knapsack sprayer. Adjustable nozzle, ergonomic straps, and large 20L capacity tank.",
    price: 4800,
    rating: 4.7,
    reviews: 56,
    category: "Farm Tools",
    badge: "Top Rated",
    badgeColor: "bg-[#13ec80] text-[#0f392b]",
    icon: "water_drop",
  },
  {
    id: 5,
    name: "CAN Fertilizer 50kg",
    description:
      "Calcium Ammonium Nitrate fertilizer for top-dressing. Improves yield and plant health during growth phase.",
    price: 3200,
    rating: 4.6,
    reviews: 98,
    category: "Fertilizers & Soil",
    badge: null,
    badgeColor: "",
    icon: "science",
  },
  {
    id: 6,
    name: "Assorted Vegetable Seeds",
    description:
      "Premium assorted vegetable seed pack. Includes tomato, kale, sukuma wiki and spinach varieties.",
    price: 450,
    rating: 4.3,
    reviews: 43,
    category: "Certified Seeds",
    badge: null,
    badgeColor: "",
    icon: "eco",
  },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [cartCount] = useState(2);

  const filtered =
    activeCategory === "All Categories"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
          <span className="material-icons-round text-[22px]">
            shopping_cart
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#13ec80] text-[#0f392b] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                  ? "bg-[#0f392b] text-white border-[#0f392b] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#047857] hover:text-[#047857]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-[#047857]/20 transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-56 bg-gradient-to-br from-[#0f392b]/5 to-emerald-50 flex items-center justify-center">
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
                <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full text-gray-400 hover:text-red-400 transition-colors backdrop-blur-sm shadow-sm">
                  <span className="material-icons-round text-lg">
                    favorite_border
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
                      className={`material-icons-round text-sm ${s <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}
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
                  <div>
                    <span className="text-xl font-extrabold text-[#0f392b]">
                      Ksh {product.price.toLocaleString()}
                    </span>
                  </div>
                  <button className="flex items-center gap-1.5 bg-[#0f392b] hover:bg-[#1c4a3a] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm">
                    <span className="material-icons-round text-sm">
                      add_shopping_cart
                    </span>
                    Add
                  </button>
                </div>

                <button className="w-full border border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white text-xs font-semibold py-2 rounded-xl transition-all">
                  <span className="flex items-center justify-center gap-1">
                    <span className="material-icons-round text-sm">
                      headset_mic
                    </span>
                    Connect with Dealer
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
