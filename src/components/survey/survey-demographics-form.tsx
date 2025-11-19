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
import { DEMO_FIELDS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import type { Unit, Sector, Position } from '@/lib/types';


const formSchema = z.object({
    unit: z.string().min(1, 'Selecione a unidade.'),
    sector: z.string().min(1, 'Selecione o setor.'),
    position: z.string().optional(),
    age_range: z.string().optional(),
    current_role_time: z.string().optional(),
    gender: z.string().optional(),
});

type DemographicsFormValues = z.infer<typeof formSchema>;

interface SurveyDemographicsFormProps {
    onSubmit: (data: DemographicsFormValues) => void;
    isLoading: boolean;
    units: Unit[];
    sectors: Sector[];
    positions: Position[];
}

export default function SurveyDemographicsForm({ onSubmit, isLoading, units = [], sectors = [], positions = [] }: SurveyDemographicsFormProps) {
  
  const form = useForm<DemographicsFormValues>({
    resolver: zodResolver(formSchema),
  });

  const getOptionsForField = (fieldName: string) => {
    switch (fieldName) {
      case 'unit':
        return units.map(u => ({ id: u.id, name: u.name }));
      case 'sector':
        // Use a map to ensure unique options by name
        return [...new Map(sectors.map(item => [item.name, item])).values()].map(s => ({ id: s.id, name: s.name }));
      case 'position':
        return [...new Map(positions.map(item => [item.name, item])).values()].map(p => ({ id: p.id, name: p.name }));
      default:
        const field = DEMO_FIELDS.find(f => f.name === fieldName);
        return field ? field.options : [];
    }
  };


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
                                name={fieldInfo.name as keyof DemographicsFormValues}
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
                                        {getOptionsForField(fieldInfo.name).map(option => (
                                            <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
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
