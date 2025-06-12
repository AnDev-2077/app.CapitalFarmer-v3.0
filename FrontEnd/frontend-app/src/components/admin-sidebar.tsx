"use client"

import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  const [user, setUser] = useState<{ nombre: string; correo: string } | null>(null);

  // Cargar el usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <Sidebar className="border-r border-slate-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-slate-200 pb-2 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex items-center gap-2">
                <Avatar className="size-8 bg-slate-800">
                  <AvatarFallback>EJ</AvatarFallback>
                </Avatar>
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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 justify-start px-3 hover:bg-slate-100",
                      location.pathname === item.url && "bg-slate-100",
                    )}
                    //onClick={() => setActiveItem(item.title)}
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
                  <Avatar className="size-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
                    <AvatarFallback className="bg-slate-200 text-slate-700">AU</AvatarFallback>
                  </Avatar>
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