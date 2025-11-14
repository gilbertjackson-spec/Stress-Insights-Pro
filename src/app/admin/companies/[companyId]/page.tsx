'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyDashboard from '@/components/admin/company-dashboard';
import { useParams } from 'next/navigation';
import UnitsManagement from '@/components/admin/company-management/units-management';
import SectorsManagement from '@/components/admin/company-management/sectors-management';
import PositionsManagement from '@/components/admin/company-management/positions-management';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { ChevronRight, Building, FileText, BarChart3, UserCog } from 'lucide-react';

export default function CompanyPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const firestore = useFirestore();

  const companyRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'companies', companyId);
  }, [firestore, companyId]);

  const { data: company, isLoading: isCompanyLoading } = useDoc(companyRef);
  
  const isLoading = isCompanyLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
        <div>
            <h1 className="text-2xl font-bold">Empresa não encontrada</h1>
            <p>A empresa que você está tentando acessar não existe.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/companies" className="hover:text-primary transition-colors">
          Empresas
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{company.name}</span>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="structure">
            <Building className="mr-2 h-4 w-4" />
            Estrutura Organizacional
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            <FileText className="mr-2 h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CompanyDashboard company={company} />
        </TabsContent>
        <TabsContent value="structure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <UnitsManagement companyId={companyId} />
            <SectorsManagement companyId={companyId} />
            <PositionsManagement companyId={companyId} />
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">A funcionalidade de relatórios estará disponível em breve.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
