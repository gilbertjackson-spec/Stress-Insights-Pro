'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import CompaniesTable from '@/components/admin/companies-table';

export default function CompaniesPage() {
  const firestore = useFirestore();

  const companiesRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'companies');
  }, [firestore]);

  const { data: companies, isLoading } = useCollection(companiesRef);

  return (
    <div className="p-4 sm:p-8 pt-6">
      <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight mb-6">
        Gerenciar Empresas
      </h1>
      <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
