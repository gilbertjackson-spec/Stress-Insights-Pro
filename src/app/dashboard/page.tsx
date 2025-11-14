'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import CompaniesTable from '@/components/admin/companies-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const companiesRef = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'companies');
  }, [firestore, isUserLoading]);

  const { data: companies, isLoading: areCompaniesLoading } = useCollection(companiesRef);
  
  const isLoading = isUserLoading || areCompaniesLoading;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">Dashboard</CardTitle>
                <CardDescription>Bem-vindo ao seu painel de controle central.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Aqui você pode ter uma visão geral rápida das suas atividades recentes. Use o menu lateral para navegar para seções específicas.</p>
            </CardContent>
        </Card>
        <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
