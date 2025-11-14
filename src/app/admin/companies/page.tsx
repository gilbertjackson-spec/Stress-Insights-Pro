'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import CompaniesTable from '@/components/admin/companies-table';

export default function CompaniesPage() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const companiesRef = useMemoFirebase(() => {
    // Wait until firebase is initialized and user is loaded
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'companies');
  }, [firestore, isUserLoading]);

  const { data: companies, isLoading: areCompaniesLoading } = useCollection(companiesRef);
  
  // Combine user loading and collection loading states
  const isLoading = isUserLoading || areCompaniesLoading;

  return (
    <div className="p-4 sm:p-8 pt-6">
      <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight mb-6">
        Gerenciar Empresas
      </h1>
      <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
