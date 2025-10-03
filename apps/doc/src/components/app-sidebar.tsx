import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  FolderIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "/team",
      icon: UsersIcon,
    },
  ],
  navSecondary: [],
  documents: [
    {
      name: "Data Library",
      url: "/data-library",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "/word-assistant",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">devsync</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}
