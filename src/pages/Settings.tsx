import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { departments } from '@/data/departments';
import { DepartmentId } from '@/types';
import {
  Settings as SettingsIcon,
  Building2,
  Sparkles,
  Heart,
  GraduationCap,
  Home,
  Truck,
  Save,
  Link,
} from 'lucide-react';
import { toast } from 'sonner';

const departmentIcons = {
  estetica: Sparkles,
  saude: Heart,
  educacao: GraduationCap,
  estadia: Home,
  logistica: Truck,
};

const departmentColors: Record<DepartmentId, string> = {
  estetica: 'text-dept-estetica',
  saude: 'text-dept-saude',
  educacao: 'text-dept-educacao',
  estadia: 'text-dept-estadia',
  logistica: 'text-dept-logistica',
};

export default function Settings() {
  const { settings, updateSettings, toggleDepartment, isDepartmentEnabled } = useSettings();

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do seu pet shop
          </p>
        </div>

        {/* Business Info */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informações do Negócio
            </CardTitle>
            <CardDescription>
              Dados básicos do seu pet shop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome do Pet Shop</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => updateSettings({ businessName: e.target.value })}
                placeholder="Nome do seu pet shop"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Telefone</Label>
                <Input
                  id="businessPhone"
                  value={settings.businessPhone}
                  onChange={(e) => updateSettings({ businessPhone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Endereço</Label>
                <Input
                  id="businessAddress"
                  value={settings.businessAddress}
                  onChange={(e) => updateSettings({ businessAddress: e.target.value })}
                  placeholder="Rua, número, bairro"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Departamentos
            </CardTitle>
            <CardDescription>
              Ative ou desative os departamentos disponíveis no seu pet shop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => {
                const Icon = departmentIcons[dept.id];
                const isEnabled = isDepartmentEnabled(dept.id);
                
                return (
                  <div
                    key={dept.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      isEnabled
                        ? 'bg-secondary/50 border-primary/20'
                        : 'bg-muted/30 border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-background' : 'bg-muted'}`}>
                        <Icon className={`h-5 w-5 ${isEnabled ? departmentColors[dept.id] : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dept.services.length} serviços disponíveis
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleDepartment(dept.id)}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Integrações
            </CardTitle>
            <CardDescription>
              Configure as integrações com serviços externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n8nWebhook">URL do Webhook n8n (WhatsApp)</Label>
              <Input
                id="n8nWebhook"
                value={settings.n8nWebhookUrl}
                onChange={(e) => updateSettings({ n8nWebhookUrl: e.target.value })}
                placeholder="https://seu-n8n.com/webhook/..."
              />
              <p className="text-xs text-muted-foreground">
                Usado para enviar notificações via WhatsApp quando o pet estiver pronto
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
