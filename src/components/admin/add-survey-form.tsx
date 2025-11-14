'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { addSurveyDeployment } from '@/lib/survey-deployment-service';
import type { SurveyTemplate } from '@/lib/types';
import { collection } from 'firebase/firestore';


const formSchema = z.object({
  templateId: z.string().min(1, { message: 'Por favor, selecione um template.' }),
  dateRange: z.object({
    from: z.date({
      required_error: 'A data de início é obrigatória.',
    }),
    to: z.date({
      required_error: 'A data de fim é obrigatória.',
    }),
  }),
  totalEmployees: z.coerce
    .number({ invalid_type_error: 'Deve ser um número.'})
    .positive({ message: 'O número de colaboradores deve ser positivo.' }),
  totalInvited: z.coerce
    .number({ invalid_type_error: 'Deve ser um número.'})
    .positive({ message: 'O número de convidados deve ser positivo.' }),
});

export function AddSurveyForm({ companyId, onFinished }: { companyId: string, onFinished: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const templatesQuery = useMemoFirebase(() => {
    // Wait until firebase is initialized and user is loaded
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'survey_templates');
  }, [firestore, isUserLoading]);

  const { data: templates, isLoading: areTemplatesLoading } = useCollection<SurveyTemplate>(templatesQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        totalInvited: 0,
        totalEmployees: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      await addSurveyDeployment(firestore, {
        companyId,
        templateId: values.templateId,
        startDate: values.dateRange.from.toISOString(),
        endDate: values.dateRange.to.toISOString(),
        totalInvited: values.totalInvited,
        totalEmployees: values.totalEmployees,
      });
      toast({
        title: 'Pesquisa Criada!',
        description: `A nova pesquisa foi criada com sucesso e está em modo rascunho.`,
      });
      form.reset();
      onFinished();
    } catch (error) {
      console.error('Error adding survey deployment: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar pesquisa',
        description:
          'Ocorreu um erro ao tentar criar a pesquisa. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const templatesStillLoading = areTemplatesLoading || isUserLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template da Pesquisa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={templatesStillLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={templatesStillLoading ? "Carregando..." : "Selecione um template..."} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates?.map((template) => (
                    <SelectItem key={template.id} value={String(template.id)}>
                      {template.name}
                    </SelectItem>
                  ))}
                  {templatesStillLoading && <SelectItem value="loading" disabled>Carregando templates...</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Período da Pesquisa</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Escolha um período</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={{from: field.value?.from, to: field.value?.to}}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="totalEmployees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Colaboradores</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 200" {...field} />
              </FormControl>
              <FormDescription>
                Número total de colaboradores na empresa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalInvited"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Convidados</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 150" {...field} />
              </FormControl>
              <FormDescription>
                Número de colaboradores que serão convidados para a pesquisa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Pesquisa
            </Button>
        </div>
      </form>
    </Form>
  );
}
