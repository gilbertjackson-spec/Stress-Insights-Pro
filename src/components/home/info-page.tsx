import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ListChecks, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-3xl text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">
            Bem-vindo ao Stress Insights Pro
          </CardTitle>
          <CardDescription className="text-lg md:text-xl pt-2">
            Sua ferramenta completa para análise e gestão de indicadores de estresse no ambiente de trabalho.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col items-center p-4 rounded-lg">
                    <ListChecks className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Pesquisas Detalhadas</h3>
                    <p className="text-sm text-muted-foreground text-center">Crie e gerencie pesquisas baseadas em modelos validados cientificamente.</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg">
                    <TrendingUp className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Dashboards Inteligentes</h3>
                    <p className="text-sm text-muted-foreground text-center">Visualize os resultados com gráficos interativos e análises por domínio.</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg">
                    <Building className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Gestão de Empresas</h3>
                    <p className="text-sm text-muted-foreground text-center">Administre múltiplas empresas e unidades de forma centralizada.</p>
                </div>
            </div>
            <div className="pt-4">
                <p className="text-muted-foreground mb-6">Comece acessando a área de administração para gerenciar suas empresas e pesquisas.</p>
                <Link href="/admin/companies" passHref>
                    <Button size="lg">
                        Acessar Área de Administração
                    </Button>
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
