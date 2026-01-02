import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Owner {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  cpf: string | null;
  created_at: string;
  updated_at: string;
}

export interface OwnerWithPets extends Owner {
  pets: { id: string; name: string }[];
}

export type OwnerInsert = Omit<Owner, 'id' | 'created_at' | 'updated_at'>;
export type OwnerUpdate = Partial<OwnerInsert>;

export function useOwners() {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async (): Promise<OwnerWithPets[]> => {
      const { data, error } = await supabase
        .from('owners')
        .select(`
          *,
          pets (id, name)
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useOwner(id: string) {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: async (): Promise<OwnerWithPets | null> => {
      const { data, error } = await supabase
        .from('owners')
        .select(`
          *,
          pets (id, name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (owner: OwnerInsert) => {
      const { data, error } = await supabase
        .from('owners')
        .insert(owner)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Tutor cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar tutor: ' + error.message);
    },
  });
}

export function useUpdateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...owner }: OwnerUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('owners')
        .update(owner)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Tutor atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar tutor: ' + error.message);
    },
  });
}

export function useDeleteOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('owners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Tutor removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover tutor: ' + error.message);
    },
  });
}
