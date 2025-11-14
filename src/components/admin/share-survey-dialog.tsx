'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface ShareSurveyDialogProps {
  deploymentId: string;
}

export function ShareSurveyDialog({ deploymentId }: ShareSurveyDialogProps) {
  const [surveyUrl, setSurveyUrl] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Ensure this runs only on the client where window is available
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/survey/${deploymentId}`;
      setSurveyUrl(url);
    }
  }, [deploymentId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setHasCopied(true);
    toast({
      title: 'Link Copiado!',
      description: 'O link da pesquisa foi copiado para a área de transferência.',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Pesquisa</DialogTitle>
          <DialogDescription>
            Qualquer pessoa com este link ou QR code poderá responder à pesquisa.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="bg-white p-4 rounded-lg border">
                 <QRCode value={surveyUrl} size={160} />
            </div>
          
          <div className="flex items-center space-x-2 w-full">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={surveyUrl} readOnly />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
              <span className="sr-only">Copiar</span>
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
