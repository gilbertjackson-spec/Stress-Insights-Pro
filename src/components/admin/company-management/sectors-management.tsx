'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Component, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Sector, Unit } from '@/lib/types';
import { AddSectorForm } from './add-sector-form';
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
import { deleteSector } from '@/lib/sector-service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function SectorsManagement({ companyId }: { companyId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
    const [filter, setFilter] = useState('');
    
    const unitsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'companies', companyId, 'units');
    }, [firestore, companyId]);

    const { data: units, isLoading: unitsLoading } = useCollection<Unit>(unitsQuery);

    const [sectors, setSectors] = useState<Sector[]>([]);
    const [sectorsLoading, setSectorsLoading] = useState(true);

    const fetchSectors = async () => {
        if (!firestore || !units) {
            if(!unitsLoading) setSectorsLoading(false);
            return;
        };

        setSectorsLoading(true);
        try {
            const allSectors: Sector[] = [];
            for (const unit of units) {
                const sectorsCollectionRef = collection(firestore, 'companies', companyId, 'units', unit.id, 'sectors');
                const sectorsSnapshot = await getDocs(sectorsCollectionRef);
                sectorsSnapshot.forEach(doc => {
                    allSectors.push({ ...doc.data(), id: doc.id, unitId: unit.id } as Sector);
                });
            }
            setSectors(allSectors);
        } catch (error) {
            console.error("Error fetching sectors:", error);
        } finally {
            setSectorsLoading(false);
        }
    };


    useEffect(() => {
        fetchSectors();
    }, [firestore, companyId, units]);


    const handleFormFinished = () => {
        setIsAddDialogOpen(false);
        setTimeout(fetchSectors, 500);
    }
    
    const openDeleteDialog = (sector: Sector) => {
        setSelectedSector(sector);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !selectedSector) return;
        try {
            await deleteSector(firestore, companyId, selectedSector.unitId, selectedSector.id);
            toast({
                title: "Setor Excluído",
                description: `O setor "${selectedSector.name}" foi excluído com sucesso.`,
            });
            setTimeout(fetchSectors, 500);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível excluir o setor.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedSector(null);
        }
    }

    const isLoading = unitsLoading || sectorsLoading;

    const getUnitName = (unitId: string) => units?.find(u => u.id === unitId)?.name || '...';

    const sortedSectors = useMemo(() => {
        if (!sectors) return [];
        return [...sectors].sort((a, b) => a.name.localeCompare(b.name));
    }, [sectors]);

    const filteredSectors = useMemo(() => {
        return sortedSectors.filter(sector => 
            sector.name.toLowerCase().includes(filter.toLowerCase()) ||
            getUnitName(sector.unitId).toLowerCase().includes(filter.toLowerCase())
        );
    }, [sortedSectors, filter, units]);

    const sectorsWithUnitNames = filteredSectors.map(sector => ({
        ...sector,
        unitName: getUnitName(sector.unitId),
    }));

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Component className="h-5 w-5" />
                            Gerenciar Setores
                        </CardTitle>
                        <CardDescription>Adicione, edite ou exclua os setores de cada unidade.</CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!units || units.length === 0}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Setor</DialogTitle>
                            </DialogHeader>
                            <AddSectorForm companyId={companyId} units={units || []} onFinished={handleFormFinished} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Filtrar setores..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="mb-4"
                    />
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Setor</TableHead>
                                    <TableHead>Unidade</TableHead>
                                    <TableHead className="text-right w-[50px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
                                    ))
                                ) : sectorsWithUnitNames && sectorsWithUnitNames.length > 0 ? (
                                    sectorsWithUnitNames.map((sector) => (
                                        <TableRow key={sector.id}>
                                            <TableCell>{sector.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{sector.unitName}</TableCell>
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
                                                        <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(sector)}>
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
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            {units && units.length > 0 ? 'Nenhum setor encontrado.' : 'Cadastre uma unidade primeiro.'}
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
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o setor
                        <span className="font-bold"> {selectedSector?.name} </span>.
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
