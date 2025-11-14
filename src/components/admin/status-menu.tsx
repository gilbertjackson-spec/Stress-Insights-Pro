'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { SurveyStatus } from '@/lib/types';
import { ChevronDown, Circle, Play, Square, Ban } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface StatusMenuProps {
  deploymentId: string;
  currentStatus: SurveyStatus;
}

const statusConfig: Record<SurveyStatus, { label: string; icon: React.ElementType; color: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: 'Rascunho', icon: Circle, color: 'text-gray-500', badgeVariant: 'outline' },
    active: { label: 'Aberta', icon: Play, color: 'text-green-500', badgeVariant: 'default' },
    suspended: { label: 'Suspensa', icon: Ban, color: 'text-yellow-500', badgeVariant: 'secondary' },
    closed: { label: 'Encerrada', icon: Square, color: 'text-red-500', badgeVariant: 'destructive' },
};

export default function StatusMenu({ deploymentId, currentStatus }: StatusMenuProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: SurveyStatus) => {
    if (!firestore) return;
    const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
    try {
      await updateDoc(deploymentRef, { status: newStatus });
      toast({
        title: 'Status Atualizado!',
        description: `A pesquisa agora está "${statusConfig[newStatus].label}".`,
      });
    } catch (error) {
      console.error('Error updating status: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: 'Não foi possível alterar o status da pesquisa. Verifique suas permissões.',
      });
    }
  };

  const { label, badgeVariant } = statusConfig[currentStatus];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
            <Badge variant={badgeVariant} className="capitalize cursor-pointer flex items-center gap-1">
                {label}
                <ChevronDown className="h-3 w-3" />
            </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(statusConfig).map(([status, { label, icon: Icon }]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as SurveyStatus)}
            disabled={status === currentStatus}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
