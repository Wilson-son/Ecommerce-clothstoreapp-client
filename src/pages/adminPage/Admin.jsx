import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import DashboardPage from "./DashboardPage.jsx";
import ProductsPage from "./ProductsPage.jsx";
import SubscriptionPage from "./SubscriptionPage";
import { mockProducts, mockSubscribers } from "./adminData.js";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState(mockProducts);
  const [subscribers, setSubscribers] = useState(mockSubscribers);

  return (
    <div className="min-h-screen bg-[#F3F5FB] flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar activeTab={activeTab} />

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <DashboardPage
              products={products}
              subscribers={subscribers}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "products" && (
            <ProductsPage products={products} setProducts={setProducts} />
          )}
          {activeTab === "newsletter" && (
            <SubscriptionPage
              subscribers={subscribers}
              setSubscribers={setSubscribers}
            />
          )}
        </main>
      </div>
    </div>
  );
}
