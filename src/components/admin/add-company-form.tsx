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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addCompany } from '@/lib/company-service';
import { useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome da empresa deve ter pelo menos 2 caracteres.',
  }),
});

export function AddCompanyForm({ onFinished }: { onFinished: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      await addCompany(firestore, values.name);
      toast({
        title: 'Empresa Adicionada!',
        description: `A empresa "${values.name}" foi criada com sucesso.`,
      });
      form.reset();
      onFinished();
    } catch (error) {
      console.error('Error adding company: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar empresa',
        description:
          'Ocorreu um erro ao tentar adicionar a empresa. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Acme Corporation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Adicionar Empresa
        </Button>
      </form>
    </Form>
  );
}
