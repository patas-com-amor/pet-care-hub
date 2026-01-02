import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { departments } from '@/data/departments';
import { useSettings } from '@/contexts/SettingsContext';
import { useEmployees, useCreateEmployee, EmployeeRole, DepartmentId } from '@/hooks/useEmployees';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCog,
  Plus,
  DollarSign,
  Calendar,
  Percent,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';

const roleLabels: Record<EmployeeRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  groomer: 'Banhista/Tosador',
  veterinarian: 'Veterinário',
  trainer: 'Adestrador',
  receptionist: 'Recepcionista',
  driver: 'Motorista',
};

export default function Employees() {
  const { isDepartmentEnabled } = useSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'groomer' as EmployeeRole,
    departments: [] as DepartmentId[],
    commission_enabled: false,
    commission_percentage: 0,
  });

  const { data: employees = [], isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    await createEmployee.mutateAsync({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      role: formData.role,
      departments: formData.departments,
      commission_enabled: formData.commission_enabled,
      commission_percentage: formData.commission_percentage,
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'groomer',
      departments: [],
      commission_enabled: false,
      commission_percentage: 0,
    });
    setIsDialogOpen(false);
  };

  const activeEmployees = employees.filter(e => e.active);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              Colaboradores
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie a equipe e comissões
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Colaborador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar Colaborador</DialogTitle>
                <DialogDescription>
                  Adicione um novo membro à equipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="empName">Nome Completo *</Label>
                  <Input 
                    id="empName" 
                    placeholder="Nome do colaborador"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empEmail">E-mail</Label>
                    <Input 
                      id="empEmail" 
                      type="email" 
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empPhone">Telefone</Label>
                    <Input 
                      id="empPhone" 
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={formData.role} onValueChange={(v: EmployeeRole) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Departamentos</Label>
                  <Select 
                    value={formData.departments[0] || ''} 
                    onValueChange={(v: DepartmentId) => setFormData({ ...formData, departments: [v] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os departamentos" />
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
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <Label htmlFor="commission">Habilitar Comissão</Label>
                    <p className="text-sm text-muted-foreground">
                      Calcular comissão por serviço
                    </p>
                  </div>
                  <Switch
                    id="commission"
                    checked={formData.commission_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, commission_enabled: checked })}
                  />
                </div>
                {formData.commission_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="commissionPercentage">Percentual de Comissão (%)</Label>
                    <Input
                      id="commissionPercentage"
                      type="number"
                      placeholder="15"
                      min="0"
                      max="100"
                      value={formData.commission_percentage}
                      onChange={(e) => setFormData({ ...formData, commission_percentage: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.name.trim() || createEmployee.isPending}>
                  {createEmployee.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Comissões (Mês)</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ 0,00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Colaboradores Ativos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {activeEmployees.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serviços Realizados (Mês)</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <Card variant="bordered" className="p-12 text-center">
            <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum colaborador cadastrado
            </h3>
            <p className="text-muted-foreground">
              Clique em "Novo Colaborador" para adicionar
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card key={employee.id} variant="elevated" className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {employee.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {employee.name}
                        </h3>
                        <Badge variant="secondary">{roleLabels[employee.role]}</Badge>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {employee.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {employee.phone}
                            </span>
                          )}
                          {employee.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {employee.commission_enabled && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-primary">
                            <Percent className="h-4 w-4" />
                            <span className="font-semibold">
                              {employee.commission_percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Comissão</p>
                        </div>
                      )}
                      <Badge variant={employee.active ? 'success' : 'secondary'}>
                        {employee.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
