import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { usePendingCheckIn, useCheckIn } from '@/hooks/useAppointments';
import {
  LogIn,
  Search,
  PawPrint,
  Clock,
  User,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CheckIn() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: pendingAppointments, isLoading } = usePendingCheckIn();
  const checkInMutation = useCheckIn();

  const filteredAppointments = (pendingAppointments || []).filter(
    (apt) =>
      apt.pets?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owners?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = async (appointmentId: string, petName: string) => {
    try {
      await checkInMutation.mutateAsync(appointmentId);
      toast.success(`Check-in realizado para ${petName}!`, {
        description: 'O pet foi registrado e pode iniciar o atendimento.',
      });
    } catch (error) {
      toast.error('Erro ao realizar check-in');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <LogIn className="h-8 w-8 text-success" />
            Check-in
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre a chegada dos pets para atendimento
          </p>
        </div>

        {/* Search */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do pet ou tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending Check-ins */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Aguardando Check-in ({filteredAppointments.length})
          </h2>

          {isLoading ? (
            <Card variant="bordered" className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Carregando agendamentos...</p>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum check-in pendente
              </h3>
              <p className="text-muted-foreground">
                Todos os agendamentos do momento já fizeram check-in
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  variant="elevated"
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-success/20">
                          <AvatarFallback className="bg-success/10 text-success">
                            <PawPrint className="h-7 w-7" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {appointment.pets?.name || 'Pet'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.pets?.breed || 'Sem raça definida'}
                          </p>
                          <Badge variant={appointment.department_id as any} className="mt-1">
                            {appointment.services?.name || 'Serviço'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{appointment.owners?.name || 'Tutor'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Agendado para{' '}
                              {format(new Date(appointment.scheduled_at), 'HH:mm', {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="success"
                          size="lg"
                          className="gap-2"
                          onClick={() => handleCheckIn(appointment.id, appointment.pets?.name || 'Pet')}
                          disabled={checkInMutation.isPending}
                        >
                          {checkInMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <LogIn className="h-4 w-4" />
                              Check-in
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
