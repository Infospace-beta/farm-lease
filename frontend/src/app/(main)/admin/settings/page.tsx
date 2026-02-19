"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function SystemSettingsPage() {
  const [fee, setFee] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-5 lg:p-8">
      <header className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-earth" />
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
            System Settings
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Configure platform-wide defaults and operational parameters.
          </p>
        </div>
      </header>

      <div className="max-w-2xl space-y-6">

        {/* Fee Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-earth font-serif mb-4">Platform Fee Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Lease Service Fee: <span className="text-sidebar-bg">{fee}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={25}
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg accent-sidebar-bg cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
                <span>0%</span><span>25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Escrow Hold Period */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-earth font-serif mb-4">Escrow Hold Period</h3>
          <select className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
            <option>7 Days</option>
            <option>14 Days</option>
            <option selected>30 Days</option>
            <option>60 Days</option>
          </select>
          <p className="text-xs text-gray-400 mt-2">Funds are held in escrow for this period after lease signing before being released to the landowner.</p>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-earth font-serif">Maintenance Mode</h3>
            <p className="text-xs text-gray-400 mt-1">When enabled, the platform is inaccessible to non-admin users.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-bg" />
          </label>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition ${
            saved
              ? "bg-green-600 text-white"
              : "bg-sidebar-bg text-white hover:opacity-90"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
