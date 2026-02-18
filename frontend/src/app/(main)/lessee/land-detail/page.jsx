"use client";

import { useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/shared/DashboardLayout";
import Sidebar from "../../../../components/shared/Sidebar";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";

const LandDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Land Details</h1>

        <Card>
          <p className="text-gray-600 mb-4">Land ID: {id}</p>
          <p className="text-gray-600 mb-6">
            Detailed land information will be displayed here.
          </p>
          {/* TODO: Implement land details view with images, specs, etc. */}

          <div className="flex space-x-4">
            <Button className="flex-1">Lease This Land</Button>
            <Button variant="outline">Save for Later</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LandDetailPage;
