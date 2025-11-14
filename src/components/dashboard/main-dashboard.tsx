"use client";

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/lib/types';
import type { Filters } from '@/lib/analysis';
import { getDashboardData } from '@/lib/analysis';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardFilters from './filters';
import OverviewCards from './overview-cards';
import ExecutiveSummary from './executive-summary';
import DomainAccordion from './domain-accordion';

const initialFilters: Filters = {
    unit: 'all',
    sector: 'all',
    age_range: 'all',
    current_role_time: 'all',
};

export default function MainDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await getDashboardData(filters);
            setData(result);
            setIsLoading(false);
        };
        fetchData();
    }, [filters]);

    if (isLoading && !data) {
        return <DashboardSkeleton />;
    }

    if (!data) {
        return <div>Não foi possível carregar os dados.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Dashboard de Análise</h1>
                 {/* Can add a date picker or other actions here */}
            </div>
            
            <DashboardFilters 
                options={data.demographic_options}
                filters={filters}
                setFilters={setFilters}
                disabled={isLoading}
            />

            <OverviewCards data={data} isLoading={isLoading} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ExecutiveSummary data={data} isLoading={isLoading} />
            </div>

            <DomainAccordion data={data} isLoading={isLoading} />
        </div>
    );
}

function DashboardSkeleton() {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <Skeleton className="md:col-span-3 lg:col-span-2 h-96" />
            <Skeleton className="md:col-span-4 lg:col-span-5 h-96" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
