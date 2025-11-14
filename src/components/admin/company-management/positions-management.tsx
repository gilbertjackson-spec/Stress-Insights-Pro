'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserCog } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddPositionForm } from './add-position-form';
import type { Position } from '@/lib/types';

export default function PositionsManagement({ companyId }: { companyId: string }) {
    const firestore = useFirestore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const positionsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'companies', companyId, 'positions');
    }, [firestore, companyId]);

    const { data: positions, isLoading, refetch } = useCollection<Position>(positionsQuery);

    const handleFormFinished = () => {
        setIsAddDialogOpen(false);
        if (refetch) {
            setTimeout(refetch, 500);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Gerenciar Cargos
                    </CardTitle>
                    <CardDescription>Adicione ou edite os cargos da sua empresa.</CardDescription>
                </div>
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                        </DialogHeader>
                        <AddPositionForm companyId={companyId} onFinished={handleFormFinished} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Cargo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={2}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
                                ))
                            ) : positions && positions.length > 0 ? (
                                positions.map((position) => (
                                    <TableRow key={position.id}>
                                        <TableCell>{position.name}</TableCell>
                                        <TableCell className="text-right">
                                            {/* Action buttons (edit, delete) can go here */}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="h-24 text-center">Nenhum cargo cadastrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
