import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  PawPrint,
  Package,
  UserCog,
  DollarSign,
  Settings,
  Sparkles,
  Heart,
  GraduationCap,
  Home,
  Truck,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Power,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const departmentIcons = {
  estetica: Sparkles,
  saude: Heart,
  educacao: GraduationCap,
  estadia: Home,
  logistica: Truck,
};

const departmentColors = {
  estetica: 'text-dept-estetica',
  saude: 'text-dept-saude',
  educacao: 'text-dept-educacao',
  estadia: 'text-dept-estadia',
  logistica: 'text-dept-logistica',
};

export function Sidebar({ mobile, onNavigate }: SidebarProps) {
  const { isDepartmentEnabled } = useSettings();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const effectiveCollapsed = mobile ? false : collapsed;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNav = () => {
    onNavigate?.();
  };

  const mainNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agendamentos', icon: Calendar, label: 'Agendamentos' },
    { to: '/check-in', icon: LogIn, label: 'Check-in' },
    { to: '/check-out', icon: LogOut, label: 'Check-out' },
  ];

  const crmNavItems = [
    { to: '/pets', icon: PawPrint, label: 'Pets' },
    { to: '/tutores', icon: Users, label: 'Tutores' },
  ];

  const businessNavItems = [
    { to: '/pacotes', icon: Package, label: 'Pacotes' },
    ...(isAdmin ? [
      { to: '/colaboradores', icon: UserCog, label: 'Colaboradores' },
      { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    ] : []),
  ];

  const NavItem = ({ to, icon: Icon, label, colorClass }: { to: string; icon: any; label: string; colorClass?: string }) => (
    <NavLink
      to={to}
      onClick={handleNav}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-sidebar-foreground hover:bg-sidebar-accent'
        )
      }
    >
      <Icon className={cn('h-5 w-5 shrink-0', colorClass)} />
      {!effectiveCollapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!effectiveCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">PetShop</span>
          </div>
        )}
        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          {!effectiveCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Principal</p>
          )}
          {mainNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="space-y-1">
          {!effectiveCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Departamentos</p>
          )}
          {Object.entries(departmentIcons).map(([deptId, Icon]) => {
            if (!isDepartmentEnabled(deptId as any)) return null;
            const deptNames: Record<string, string> = {
              estetica: 'Estética',
              saude: 'Saúde',
              educacao: 'Educação',
              estadia: 'Estadia',
              logistica: 'Logística',
            };
            return (
              <NavItem
                key={deptId}
                to={`/departamento/${deptId}`}
                icon={Icon}
                label={deptNames[deptId]}
                colorClass={departmentColors[deptId as keyof typeof departmentColors]}
              />
            );
          })}
        </div>

        <div className="space-y-1">
          {!effectiveCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">CRM</p>
          )}
          {crmNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="space-y-1">
          {!effectiveCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Negócio</p>
          )}
          {businessNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      {/* Settings & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {isAdmin && (
          <NavItem to="/configuracoes" icon={Settings} label="Configurações" />
        )}
        <div className="pt-2 border-t border-sidebar-border mt-2">
          {!effectiveCollapsed && user && (
            <p className="text-xs text-muted-foreground px-3 mb-2 truncate">{user.email}</p>
          )}
          <button
            onClick={() => { handleNav(); handleSignOut(); }}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
              'text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground'
            )}
          >
            <Power className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </div>
    </>
  );

  if (mobile) {
    return (
      <div className="flex flex-col h-full bg-sidebar">
        {sidebarContent}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        effectiveCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {sidebarContent}
    </aside>
  );
}
