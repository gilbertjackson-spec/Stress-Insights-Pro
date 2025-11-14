'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyDashboard from '@/components/admin/company-dashboard';

interface CompanyPageProps {
  params: {
    companyId: string;
  };
}

export default function CompanyPage({ params: { companyId } }: CompanyPageProps) {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const companyRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'companies', companyId);
  }, [firestore, companyId]);

  const { data: company, isLoading: isCompanyLoading } = useDoc(companyRef);
  
  const isLoading = isUserLoading || isCompanyLoading;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 pt-6 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-96 w-full" />
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
    <div className="p-4 sm:p-8 pt-6">
      <CompanyDashboard company={company} />
    </div>
  );
}
