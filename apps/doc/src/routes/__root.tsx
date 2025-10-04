import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";
import {  SidebarProvider } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={false}>
        
          <AppSidebar variant="floating" />
         
            <main className="flex-1">
            
              <Outlet />
            </main>
         
        
      </SidebarProvider>
      
    </ThemeProvider>
  ),
});
