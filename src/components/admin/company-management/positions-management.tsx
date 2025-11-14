'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserCog, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddPositionForm } from './add-position-form';
import type { Position } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
} from "@/components/ui/alert-dialog"
import { deletePosition } from '@/lib/position-service';
import { useToast } from '@/hooks/use-toast';

export default function PositionsManagement({ companyId }: { companyId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

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

    const openDeleteDialog = (position: Position) => {
        setSelectedPosition(position);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !selectedPosition) return;
        try {
            await deletePosition(firestore, companyId, selectedPosition.id);
            toast({
                title: "Cargo Excluído",
                description: `O cargo "${selectedPosition.name}" foi excluído com sucesso.`,
            });
             if (refetch) {
                setTimeout(refetch, 500);
            }
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível excluir o cargo.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedPosition(null);
        }
    }


    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <UserCog className="h-5 w-5" />
                            Gerenciar Cargos
                        </CardTitle>
                        <CardDescription>Adicione, edite ou exclua os cargos da sua empresa.</CardDescription>
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
                                    <TableHead className="text-right w-[50px]">Ações</TableHead>
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem disabled>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(position)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o cargo
                        <span className="font-bold"> {selectedPosition?.name} </span>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Sim, excluir
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
