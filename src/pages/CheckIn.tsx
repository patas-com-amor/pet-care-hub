import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  LogIn,
  Search,
  PawPrint,
  Clock,
  User,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock appointments waiting for check-in
const mockPendingCheckIn = [
  {
    id: '1',
    petName: 'Thor',
    petBreed: 'Golden Retriever',
    ownerName: 'Maria Silva',
    service: 'Banho + Tosa',
    department: 'estetica',
    scheduledAt: new Date().toISOString(),
  },
  {
    id: '2',
    petName: 'Luna',
    petBreed: 'Shih Tzu',
    ownerName: 'João Santos',
    service: 'Consulta Veterinária',
    department: 'saude',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: '4',
    petName: 'Nina',
    petBreed: 'Poodle',
    ownerName: 'Pedro Oliveira',
    service: 'Adestramento',
    department: 'educacao',
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
  },
];

export default function CheckIn() {
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredAppointments = mockPendingCheckIn.filter(
    (apt) =>
      apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = async (appointmentId: string, petName: string) => {
    setProcessingId(appointmentId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Check-in realizado para ${petName}!`, {
      description: 'O pet foi registrado e pode iniciar o atendimento.',
    });
    
    setProcessingId(null);
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

          {filteredAppointments.length === 0 ? (
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
                            {appointment.petName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.petBreed}
                          </p>
                          <Badge variant={appointment.department as any} className="mt-1">
                            {appointment.service}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{appointment.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Agendado para{' '}
                              {format(new Date(appointment.scheduledAt), 'HH:mm', {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="success"
                          size="lg"
                          className="gap-2"
                          onClick={() => handleCheckIn(appointment.id, appointment.petName)}
                          disabled={processingId === appointment.id}
                        >
                          {processingId === appointment.id ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
