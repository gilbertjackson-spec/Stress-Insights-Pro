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
import { Share2, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface ShareSurveyDialogProps {
  deploymentId: string;
}

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52s-.67-.816-.916-.816-.52.05-.717.05c-.197 0-.52.075-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871-.118.571-.355 1.758-1.44 2.006-1.953.248-.513.248-.94.173-1.04-.075-.099-.273-.148-.57-.296z"/>
    </svg>
)

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
  
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Por favor, responda a nossa pesquisa de clima acessando este link: ${surveyUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  const handleOpenLink = () => {
    window.open(surveyUrl, '_blank');
  }

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
            <Button type="button" size="icon" variant="outline" onClick={handleOpenLink}>
                <span className="sr-only">Abrir link</span>
                <ExternalLink className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
              <span className="sr-only">Copiar</span>
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
             <Button type="button" size="icon" variant="outline" onClick={handleShareWhatsApp}>
                <span className="sr-only">Compartilhar no WhatsApp</span>
                <WhatsAppIcon />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
