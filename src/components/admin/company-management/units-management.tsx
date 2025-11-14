'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddUnitForm } from './add-unit-form';
import type { Unit } from '@/lib/types';
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
import { deleteUnit } from '@/lib/unit-service';
import { useToast } from '@/hooks/use-toast';
import { EditUnitForm } from './edit-unit-form';


export default function UnitsManagement({ companyId }: { companyId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const unitsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'companies', companyId, 'units');
    }, [firestore, companyId]);

    const { data: units, isLoading, refetch } = useCollection<Unit>(unitsQuery);

    const handleFormFinished = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        if (refetch) {
            setTimeout(refetch, 500);
        }
    }

    const openEditDialog = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !selectedUnit) return;
        try {
            await deleteUnit(firestore, companyId, selectedUnit.id);
            toast({
                title: "Unidade Excluída",
                description: `A unidade "${selectedUnit.name}" foi excluída com sucesso.`,
            });
            if (refetch) {
                setTimeout(refetch, 500);
            }
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível excluir a unidade.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedUnit(null);
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Gerenciar Unidades
                        </CardTitle>
                        <CardDescription>Adicione, edite ou exclua as unidades da sua empresa.</CardDescription>
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
                                <DialogTitle>Adicionar Nova Unidade</DialogTitle>
                            </DialogHeader>
                            <AddUnitForm companyId={companyId} onFinished={handleFormFinished} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome da Unidade</TableHead>
                                    <TableHead className="text-right w-[50px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={2}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
                                    ))
                                ) : units && units.length > 0 ? (
                                    units.map((unit) => (
                                        <TableRow key={unit.id}>
                                            <TableCell>{unit.name}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(unit)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(unit)}>
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
                                        <TableCell colSpan={2} className="h-24 text-center">Nenhuma unidade cadastrada.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Unidade</DialogTitle>
                    </DialogHeader>
                    {selectedUnit && (
                        <EditUnitForm
                            companyId={companyId}
                            unit={selectedUnit}
                            onFinished={handleFormFinished}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a unidade
                        <span className="font-bold"> {selectedUnit?.name} </span>
                        e todos os seus dados associados (como setores).
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
