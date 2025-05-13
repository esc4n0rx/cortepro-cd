"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home, Package, Settings, ShoppingCart, Truck } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Novo Corte",
      icon: Package,
      href: "/novo-corte",
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: "/relatorios",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/configuracoes",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CortePro CD</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon
                    className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-sidebar-foreground")}
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">CD Pavuna</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
