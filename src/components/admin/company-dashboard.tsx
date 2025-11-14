'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddSurveyForm } from './add-survey-form';
import { useState } from 'react';

interface Company {
    id: string;
    name: string;
}

interface SurveyDeployment {
    id: string;
    templateId: string;
    startDate: string;
    endDate: string;
    status: 'draft' | 'active' | 'closed';
}

interface CompanyDashboardProps {
    company: Company;
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

    const { data: deployments, isLoading } = useCollection(deploymentsQuery);

    const getStatusVariant = (status: SurveyDeployment['status']) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'closed':
                return 'secondary';
            case 'draft':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getStatusLabel = (status: SurveyDeployment['status']) => {
        switch (status) {
            case 'active':
                return 'Ativa';
            case 'closed':
                return 'Fechada';
            case 'draft':
                return 'Rascunho';
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
                    {company.name}
                </h1>
                <p className="text-muted-foreground">Gerencie as pesquisas e veja os resultados.</p>
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
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : deployments && deployments.length > 0 ? (
                                    deployments.map((dep: SurveyDeployment) => (
                                        <TableRow key={dep.id}>
                                            <TableCell className="font-medium">Indicadores de Estresse HSE 2025</TableCell>
                                            <TableCell>{new Date(dep.startDate).toLocaleDateString()} - {new Date(dep.endDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(dep.status)} className="capitalize">{getStatusLabel(dep.status)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/admin/reports/${dep.id}`}>Ver Relatório</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
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
