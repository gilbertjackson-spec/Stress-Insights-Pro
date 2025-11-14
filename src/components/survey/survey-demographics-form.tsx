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
import { DEMO_OPTIONS } from '@/lib/mock-data-fortesting';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
    unit: z.string().min(1, 'Selecione a unidade.'),
    sector: z.string().min(1, 'Selecione o setor.'),
    age_range: z.string().min(1, 'Selecione a faixa etária.'),
    current_role_time: z.string().min(1, 'Selecione o tempo no cargo atual.'),
});

type DemographicsFormValues = z.infer<typeof formSchema>;

interface SurveyDemographicsFormProps {
    onSubmit: (data: DemographicsFormValues) => void;
}

export default function SurveyDemographicsForm({ onSubmit }: SurveyDemographicsFormProps) {
  
  const form = useForm<DemographicsFormValues>({
    resolver: zodResolver(formSchema),
  });

  const DEMO_FIELDS = [
    { name: 'unit', label: 'Unidade', options: DEMO_OPTIONS.units },
    { name: 'sector', label: 'Setor', options: DEMO_OPTIONS.sectors },
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
                                        <SelectValue placeholder={`Selecione seu ${fieldInfo.label.toLowerCase()}...`} />
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
        </CardContent>
    </>
  );
}
