'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SurveyPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;
  const [surveyStarted, setSurveyStarted] = useState(false);

  const handleStartSurvey = () => {
    setSurveyStarted(true);
  };

  if (surveyStarted) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-4xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Pesquisa em Andamento</CardTitle>
                <CardDescription>Responda a todas as perguntas.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Aqui será o local para renderizar as perguntas da pesquisa */}
                <p className="text-center text-muted-foreground p-8">O formulário da pesquisa aparecerá aqui.</p>
            </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Pesquisa de Indicadores de Estresse</CardTitle>
          <CardDescription>Obrigado por participar. Sua opinião é anônima e confidencial.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">Você está prestes a iniciar a pesquisa.</p>
            <p className="text-sm text-gray-500">ID da Pesquisa: {deploymentId}</p>
          <Button size="lg" onClick={handleStartSurvey}>Iniciar Pesquisa</Button>
        </CardContent>
      </Card>
    </div>
  );
}
