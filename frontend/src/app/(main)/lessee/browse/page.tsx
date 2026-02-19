const listings = [
  {
    name: "Green Valley Plot A",
    acres: "20 Acres",
    location: "Nakuru, Rift Valley",
    price: "45k",
    soil: "Loam",
    water: "River",
    slope: "Flat",
    badge: "Ideal for Maize",
    badgeColor: "bg-[#047857]",
    match: "98%",
    matchColor: "text-[#047857] bg-emerald-50",
    status: null,
  },
  {
    name: "Highland Wheat Farm",
    acres: "15 Acres",
    location: "Narok, Rift Valley",
    price: "30k",
    soil: "Volcanic",
    water: "Borehole",
    slope: "Gentle",
    badge: "Wheat Ready",
    badgeColor: "bg-amber-600",
    match: "85%",
    matchColor: "text-amber-600 bg-amber-50",
    status: null,
  },
  {
    name: "Nyeri Mixed Farm",
    acres: "50 Acres",
    location: "Nyeri, Central",
    price: "60k",
    soil: "Red Clay",
    water: "Rain/Dam",
    slope: "Hilly",
    badge: "Mixed Crop",
    badgeColor: "bg-teal-600",
    match: "92%",
    matchColor: "text-teal-700 bg-teal-50",
    status: null,
  },
  {
    name: "Thika Road Plot",
    acres: "12 Acres",
    location: "Kiambu, Central",
    price: "80k",
    soil: "Loam",
    water: "Piped",
    slope: "Flat",
    badge: "Horticulture",
    badgeColor: "bg-purple-600",
    match: null,
    matchColor: "",
    status: "Pending Verification",
  },
];

export default function BrowseLandPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
        <div>
          <h2
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Find Land
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse available leasing opportunities matched to your preferences
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search location or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-gray-700 placeholder-gray-400"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Filters Panel */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-6 flex flex-col gap-6 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3
                className="font-bold text-gray-800 flex items-center gap-2 text-xl"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857] text-2xl">
                  tune
                </span>
                Farm Preferences
              </h3>
              <button className="text-xs font-semibold text-[#047857] hover:text-emerald-700">
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Adjust these settings to filter the land listings automatically.
            </p>
          </div>

          {/* Preferred Regions */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block mb-2">
              Preferred Regions
            </label>
            {[
              "Rift Valley",
              "Central Kenya",
              "Coastal Region",
              "Eastern",
              "Western",
            ].map((region, i) => (
              <label
                key={region}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="w-5 h-5 rounded border-gray-300 text-[#047857] focus:ring-[#047857]/20 accent-[#047857]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#047857] transition-colors">
                  {region}
                </span>
              </label>
            ))}
          </div>

          {/* AI Recommended Crops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
                AI Recommended Crops
              </label>
              <span className="flex items-center text-[10px] text-[#5D4037] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="material-icons-round text-[14px] mr-1 text-amber-600">
                  auto_awesome
                </span>
                Gemini AI
              </span>
            </div>
            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl p-3 border border-amber-100">
              <p className="text-[10px] text-[#5D4037] mb-2.5">
                Based on soil data & climate history for{" "}
                <span className="font-bold text-amber-700">
                  Rift Valley & Central
                </span>
                :
              </p>
              <div className="flex flex-wrap gap-2">
                {["Maize", "Wheat", "Avocado"].map((crop) => (
                  <button
                    key={crop}
                    className="inline-flex items-center bg-white text-[#5D4037] px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 hover:border-amber-400 hover:text-amber-700 transition-all shadow-sm"
                  >
                    <span className="material-icons-round text-[14px] mr-1.5 text-amber-600">
                      auto_awesome
                    </span>
                    {crop}
                    <span className="material-icons-round text-xs ml-1.5 text-gray-300">
                      add
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <label className="text-[10px] font-bold text-[#5D4037] uppercase tracking-wider block mb-2">
                My Selection
              </label>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center bg-[#047857] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  Maize
                  <button className="ml-1.5 hover:text-emerald-100">
                    <span className="material-icons-round text-sm">close</span>
                  </button>
                </div>
                <button className="inline-flex items-center bg-transparent text-[#5D4037] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors border border-dashed border-[#5D4037]/30">
                  <span className="material-icons-round text-sm mr-1">add</span>{" "}
                  Custom Crop
                </button>
              </div>
            </div>
          </div>

          {/* Target Acreage */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Target Acreage
            </label>
            <div className="relative pt-1 pb-2">
              <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
              <div className="absolute top-1 left-[10%] right-[30%] h-1.5 bg-[#047857]/60 rounded-full"></div>
              <div className="absolute top-[0px] left-[45%] w-4 h-4 bg-white border-2 border-[#047857] rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full">
                <label className="text-[10px] text-gray-400 block mb-1">
                  Min (Acres)
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full text-center py-1.5 px-2 text-sm border border-gray-200 bg-white rounded-lg text-gray-700 focus:border-[#047857] focus:ring-0 focus:outline-none"
                />
              </div>
              <span className="text-gray-300 font-light">—</span>
              <div className="w-full">
                <label className="text-[10px] text-gray-400 block mb-1">
                  Max (Acres)
                </label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full text-center py-1.5 px-2 text-sm border border-gray-200 bg-white rounded-lg text-gray-700 focus:border-[#047857] focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-3 mb-2">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Soil Type Preference
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-[#047857] cursor-pointer">
                <option>Any Soil Type</option>
                <option>Volcanic Loam</option>
                <option>Clay</option>
                <option>Sandy</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 material-icons-round text-xl">
                expand_more
              </span>
            </div>
          </div>

          <button className="mt-auto w-full bg-[#047857] hover:bg-emerald-800 text-white font-medium py-3 rounded-xl shadow-lg transition-colors">
            Update Results
          </button>
        </aside>

        {/* Main Listings */}
        <div className="flex-1 bg-[#f8fafc] p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              14 Land Listings Found
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="relative">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                  <span>Recommended</span>
                  <span className="material-icons-round text-lg">
                    expand_more
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.name}
                className="bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#047857]/20 flex flex-col"
              >
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                    <span className="material-icons-round text-[#0f392b]/20 text-[80px]">
                      landscape
                    </span>
                  </div>
                  <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                    <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">
                      {listing.acres}
                    </span>
                    <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-1.5 rounded-full text-white transition-colors">
                      <span className="material-icons-round text-lg">
                        favorite_border
                      </span>
                    </button>
                  </div>
                  <span
                    className={`absolute bottom-3 left-3 ${listing.badgeColor} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm`}
                  >
                    {listing.badge}
                  </span>
                </div>

                <div className="pt-4 px-5 pb-5 flex flex-col flex-1">
                  <h4
                    className="font-bold text-lg text-gray-900 mb-1"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {listing.name}
                  </h4>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="material-icons-round text-sm mr-1">
                        location_on
                      </span>
                      {listing.location}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-medium">
                        KES
                      </div>
                      <div className="text-sm font-bold text-[#047857]">
                        {listing.price}
                        <span className="text-[10px] font-normal text-gray-400">
                          /acre/yr
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                    <div className="text-center">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                        Soil
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        {listing.soil}
                      </div>
                    </div>
                    <div className="text-center border-l border-r border-gray-100">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                        Water
                      </div>
                      <div className="text-xs font-medium text-gray-600 truncate">
                        {listing.water}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                        Slope
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        {listing.slope}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {listing.match ? (
                        <>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${listing.matchColor}`}
                          >
                            <span className="text-[10px] font-bold">
                              {listing.match}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            Match
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-orange-500 font-medium">
                          {listing.status}
                        </span>
                      )}
                    </div>
                    <a
                      href="#"
                      className="text-xs font-bold text-[#047857] flex items-center hover:text-emerald-700 transition-colors"
                    >
                      View Details
                      <span className="material-icons-round text-sm ml-1">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
