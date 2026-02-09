import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PendingPaymentAppointment {
  id: string;
  pet_id: string;
  owner_id: string;
  service_id: string;
  department_id: string;
  employee_id: string | null;
  price: number;
  check_out_at: string | null;
  scheduled_at: string;
  pets: { id: string; name: string; breed: string | null } | null;
  owners: { id: string; name: string; phone: string | null; whatsapp: string | null } | null;
  services: { id: string; name: string } | null;
  employees: { id: string; name: string } | null;
}

export type PaymentMethod = 'debito' | 'credito' | 'pix' | 'dinheiro';

export function usePendingPayments() {
  return useQuery({
    queryKey: ['pending-payments'],
    queryFn: async (): Promise<PendingPaymentAppointment[]> => {
      // Get completed appointments
      const { data: completedAppointments, error: appError } = await supabase
        .from('appointments')
        .select(`
          id, pet_id, owner_id, service_id, department_id, employee_id, price, check_out_at, scheduled_at,
          pets (id, name, breed),
          owners (id, name, phone, whatsapp),
          services (id, name),
          employees (id, name)
        `)
        .eq('status', 'completed')
        .gt('price', 0)
        .order('check_out_at', { ascending: false });

      if (appError) throw appError;
      if (!completedAppointments || completedAppointments.length === 0) return [];

      // Get appointment IDs that already have income transactions
      const { data: paidTransactions, error: txError } = await supabase
        .from('transactions')
        .select('appointment_id')
        .eq('type', 'income')
        .eq('category', 'service')
        .not('appointment_id', 'is', null);

      if (txError) throw txError;

      const paidAppointmentIds = new Set(
        (paidTransactions || []).map(t => t.appointment_id)
      );

      // Filter out already paid appointments
      return completedAppointments.filter(
        a => !paidAppointmentIds.has(a.id)
      ) as PendingPaymentAppointment[];
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      price,
      serviceName,
      employeeId,
      paymentMethod,
    }: {
      appointmentId: string;
      price: number;
      serviceName: string;
      employeeId: string | null;
      paymentMethod: PaymentMethod;
    }) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: 'income' as const,
          category: 'service' as const,
          description: `Serviço: ${serviceName}`,
          amount: price,
          appointment_id: appointmentId,
          employee_id: employeeId,
          date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Pagamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar pagamento: ' + error.message);
    },
  });
}
