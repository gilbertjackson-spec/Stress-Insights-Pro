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
    isLoadingUnits: boolean;
    isLoadingSectors: boolean;
    isLoadingPositions: boolean;
    units: Unit[];
    sectors: Sector[];
    positions: Position[];
    onUnitChange: (unitId: string) => void;
    onSectorChange: (sectorId: string) => void;
    selectedUnit: string;
}

export default function SurveyDemographicsForm({ 
    onSubmit, 
    isLoadingUnits,
    isLoadingSectors,
    isLoadingPositions,
    units = [], 
    sectors = [], 
    positions = [],
    onUnitChange,
    onSectorChange,
    selectedUnit,
}: SurveyDemographicsFormProps) {
  
  const form = useForm<DemographicsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        unit: '',
        sector: '',
        position: '',
        age_range: '',
        current_role_time: '',
        gender: '',
    },
  });

  const handleUnitChange = (value: string) => {
    onUnitChange(value);
    form.setValue('unit', value);
    form.setValue('sector', '');
    form.setValue('position', '');
  }

  const handleSectorChange = (value: string) => {
    onSectorChange(value);
    form.setValue('sector', value);
    form.setValue('position', '');
  }

  const otherDemoFields = DEMO_FIELDS.filter(f => !['unit', 'sector', 'position'].includes(f.name));
  const isLoading = isLoadingUnits;

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
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unidade</FormLabel>
                                    <Select onValueChange={handleUnitChange} value={field.value} disabled={isLoadingUnits}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingUnits ? "Carregando..." : "Selecione a unidade..."} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {units.map(option => (
                                            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Setor</FormLabel>
                                    <Select onValueChange={handleSectorChange} value={field.value} disabled={!selectedUnit || isLoadingSectors}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingSectors ? "Carregando..." : "Selecione o setor..."} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {sectors.map(option => (
                                            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''} disabled={!form.getValues('sector') || isLoadingPositions}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingPositions ? "Carregando..." : "Selecione o cargo (opcional)..."} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {positions.map(option => (
                                            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {otherDemoFields.map(fieldInfo => (
                             <FormField
                                key={fieldInfo.name}
                                control={form.control}
                                name={fieldInfo.name as keyof DemographicsFormValues}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{fieldInfo.label}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Selecione...`} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {fieldInfo.options.map(option => (
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
