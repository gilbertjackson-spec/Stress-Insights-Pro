'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserCog, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddPositionForm } from './add-position-form';
import type { Position, Unit, Sector } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PositionsManagementProps {
    companyId: string;
    selectedUnit: string;
    selectedSector: string;
}

export default function PositionsManagement({ companyId, selectedUnit, selectedSector }: PositionsManagementProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);
    const [selectedPositionFilter, setSelectedPositionFilter] = useState('all');

    // Data hooks
    const unitsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'companies', companyId, 'units');
    }, [firestore, companyId]);
    const { data: units, isLoading: unitsLoading } = useCollection<Unit>(unitsQuery);

    const [allSectors, setAllSectors] = useState<Sector[]>([]);
    const [sectorsLoading, setSectorsLoading] = useState(true);
    const [allPositions, setAllPositions] = useState<Position[]>([]);
    const [positionsLoading, setPositionsLoading] = useState(true);

    const fetchSectorsAndPositions = async () => {
        if (!firestore || !units) {
            if (!unitsLoading) {
                setSectorsLoading(false);
                setPositionsLoading(false);
            }
            return;
        }
        setSectorsLoading(true);
        setPositionsLoading(true);
        try {
            const fetchedSectors: Sector[] = [];
            const fetchedPositions: Position[] = [];
            for (const unit of units) {
                const sectorsRef = collection(firestore, 'companies', companyId, 'units', unit.id, 'sectors');
                const sectorsSnap = await getDocs(sectorsRef);
                for (const sectorDoc of sectorsSnap.docs) {
                    const sectorData = { ...sectorDoc.data(), id: sectorDoc.id, unitId: unit.id } as Sector
                    fetchedSectors.push(sectorData);
                    
                    const positionsRef = collection(sectorDoc.ref, 'positions');
                    const positionsSnap = await getDocs(positionsRef);
                    positionsSnap.forEach(posDoc => {
                        fetchedPositions.push({ ...posDoc.data(), id: posDoc.id, sectorId: sectorDoc.id, unitId: unit.id } as Position);
                    });
                }
            }
            setAllSectors(fetchedSectors);
            setAllPositions(fetchedPositions);
        } catch (error) {
            console.error("Error fetching sectors/positions:", error);
        } finally {
            setSectorsLoading(false);
            setPositionsLoading(false);
        }
    };
    
    useEffect(() => {
        if (units) {
            fetchSectorsAndPositions();
        }
    }, [firestore, companyId, units]);

    const handleFormFinished = () => {
        setIsAddDialogOpen(false);
        setTimeout(fetchSectorsAndPositions, 500); // refetch
    }

    const openDeleteDialog = (position: Position) => {
        setPositionToDelete(position);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !positionToDelete) return;
        try {
            await deletePosition(firestore, companyId, positionToDelete.unitId, positionToDelete.sectorId, positionToDelete.id);
            toast({
                title: "Cargo Excluído",
                description: `O cargo "${positionToDelete.name}" foi excluído com sucesso.`,
            });
            setTimeout(fetchSectorsAndPositions, 500); // refetch
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível excluir o cargo.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setPositionToDelete(null);
        }
    }

    const isLoading = unitsLoading || sectorsLoading || positionsLoading;

    const getUnitName = (unitId: string) => units?.find(u => u.id === unitId)?.name || '...';
    const getSectorName = (sectorId: string) => allSectors?.find(s => s.id === sectorId)?.name || '...';

    const positionsForFilter = useMemo(() => {
        let filtered = allPositions;
        if (selectedUnit !== 'all') {
            filtered = filtered.filter(pos => pos.unitId === selectedUnit);
        }
        if (selectedSector !== 'all') {
            filtered = filtered.filter(pos => pos.sectorId === selectedSector);
        }
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }, [allPositions, selectedUnit, selectedSector]);
    
    const displayedPositions = useMemo(() => {
        if (selectedPositionFilter === 'all') return positionsForFilter;
        return positionsForFilter.filter(pos => pos.id === selectedPositionFilter);
    }, [positionsForFilter, selectedPositionFilter]);

    const positionsWithNames = displayedPositions.map(pos => ({
        ...pos,
        sectorName: getSectorName(pos.sectorId),
        unitName: getUnitName(pos.unitId)
    }));
    
    const canAdd = useMemo(() => {
        if (!units || units.length === 0) return false;
        if(selectedUnit === 'all') return allSectors.length > 0;
        return allSectors.some(s => s.unitId === selectedUnit);
    }, [units, allSectors, selectedUnit]);


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
                             <Button variant="outline" size="sm" disabled={!canAdd}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                            </DialogHeader>
                            <AddPositionForm companyId={companyId} units={units || []} onFinished={handleFormFinished} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Select value={selectedPositionFilter} onValueChange={setSelectedPositionFilter} disabled={isLoading || !positionsForFilter.length}>
                        <SelectTrigger className="mb-4">
                            <SelectValue placeholder="Filtrar cargos..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os cargos</SelectItem>
                            {positionsForFilter.map(pos => (
                                <SelectItem key={pos.id} value={pos.id}>
                                    {pos.name} ({getSectorName(pos.sectorId)} / {getUnitName(pos.unitId)})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Cargo</TableHead>
                                    <TableHead>Setor</TableHead>
                                    <TableHead>Unidade</TableHead>
                                    <TableHead className="text-right w-[50px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
                                    ))
                                ) : positionsWithNames && positionsWithNames.length > 0 ? (
                                    positionsWithNames.map((position) => (
                                        <TableRow key={position.id}>
                                            <TableCell>{position.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{position.sectorName}</TableCell>
                                            <TableCell className="text-muted-foreground">{position.unitName}</TableCell>
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
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            {selectedSector !== 'all' ? 'Nenhum cargo neste setor.' : selectedUnit !== 'all' ? 'Nenhum cargo nesta unidade.' : 'Nenhum cargo encontrado.'}
                                        </TableCell>
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
                        <span className="font-bold"> {positionToDelete?.name} </span>.
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
