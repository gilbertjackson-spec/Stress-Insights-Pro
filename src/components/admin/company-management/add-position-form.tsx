'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addPosition } from '@/lib/position-service';
import { useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Unit, Sector } from '@/lib/types';
import { collection, getDocs, query, where } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome do cargo deve ter pelo menos 2 caracteres.' }),
  unitId: z.string().min(1, { message: 'Por favor, selecione uma unidade.' }),
  sectorId: z.string().min(1, { message: 'Por favor, selecione um setor.' }),
});

interface AddPositionFormProps {
    companyId: string;
    units: Unit[];
    onFinished: () => void;
}

export function AddPositionForm({ companyId, units, onFinished }: AddPositionFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', unitId: '', sectorId: '' },
  });

  const selectedUnitId = form.watch('unitId');

  useEffect(() => {
    const fetchSectors = async () => {
        if (!firestore || !selectedUnitId) {
            setSectors([]);
            form.resetField('sectorId');
            return;
        }
        setSectorsLoading(true);
        try {
            const sectorsRef = collection(firestore, 'companies', companyId, 'units', selectedUnitId, 'sectors');
            const sectorsSnap = await getDocs(sectorsRef);
            const fetchedSectors = sectorsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sector));
            setSectors(fetchedSectors);
        } catch (error) {
            console.error("Failed to fetch sectors:", error);
            setSectors([]);
        } finally {
            setSectorsLoading(false);
        }
    };
    fetchSectors();
  }, [firestore, companyId, selectedUnitId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      await addPosition(firestore, companyId, values.unitId, values.sectorId, values.name);
      toast({
        title: 'Cargo Adicionado!',
        description: `O cargo "${values.name}" foi criado com sucesso.`,
      });
      form.reset();
      onFinished();
    } catch (error) {
      console.error('Error adding position: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar cargo',
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="unitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sectorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedUnitId || sectorsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={sectorsLoading ? "Carregando setores..." : "Selecione o setor..."} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Analista, Gerente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar Cargo
            </Button>
        </div>
      </form>
    </Form>
  );
}
    