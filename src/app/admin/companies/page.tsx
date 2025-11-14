'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import CompaniesTable from '@/components/admin/companies-table';
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Database } from 'lucide-react';
import type { SurveyTemplate } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

export default function CompaniesPage() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const companiesRef = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'companies');
  }, [firestore, isUserLoading]);

  const templatesRef = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'survey_templates');
  }, [firestore, isUserLoading]);

  const { data: companies, isLoading: areCompaniesLoading } = useCollection(companiesRef);
  const { data: templates, isLoading: areTemplatesLoading, refetch: refetchTemplates } = useCollection<SurveyTemplate>(templatesRef);

  const handleSeed = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      await seedDatabase(firestore);
      toast({
        title: 'Dados Iniciais Criados!',
        description: 'Os templates de pesquisa foram adicionados ao banco de dados.',
      });
      if(refetchTemplates) refetchTemplates();
    } catch (error: any) {
      console.error('Failed to seed database:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar dados',
        description: error.message || 'Não foi possível popular o banco de dados.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const isLoading = isUserLoading || areCompaniesLoading || areTemplatesLoading;
  const showSeeder = !isLoading && templates && templates.length === 0;

  return (
    <div className="space-y-4">
      {showSeeder && (
         <Alert className="border-primary/50 text-primary">
            <Database className="h-4 w-4 !text-primary" />
            <AlertTitle className="text-primary font-bold">Ação Necessária: Configurar Templates</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                Seu banco de dados não possui templates de pesquisa. Clique aqui para criar os dados iniciais.
                <Button onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    {isSeeding ? 'Criando...' : 'Criar Templates Iniciais'}
                </Button>
            </AlertDescription>
        </Alert>
      )}
      <CompaniesTable companies={companies || []} isLoading={isLoading} />
    </div>
  );
}
