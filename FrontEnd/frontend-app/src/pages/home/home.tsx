import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import ControlPanel from "@/pages/home/control-panel"
import UserManagementPanel from "@/pages/home/users-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<ControlPanel />} />
            <Route path="/users" element={<UserManagementPanel />} />
            {/* Agrega más rutas hijas aquí si tienes más paneles */}
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}