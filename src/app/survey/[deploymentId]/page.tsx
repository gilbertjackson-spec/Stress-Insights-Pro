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

export default function SurveyPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const firestore = useFirestore();

  const [step, setStep] = useState<SurveyStep>('welcome');
  const [demographics, setDemographics] = useState<Partial<Demographics>>({});
  
  // State for org structure and selections
  const [units, setUnits] = useState<Unit[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [isLoadingSectors, setIsLoadingSectors] = useState(false);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');


  const deploymentRef = useMemoFirebase(() => {
    if (!firestore || !deploymentId) return null;
    return doc(firestore, 'survey_deployments', deploymentId);
  }, [firestore, deploymentId]);

  const { data: deployment, isLoading: isLoadingDeployment } = useDoc<SurveyDeployment>(deploymentRef);

  // Fetch Units
  useEffect(() => {
    if (!deployment || !firestore) return;
    const fetchUnits = async () => {
      setIsLoadingUnits(true);
      try {
        const companyId = deployment.companyId;
        const unitsSnap = await getDocs(collection(firestore, 'companies', companyId, 'units'));
        const fetchedUnits = unitsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Unit));
        setUnits(fetchedUnits);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setIsLoadingUnits(false);
      }
    };
    fetchUnits();
  }, [deployment, firestore]);

  // Fetch Sectors when unit changes
  useEffect(() => {
    if (!selectedUnit || !deployment || !firestore) {
        setSectors([]);
        setSelectedSector('');
        return;
    };
    const fetchSectors = async () => {
        setIsLoadingSectors(true);
        try {
            const companyId = deployment.companyId;
            const sectorsSnap = await getDocs(collection(firestore, 'companies', companyId, 'units', selectedUnit, 'sectors'));
            const fetchedSectors = sectorsSnap.docs.map(d => ({ ...d.data(), id: d.id, unitId: selectedUnit } as Sector));
            setSectors(fetchedSectors);
        } catch (error) {
            console.error("Failed to fetch sectors:", error);
            setSectors([]);
        } finally {
            setIsLoadingSectors(false);
        }
    };
    fetchSectors();
  }, [selectedUnit, deployment, firestore]);

  // Fetch Positions when sector changes
  useEffect(() => {
    if (!selectedSector || !selectedUnit || !deployment || !firestore) {
        setPositions([]);
        return;
    }
    const fetchPositions = async () => {
        setIsLoadingPositions(true);
        try {
            const companyId = deployment.companyId;
            const positionsSnap = await getDocs(collection(firestore, 'companies', companyId, 'units', selectedUnit, 'sectors', selectedSector, 'positions'));
            const fetchedPositions = positionsSnap.docs.map(d => ({ ...d.data(), id: d.id, sectorId: selectedSector, unitId: selectedUnit } as Position));
            setPositions(fetchedPositions);
        } catch (error) {
            console.error("Failed to fetch positions:", error);
            setPositions([]);
        } finally {
            setIsLoadingPositions(false);
        }
    };
    fetchPositions();
  }, [selectedSector, selectedUnit, deployment, firestore]);


  const handleStart = () => {
    setStep('demographics');
  };

  const handleDemographicsSubmit = (data: { unit: string; sector: string; position?: string; age_range?: string; current_role_time?: string; gender?: string; }) => {
    const unitName = units.find(u => u.id === data.unit)?.name;
    const sectorName = sectors.find(s => s.id === data.sector)?.name;
    const positionName = data.position ? positions.find(p => p.id === data.position)?.name : undefined;
    
    setDemographics({
        unit: unitName,
        sector: sectorName,
        position: positionName,
        age_range: data.age_range,
        current_role_time: data.current_role_time,
        gender: data.gender,
    });
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
            isLoadingUnits={isLoadingUnits}
            isLoadingSectors={isLoadingSectors}
            isLoadingPositions={isLoadingPositions}
            units={units}
            sectors={sectors}
            positions={positions}
            onUnitChange={setSelectedUnit}
            onSectorChange={setSelectedSector}
            selectedUnit={selectedUnit}
          />
        );
      case 'questionnaire':
        if (!deployment?.templateId) {
            return <div className="p-8 text-center text-red-500">Erro: Template da pesquisa não encontrado.</div>
        }
        return (
          <SurveyQuestionnaire 
            deploymentId={deploymentId} 
            templateId={deployment.templateId}
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
      <Card className="w-full max-w-4xl shadow-2xl">
        {renderStep()}
      </Card>
    </div>
  );
}
