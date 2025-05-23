"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircle, MinusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

// =============================
// ✅ TIPAGEM e SCHEMA
// =============================
const expenseItemSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
});

const formSchema = z.object({
  expenses: z.array(expenseItemSchema).min(1, { message: "Adicione pelo menos uma despesa." }),
});

type OnboardingFormValues = z.infer<typeof formSchema>;

const expenseCategories = [
  { value: "Habitação", label: "Habitação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Alimentacao", label: "Alimentação" },
  { value: "Utilidades", label: "Utilidades" },
  { value: "Seguros", label: "Seguros" },
  { value: "Saude", label: "Saúde" },
  { value: "Investimentos", label: "Investimentos" },
  { value: "Assinaturas", label: "Assinaturas" },
  { value: "Entretenimento", label: "Entretenimento" },
  { value: "Educação", label: "Educação" },
  { value: "Outros", label: "Outros" },
];

// =============================
// ✅ COMPONENTE PRINCIPAL
// =============================
export default function OnboardingForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenses: [{ title: "", amount: "", category: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "expenses",
    control: form.control,
  });

  async function onSubmit(values: OnboardingFormValues) {
    setIsLoading(true);

    try {
      const validExpenses = values.expenses.filter(
        (expense) => expense.title && expense.amount && expense.category
      );

      if (validExpenses.length > 0) {
        const { error: expensesError } = await supabase.from("fixed_expenses").insert(
          validExpenses.map((expense) => ({
            userId,
            title: expense.title,
            amount: parseFloat(expense.amount),
            category: expense.category,
            type: "expense",
          }))
        );

        if (expensesError) {
          throw expensesError;
        }
      }

      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ onboardingCompleted: true })
        .eq("id", userId);

      if (userUpdateError) {
        throw userUpdateError;
      }

      toast({
        title: "Integração completa",
        description: "Suas despesas fixas foram salvar com sucesso.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save expenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Vamos cadastrar suas despesas fixas</CardTitle>
        <CardDescription className="text-center">
          Adicione suas despesas mensais recorrentes para te ajudarmos no controle financeiro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col space-y-3 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Despesa #{index + 1}</h3>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.title` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Aluguel, Netflix, etc." {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.amount` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.category` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {expenseCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ title: "", amount: "", category: "" })}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar outra despesa
            </Button>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
              >
                Pular por enquanto
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner size="sm" className="mr-2" />}
                Finalizar cadastro
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center">
        Você poderá adicionar ou editar suas despesas depois no seu painel.
      </CardFooter>
    </Card>
  );
}
