import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Department, DepartmentId } from '@/types';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  GraduationCap,
  Home,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const departmentIcons = {
  estetica: Sparkles,
  saude: Heart,
  educacao: GraduationCap,
  estadia: Home,
  logistica: Truck,
};

const departmentStyles: Record<DepartmentId, { bg: string; text: string; border: string }> = {
  estetica: { bg: 'bg-dept-estetica/10', text: 'text-dept-estetica', border: 'border-dept-estetica/30' },
  saude: { bg: 'bg-dept-saude/10', text: 'text-dept-saude', border: 'border-dept-saude/30' },
  educacao: { bg: 'bg-dept-educacao/10', text: 'text-dept-educacao', border: 'border-dept-educacao/30' },
  estadia: { bg: 'bg-dept-estadia/10', text: 'text-dept-estadia', border: 'border-dept-estadia/30' },
  logistica: { bg: 'bg-dept-logistica/10', text: 'text-dept-logistica', border: 'border-dept-logistica/30' },
};

interface DepartmentCardProps {
  department: Department;
  appointmentsToday?: number;
}

export function DepartmentCard({ department, appointmentsToday = 0 }: DepartmentCardProps) {
  const navigate = useNavigate();
  const Icon = departmentIcons[department.id];
  const styles = departmentStyles[department.id];

  return (
    <Card
      variant="bordered"
      className={cn(
        'p-5 transition-all duration-300 hover:shadow-lg cursor-pointer group border-2',
        styles.border
      )}
      onClick={() => navigate(`/departamento/${department.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', styles.bg)}>
          <Icon className={cn('h-6 w-6', styles.text)} />
        </div>
        <Badge variant={department.id}>{appointmentsToday} hoje</Badge>
      </div>
      
      <h3 className="font-semibold text-lg text-foreground mb-1">{department.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{department.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {department.services.length} serviços
        </span>
        <ArrowRight className={cn(
          'h-4 w-4 transition-transform duration-300 group-hover:translate-x-1',
          styles.text
        )} />
      </div>
    </Card>
  );
}
