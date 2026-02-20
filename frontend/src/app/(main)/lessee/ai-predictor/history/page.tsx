import Link from "next/link";

const historyData = [
  {
    date: "Oct 24, 2023",
    time: "10:42 AM",
    mode: "Regional Data",
    query: "Nakuru, Rift Valley",
    crop: "Arabica Coffee",
    icon: "coffee",
    match: "94%",
    matchColor: "text-[#0f392b]",
  },
  {
    date: "Oct 20, 2023",
    time: "03:15 PM",
    mode: "Manual Entry",
    query: "pH 6.2, N:High, P:Med",
    querySub: "Soil Sample #4021",
    crop: "Hybrid Maize 614",
    icon: "grain",
    match: "89%",
    matchColor: "text-[#0f392b]",
  },
  {
    date: "Oct 12, 2023",
    time: "09:30 AM",
    mode: "Regional Data",
    query: "Trans-Nzoia County",
    crop: "Hass Avocado",
    icon: "nutrition",
    match: "76%",
    matchColor: "text-orange-500",
  },
  {
    date: "Sep 28, 2023",
    time: "11:15 AM",
    mode: "Regional Data",
    query: "Kiambu, Central",
    crop: "Macadamia Nuts",
    icon: "forest",
    match: "91%",
    matchColor: "text-[#0f392b]",
  },
  {
    date: "Sep 15, 2023",
    time: "02:45 PM",
    mode: "Manual Entry",
    query: "pH 5.5, N:Low, P:High",
    querySub: "Soil Sample #3892",
    crop: "Purple Tea",
    icon: "emoji_food_beverage",
    match: "85%",
    matchColor: "text-[#0f392b]",
  },
];

export default function AIPredictorHistoryPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2
            className="text-3xl font-bold text-[#5D4037] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            AI Crop Predictor
          </h2>
          <p className="text-gray-500 text-sm max-w-xl">
            Review past soil and climate analysis results to track trends over
            time.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <Link
              href="/lessee/ai-predictor"
              className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded text-xs font-bold uppercase tracking-wide"
            >
              Predictor
            </Link>
            <button className="px-4 py-2 bg-[#0f392b] text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm">
              History
            </button>
          </div>
        </div>
      </header>

      {/* Prediction History Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3
              className="font-bold text-2xl text-[#5D4037]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Prediction History
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Showing last 6 months of analysis
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search by crop, region..."
                className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f392b] w-60 shadow-sm"
              />
            </div>
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                calendar_today
              </span>
              <input
                type="text"
                placeholder="Filter by date"
                className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f392b] w-48 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0f392b] text-white rounded-xl text-sm font-medium hover:bg-[#0a261c] transition shadow-lg">
              <span className="material-icons-round text-sm">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-4 pr-6">Date</th>
                <th className="py-4 pr-6">Analysis Mode</th>
                <th className="py-4 pr-6">Search Query</th>
                <th className="py-4 pr-6">Top Recommendation</th>
                <th className="py-4 pr-6 text-center">Match %</th>
                <th className="py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 pr-6">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.date}
                    </p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </td>
                  <td className="py-5 pr-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        item.mode === "Regional Data"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      <span className="material-icons-round text-[12px]">
                        {item.mode === "Regional Data" ? "public" : "edit"}
                      </span>
                      {item.mode}
                    </span>
                  </td>
                  <td className="py-5 pr-6">
                    <p className="text-sm text-gray-700 font-medium">
                      {item.query}
                    </p>
                    {item.querySub && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.querySub}
                      </p>
                    )}
                  </td>
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0f392b]/10 flex items-center justify-center text-[#0f392b] shrink-0">
                        <span className="material-icons-round text-sm">
                          {item.icon}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {item.crop}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pr-6 text-center">
                    <span className={`text-sm font-bold ${item.matchColor}`}>
                      {item.match}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-[#0f392b] hover:underline">
                      View Full Report
                      <span className="material-icons-round text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
