'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SurveyDemographicsForm from '@/components/survey/survey-demographics-form';
import SurveyQuestionnaire from '@/components/survey/survey-questionnaire';
import type { Demographics, SurveyDeployment, Unit, Sector, Position } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SurveyStep = 'welcome' | 'demographics' | 'questionnaire' | 'completed';

interface OrgStructure {
  units: Unit[];
  sectors: Sector[];
  positions: Position[];
}

export default function SurveyPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const firestore = useFirestore();

  const [step, setStep] = useState<SurveyStep>('welcome');
  const [demographics, setDemographics] = useState<Partial<Demographics>>({});
  const [orgStructure, setOrgStructure] = useState<OrgStructure | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);

  const deploymentRef = useMemoFirebase(() => {
    if (!firestore || !deploymentId) return null;
    return doc(firestore, 'survey_deployments', deploymentId);
  }, [firestore, deploymentId]);

  const { data: deployment, isLoading: isLoadingDeployment } = useDoc<SurveyDeployment>(deploymentRef);

  useEffect(() => {
    if (!deployment || !firestore) return;

    const fetchOrgStructure = async () => {
      setIsLoadingOrg(true);
      try {
        const companyId = deployment.companyId;

        // Fetch all organizational structure data in parallel
        const [unitsSnap, positionsSnap] = await Promise.all([
          getDocs(collection(firestore, 'companies', companyId, 'units')),
          getDocs(collection(firestore, 'companies', companyId, 'positions'))
        ]);
        
        const units = unitsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Unit));
        const positions = positionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Position));

        // Fetch Sectors from all units in parallel
        const sectorsPromises = units.map(unit => 
            getDocs(collection(firestore, 'companies', companyId, 'units', unit.id, 'sectors'))
        );
        const sectorsSnaps = await Promise.all(sectorsPromises);
        const sectors = sectorsSnaps.flatMap(snap => snap.docs.map(d => ({ ...d.data(), id: d.id } as Sector)));

        setOrgStructure({ units, sectors, positions });
      } catch (error) {
        console.error("Failed to fetch organizational structure:", error);
      } finally {
        setIsLoadingOrg(false);
      }
    };

    fetchOrgStructure();
  }, [deployment, firestore]);


  const handleStart = () => {
    setStep('demographics');
  };

  const handleDemographicsSubmit = (data: Partial<Demographics>) => {
    setDemographics(data);
    setStep('questionnaire');
  };

  const handleSurveyComplete = () => {
    setStep('completed');
  };

  const renderStep = () => {
    switch (step) {
      case 'demographics':
        return (
          <SurveyDemographicsForm 
            onSubmit={handleDemographicsSubmit} 
            isLoading={isLoadingOrg}
            units={orgStructure?.units || []}
            sectors={orgStructure?.sectors || []}
            positions={orgStructure?.positions || []}
          />
        );
      case 'questionnaire':
        return (
          <SurveyQuestionnaire 
            deploymentId={deploymentId} 
            demographics={demographics}
            onComplete={handleSurveyComplete} 
          />
        );
      case 'completed':
        return (
            <div className="text-center p-8">
                <CardTitle className="text-2xl font-headline mb-4">Obrigado por sua participação!</CardTitle>
                <p className="text-muted-foreground">Suas respostas foram enviadas com sucesso e contribuirão para um ambiente de trabalho melhor.</p>
            </div>
        );
      case 'welcome':
      default:
        return (
          <div className="text-center">
             <CardHeader>
                <CardTitle className="text-2xl font-headline">Pesquisa de Indicadores de Estresse</CardTitle>
                <CardDescription>Obrigado por participar. Sua opinião é anônima e confidencial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoadingDeployment ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : deployment ? (
                    <>
                        <p className="text-muted-foreground">Você está prestes a iniciar a pesquisa.</p>
                        <Button size="lg" onClick={handleStart}>Iniciar Pesquisa</Button>
                    </>
                ) : (
                    <p className="text-red-500">Pesquisa não encontrada ou inválida.</p>
                )}
            </CardContent>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-4xl">
        {renderStep()}
      </Card>
    </div>
  );
}
