"use client";

import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import AppHeader from "./header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Get the default sidebar state from a cookie
  const defaultOpen =
    typeof document !== "undefined"
      ? document.cookie.includes("sidebar_state=true")
      : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
