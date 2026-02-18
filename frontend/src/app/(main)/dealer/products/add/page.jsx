"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, Lightbulb } from "lucide-react";
import Card from "../../../../../components/ui/Card";
import Button from "../../../../../components/ui/Button";
import DealerSidebar from "../../../../../components/layout/DealerSidebar";
import DealerHeader from "../../../../../components/layout/DealerHeader";

const AddProductPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("add-product");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const categories = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizers", label: "Fertilizers" },
    { value: "pesticides", label: "Pesticides" },
    { value: "tools", label: "Tools & Equipment" },
    { value: "machinery", label: "Machinery" },
    { value: "irrigation", label: "Irrigation Systems" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product data:", formData);
    // Handle product creation
  };

  return (
    <div className="bg-background-light flex">
      <DealerSidebar />
      <main className="flex-1 h-screen overflow-hidden">
        <DealerHeader
          title="Add Product"
          subtitle="Fill in the details to add a new product to your inventory"
        />
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Card className="bg-white p-6 shadow-md">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Hybrid Maize Seeds - DH04"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (KES) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Initial Stock Quantity *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Product Description
                    </h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your product, its features, benefits, and usage..."
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Product Image
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-6xl flex justify-center">
                          <Camera className="w-16 h-16 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="text-emerald-700 font-medium">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or WEBP (MAX. 5MB)
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.files[0] })
                        }
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-medium shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </Button>
                    <button
                      type="button"
                      onClick={() => router.push("/dealer/products")}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Card>
            </form>

            {/* Tips Card */}
            <Card className="bg-blue-50 border-blue-200 p-6">
              <div className="flex gap-3">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Tips for Adding Products
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, descriptive product names</li>
                    <li>• High-quality images increase sales by up to 40%</li>
                    <li>• Include detailed descriptions with key features</li>
                    <li>• Set competitive pricing based on market research</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
