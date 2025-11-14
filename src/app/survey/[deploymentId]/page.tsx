'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SurveyDemographicsForm from '@/components/survey/survey-demographics-form';
import SurveyQuestionnaire from '@/components/survey/survey-questionnaire';
import type { Demographics } from '@/lib/types';

type SurveyStep = 'welcome' | 'demographics' | 'questionnaire' | 'completed';

export default function SurveyPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const [step, setStep] = useState<SurveyStep>('welcome');
  const [demographics, setDemographics] = useState<Partial<Demographics>>({});

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
        return <SurveyDemographicsForm onSubmit={handleDemographicsSubmit} />;
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
                <p className="text-muted-foreground">Você está prestes a iniciar a pesquisa.</p>
                <p className="text-sm text-gray-500">ID da Pesquisa: {deploymentId}</p>
                <Button size="lg" onClick={handleStart}>Iniciar Pesquisa</Button>
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
