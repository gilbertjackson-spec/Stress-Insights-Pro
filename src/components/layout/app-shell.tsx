"use client";

import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import AppHeader from "./header";
import React, { useState, useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const defaultOpen = document.cookie.includes("sidebar_state=true");
    setIsSidebarOpen(defaultOpen);
  }, []);


  if (!isClient) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return null;
  }

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
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
