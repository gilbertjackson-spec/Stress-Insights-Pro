'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DEMO_OPTIONS } from '@/lib/mock-data-fortesting';
import { Loader2 } from 'lucide-react';
import type { Unit, Sector, Position } from '@/lib/types';


const formSchema = z.object({
    unit: z.string().min(1, 'Selecione a unidade.'),
    sector: z.string().min(1, 'Selecione o setor.'),
    position: z.string().min(1, 'Selecione o cargo.'),
    age_range: z.string().min(1, 'Selecione a faixa etária.'),
    current_role_time: z.string().min(1, 'Selecione o tempo no cargo atual.'),
});

type DemographicsFormValues = z.infer<typeof formSchema>;

interface SurveyDemographicsFormProps {
    onSubmit: (data: DemographicsFormValues) => void;
    isLoading: boolean;
    units: Unit[];
    sectors: Sector[];
    positions: Position[];
}

export default function SurveyDemographicsForm({ onSubmit, isLoading, units, sectors, positions }: SurveyDemographicsFormProps) {
  
  const form = useForm<DemographicsFormValues>({
    resolver: zodResolver(formSchema),
  });

  const DEMO_FIELDS = [
    { name: 'unit', label: 'Unidade', options: units.map(u => u.name) },
    { name: 'sector', label: 'Setor', options: sectors.map(s => s.name) },
    { name: 'position', label: 'Cargo', options: positions.map(p => p.name) },
    { name: 'age_range', label: 'Faixa Etária', options: DEMO_OPTIONS.age_ranges },
    { name: 'current_role_time', label: 'Tempo no Cargo Atual', options: DEMO_OPTIONS.current_role_times },
  ] as const;

  return (
    <>
        <CardHeader>
            <CardTitle>Informações Demográficas</CardTitle>
            <CardDescription>Estes dados são anônimos e usados apenas para análise estatística.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Carregando estrutura...</p>
                </div>
            ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DEMO_FIELDS.map(fieldInfo => (
                             <FormField
                                key={fieldInfo.name}
                                control={form.control}
                                name={fieldInfo.name}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{fieldInfo.label}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Selecione...`} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {fieldInfo.options.map(option => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                   
                    <div className="flex justify-end">
                        <Button type="submit">Continuar para a Pesquisa</Button>
                    </div>
                </form>
                </Form>
            )}
        </CardContent>
    </>
  );
}
