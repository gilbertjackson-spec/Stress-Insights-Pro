import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function EmptyDashboard() {
    return (
        <div className='space-y-6'>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Dashboard de Análise</h1>
            </div>
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Nenhuma resposta ainda</AlertTitle>
                <AlertDescription>
                    Ainda não há dados de resposta para esta pesquisa. Compartilhe o link para começar a coletar respostas.
                </AlertDescription>
            </Alert>
        </div>
    );
}
