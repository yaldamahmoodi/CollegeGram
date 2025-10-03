import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  DatabaseIcon,
  FolderIcon,
  UsersIcon,
  BuildingIcon,
  ServerIcon,
  FileTextIcon,
  SearchIcon,
  MailIcon,
  MessageSquareIcon,
  BellIcon,
  BookOpenIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavReadMore } from "@/components/nav-read-more"
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
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Overview",
      url: "/overview",
      icon: BookOpenIcon,
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
      name: "System Architecture",
      url: "/architecture",
      icon: BuildingIcon,
    },
    {
      name: "Database Schema",
      url: "/database",
      icon: DatabaseIcon,
    },
    {
      name: "Deployment Guide",
      url: "/deployment",
      icon: ServerIcon,
    },
    {
      name: "API Conventions",
      url: "/api-conventions",
      icon: FileTextIcon,
    },
  ],
  readMore: [
    {
      name: "Elasticsearch",
      url: "/elasticsearch",
      icon: SearchIcon,
    },
    {
      name: "Mailpit",
      url: "/mailpit",
      icon: MailIcon,
    },
    {
      name: "Socket.io",
      url: "/socketio",
      icon: MessageSquareIcon,
    },
    {
      name: "Service Workers",
      url: "/service-workers",
      icon: BellIcon,
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
              <Link to="/analytics">
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
        <NavReadMore items={data.readMore} />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}
