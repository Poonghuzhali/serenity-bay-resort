import { Outlet } from "react-router-dom";
import AdminSidebar, { MobileAdminNav } from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <MobileAdminNav />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
