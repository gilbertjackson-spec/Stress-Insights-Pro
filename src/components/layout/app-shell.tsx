'use client';

import AppHeader from './header';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSurveyPage = pathname.startsWith('/survey');

  return (
    <div className="flex min-h-screen flex-col">
      {!isSurveyPage && <AppHeader />}
      <main className="flex-1 bg-background">
        <div className={!isSurveyPage ? "mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8" : ""}>
          {children}
        </div>
      </main>
    </div>
  );
}
