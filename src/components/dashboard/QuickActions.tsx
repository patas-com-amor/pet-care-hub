import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  UserPlus,
  PawPrint,
  LogIn,
  Package,
  Zap,
} from 'lucide-react';

const quickActions = [
  {
    icon: CalendarPlus,
    label: 'Novo Agendamento',
    description: 'Agendar um serviço',
    to: '/agendamentos',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    icon: LogIn,
    label: 'Check-in',
    description: 'Registrar chegada',
    to: '/check-in',
    color: 'bg-success/10 text-success hover:bg-success/20',
  },
  {
    icon: PawPrint,
    label: 'Novo Pet',
    description: 'Cadastrar pet',
    to: '/pets',
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
  },
  {
    icon: UserPlus,
    label: 'Novo Tutor',
    description: 'Cadastrar tutor',
    to: '/tutores',
    color: 'bg-info/10 text-info hover:bg-info/20',
  },
  {
    icon: Package,
    label: 'Vender Pacote',
    description: 'Planos mensais',
    to: '/pacotes',
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${action.color}`}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs opacity-70">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
