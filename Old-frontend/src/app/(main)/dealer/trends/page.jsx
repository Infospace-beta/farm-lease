"use client";

import { useState } from "react";
import DealerSidebar from "../../../../components/layout/DealerSidebar";
import DealerHeader from "../../../../components/layout/DealerHeader";

const MarketTrendsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("North Rift Region");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timePeriod, setTimePeriod] = useState("30days");

  const insightCards = [
    {
      type: "ai-forecast",
      title: "Stock Up on Urea",
      description:
        "Predicted 40% surge in demand next week due to upcoming maize top-dressing season.",
      badge: "AI Forecast",
      icon: "🧠",
      buttonText: "View Suppliers",
      gradient: "from-emerald-700 to-emerald-900",
      category: "fertilizers",
    },
    {
      type: "hot-item",
      title: "Pest Control Alert",
      description:
        "High Fall Armyworm activity reported in 150 nearby farms. Pesticide demand is critical.",
      badge: "Hot Item",
      icon: "🔥",
      metric: "+215% Search Volume",
      metricIcon: "📈",
      bgColor: "bg-white",
      badgeColor: "bg-orange-100 text-orange-800",
      category: "pesticides",
    },
    {
      type: "seasonal",
      title: "Irrigation Prep",
      description:
        "Dry spell forecasted for next month. Farmers are inquiring about drip kits and pumps.",
      badge: "Seasonal",
      icon: "💧",
      metric: "High Viewing Interest",
      metricIcon: "👁️",
      bgColor: "bg-white",
      badgeColor: "bg-blue-100 text-blue-800",
      category: "equipment",
    },
    {
      type: "trending",
      title: "Hybrid Seeds Shortage",
      description:
        "DH04 and DK777 varieties running low. Early planters are stocking up ahead of long rains.",
      badge: "Trending",
      icon: "🌱",
      metric: "+120% Orders",
      metricIcon: "📦",
      bgColor: "bg-white",
      badgeColor: "bg-green-100 text-green-800",
      category: "seeds",
    },
  ];

  const demandProducts = [
    {
      id: 1,
      name: "NPK 23:23:0",
      category: "fertilizers",
      trend: "+34%",
      trendColor: "text-green-600",
      price: 6200,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt",
    },
    {
      id: 2,
      name: "DK 777 Maize",
      category: "seeds",
      trend: "+12%",
      trendColor: "text-green-600",
      price: 2400,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV",
    },
    {
      id: 3,
      name: "Belt 480 SC",
      category: "pesticides",
      trend: "+85%",
      trendColor: "text-orange-600",
      price: 8500,
      icon: "🐛",
    },
    {
      id: 4,
      name: "DAP Fertilizer",
      category: "fertilizers",
      trend: "+28%",
      trendColor: "text-green-600",
      price: 3800,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt",
    },
    {
      id: 5,
      name: "Tomato F1 Hybrid",
      category: "seeds",
      trend: "+19%",
      trendColor: "text-green-600",
      price: 3500,
      icon: "🍅",
    },
    {
      id: 6,
      name: "Power Tiller",
      category: "equipment",
      trend: "+45%",
      trendColor: "text-orange-600",
      price: 45000,
      icon: "🚜",
    },
    {
      id: 7,
      name: "Roundup Herbicide",
      category: "pesticides",
      trend: "+67%",
      trendColor: "text-orange-600",
      price: 1200,
      icon: "🌿",
    },
    {
      id: 8,
      name: "Drip Irrigation Kit",
      category: "equipment",
      trend: "+92%",
      trendColor: "text-orange-600",
      price: 12500,
      icon: "💦",
    },
  ];

  // Filter insights and products based on category
  const filteredInsights =
    categoryFilter === "all"
      ? insightCards
      : insightCards.filter((card) => card.category === categoryFilter);

  const filteredProducts =
    categoryFilter === "all"
      ? demandProducts.slice(0, 3)
      : demandProducts.filter((product) => product.category === categoryFilter);

  // Count items per category
  const categoryCounts = {
    all: insightCards.length,
    fertilizers: insightCards.filter((c) => c.category === "fertilizers")
      .length,
    seeds: insightCards.filter((c) => c.category === "seeds").length,
    pesticides: insightCards.filter((c) => c.category === "pesticides").length,
    equipment: insightCards.filter((c) => c.category === "equipment").length,
  };

  const regionalUpdates = [
    {
      id: 1,
      time: "Today, 9:00 AM",
      title: "Subsidized Fertilizer Arrival",
      description:
        "Government subsidy program fertilizers have arrived at the NCPB depot in Eldoret. Expect increased farmer movement.",
      isRecent: true,
    },
    {
      id: 2,
      time: "Yesterday",
      title: "Heavy Rainfall Warning",
      description:
        "Met Dept warns of heavy rains in the western region. Stock up on fungicides as blight risk increases.",
      isRecent: false,
    },
    {
      id: 3,
      time: "2 Days Ago",
      title: "Market Price Shift",
      description:
        "Wholesale price of Hybrid Maize seeds increased by 5% due to supply constraints.",
      isRecent: false,
    },
  ];

  return (
    <div className="bg-background-light flex">
      <DealerSidebar />

      <main className="flex-1 h-screen overflow-hidden">
        <DealerHeader
          title="Market Trends"
          subtitle="Stay informed about market dynamics"
          rightContent={
            <div className="flex items-center gap-4">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-gray-400 text-sm">📍</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer outline-none"
                >
                  <option>North Rift Region</option>
                  <option>Central Region</option>
                  <option>Western Region</option>
                </select>
              </div>
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                <span className="text-lg">🎛️</span>
                <span className="font-medium text-sm">Filters</span>
              </button>
            </div>
          }
        />

        <div className="h-[calc(100vh-5rem)] overflow-y-auto p-8 bg-gray-50">
          <div className="space-y-8 pb-8">
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === "all"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>All Trends</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      categoryFilter === "all"
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryCounts.all}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("fertilizers")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === "fertilizers"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>🌾 Fertilizers</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      categoryFilter === "fertilizers"
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryCounts.fertilizers}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("seeds")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === "seeds"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>🌱 Seeds</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      categoryFilter === "seeds"
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryCounts.seeds}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("pesticides")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === "pesticides"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>🐛 Pesticides</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      categoryFilter === "pesticides"
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryCounts.pesticides}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("equipment")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === "equipment"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>🚜 Equipment</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      categoryFilter === "equipment"
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryCounts.equipment}
                  </span>
                </button>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setTimePeriod("7days")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timePeriod === "7days"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimePeriod("30days")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timePeriod === "30days"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setTimePeriod("season")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timePeriod === "season"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Season
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {/* Main Content Area */}
              <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8">
                {/* Insight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredInsights.length > 0 ? (
                    filteredInsights.map((card, index) =>
                      card.type === "ai-forecast" ? (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg"
                        >
                          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <span className="text-2xl">{card.icon}</span>
                            </div>
                            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide backdrop-blur-md">
                              {card.badge}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1 relative z-10">
                            {card.title}
                          </h3>
                          <p className="text-white/80 text-xs mb-4 relative z-10 leading-relaxed">
                            {card.description}
                          </p>
                          {card.buttonText && (
                            <button className="text-xs font-bold bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition relative z-10 w-full md:w-auto">
                              {card.buttonText}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-emerald-700/30 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                              <span className="text-2xl">{card.icon}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${card.badgeColor || "bg-orange-100 text-orange-800"}`}
                            >
                              {card.badge}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg mb-1">
                            {card.title}
                          </h3>
                          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                            {card.description}
                          </p>
                          {card.metric && (
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                              <span>{card.metricIcon}</span>
                              <span>{card.metric}</span>
                            </div>
                          )}
                        </div>
                      ),
                    )
                  ) : (
                    <div className="col-span-3 py-12 text-center text-gray-400">
                      <p className="text-sm">
                        No insights available for this category.
                      </p>
                    </div>
                  )}
                </div>

                {/* Regional Input Demand Chart */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Regional Input Demand
                      </h3>
                      <p className="text-xs text-gray-400">
                        Comparing top 3 categories over the last 30 days
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-700"></span>{" "}
                        Fertilizer
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>{" "}
                        Seeds
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                        Chemicals
                      </span>
                    </div>
                  </div>

                  <div className="relative h-72 w-full">
                    <svg
                      className="w-full h-full"
                      preserveAspectRatio="none"
                      viewBox="0 0 800 300"
                    >
                      {/* Grid lines */}
                      <line
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        x1="0"
                        x2="800"
                        y1="50"
                        y2="50"
                      />
                      <line
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        x1="0"
                        x2="800"
                        y1="125"
                        y2="125"
                      />
                      <line
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        x1="0"
                        x2="800"
                        y1="200"
                        y2="200"
                      />
                      <line
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        x1="0"
                        x2="800"
                        y1="275"
                        y2="275"
                      />

                      {/* Fertilizer line with gradient */}
                      <path
                        d="M0,200 C50,180 100,220 150,150 C200,80 250,100 300,90 C350,80 400,40 450,30 C500,20 550,60 600,50 C650,40 700,20 750,10 L800,20 L800,300 L0,300 Z"
                        fill="url(#gradient-primary)"
                        opacity="0.1"
                      />
                      <path
                        d="M0,200 C50,180 100,220 150,150 C200,80 250,100 300,90 C350,80 400,40 450,30 C500,20 550,60 600,50 C650,40 700,20 750,10 L800,20"
                        fill="none"
                        stroke="#047857"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />

                      {/* Seeds line (dashed) */}
                      <path
                        d="M0,250 C60,240 120,260 180,200 C240,140 300,160 360,150 C420,140 480,180 540,160 C600,140 660,120 720,130 L800,110"
                        fill="none"
                        stroke="#fb923c"
                        strokeDasharray="5,5"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />

                      {/* Chemicals line */}
                      <path
                        d="M0,280 C70,270 140,280 210,250 C280,220 350,230 420,220 C490,210 560,240 630,230 C700,220 770,200 800,190"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />

                      <defs>
                        <linearGradient
                          id="gradient-primary"
                          x1="0%"
                          x2="0%"
                          y1="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: "#047857", stopOpacity: 0.8 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#047857", stopOpacity: 0 }}
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute top-[10%] left-[56%] bg-gray-800 text-white text-[10px] py-1 px-3 rounded-lg shadow-xl transform -translate-x-1/2">
                      <div className="font-bold">Peak Demand</div>
                      <div className="text-white/80">Urea: 450 Bags</div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-medium px-2 uppercase tracking-wider">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>

                {/* Highest Demand Inputs Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Highest Demand Inputs
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Showing {filteredProducts.length}{" "}
                        {categoryFilter === "all" ? "top" : categoryFilter}{" "}
                        product{filteredProducts.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
                      See Full Report
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                          <th className="px-6 py-4 tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-4 tracking-wider">Category</th>
                          <th className="px-6 py-4 tracking-wider">
                            Search Trend
                          </th>
                          <th className="px-6 py-4 tracking-wider">
                            Avg. Market Price
                          </th>
                          <th className="px-6 py-4 tracking-wider text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-gray-800">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gray-100 p-1 flex items-center justify-center shrink-0">
                                    {product.image ? (
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full object-contain"
                                      />
                                    ) : (
                                      <span className="text-lg">
                                        {product.icon}
                                      </span>
                                    )}
                                  </div>
                                  {product.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 capitalize">
                                {product.category}
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className={`flex items-center gap-2 ${product.trendColor} font-bold text-xs`}
                                >
                                  <span>📈</span> {product.trend}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium">
                                Ksh {product.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="bg-emerald-700/10 text-emerald-700 hover:bg-emerald-700 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                  Restock
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-12 text-center">
                              <p className="text-gray-400 text-sm">
                                No products found for this category.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                {/* Seasonal Planting Calendar */}
                <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-700 opacity-20 rounded-full blur-3xl"></div>
                  <h3 className="font-bold text-lg mb-4 relative z-10">
                    Seasonal Planting Calendar
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-green-300">
                          Current Phase
                        </span>
                        <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <h4 className="font-bold text-sm">Long Rains Planting</h4>
                      <p className="text-[10px] text-white/70 mt-1">
                        Maize, Beans, Sorghum
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                          Coming Soon
                        </span>
                        <span className="text-[10px] text-white/60">
                          In 2 Weeks
                        </span>
                      </div>
                      <h4 className="font-bold text-sm">
                        First Weeding &amp; Top Dressing
                      </h4>
                      <p className="text-[10px] text-white/70 mt-1">
                        Prepare CAN &amp; Foliar feeds
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regional Updates */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-800">
                      Regional Updates
                    </h3>
                    <button className="text-gray-400 hover:text-gray-800 transition">
                      <span className="text-xl">🔄</span>
                    </button>
                  </div>
                  <div className="space-y-6 overflow-y-auto pr-2 max-h-[500px]">
                    {regionalUpdates.map((update) => (
                      <div
                        key={update.id}
                        className={`relative pl-6 border-l-2 ${
                          update.isRecent
                            ? "border-emerald-700/30"
                            : "border-gray-200"
                        } pb-2`}
                      >
                        <div
                          className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 ${
                            update.isRecent
                              ? "border-emerald-700"
                              : "border-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-[10px] font-bold mb-1 block uppercase tracking-wide ${
                            update.isRecent
                              ? "text-emerald-700"
                              : "text-gray-400"
                          }`}
                        >
                          {update.time}
                        </span>
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          {update.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {update.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dealer Tip */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="flex gap-3 mb-2">
                        <span className="text-emerald-700 text-xl">💡</span>
                        <h4 className="font-bold text-emerald-700 text-sm">
                          Dealer Tip
                        </h4>
                      </div>
                      <p className="text-xs text-emerald-800/80 leading-relaxed">
                        Bundle <span className="font-bold">Glyphosate</span>{" "}
                        with pre-emergence herbicides to increase basket size
                        this week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketTrendsPage;
