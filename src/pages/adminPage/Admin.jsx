import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import AddProduct from "./AddProduct.jsx";
import EditProduct from "./EditProduct.jsx";
import DashboardPage from "./DashboardPage.jsx";
import ProductsPage from "./ProductsPage.jsx";
import SubscriptionPage from "./SubscriptionPage";


export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  

  return (
    <div className="min-h-screen bg-[#F3F5FB] flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          activeTab={activeTab}
          onAddProduct={() => setShowAddModal(true)}
        />

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <DashboardPage
              
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "products" && (
            <ProductsPage
              onAddProduct={() => setShowAddModal(true)}
              onEditProduct={(product) => setEditModal(product)}
            />
          )}
          {activeTab === "newsletter" && (
            <SubscriptionPage/>
          )}
        </main>

        {showAddModal && <AddProduct onClose={() => setShowAddModal(false)} />}

        {editModal && (
          <EditProduct product={editModal} onClose={() => setEditModal(null)} />
        )}
      </div>
    </div>
  );
}
