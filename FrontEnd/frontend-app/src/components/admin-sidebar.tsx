"use client"

import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import {
  LayoutDashboard,
  HeadphonesIcon,
  Scale,
  Users,
  Bot,
  Archive,
  UserCheck,
  Settings,
  LogOut,
  User,
  Bell,
  CalendarClock,
  Files,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Panel de Control",
    icon: LayoutDashboard,
    url: "/home",
    color: "text-blue-500",
  },
  {
    title: "Asistencia",
    icon: CalendarClock,
    url: "#",
    color: "text-purple-500",
  },
  {
    title: "Cotizaciones",
    icon: Files,
    url: "/home/quotes",
    color: "text-amber-500",
  },
  {
    title: "Asesoría Legal",
    icon: Scale,
    url: "#",
    color: "text-green-500",
  },
  {
    title: "Interno",
    icon: UserCheck,
    url: "#",
    color: "text-orange-500",
  },
  {
    title: "Bots",
    icon: Bot,
    url: "#",
    color: "text-pink-500",
  },
  {
    title: "Archivos",
    icon: Archive,
    url: "#",
    color: "text-amber-500",
  },
  {
    title: "Clientes",
    icon: Users,
    url: "#",
    color: "text-violet-500",
  },
  {
    title: "Usuarios",
    icon: User,
    url: "/home/users",
    color: "text-indigo-500",
  },
  {
    title: "Soporte",
    icon: HeadphonesIcon,
    url: "#",
    color: "text-teal-500",
  },
]

export function AdminSidebar({ ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Ejemplo de visibilidad por rol
  const visibleNavigationItems = navigationItems.filter(item => {
  // Si es Administrador (AD), ve todo
  if (user?.rol_nombre === "Administrador (AD)") {
    return true;
  }

  // Ejemplo: Solo los asesores legales pueden ver "Asesoría Legal"
  if (item.title === "Asesoría Legal") {
    return [
      "Asesor Legal Capital (AS)",
      "Asesor Legal Farmer (AS)",
      "Asesor Legal Trimex (AS)"
    ].includes(user?.rol_nombre ?? "");
  }

  // Ejemplo: Solo los colaboradores pueden ver "Interno"
  if (item.title === "Interno") {
    return [
      "Colaborador Capital (CO)",
      "Colaborador Farmer (CO)",
      "Colaborador Trimex (CO)"
    ].includes(user?.rol_nombre ?? "");
  }

  // Ejemplo: Solo los clientes pueden ver "Soporte"
  if (item.title === "Soporte") {
    return user?.rol_nombre === "Cliente";
  }

  // Ejemplo: Solo los devs pueden ver "Bots"
  if (item.title === "Bots") {
    return user?.rol_nombre === "Dev";
  }

  // Ejemplo: Solo empleados pueden ver "Archivos"
  if (item.title === "Archivos") {
    return user?.rol_nombre === "Empleado";
  }

  // Ejemplo: Solo admin puede ver "Usuarios" (ya cubierto arriba, pero puedes dejarlo)
  if (item.title === "Usuarios") {
    return false; // Ya lo ve el admin arriba
  }

  // El resto es visible para todos
  return true;
});

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-slate-200 pb-2 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-slate-900">CapitalFarmer</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="absolute right-4 top-4">
          <Bell className="h-5 w-5 text-slate-500" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {visibleNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 justify-start px-3 hover:bg-slate-100",
                      location.pathname === item.url && "bg-slate-100",
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className={cn("size-5", item.color)} />
                      <span className="text-sm font-medium text-slate-700">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-slate-100 h-12">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="font-medium text-sm text-slate-900">{user ? user.nombre : "Usuario"}</span>
                    <span className="text-xs text-slate-500">{user ? user.correo : "correo@ejemplo.com"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-slate-200" side="top" align="end">
                <div className="px-2 py-1.5 text-sm font-medium text-slate-900">Mi Cuenta</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-slate-700 hover:bg-slate-50">
                  <Settings className="size-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-slate-700 hover:bg-slate-50" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}