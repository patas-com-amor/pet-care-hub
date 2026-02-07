import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  service_id: string;
  quantity: number;
  validity_days: number;
  original_price: number;
  discounted_price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicePackageWithService extends ServicePackage {
  services: { id: string; name: string } | null;
}

export interface CustomerPackage {
  id: string;
  package_id: string;
  owner_id: string;
  pet_id: string;
  remaining_uses: number;
  purchased_at: string;
  expires_at: string;
  used_appointments: string[];
  created_at: string;
}

export interface CustomerPackageWithDetails extends CustomerPackage {
  service_packages: { id: string; name: string; quantity: number } | null;
  owners: { id: string; name: string } | null;
  pets: { id: string; name: string } | null;
}

export type ServicePackageInsert = Omit<ServicePackage, 'id' | 'created_at' | 'updated_at'>;
export type ServicePackageUpdate = Partial<ServicePackageInsert>;

export type CustomerPackageInsert = {
  package_id: string;
  owner_id: string;
  pet_id: string;
  remaining_uses: number;
  expires_at: string;
};

export function useServicePackages() {
  return useQuery({
    queryKey: ['service-packages'],
    queryFn: async (): Promise<ServicePackageWithService[]> => {
      const { data, error } = await supabase
        .from('service_packages')
        .select(`
          *,
          services (id, name)
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useActiveServicePackages() {
  return useQuery({
    queryKey: ['service-packages', 'active'],
    queryFn: async (): Promise<ServicePackageWithService[]> => {
      const { data, error } = await supabase
        .from('service_packages')
        .select(`
          *,
          services (id, name)
        `)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCustomerPackages() {
  return useQuery({
    queryKey: ['customer-packages'],
    queryFn: async (): Promise<CustomerPackageWithDetails[]> => {
      const { data, error } = await supabase
        .from('customer_packages')
        .select(`
          *,
          service_packages (id, name, quantity),
          owners (id, name),
          pets (id, name)
        `)
        .gt('remaining_uses', 0)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCustomerPackagesByOwner(ownerId: string) {
  return useQuery({
    queryKey: ['customer-packages', 'owner', ownerId],
    queryFn: async (): Promise<CustomerPackageWithDetails[]> => {
      const { data, error } = await supabase
        .from('customer_packages')
        .select(`
          *,
          service_packages (id, name, quantity),
          owners (id, name),
          pets (id, name)
        `)
        .eq('owner_id', ownerId)
        .gt('remaining_uses', 0)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at');

      if (error) throw error;
      return data || [];
    },
    enabled: !!ownerId,
  });
}

export function useCreateServicePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: ServicePackageInsert) => {
      const { data, error } = await supabase
        .from('service_packages')
        .insert(pkg)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-packages'] });
      toast.success('Pacote criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar pacote: ' + error.message);
    },
  });
}

export function useUpdateServicePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...pkg }: ServicePackageUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('service_packages')
        .update(pkg)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-packages'] });
      toast.success('Pacote atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pacote: ' + error.message);
    },
  });
}

export function useDeleteServicePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-packages'] });
      toast.success('Pacote excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir pacote: ' + error.message);
    },
  });
}

export function useUpdateCustomerPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; remaining_uses?: number; expires_at?: string }) => {
      const { data: result, error } = await supabase
        .from('customer_packages')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-packages'] });
      toast.success('Pacote atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pacote: ' + error.message);
    },
  });
}

export function useDeleteCustomerPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customer_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-packages'] });
      toast.success('Pacote do cliente excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir pacote: ' + error.message);
    },
  });
}

export function useSellPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerPackage: CustomerPackageInsert & { 
      packageName: string; 
      discountedPrice: number;
      ownerName?: string;
    }) => {
      const { packageName, discountedPrice, ownerName, ...insertData } = customerPackage;
      
      const { data, error } = await supabase
        .from('customer_packages')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Create income transaction for package sale
      if (discountedPrice > 0) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            type: 'income',
            category: 'package',
            description: `Venda pacote: ${packageName}${ownerName ? ` - ${ownerName}` : ''}`,
            amount: discountedPrice,
            appointment_id: null,
            employee_id: null,
            date: new Date().toISOString().split('T')[0],
          });

        if (transactionError) {
          console.error('Error creating package transaction:', transactionError);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-packages'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Pacote vendido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao vender pacote: ' + error.message);
    },
  });
}

export function useUsePackageCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, appointmentId }: { id: string; appointmentId?: string }) => {
      // First get current package data
      const { data: current, error: fetchError } = await supabase
        .from('customer_packages')
        .select('remaining_uses, used_appointments')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!current) throw new Error('Pacote não encontrado');
      if (current.remaining_uses <= 0) throw new Error('Pacote sem créditos disponíveis');

      const updatedAppointments = appointmentId
        ? [...(current.used_appointments || []), appointmentId]
        : current.used_appointments || [];

      const { data, error } = await supabase
        .from('customer_packages')
        .update({
          remaining_uses: current.remaining_uses - 1,
          used_appointments: updatedAppointments,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-packages'] });
      toast.success('Crédito utilizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao utilizar crédito: ' + error.message);
    },
  });
}
