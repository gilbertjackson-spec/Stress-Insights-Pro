'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyDashboard from '@/components/admin/company-dashboard';
import { useParams } from 'next/navigation';
import UnitsManagement from '@/components/admin/company-management/units-management';
import SectorsManagement from '@/components/admin/company-management/sectors-management';
import { Separator } from '@/components/ui/separator';

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
      <div className="p-4 sm:p-8 pt-6 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
        <div className="p-4 sm:p-8 pt-6">
            <h1 className="text-2xl font-bold">Empresa não encontrada</h1>
            <p>A empresa que você está tentando acessar não existe.</p>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 pt-6 space-y-8">
      <CompanyDashboard company={company} />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UnitsManagement companyId={companyId} />
        <SectorsManagement companyId={companyId} />
      </div>
    </div>
  );
}
