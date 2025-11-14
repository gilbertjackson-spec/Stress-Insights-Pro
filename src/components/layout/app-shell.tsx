'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import AppHeader from './header';
import React, { useState, useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // To prevent hydration mismatch, we need to ensure that the server-rendered
  // output is the same as the initial client render. We can achieve this by
  // using a key on the provider that changes once the client has mounted.
  const defaultOpen = isClient
    ? document.cookie.includes('sidebar_state=true')
    : true;

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      key={isClient ? 'client' : 'server'} // This key forces a re-render on the client
    >
      <div className="flex min-h-screen">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 bg-background">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
