import Link from "next/link";

export default function HomePage() {
  return (
    <div className="antialiased bg-[#f8fafc] text-gray-900">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sidebar-bg rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[#13ec80] text-2xl">grid_view</span>
              </div>
              <span
                className="text-2xl font-bold text-sidebar-bg tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                FarmLease
              </span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/lessee/browse" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">
                Find Land
              </Link>
              <a href="#ai-predictor" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">
                AI Predictor
              </a>
              <Link href="/login" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">
                Agro-Dealers
              </Link>
              <a href="#about" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">
                About Us
              </a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-sidebar-bg hover:bg-emerald-900 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg text-sm flex items-center gap-2"
              >
                <span>Join FarmLease</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#f8fafc]">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI-Driven Agriculture
              </div>
              <h1
                className="text-5xl lg:text-7xl font-bold text-sidebar-bg mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Precision Farming,{" "}
                <br />
                <span className="text-primary">Data-Backed Leasing.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Access verified land with predictive yield analytics. We connect landowners and modern
                farmers through a secure, tech-forward ecosystem powered by deep learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="bg-sidebar-bg text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-900 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Start Exploring
                  <span className="material-symbols-outlined">explore</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-full font-medium text-lg text-sidebar-bg border border-gray-200 hover:bg-white hover:border-gray-300 transition-all bg-white/50 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  List Your Land
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center gap-8 border-t border-gray-200 pt-8">
                <div>
                  <p className="text-3xl font-bold text-sidebar-bg">98%</p>
                  <p className="text-sm text-gray-500 font-medium">Predictive Accuracy</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <p className="text-3xl font-bold text-sidebar-bg">50k+</p>
                  <p className="text-sm text-gray-500 font-medium">Acres Analyzed</p>
                </div>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative">
              <div className="relative rounded-[24px] overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-linear-to- from-sidebar-bg/40 to-transparent mix-blend-multiply z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9d4uCEKQmY1LRXZB10FgJWnHE4h_VPeaLo_gu8p1nRvRLx5qeyCCrzeIHB9mlqT-uK2L6E4YmJTcMikdNWNZhgxIzzr3tFnnK2c8EZ3l1JV6OgCQse7JhDuy4HGmSAOw4dy4FO4FSY88bjfJKyZN-lZMrUAjRNgiWBJ-i6kUfOLZYilQLrhna0MV5H3Cr_5ddee5BqViIdgwCJTjZPngzW0KoFWqxfqufn3Syf9ECB4QzHcUY9WFjskHQ5YWQc8Y38KOsDz0MhqXc"
                  alt="Farmer using tablet in field"
                  className="w-full h-[600px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating Soil Analysis card */}
                <div className="absolute bottom-8 left-8 right-8 z-20 p-6 rounded-2xl border border-white/20 shadow-lg backdrop-blur-xl bg-white/90">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sidebar-bg font-bold">Soil Analysis #842</h3>
                      <p className="text-xs text-gray-500">Updated 2 mins ago</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">OPTIMAL</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Moisture</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[75%]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Nitrogen</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[60%]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">pH Level</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[45%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow orbs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Smart Land Leasing */}
            <div className="p-8 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-earth/30 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-earth text-2xl">landscape</span>
                </div>
                <span className="text-earth bg-earth/10 px-3 py-1 rounded-full text-xs font-bold">LEASING</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Smart Land Leasing
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Blockchain-verified land ownership records and automated smart contracts ensure
                transparency and trust for every transaction.
              </p>
            </div>

            {/* Card 2: Gemini AI — highlighted */}
            <div className="p-8 rounded-[24px] bg-sidebar-bg text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[#13ec80] text-2xl">auto_awesome</span>
                </div>
                <span className="text-[#13ec80] bg-[#13ec80]/20 px-3 py-1 rounded-full text-xs font-bold border border-[#13ec80]/20">
                  AI POWERED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10" style={{ fontFamily: "var(--font-playfair)" }}>
                Gemini AI Predictions
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                Advanced generative models analyze soil samples and weather patterns to suggest
                high-yield crops with 98% accuracy.
              </p>
            </div>

            {/* Card 3: Secure Escrow */}
            <div className="p-8 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-earth/30 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-earth text-2xl">lock_person</span>
                </div>
                <span className="text-earth bg-earth/10 px-3 py-1 rounded-full text-xs font-bold">SECURITY</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Secure Escrow
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Financial protection for both parties. Funds are held in neutral escrow until all
                lease conditions are algorithmically verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Predictor ────────────────────────────────────────── */}
      <section id="ai-predictor" className="py-24 bg-sidebar-bg relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#13ec80 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.05,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#13ec80] font-mono text-sm tracking-widest uppercase mb-2 block">
              Powered by Gemini API
            </span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Predictive Crop Intelligence
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Harness the power of machine learning to visualize yield potential before you plant a
              single seed.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input parameters panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[24px]">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec80]">tune</span>
                  Input Parameters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Soil pH Level</label>
                    <input
                      type="range"
                      defaultValue={65}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#13ec80]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Acidic</span>
                      <span className="text-white">6.5</span>
                      <span>Alkaline</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Nitrogen Content</label>
                    <input
                      type="range"
                      defaultValue={80}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#13ec80]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Moisture Index</label>
                    <input
                      type="range"
                      defaultValue={45}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#13ec80]"
                    />
                  </div>
                </div>
                <button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  Recalculate Model
                </button>
              </div>

              <div className="bg-linear-to- from-primary/20 to-transparent border border-primary/20 p-6 rounded-[24px]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-[#13ec80]">psychology</span>
                  <span className="text-[#13ec80] text-xs font-bold uppercase">AI Insight</span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  &ldquo;Based on current market trends and soil comp #402,{" "}
                  <strong className="text-[#13ec80]">Soybeans</strong> are projected to yield 15%
                  higher ROI than maize this season.&rdquo;
                </p>
              </div>
            </div>

            {/* Bar chart visualization */}
            <div className="lg:col-span-8">
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 lg:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-white text-lg font-medium">Crop Suitability Score</h4>
                    <p className="text-gray-400 text-xs">Region: Rift Valley | Sector 4A</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">Daily</span>
                    <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-[#13ec80]">Weekly</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">Monthly</span>
                  </div>
                </div>

                <div className="relative h-64 w-full flex items-end justify-between gap-2 px-4 mb-6">
                  {[
                    { h: "40%", label: "40%", highlight: false },
                    { h: "65%", label: "65%", highlight: false },
                    { h: "55%", label: "55%", highlight: false },
                    { h: "85%", label: "85%", highlight: true },
                    { h: "60%", label: "60%", highlight: false },
                    { h: "45%", label: "45%", highlight: false },
                  ].map((bar, i) => (
                    <div
                      key={i}
                      className="w-full rounded-t-lg relative group"
                      style={{
                        height: bar.h,
                        background: bar.highlight
                          ? "linear-gradient(to top, #16a34a, #13ec80)"
                          : `rgba(22,163,74,${0.2 + i * 0.05})`,
                        boxShadow: bar.highlight ? "0 0 20px rgba(19,236,128,0.3)" : undefined,
                      }}
                    >
                      <div
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity ${bar.highlight
                            ? "bg-[#13ec80] text-sidebar-bg"
                            : "bg-white text-sidebar-bg"
                          }`}
                      >
                        {bar.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-gray-500 px-4 border-t border-white/10 pt-4">
                  {["Wheat", "Barley", "Sorghum", "Soybeans", "Maize", "Rice"].map((crop, i) => (
                    <span key={crop} className={i === 3 ? "text-[#13ec80] font-bold" : ""}>
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Streamlined Workflow ─────────────────────────────────── */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-sidebar-bg mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Streamlined Workflow
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From discovery to harvest, our platform manages the complexity so you can focus on growth.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 z-0" />
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  num: 1,
                  title: "Create Profile",
                  text: "Sign up as a Farmer or Landowner and verify identity via Ardhisasa API.",
                  color: "#0f392b",
                },
                {
                  num: 2,
                  title: "List or Search",
                  text: "Post land with soil data or search using AI-powered filters.",
                  color: "#5d4037",
                },
                {
                  num: 3,
                  title: "Smart Contract",
                  text: "Auto-generated lease agreements signed digitally and secured on-chain.",
                  color: "#16a34a",
                },
                {
                  num: 4,
                  title: "Farm & Monitor",
                  text: "Connect with agro-dealers and track crop health via satellite integration.",
                  color: "#059669",
                },
              ].map((step) => (
                <div key={step.num} className="pt-12 relative group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#f8fafc] flex items-center justify-center">
                    <div
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg transition-colors duration-300"
                      style={{ border: `2px solid ${step.color}`, color: step.color }}
                    >
                      {step.num}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-center h-full hover:shadow-md transition-shadow">
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ fontFamily: "var(--font-playfair)", color: step.color }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Verified by Ardhisasa ────────────────────────────────── */}
      <section id="about" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-[24px] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-gray-100">
            <div className="md:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="material-symbols-outlined text-green-700">verified_user</span>
                </div>
                <h2
                  className="text-2xl font-bold text-sidebar-bg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Verified by Ardhisasa
                </h2>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Security is our priority. Every land listing on FarmLease undergoes a rigorous manual
                verification process through the National Land Information Management System
                (Ardhisasa) to ensure legitimate ownership before it hits the marketplace.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Title Deed Verification", "ID Authentication", "Fraud Detection"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium text-sidebar-bg shadow-sm border border-gray-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-100">
                <span className="material-symbols-outlined text-sidebar-bg/10" style={{ fontSize: "6rem" }}>
                  policy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-sidebar-bg pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-[#13ec80] text-lg">grid_view</span>
                </div>
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  FarmLease
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Connecting the dots in the agricultural value chain. From land access to market
                readiness, powered by data.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">public</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">alternate_email</span>
                </a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4
                className="text-white font-bold mb-6 tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Platform
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Find Land", href: "/lessee/browse" },
                  { label: "List Property", href: "/login" },
                  { label: "Agro-Dealers", href: "/login" },
                  { label: "AI Insights", href: "#ai-predictor" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#13ec80] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4
                className="text-white font-bold mb-6 tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#13ec80] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4
                className="text-white font-bold mb-6 tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Stay Updated
              </h4>
              <p className="text-gray-400 text-xs mb-4">
                Get the latest crop reports and platform updates.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">© 2025 FarmLease. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-xs">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-xs">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

