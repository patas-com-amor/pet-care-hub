import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentCard } from '@/components/dashboard/DepartmentCard';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useSettings } from '@/contexts/SettingsContext';
import { departments } from '@/data/departments';
import {
  Calendar,
  PawPrint,
  DollarSign,
  Users,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { isDepartmentEnabled } = useSettings();

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 capitalize">{today}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Agendamentos Hoje"
            value={12}
            subtitle="3 em andamento"
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
            color="primary"
          />
          <StatCard
            title="Pets Cadastrados"
            value={248}
            subtitle="+5 esta semana"
            icon={PawPrint}
            trend={{ value: 12, isPositive: true }}
            color="accent"
          />
          <StatCard
            title="Faturamento do Mês"
            value="R$ 15.420"
            subtitle="Meta: R$ 20.000"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
            color="success"
          />
          <StatCard
            title="Clientes Ativos"
            value={186}
            subtitle="92% de retenção"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            color="info"
          />
        </div>

        {/* Departments Grid */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Departamentos Ativos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {enabledDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                appointmentsToday={Math.floor(Math.random() * 8)}
              />
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAppointments />
          
          {/* Mini Financial Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Resumo Financeiro
            </h2>
            <div className="grid gap-4">
              <StatCard
                title="Receita de Serviços"
                value="R$ 12.850"
                icon={Calendar}
                color="success"
              />
              <StatCard
                title="Receita de Produtos"
                value="R$ 2.570"
                icon={DollarSign}
                color="info"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
