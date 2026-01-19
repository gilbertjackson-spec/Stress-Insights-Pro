'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { SurveyDeployment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface CompanyReportsListProps {
    companyId: string;
}

export default function CompanyReportsList({ companyId }: CompanyReportsListProps) {
    const firestore = useFirestore();

    const deploymentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'survey_deployments'),
            where('companyId', '==', companyId)
        );
    }, [firestore, companyId]);

    const { data: deployments, isLoading } = useCollection<SurveyDeployment>(deploymentsQuery);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        );
    }

    if (!deployments || deployments.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">Nenhuma pesquisa encontrada para gerar relatórios.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Relatórios de Pesquisa
                </CardTitle>
                <CardDescription>
                    Acesse os relatórios detalhados e exportações de dados das pesquisas aplicadas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pesquisa</TableHead>
                                <TableHead>Período</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deployments.map((deployment) => (
                                <TableRow key={deployment.id}>
                                    <TableCell className="font-medium">{deployment.name}</TableCell>
                                    <TableCell>
                                        {new Date(deployment.startDate).toLocaleDateString()} - {new Date(deployment.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={deployment.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                            {deployment.status === 'active' ? 'Aberta' :
                                                deployment.status === 'closed' ? 'Encerrada' :
                                                    deployment.status === 'suspended' ? 'Pausada' :
                                                        deployment.status === 'draft' ? 'Rascunho' : 'Arquivada'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/reports/${deployment.id}`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </Button>
                                        <Button asChild variant="default" size="sm">
                                            <Link href={`/admin/reports/${deployment.id}/full-report`}>
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Relatório Completo
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
