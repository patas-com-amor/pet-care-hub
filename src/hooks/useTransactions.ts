import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'service' | 'product' | 'package' | 'commission' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  appointment_id: string | null;
  employee_id: string | null;
  date: string;
  created_at: string;
}

export interface TransactionWithDetails extends Transaction {
  appointments: { id: string; pets: { name: string } | null } | null;
  employees: { id: string; name: string } | null;
}

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'>;
export type TransactionUpdate = Partial<TransactionInsert>;

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<TransactionWithDetails[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          appointments (id, pets (name)),
          employees (id, name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useTransactionsByPeriod(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['transactions', 'period', startDate, endDate],
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useFinancialSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['transactions', 'summary', startDate, endDate],
    queryFn: async () => {
      let query = supabase.from('transactions').select('*');
      
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transactions = data || [];
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const byCategory = transactions.reduce((acc, t) => {
        const key = `${t.type}_${t.category}`;
        acc[key] = (acc[key] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

      return {
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        byCategory,
        transactions,
      };
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação registrada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar transação: ' + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...transaction }: TransactionUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar transação: ' + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação removida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover transação: ' + error.message);
    },
  });
}
