"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";
import { useRouter } from "next/navigation";
import { dealerApi } from "@/lib/services/api";

export default function AddProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [visibility, setVisibility] = useState<"public" | "hidden">("public");
  const [immediatePublish, setImmediatePublish] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    sku: "",
    unitPrice: "",
    qty: "",
    discountPrice: "",
    lowStockLevel: "",
    summary: "",
    description: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.category) e.category = "Category is required";
    if (
      !form.unitPrice ||
      isNaN(Number(form.unitPrice)) ||
      Number(form.unitPrice) <= 0
    )
      e.unitPrice = "Valid price required";
    if (!form.qty || isNaN(Number(form.qty)) || Number(form.qty) < 0)
      e.qty = "Valid quantity required";
    if (!form.summary.trim()) e.summary = "Short summary is required";
    return e;
  };

  const handlePublish = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setIsPublishing(true);
    
    try {
      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.unitPrice);
      formData.append("quantity", form.qty);
      formData.append("description", form.description || form.summary);
      formData.append("is_visible", visibility === "public" ? "true" : "false");
      formData.append("is_active", immediatePublish ? "true" : "false");
      
      // Optional fields
      if (form.sku) formData.append("sku", form.sku);
      if (form.discountPrice) formData.append("discount_price", form.discountPrice);
      if (form.lowStockLevel) formData.append("low_stock_level", form.lowStockLevel);
      if (form.summary) formData.append("summary", form.summary);
      
      // Add images if any
      selectedFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      // Call the API
      await dealerApi.createProduct(formData);
      
      showToast("Product published successfully!");
      setTimeout(() => router.push("/dealer/products"), 2000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      showToast("Failed to publish product. Please try again.");
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    if (!form.name.trim()) {
      setErrors({ name: "Product name required for draft" });
      return;
    }
    showToast("Draft saved");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 4) {
      showToast("Maximum 4 images allowed");
      return;
    }
    setSelectedFiles(prev => [...prev, ...files].slice(0, 4));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${errors[field] ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-[#047857]/20 focus:border-[#047857]"}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-sidebar-bg text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Add New Product"
        subtitle="Complete all sections to publish your product to the marketplace."
      >
        <Link
          href="/dealer/products"
          className="flex px-4 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 bg-white"
        >
          <span className="material-icons-round text-base">close</span>
          Cancel
        </Link>
        <button
          onClick={handleSaveDraft}
          className="flex px-4 py-2.5 text-sm border border-[#047857] text-[#047857] rounded-lg items-center gap-2 hover:bg-emerald-50 bg-white"
        >
          <span className="material-icons-round text-base">save</span>
          Save Draft
        </button>
      </DealerPageHeader>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-300">
          {/* Left — Main Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-sidebar-bg rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Basic Information</h3>
                  <p className="text-xs text-gray-400">
                    Product identity and classification
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g. DAP Fertilizer 50kg Bag"
                    className={inputCls("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className={inputCls("category") + " appearance-none"}
                    >
                      <option value="">Select category</option>
                      <option>Fertilizers</option>
                      <option>Seeds</option>
                      <option>Equipment</option>
                      <option>Pesticides</option>
                      <option>Animal Feeds</option>
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      SKU / Product Code
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setField("sku", e.target.value)}
                      placeholder="e.g. DAP-50KG-001"
                      className={inputCls("sku")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Stock */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-sidebar-bg rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Pricing &amp; Stock
                  </h3>
                  <p className="text-xs text-gray-400">
                    Set your pricing and manage inventory levels
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Unit Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      Ksh
                    </span>
                    <input
                      type="number"
                      value={form.unitPrice}
                      onChange={(e) => setField("unitPrice", e.target.value)}
                      placeholder="0.00"
                      className={
                        "w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition " +
                        (errors.unitPrice
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-[#047857]/20 focus:border-[#047857]")
                      }
                    />
                  </div>
                  {errors.unitPrice && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.unitPrice}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Initial Quantity *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.qty}
                      onChange={(e) => setField("qty", e.target.value)}
                      placeholder="0"
                      className={
                        "w-full pl-4 pr-14 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition " +
                        (errors.qty
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-[#047857]/20 focus:border-[#047857]")
                      }
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                      UNITS
                    </span>
                  </div>
                  {errors.qty && (
                    <p className="text-xs text-red-500 mt-1">{errors.qty}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Discount Price{" "}
                    <span className="text-gray-300 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      Ksh
                    </span>
                    <input
                      type="number"
                      value={form.discountPrice}
                      onChange={(e) =>
                        setField("discountPrice", e.target.value)
                      }
                      placeholder="Leave blank if none"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Low Stock Alert Level
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.lowStockLevel}
                      onChange={(e) =>
                        setField("lowStockLevel", e.target.value)
                      }
                      placeholder="e.g. 20"
                      className="w-full pl-4 pr-14 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                      UNITS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Description */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-sidebar-bg rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Product Description
                  </h3>
                  <p className="text-xs text-gray-400">
                    Help buyers understand your product
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Short Summary *
                  </label>
                  <input
                    type="text"
                    value={form.summary}
                    onChange={(e) => setField("summary", e.target.value)}
                    placeholder="A brief one-line description displayed in search results"
                    className={inputCls("summary")}
                  />
                  {errors.summary && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.summary}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Full Description
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Detailed product description, usage instructions, specifications..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Section 4: Media */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-sidebar-bg rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Media</h3>
                  <p className="text-[10px] text-gray-400">
                    Upload product images
                  </p>
                </div>
              </div>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#047857] hover:bg-emerald-50/30 transition cursor-pointer mb-3 group"
              >
                <span className="material-icons-round text-3xl text-gray-300 group-hover:text-[#047857] mb-2 block transition">
                  cloud_upload
                </span>
                <p className="text-xs font-semibold text-gray-500">
                  Click to upload
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  PNG, JPG up to 5MB each
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => {
                  const file = selectedFiles[i];
                  if (file) {
                    return (
                      <div key={i} className="aspect-square relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <span className="material-icons-round text-xs">close</span>
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      onClick={() => fileRef.current?.click()}
                      className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#047857] hover:bg-emerald-50/30 transition"
                    >
                      <span className="material-icons-round text-gray-300 text-sm">
                        add
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-sm mb-4">
                Visibility
              </h3>
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${visibility === "public" ? "border-[#047857] bg-emerald-50/30" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="mt-0.5 accent-[#047857]"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Public</p>
                    <p className="text-[10px] text-gray-400">
                      Visible to all buyers in the marketplace
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${visibility === "hidden" ? "border-gray-500 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="hidden"
                    checked={visibility === "hidden"}
                    onChange={() => setVisibility("hidden")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Hidden</p>
                    <p className="text-[10px] text-gray-400">
                      Only visible to you. Won&apos;t appear in search.
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Immediate Publish
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Go live instantly after saving
                  </p>
                </div>
                <button
                  onClick={() => setImmediatePublish(!immediatePublish)}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${immediatePublish ? "bg-blue-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all shadow ${immediatePublish ? "left-5" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-4 bg-[#047857] text-white rounded-2xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-[#047857]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <span className="material-icons-round text-base animate-spin">
                    refresh
                  </span>
                  Publishing...
                </>
              ) : (
                <>
                  Publish Product
                  <span className="material-icons-round text-base">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400">
              By publishing, you agree to our{" "}
              <span className="text-[#047857] font-semibold underline cursor-pointer">
                Dealer Terms
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
