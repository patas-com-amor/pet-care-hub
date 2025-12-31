import { useParams, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { getDepartmentById } from '@/data/departments';
import { DepartmentId } from '@/types';
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
  const { isDepartmentEnabled } = useSettings();

  if (!id || !isDepartmentEnabled(id as DepartmentId)) {
    return <Navigate to="/" replace />;
  }

  const department = getDepartmentById(id);

  if (!department) {
    return <Navigate to="/" replace />;
  }

  const Icon = departmentIcons[department.id];

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Serviços Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.services.map((service) => (
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
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                    {service.commissionPercentage && (
                      <Badge variant="secondary" className="text-xs">
                        {service.commissionPercentage}% comissão
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
