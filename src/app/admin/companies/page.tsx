'use client';

import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import CompaniesTable from '@/components/admin/companies-table';
import { useMemo } from 'react';

export default function CompaniesPage() {
  const firestore = useFirestore();

  const companiesRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'companies');
  }, [firestore]);

  const { data: companies, isLoading } = useCollection(companiesRef as any);

  return (
    <div className="p-4 sm:p-8 pt-6">
      <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight mb-6">
        Gerenciar Empresas
      </h1>
      <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
