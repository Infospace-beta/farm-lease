"use client";

import DashboardLayout from "../../../../components/shared/DashboardLayout";
import Sidebar from "../../../../components/shared/Sidebar";
import Card from "../../../../components/ui/Card";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const BrowseLandsPage = () => {
  const menuItems = [
    { label: "Dashboard", path: "/lessee/dashboard", icon: "📊" },
    { label: "Browse Lands", path: "/lessee/browse", icon: "🔍" },
    { label: "My Leases", path: "/lessee/leases", icon: "📄" },
    {
      label: "Crop Recommendations",
      path: "/lessee/recommendations",
      icon: "🌾",
    },
    { label: "Agro Products", path: "/lessee/products", icon: "🛒" },
    { label: "Profile", path: "/lessee/profile", icon: "👤" },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar menuItems={menuItems} />}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Browse Available Lands
        </h1>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="flex space-x-4">
            <Input
              placeholder="Search by location, size, or keyword..."
              className="flex-1"
            />
            <Button>Search</Button>
          </div>
        </Card>

        {/* TODO: Add filter sidebar and land cards grid */}
        <Card>
          <p className="text-gray-600 text-center py-8">
            No lands available at the moment. Check back later!
          </p>
          {/* TODO: Implement land cards grid */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BrowseLandsPage;
