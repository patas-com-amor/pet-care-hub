import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';

export interface PetBehavior {
  type: string;
  notes?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  size: PetSize;
  birth_date: string | null;
  owner_id: string;
  photo_url: string | null;
  allergies: string[];
  behaviors: PetBehavior[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PetWithOwner extends Pet {
  owners: { id: string; name: string; phone: string | null } | null;
}

export type PetInsert = {
  name: string;
  species?: PetSpecies;
  breed?: string | null;
  size?: PetSize;
  birth_date?: string | null;
  owner_id: string;
  photo_url?: string | null;
  allergies?: string[];
  behaviors?: PetBehavior[];
  notes?: string | null;
};

export type PetUpdate = Partial<Omit<PetInsert, 'owner_id'>>;

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async (): Promise<PetWithOwner[]> => {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          owners (id, name, phone)
        `)
        .order('name');

      if (error) throw error;
      
      // Parse behaviors from JSONB
      return (data || []).map(pet => ({
        ...pet,
        behaviors: (Array.isArray(pet.behaviors) ? pet.behaviors : []) as unknown as PetBehavior[],
      }));
    },
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: async (): Promise<PetWithOwner | null> => {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          owners (id, name, phone)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        behaviors: (Array.isArray(data.behaviors) ? data.behaviors : []) as unknown as PetBehavior[],
      };
    },
    enabled: !!id,
  });
}

export function usePetsByOwner(ownerId: string) {
  return useQuery({
    queryKey: ['pets', 'owner', ownerId],
    queryFn: async (): Promise<Pet[]> => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', ownerId)
        .order('name');

      if (error) throw error;
      return (data || []).map(pet => ({
        ...pet,
        behaviors: (Array.isArray(pet.behaviors) ? pet.behaviors : []) as unknown as PetBehavior[],
      }));
    },
    enabled: !!ownerId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pet: PetInsert) => {
      const { data, error } = await supabase
        .from('pets')
        .insert({
          ...pet,
          behaviors: JSON.stringify(pet.behaviors || []),
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Pet cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar pet: ' + error.message);
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...pet }: PetUpdate & { id: string }) => {
      const updateData: any = { ...pet };
      if (pet.behaviors) {
        updateData.behaviors = JSON.stringify(pet.behaviors);
      }
      
      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pet: ' + error.message);
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Pet removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover pet: ' + error.message);
    },
  });
}
