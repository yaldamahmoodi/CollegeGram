import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  ),
});
