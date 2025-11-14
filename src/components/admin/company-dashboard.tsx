'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, FileText, MoreVertical, Archive, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddSurveyForm } from './add-survey-form';
import { useState, useEffect } from 'react';
import { ShareSurveyDialog } from './share-survey-dialog';
import type { SurveyStatus, SurveyDeployment } from '@/lib/types';
import StatusMenu from './status-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { archiveSurveyDeployment, deleteSurveyDeployment } from '@/lib/survey-deployment-service';
import { useToast } from '@/hooks/use-toast';

interface Company {
    id: string;
    name: string;
}

interface DeploymentRowProps {
    deployment: SurveyDeployment;
    onActionComplete: () => void;
}


function DeploymentRow({ deployment, onActionComplete }: DeploymentRowProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [respondentCount, setRespondentCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!firestore) return;
        
        const respondentsCol = collection(firestore, 'survey_deployments', deployment.id, 'respondents');
        
        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(respondentsCol, snapshot => {
            setRespondentCount(snapshot.size);
            setIsLoading(false);
        }, err => {
            console.error("Failed to listen to respondent count:", err);
            // Optionally set an error state here
            setIsLoading(false);
        });
        
        // Cleanup listener on unmount
        return () => unsubscribe();
        
    }, [firestore, deployment.id]);
    
    const handleArchiveAction = async () => {
        if (!firestore) return;
        try {
            await archiveSurveyDeployment(firestore, deployment.id);
            toast({
                title: "Pesquisa Arquivada",
                description: "A pesquisa foi movida para o arquivo."
            });
            onActionComplete();
        } catch(e) {
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível arquivar a pesquisa."});
        }
    };
    
    const handleDeleteAction = async () => {
        if (!firestore) return;
        setIsDeleting(true);
        try {
            await deleteSurveyDeployment(firestore, deployment.id);
            toast({
                title: "Pesquisa Excluída",
                description: "A pesquisa e todos os seus dados foram excluídos permanentemente."
            });
            setIsDeleteDialogOpen(false);
            onActionComplete();
        } catch(e) {
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir a pesquisa."});
        } finally {
            setIsDeleting(false);
        }
    }


    return (
         <>
            <TableRow key={deployment.id}>
                <TableCell className="font-medium">{deployment.name}</TableCell>
                <TableCell>{new Date(deployment.startDate).toLocaleDateString()} - {new Date(deployment.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                    {isLoading ? <Skeleton className="h-5 w-16" /> : `${respondentCount ?? 0} / ${deployment.totalInvited}`}
                </TableCell>
                <TableCell>
                    <StatusMenu deploymentId={deployment.id} currentStatus={deployment.status} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                    <ShareSurveyDialog deploymentId={deployment.id} />
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/reports/${deployment.id}`}>Ver Relatório</Link>
                    </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Pesquisa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Excluir uma pesquisa é uma ação permanente e removerá todas as respostas coletadas. 
                        Como alternativa, você pode arquivar a pesquisa para ocultá-la do painel, mas manter os dados.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-between gap-2">
                        <Button variant="destructive" onClick={handleDeleteAction} disabled={isDeleting}>
                            {isDeleting && <Trash2 className="mr-2 h-4 w-4 animate-spin" />}
                            Excluir Permanentemente
                        </Button>
                        <div className='flex gap-2'>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleArchiveAction}>
                                <Archive className="mr-2 h-4 w-4" />
                                Arquivar
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
         </>
    );
}

export default function CompanyDashboard({ company }: { company: Company }) {
    const firestore = useFirestore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const deploymentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'survey_deployments'),
            where('companyId', '==', company.id)
        );
    }, [firestore, company.id]);

    const { data: allDeployments, isLoading, refetch } = useCollection<Omit<SurveyDeployment, 'respondentCount'>>(deploymentsQuery);
    
    // Filter out archived deployments on the client side
    const deployments = allDeployments?.filter(d => d.status !== 'archived');
    
    const handleAction = () => {
        if(refetch) refetch();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
                    {company.name}
                </h1>
                <p className="text-muted-foreground">Gerencie as pesquisas e a estrutura organizacional da empresa.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Histórico de Pesquisas
                        </CardTitle>
                        <CardDescription>
                            Veja todas as pesquisas aplicadas para esta empresa.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Criar Nova Pesquisa
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Criar Nova Pesquisa</DialogTitle>
                            </DialogHeader>
                            <AddSurveyForm companyId={company.id} onFinished={() => setIsAddDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome da Pesquisa</TableHead>
                                    <TableHead>Período</TableHead>
                                    <TableHead>Respostas</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 2 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : deployments && deployments.length > 0 ? (
                                    deployments.map((dep: SurveyDeployment) => (
                                       <DeploymentRow key={dep.id} deployment={dep} onActionComplete={handleAction} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Nenhuma pesquisa encontrada para esta empresa.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

