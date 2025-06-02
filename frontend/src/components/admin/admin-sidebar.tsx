"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FileText, MessageSquare } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

export function AdminSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      title: "User Table",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Reports",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/reports",
    },
  ]

  return (
    <div
      className={cn(
        "border-r border-border bg-card h-[calc(100vh-4rem)] transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <h2 className="font-semibold">Admin Panel</h2>}
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="px-3 py-2">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <a key={index} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-muted",
                    collapsed ? "px-2" : "px-3",
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-2">{item.title}</span>}
                </Button>
              </a>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  )
}
