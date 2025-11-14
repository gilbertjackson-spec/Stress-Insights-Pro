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
    // On the client, check the cookie for the persisted state
    const defaultOpen = document.cookie.includes("sidebar_state=true");
    setIsSidebarOpen(defaultOpen);
  }, []);

  // On the server, we can render with a default, and the client will correct it.
  // To prevent hydration mismatch, we use a key on the provider or wait for client.
  // A simpler approach for now is to just use the initial state and let useEffect update it.
  const sidebarDefaultOpen = isClient ? isSidebarOpen : true;

  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen} key={isClient ? 'client' : 'server'}>
      <div className="flex min-h-screen">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
