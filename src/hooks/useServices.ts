import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DepartmentId = 'estetica' | 'saude' | 'educacao' | 'estadia' | 'logistica';

export interface Service {
  id: string;
  name: string;
  department_id: DepartmentId;
  duration: number;
  price: number;
  commission_percentage: number | null;
  active: boolean;
  created_at: string;
}

export type ServiceInsert = Omit<Service, 'id' | 'created_at'>;
export type ServiceUpdate = Partial<ServiceInsert>;

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('department_id')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useServicesByDepartment(departmentId: DepartmentId) {
  return useQuery({
    queryKey: ['services', 'department', departmentId],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('department_id', departmentId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!departmentId,
  });
}

export function useActiveServices() {
  return useQuery({
    queryKey: ['services', 'active'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('department_id')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: ServiceInsert) => {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Serviço cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar serviço: ' + error.message);
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...service }: ServiceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Serviço atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar serviço: ' + error.message);
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Serviço removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover serviço: ' + error.message);
    },
  });
}
