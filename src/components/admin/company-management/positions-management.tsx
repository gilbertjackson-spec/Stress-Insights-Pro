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

export default function PositionsManagement({ companyId }: { companyId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [filter, setFilter] = useState('all');

    // Data hooks
    const unitsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'companies', companyId, 'units');
    }, [firestore, companyId]);
    const { data: units, isLoading: unitsLoading } = useCollection<Unit>(unitsQuery);

    const [sectors, setSectors] = useState<Sector[]>([]);
    const [sectorsLoading, setSectorsLoading] = useState(true);
    const [positions, setPositions] = useState<Position[]>([]);
    const [positionsLoading, setPositionsLoading] = useState(true);

    // Fetch sectors when units are available
    useEffect(() => {
        const fetchSectors = async () => {
            if (!firestore || !units) {
                if (!unitsLoading) setSectorsLoading(false);
                return;
            }
            setSectorsLoading(true);
            try {
                const allSectors: Sector[] = [];
                for (const unit of units) {
                    const sectorsRef = collection(firestore, 'companies', companyId, 'units', unit.id, 'sectors');
                    const sectorsSnap = await getDocs(sectorsRef);
                    sectorsSnap.forEach(doc => {
                        allSectors.push({ ...doc.data(), id: doc.id, unitId: unit.id } as Sector);
                    });
                }
                setSectors(allSectors);
            } catch (error) {
                console.error("Error fetching sectors for positions:", error);
            } finally {
                setSectorsLoading(false);
            }
        };
        fetchSectors();
    }, [firestore, companyId, units, unitsLoading]);

    // Fetch positions when sectors are available
    const fetchPositions = async () => {
        if (!firestore || !sectors || !units) {
            if(!sectorsLoading) setPositionsLoading(false);
            return;
        }
        setPositionsLoading(true);
        try {
            const allPositions: Position[] = [];
            for (const sector of sectors) {
                // Correctly find unitId from the unit associated with the sector
                const unitId = sector.unitId;
                if (!unitId) continue;
                const positionsRef = collection(firestore, 'companies', companyId, 'units', unitId, 'sectors', sector.id, 'positions');
                const positionsSnap = await getDocs(positionsRef);
                positionsSnap.forEach(doc => {
                    allPositions.push({ ...doc.data(), id: doc.id, sectorId: sector.id, unitId: unitId } as Position);
                });
            }
            setPositions(allPositions);
        } catch (error) {
            console.error("Error fetching positions:", error);
        } finally {
            setPositionsLoading(false);
        }
    };
    
    useEffect(() => {
        // This check is important. It ensures that we only fetch positions
        // once the sectors (and by extension, units) have finished loading.
        if(!sectorsLoading) {
            fetchPositions();
        }
    }, [firestore, companyId, sectors, units, sectorsLoading]);

    const handleFormFinished = () => {
        setIsAddDialogOpen(false);
        setTimeout(fetchPositions, 500); // refetch
    }

    const openDeleteDialog = (position: Position) => {
        setSelectedPosition(position);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !selectedPosition) return;
        try {
            await deletePosition(firestore, companyId, selectedPosition.unitId, selectedPosition.sectorId, selectedPosition.id);
            toast({
                title: "Cargo Excluído",
                description: `O cargo "${selectedPosition.name}" foi excluído com sucesso.`,
            });
            setTimeout(fetchPositions, 500); // refetch
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


    const isLoading = unitsLoading || sectorsLoading || positionsLoading;

    const getUnitName = (unitId: string) => units?.find(u => u.id === unitId)?.name || '...';
    const getSectorName = (sectorId: string) => sectors?.find(s => s.id === sectorId)?.name || '...';

    const sortedPositions = useMemo(() => {
        if (!positions) return [];
        return [...positions].sort((a, b) => a.name.localeCompare(b.name));
    }, [positions]);

    const filteredPositions = useMemo(() => {
        if (filter === 'all') return sortedPositions;
        return sortedPositions.filter(pos => pos.id === filter);
    }, [sortedPositions, filter, sectors, units]);

    const positionsWithNames = filteredPositions.map(pos => {
        const sector = sectors.find(s => s.id === pos.sectorId);
        const unit = sector ? units?.find(u => u.id === sector.unitId) : undefined;
        return {
            ...pos,
            sectorName: sector?.name || '...',
            unitName: unit?.name || '...'
        }
    });

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
                             <Button variant="outline" size="sm" disabled={!sectors || sectors.length === 0}>
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
                    <Select value={filter} onValueChange={setFilter} disabled={isLoading || !sortedPositions.length}>
                        <SelectTrigger className="mb-4">
                            <SelectValue placeholder="Filtrar cargos..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os cargos</SelectItem>
                            {sortedPositions.map(pos => (
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
                                            {sectors && sectors.length > 0 ? 'Nenhum cargo encontrado.' : 'Cadastre unidades e setores primeiro.'}
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
    
