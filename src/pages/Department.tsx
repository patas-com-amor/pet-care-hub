import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { getDepartmentById } from '@/data/departments';
import { DepartmentId } from '@/types';
import { useOwners } from '@/hooks/useOwners';
import { usePets } from '@/hooks/usePets';
import { useServices } from '@/hooks/useServices';
import { useEmployees } from '@/hooks/useEmployees';
import { useCreateAppointment } from '@/hooks/useAppointments';
import {
  Sparkles,
  Heart,
  GraduationCap,
  Home,
  Truck,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  Loader2,
} from 'lucide-react';

const departmentIcons = {
  estetica: Sparkles,
  saude: Heart,
  educacao: GraduationCap,
  estadia: Home,
  logistica: Truck,
};

export default function Department() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDepartmentEnabled } = useSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    owner_id: '',
    pet_id: '',
    employee_id: '',
    scheduled_at: '',
    scheduled_time: '',
    notes: '',
  });

  const { data: owners = [] } = useOwners();
  const { data: pets = [] } = usePets();
  const { data: services = [] } = useServices();
  const { data: employees = [] } = useEmployees();
  const createAppointment = useCreateAppointment();

  if (!id || !isDepartmentEnabled(id as DepartmentId)) {
    return <Navigate to="/" replace />;
  }

  const department = getDepartmentById(id);

  if (!department) {
    return <Navigate to="/" replace />;
  }

  const Icon = departmentIcons[department.id];

  // Get services from Supabase for this department
  const departmentServices = services.filter(s => s.department_id === department.id && s.active);
  const selectedService = departmentServices.find(s => s.id === selectedServiceId);
  
  // Filter pets by selected owner
  const filteredPets = formData.owner_id
    ? pets.filter(p => p.owner_id === formData.owner_id)
    : [];

  // Filter employees by department
  const filteredEmployees = employees.filter(e => e.active && e.departments?.includes(department.id as DepartmentId));

  const handleSchedule = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedServiceId || !formData.owner_id || !formData.pet_id || !formData.scheduled_at || !formData.scheduled_time) return;
    
    const scheduledAt = new Date(`${formData.scheduled_at}T${formData.scheduled_time}`);
    
    await createAppointment.mutateAsync({
      owner_id: formData.owner_id,
      pet_id: formData.pet_id,
      department_id: department.id as DepartmentId,
      service_id: selectedServiceId,
      employee_id: formData.employee_id || null,
      scheduled_at: scheduledAt.toISOString(),
      price: selectedService?.price || 0,
      notes: formData.notes || null,
    });
    
    setFormData({ owner_id: '', pet_id: '', employee_id: '', scheduled_at: '', scheduled_time: '', notes: '' });
    setSelectedServiceId(null);
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-dept-${department.id}/10`}>
              <Icon className={`h-8 w-8 text-dept-${department.id}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{department.name}</h1>
              <p className="text-muted-foreground mt-1">{department.description}</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => navigate('/agendamentos')}>
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Serviços Disponíveis
          </h2>
          {departmentServices.length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum serviço cadastrado
              </h3>
              <p className="text-muted-foreground">
                Cadastre serviços na área de configurações
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentServices.map((service) => (
                <Card
                  key={service.id}
                  variant="elevated"
                  className="hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {service.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>R$ {Number(service.price).toFixed(2)}</span>
                      </div>
                      {service.commission_percentage && (
                        <Badge variant="secondary" className="text-xs">
                          {service.commission_percentage}% comissão
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" className="w-full gap-2" onClick={() => handleSchedule(service.id)}>
                      <Calendar className="h-4 w-4" />
                      Agendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Today's Appointments Placeholder */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum agendamento hoje
              </h3>
              <p className="text-muted-foreground mb-4">
                Os agendamentos do departamento aparecerão aqui
              </p>
              <Button variant="outline" className="gap-2" onClick={() => navigate('/agendamentos')}>
                <Plus className="h-4 w-4" />
                Criar Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agendar Serviço</DialogTitle>
              <DialogDescription>
                {selectedService?.name} - R$ {Number(selectedService?.price || 0).toFixed(2)}
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
                      <SelectValue placeholder={formData.owner_id ? "Selecione o pet" : "Selecione um tutor"} />
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.owner_id || !formData.pet_id || !formData.scheduled_at || !formData.scheduled_time || createAppointment.isPending}
              >
                {createAppointment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Agendar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
