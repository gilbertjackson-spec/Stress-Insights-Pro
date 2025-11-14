'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddCompanyForm } from './add-company-form';
import { Skeleton } from '../ui/skeleton';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface Company {
  id: string;
  name: string;
}

interface CompaniesTableProps {
  companies: Company[];
  isLoading: boolean;
}

export default function CompaniesTable({
  companies,
  isLoading,
}: CompaniesTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-2xl font-bold font-headline tracking-tight">
                Gerenciar Empresas
            </CardTitle>
            <CardDescription>
                Adicione, visualize e gerencie as empresas de seus clientes.
            </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <AddCompanyForm onFinished={() => setIsAddDialogOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                    </TableRow>
                ))
                ) : companies.length > 0 ? (
                companies.map((company) => (
                    <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/companies/${company.id}`}>
                            Detalhes
                        </Link>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                    Nenhuma empresa encontrada.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
