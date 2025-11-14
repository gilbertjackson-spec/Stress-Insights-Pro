'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddSurveyForm } from './add-survey-form';
import { useState, useEffect } from 'react';
import { ShareSurveyDialog } from './share-survey-dialog';
import type { SurveyStatus } from '@/lib/types';
import StatusMenu from './status-menu';

interface Company {
    id: string;
    name: string;
}

interface SurveyDeployment {
    id: string;
    templateId: string;
    startDate: string;
    endDate: string;
    status: SurveyStatus;
    totalInvited: number;
    respondentCount?: number;
}

interface CompanyDashboardProps {
    company: Company;
}

function DeploymentRow({ deployment }: { deployment: SurveyDeployment }) {
    const firestore = useFirestore();
    const [respondentCount, setRespondentCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        
        const respondentsCol = collection(firestore, 'survey_deployments', deployment.id, 'respondents');
        getDocs(respondentsCol).then(snapshot => {
            setRespondentCount(snapshot.size);
            setIsLoading(false);
        }).catch(err => {
            console.error("Failed to fetch respondent count:", err);
            setIsLoading(false);
        });
        
    }, [firestore, deployment.id]);

    return (
         <TableRow key={deployment.id}>
            <TableCell className="font-medium">Indicadores de Estresse HSE 2025</TableCell>
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
            </TableCell>
        </TableRow>
    );
}

export default function CompanyDashboard({ company }: CompanyDashboardProps) {
    const firestore = useFirestore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const deploymentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'survey_deployments'),
            where('companyId', '==', company.id)
        );
    }, [firestore, company.id]);

    const { data: deployments, isLoading } = useCollection<Omit<SurveyDeployment, 'respondentCount'>>(deploymentsQuery);

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
                                    <TableHead>Template da Pesquisa</TableHead>
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
                                       <DeploymentRow key={dep.id} deployment={dep} />
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
