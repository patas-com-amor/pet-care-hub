import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentCard } from '@/components/dashboard/DepartmentCard';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useSettings } from '@/contexts/SettingsContext';
import { departments } from '@/data/departments';
import { useTodayAppointments } from '@/hooks/useAppointments';
import { usePets } from '@/hooks/usePets';
import { useOwners } from '@/hooks/useOwners';
import { useFinancialSummary } from '@/hooks/useTransactions';
import {
  Calendar,
  PawPrint,
  DollarSign,
  Users,
  TrendingUp,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { isDepartmentEnabled } = useSettings();
  const { data: todayAppointments } = useTodayAppointments();
  const { data: pets } = usePets();
  const { data: owners } = useOwners();
  
  const now = new Date();
  const { data: monthlySummary } = useFinancialSummary(
    startOfMonth(now).toISOString(),
    endOfMonth(now).toISOString()
  );

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  const inProgressCount = (todayAppointments || []).filter(
    a => a.status === 'in_progress' || a.status === 'checked_in'
  ).length;

  // Count appointments per department for today
  const appointmentsByDepartment = (todayAppointments || []).reduce((acc, apt) => {
    acc[apt.department_id] = (acc[apt.department_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
            value={todayAppointments?.length || 0}
            subtitle={`${inProgressCount} em andamento`}
            icon={Calendar}
            color="primary"
          />
          <StatCard
            title="Pets Cadastrados"
            value={pets?.length || 0}
            subtitle="Total de pets"
            icon={PawPrint}
            color="accent"
          />
          <StatCard
            title="Faturamento do Mês"
            value={`R$ ${(monthlySummary?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
            subtitle={`Despesas: R$ ${(monthlySummary?.totalExpenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
            icon={DollarSign}
            color="success"
          />
          <StatCard
            title="Clientes Ativos"
            value={owners?.length || 0}
            subtitle="Tutores cadastrados"
            icon={Users}
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
                appointmentsToday={appointmentsByDepartment[department.id] || 0}
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
                title="Receita do Mês"
                value={`R$ ${(monthlySummary?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={Calendar}
                color="success"
              />
              <StatCard
                title="Lucro Líquido"
                value={`R$ ${((monthlySummary?.totalIncome || 0) - (monthlySummary?.totalExpenses || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
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
