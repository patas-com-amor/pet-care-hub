import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSettings } from '@/contexts/SettingsContext';
import { departments } from '@/data/departments';
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment, AppointmentStatus, DepartmentId, AppointmentWithDetails } from '@/hooks/useAppointments';
import { useOwners } from '@/hooks/useOwners';
import { usePets } from '@/hooks/usePets';
import { useServices } from '@/hooks/useServices';
import { useEmployees } from '@/hooks/useEmployees';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Plus,
  Search,
  PawPrint,
  Clock,
  User,
  MoreVertical,
  Loader2,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
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

const departmentLabels: Record<DepartmentId, string> = {
  estetica: 'Estética',
  saude: 'Saúde',
  educacao: 'Educação',
  estadia: 'Estadia',
  logistica: 'Logística',
};

export default function Appointments() {
  const { isDepartmentEnabled } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithDetails | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    owner_id: '',
    pet_id: '',
    department_id: '' as DepartmentId | '',
    service_id: '',
    employee_id: '',
    scheduled_at: '',
    scheduled_time: '',
    notes: '',
  });

  const { data: appointments = [], isLoading } = useAppointments();
  const { data: owners = [] } = useOwners();
  const { data: pets = [] } = usePets();
  const { data: services = [] } = useServices();
  const { data: employees = [] } = useEmployees();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  // Filter pets by selected owner
  const filteredPets = formData.owner_id
    ? pets.filter(p => p.owner_id === formData.owner_id)
    : [];

  // Filter services by selected department
  const filteredServices = formData.department_id
    ? services.filter(s => s.department_id === formData.department_id && s.active)
    : [];

  // Filter employees by selected department
  const filteredEmployees = formData.department_id
    ? employees.filter(e => e.active && e.departments?.includes(formData.department_id as DepartmentId))
    : [];

  const selectedService = services.find(s => s.id === formData.service_id);

  const resetForm = () => {
    setFormData({ owner_id: '', pet_id: '', department_id: '', service_id: '', employee_id: '', scheduled_at: '', scheduled_time: '', notes: '' });
  };

  const handleSubmit = async () => {
    if (!formData.owner_id || !formData.pet_id || !formData.department_id || !formData.service_id || !formData.scheduled_at || !formData.scheduled_time) return;
    
    const scheduledAt = new Date(`${formData.scheduled_at}T${formData.scheduled_time}`);
    
    await createAppointment.mutateAsync({
      owner_id: formData.owner_id,
      pet_id: formData.pet_id,
      department_id: formData.department_id as DepartmentId,
      service_id: formData.service_id,
      employee_id: formData.employee_id || null,
      scheduled_at: scheduledAt.toISOString(),
      price: selectedService?.price || 0,
      notes: formData.notes || null,
    });
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (appointment: AppointmentWithDetails) => {
    const scheduledDate = new Date(appointment.scheduled_at);
    setFormData({
      owner_id: appointment.owner_id,
      pet_id: appointment.pet_id,
      department_id: appointment.department_id,
      service_id: appointment.service_id,
      employee_id: appointment.employee_id || '',
      scheduled_at: format(scheduledDate, 'yyyy-MM-dd'),
      scheduled_time: format(scheduledDate, 'HH:mm'),
      notes: appointment.notes || '',
    });
    setEditingAppointment(appointment);
  };

  const handleUpdate = async () => {
    if (!editingAppointment || !formData.scheduled_at || !formData.scheduled_time) return;
    
    const scheduledAt = new Date(`${formData.scheduled_at}T${formData.scheduled_time}`);
    
    await updateAppointment.mutateAsync({
      id: editingAppointment.id,
      service_id: formData.service_id,
      employee_id: formData.employee_id || null,
      scheduled_at: scheduledAt.toISOString(),
      notes: formData.notes || null,
    });
    
    resetForm();
    setEditingAppointment(null);
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await updateAppointment.mutateAsync({ id, status });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteAppointment.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.pets?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owners?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === 'all' || apt.department_id === filterDepartment;
    const matchesStatus =
      filterStatus === 'all' || apt.status === filterStatus;
    const deptEnabled = isDepartmentEnabled(apt.department_id);

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo agendamento
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tutor *</Label>
                    <Select value={formData.owner_id} onValueChange={(v) => setFormData({ ...formData, owner_id: v, pet_id: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pet *</Label>
                    <Select value={formData.pet_id} onValueChange={(v) => setFormData({ ...formData, pet_id: v })} disabled={!formData.owner_id}>
                      <SelectTrigger>
                        <SelectValue placeholder={formData.owner_id ? "Selecione o pet" : "Selecione um tutor primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departamento *</Label>
                    <Select value={formData.department_id} onValueChange={(v) => setFormData({ ...formData, department_id: v as DepartmentId, service_id: '', employee_id: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {enabledDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Serviço *</Label>
                    <Select value={formData.service_id} onValueChange={(v) => setFormData({ ...formData, service_id: v })} disabled={!formData.department_id}>
                      <SelectTrigger>
                        <SelectValue placeholder={formData.department_id ? "Selecione o serviço" : "Selecione um departamento primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {Number(service.price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Data *</Label>
                    <Input
                      type="date"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário *</Label>
                    <Input
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Colaborador</Label>
                    <Select value={formData.employee_id} onValueChange={(v) => setFormData({ ...formData, employee_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEmployees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Informações adicionais..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                {selectedService && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor do serviço:</p>
                    <p className="text-lg font-bold text-foreground">R$ {Number(selectedService.price).toFixed(2)}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.owner_id || !formData.pet_id || !formData.department_id || !formData.service_id || !formData.scheduled_at || !formData.scheduled_time || createAppointment.isPending}
                >
                  {createAppointment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Agendar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredAppointments.length === 0 ? (
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
                          {appointment.pets?.name || 'Pet não encontrado'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.pets?.breed || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {appointment.owners?.name || 'Tutor não encontrado'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.owners?.phone || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex-1">
                      <Badge variant={appointment.department_id as any}>
                        {appointment.services?.name || departmentLabels[appointment.department_id]}
                      </Badge>
                    </div>

                    {/* Time & Status */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(appointment.scheduled_at), 'HH:mm', {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.scheduled_at), "d 'de' MMM", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <Badge variant={statusColors[appointment.status] as any}>
                        {statusLabels[appointment.status]}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(appointment)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'confirmed')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirmar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteConfirmId(appointment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && (setEditingAppointment(null), resetForm())}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Agendamento</DialogTitle>
              <DialogDescription>
                Atualize os dados do agendamento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário *</Label>
                  <Input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Informações adicionais..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => (setEditingAppointment(null), resetForm())}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateAppointment.isPending}>
                {updateAppointment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O agendamento será removido permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {deleteAppointment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
