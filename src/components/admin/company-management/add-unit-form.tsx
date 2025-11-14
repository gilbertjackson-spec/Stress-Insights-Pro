'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addUnit } from '@/lib/unit-service';
import { useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome da unidade deve ter pelo menos 2 caracteres.' }),
});

export function AddUnitForm({ companyId, onFinished }: { companyId: string, onFinished: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      await addUnit(firestore, companyId, values.name);
      toast({
        title: 'Unidade Adicionada!',
        description: `A unidade "${values.name}" foi criada com sucesso.`,
      });
      form.reset();
      onFinished();
    } catch (error) {
      console.error('Error adding unit: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar unidade',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Unidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Matriz, Filial Sudeste" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar Unidade
            </Button>
        </div>
      </form>
    </Form>
  );
}
