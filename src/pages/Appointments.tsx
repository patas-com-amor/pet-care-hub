import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSettings } from '@/contexts/SettingsContext';
import { departments } from '@/data/departments';
import { AppointmentStatus, DepartmentId } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  PawPrint,
  Clock,
  User,
  MoreVertical,
} from 'lucide-react';

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  checked_in: 'Check-in',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: 'secondary',
  confirmed: 'default',
  checked_in: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'destructive',
};

// Mock appointments
const mockAppointments = [
  {
    id: '1',
    petName: 'Thor',
    petBreed: 'Golden Retriever',
    ownerName: 'Maria Silva',
    ownerPhone: '(11) 99999-9999',
    service: 'Banho + Tosa',
    department: 'estetica' as DepartmentId,
    scheduledAt: new Date().toISOString(),
    status: 'confirmed' as AppointmentStatus,
    price: 120,
  },
  {
    id: '2',
    petName: 'Luna',
    petBreed: 'Shih Tzu',
    ownerName: 'João Santos',
    ownerPhone: '(11) 98888-8888',
    service: 'Consulta Veterinária',
    department: 'saude' as DepartmentId,
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled' as AppointmentStatus,
    price: 150,
  },
  {
    id: '3',
    petName: 'Bob',
    petBreed: 'Labrador',
    ownerName: 'Ana Costa',
    ownerPhone: '(11) 97777-7777',
    service: 'Daycare',
    department: 'estadia' as DepartmentId,
    scheduledAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'in_progress' as AppointmentStatus,
    price: 80,
  },
  {
    id: '4',
    petName: 'Nina',
    petBreed: 'Poodle',
    ownerName: 'Pedro Oliveira',
    ownerPhone: '(11) 96666-6666',
    service: 'Adestramento',
    department: 'educacao' as DepartmentId,
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
    status: 'confirmed' as AppointmentStatus,
    price: 120,
  },
  {
    id: '5',
    petName: 'Rex',
    petBreed: 'Pastor Alemão',
    ownerName: 'Fernanda Lima',
    ownerPhone: '(11) 95555-5555',
    service: 'Leva e Traz',
    department: 'logistica' as DepartmentId,
    scheduledAt: new Date(Date.now() + 10800000).toISOString(),
    status: 'scheduled' as AppointmentStatus,
    price: 40,
  },
];

export default function Appointments() {
  const { isDepartmentEnabled } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === 'all' || apt.department === filterDepartment;
    const matchesStatus =
      filterStatus === 'all' || apt.status === filterStatus;
    const deptEnabled = isDepartmentEnabled(apt.department);

    return matchesSearch && matchesDepartment && matchesStatus && deptEnabled;
  });

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              Agendamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os agendamentos do pet shop
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por pet ou tutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {enabledDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou crie um novo agendamento
              </p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                variant="elevated"
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Pet Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <PawPrint className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {appointment.petName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.petBreed}
                        </p>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {appointment.ownerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.ownerPhone}
                        </p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex-1">
                      <Badge variant={appointment.department}>
                        {appointment.service}
                      </Badge>
                    </div>

                    {/* Time & Status */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(appointment.scheduledAt), 'HH:mm', {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.scheduledAt), "d 'de' MMM", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <Badge variant={statusColors[appointment.status] as any}>
                        {statusLabels[appointment.status]}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
