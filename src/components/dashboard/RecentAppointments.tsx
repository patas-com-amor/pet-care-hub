import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, PawPrint, Loader2, CalendarX } from 'lucide-react';
import { AppointmentStatus } from '@/types';
import { useTodayAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  checked_in: 'Check-in',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const statusVariants: Record<AppointmentStatus, string> = {
  scheduled: 'secondary',
  confirmed: 'default',
  checked_in: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'destructive',
};

export function RecentAppointments() {
  const { data: appointments, isLoading } = useTodayAppointments();

  // Sort by scheduled_at ascending and take first 6
  const upcoming = (appointments || [])
    .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 6);

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CalendarX className="h-8 w-8 mb-2" />
            <p className="text-sm">Nenhum agendamento pendente hoje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <PawPrint className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {appointment.pets?.name || 'Pet'}
                    </p>
                    <Badge variant={appointment.department_id as any} className="text-[10px]">
                      {appointment.services?.name || 'Serviço'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Tutor: {appointment.owners?.name || 'N/A'}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(appointment.scheduled_at), 'HH:mm', { locale: ptBR })}
                  </p>
                  <Badge variant={statusVariants[appointment.status as AppointmentStatus] as any} className="text-[10px]">
                    {statusLabels[appointment.status as AppointmentStatus]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
