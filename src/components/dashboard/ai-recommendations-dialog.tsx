import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AiRecommendationsDialogProps {
  domainScores: Record<string, number>;
}

export default function AiRecommendationsDialog({ domainScores }: AiRecommendationsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await generateRecommendations({ domainScores });
      setRecommendations(result.recommendations);
    } catch (e) {
      console.error(e);
      setError('Falha ao gerar recomendações. Tente novamente mais tarde.');
      toast({
        variant: 'destructive',
        title: 'Erro de IA',
        description: 'Não foi possível conectar ao serviço de IA.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Sparkles className="mr-2 h-4 w-4 text-accent" />
          Gerar Recomendações com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-accent" />
            Recomendações da IA
          </DialogTitle>
          <DialogDescription>
            Use a inteligência artificial para obter insights e recomendações acionáveis com base nos scores atuais.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {!recommendations && !isLoading && (
             <div className='text-center p-8 border-dashed border-2 rounded-lg'>
                <p className='text-muted-foreground'>Clique no botão abaixo para iniciar a análise.</p>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Analisando dados e gerando recomendações...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {recommendations && (
            <div className="prose prose-sm dark:prose-invert bg-secondary/50 p-4 rounded-md max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              <p>{recommendations}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Fechar</Button>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
                recommendations ? 'Gerar Novamente' : 'Gerar Recomendações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
