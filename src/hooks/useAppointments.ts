import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled';
export type DepartmentId = 'estetica' | 'saude' | 'educacao' | 'estadia' | 'logistica';

export interface Appointment {
  id: string;
  pet_id: string;
  owner_id: string;
  department_id: DepartmentId;
  service_id: string;
  employee_id: string | null;
  scheduled_at: string;
  status: AppointmentStatus;
  check_in_at: string | null;
  check_out_at: string | null;
  before_photo_url: string | null;
  after_photo_url: string | null;
  notes: string | null;
  package_id: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  pets: { id: string; name: string; breed: string | null } | null;
  owners: { id: string; name: string; phone: string | null; whatsapp: string | null } | null;
  services: { id: string; name: string } | null;
  employees: { id: string; name: string } | null;
}

export type AppointmentInsert = {
  pet_id: string;
  owner_id: string;
  department_id: DepartmentId;
  service_id: string;
  employee_id?: string | null;
  scheduled_at: string;
  status?: AppointmentStatus;
  notes?: string | null;
  package_id?: string | null;
  price: number;
};

export type AppointmentUpdate = Partial<Omit<AppointmentInsert, 'pet_id' | 'owner_id'>>;

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async (): Promise<AppointmentWithDetails[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: async (): Promise<AppointmentWithDetails[]> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useAppointmentsByStatus(status: AppointmentStatus) {
  return useQuery({
    queryKey: ['appointments', 'status', status],
    queryFn: async (): Promise<AppointmentWithDetails[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .eq('status', status)
        .order('scheduled_at');

      if (error) throw error;
      return data || [];
    },
    enabled: !!status,
  });
}

export function usePendingCheckIn() {
  return useQuery({
    queryKey: ['appointments', 'pending-checkin'],
    queryFn: async (): Promise<AppointmentWithDetails[]> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .in('status', ['scheduled', 'confirmed'])
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useInProgressAppointments() {
  return useQuery({
    queryKey: ['appointments', 'in-progress'],
    queryFn: async (): Promise<AppointmentWithDetails[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .in('status', ['checked_in', 'in_progress'])
        .order('check_in_at');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: AppointmentInsert) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar agendamento: ' + error.message);
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...appointment }: AppointmentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar agendamento: ' + error.message);
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'checked_in' as AppointmentStatus,
          check_in_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao realizar check-in: ' + error.message);
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, afterPhotoUrl, notes }: { id: string; afterPhotoUrl?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'completed' as AppointmentStatus,
          check_out_at: new Date().toISOString(),
          after_photo_url: afterPhotoUrl,
          notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Check-out realizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao realizar check-out: ' + error.message);
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover agendamento: ' + error.message);
    },
  });
}
