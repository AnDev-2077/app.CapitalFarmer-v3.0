import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import ControlPanel from "@/pages/home/control-panel"
import UserManagementPanel from "@/pages/home/users-panel"
import QuotationManagementPanel from "@/pages/home/quotes-panel"
import AddEditQuotesPanel from "@/pages/quotes-panels/add-edit-quotes-panel"
import DetailsQuotesPanel from "@/pages/quotes-panels/quotes-details-panel"
import ExportQuotesPanel from "@/pages/quotes-panels/export-quotes-panel"
import ClientsManagmentPanel from "@/pages/home/clients-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<ControlPanel />} />
            <Route path="/users" element={<UserManagementPanel />} />
            <Route path="/quotes" element={<QuotationManagementPanel />} />
            <Route path="/quotes/add" element={<AddEditQuotesPanel />} />
            <Route path="/quotes/edit/:id" element={<AddEditQuotesPanel />} />
            <Route path="/quotes/details/:id" element={<DetailsQuotesPanel />} />
            <Route path="/quotes/export/:id" element={<ExportQuotesPanel />} />
            <Route path="/clients" element={<ClientsManagmentPanel />} />
            {/* Agrega más rutas hijas aquí si tienes más paneles */}
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}