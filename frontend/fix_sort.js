const fs = require("fs");
let txt = fs.readFileSync("src/app/(main)/lessee/browse/page.tsx", "utf8");

// Replace the static sort section - using indexOf/slice approach
const START =
  '        {/* ── Main Listings ──────────────────────────────────── */}\n        <div className="flex-1 bg-[#f8fafc] p-8 overflow-y-auto">\n          <div className="flex items-center justify-between mb-6">';
const END_AFTER = "</div>\n\n          {";
const startIdx = txt.indexOf(START);
if (startIdx === -1) {
  console.log("Start not found");
  process.exit(1);
}
const endIdx = txt.indexOf(END_AFTER, startIdx);
if (endIdx === -1) {
  console.log("End not found");
  process.exit(1);
}
const endFull = endIdx + END_AFTER.length;
console.log("Found region from", startIdx, "to", endFull);

const before = txt.substring(0, startIdx);
const after = txt.substring(endFull);
const newSection = `        {/* ── Main Listings ──────────────────────────────────── */}
        <div className="flex-1 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3
              className="text-lg sm:text-xl font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {listingsLoading ? "Loading listings\u2026" : \`\${filteredListings.length} Land Listing\${filteredListings.length !== 1 ? "s" : ""} Found\`}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#047857] hover:text-[#047857] transition-all"
                >
                  <span className="material-icons-round text-base">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.icon ?? "sort"}
                  </span>
                  <span className="hidden sm:inline">{SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"}</span>
                  <span className="material-icons-round text-lg">expand_more</span>
                </button>
                {showSortMenu && (
                  <ul className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className={\`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-emerald-50 hover:text-[#047857] transition \${
                            sortBy === opt.value ? "text-[#047857] font-semibold bg-emerald-50" : "text-gray-700"
                          }\`}
                        >
                          <span className="material-icons-round text-base">{opt.icon}</span>
                          {opt.label}
                          {sortBy === opt.value && (
                            <span className="material-icons-round text-sm ml-auto">check</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {`;

txt = before + newSection + after;

// fix skeleton grid responsive
txt = txt.replace(
  'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\n                {Array.from',
  'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">\n                {Array.from',
);

// fix listings grid responsive
txt = txt.replace(
  'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\n                {filteredListings.map',
  'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">\n                {filteredListings.map',
);

fs.writeFileSync("src/app/(main)/lessee/browse/page.tsx", txt);
console.log("Done - sort dropdown + responsive grid updated");
