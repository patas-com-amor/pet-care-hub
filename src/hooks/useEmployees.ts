import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EmployeeRole = 'admin' | 'manager' | 'groomer' | 'veterinarian' | 'trainer' | 'receptionist' | 'driver';
export type DepartmentId = 'estetica' | 'saude' | 'educacao' | 'estadia' | 'logistica';

export interface Employee {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: EmployeeRole;
  departments: DepartmentId[];
  commission_enabled: boolean;
  commission_percentage: number;
  photo_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type EmployeeInsert = {
  name: string;
  user_id?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: EmployeeRole;
  departments?: DepartmentId[];
  commission_enabled?: boolean;
  commission_percentage?: number;
  photo_url?: string | null;
  active?: boolean;
};

export type EmployeeUpdate = Partial<EmployeeInsert>;

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useActiveEmployees() {
  return useQuery({
    queryKey: ['employees', 'active'],
    queryFn: async (): Promise<Employee[]> => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async (): Promise<Employee | null> => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: EmployeeInsert) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Colaborador cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar colaborador: ' + error.message);
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...employee }: EmployeeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Colaborador atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar colaborador: ' + error.message);
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Colaborador removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover colaborador: ' + error.message);
    },
  });
}
