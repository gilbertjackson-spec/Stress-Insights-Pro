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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
