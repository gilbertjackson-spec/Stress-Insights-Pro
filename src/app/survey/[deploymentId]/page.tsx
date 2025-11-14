'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SurveyPage() {
  const params = useParams();
  const deploymentId = params.deploymentId as string;

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
          <Button size="lg">Iniciar Pesquisa</Button>
        </CardContent>
      </Card>
    </div>
  );
}
