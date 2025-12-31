import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, PawPrint } from 'lucide-react';
import { Appointment, AppointmentStatus, DepartmentId } from '@/types';
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

const statusVariants: Record<AppointmentStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  scheduled: 'secondary',
  confirmed: 'default',
  checked_in: 'info' as any,
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'destructive',
};

// Mock data for demonstration
const mockAppointments = [
  {
    id: '1',
    petName: 'Thor',
    ownerName: 'Maria Silva',
    service: 'Banho + Tosa',
    department: 'estetica' as DepartmentId,
    scheduledAt: new Date().toISOString(),
    status: 'confirmed' as AppointmentStatus,
  },
  {
    id: '2',
    petName: 'Luna',
    ownerName: 'João Santos',
    service: 'Consulta Veterinária',
    department: 'saude' as DepartmentId,
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled' as AppointmentStatus,
  },
  {
    id: '3',
    petName: 'Bob',
    ownerName: 'Ana Costa',
    service: 'Daycare',
    department: 'estadia' as DepartmentId,
    scheduledAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'in_progress' as AppointmentStatus,
  },
  {
    id: '4',
    petName: 'Nina',
    ownerName: 'Pedro Oliveira',
    service: 'Adestramento',
    department: 'educacao' as DepartmentId,
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
    status: 'confirmed' as AppointmentStatus,
  },
];

export function RecentAppointments() {
  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
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
                  <p className="font-medium text-foreground truncate">{appointment.petName}</p>
                  <Badge variant={appointment.department} className="text-[10px]">
                    {appointment.service}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Tutor: {appointment.ownerName}
                </p>
              </div>
              
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(appointment.scheduledAt), 'HH:mm', { locale: ptBR })}
                </p>
                <Badge variant={statusVariants[appointment.status]} className="text-[10px]">
                  {statusLabels[appointment.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
