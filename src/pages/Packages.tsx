import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { departments, getServicesByDepartment } from '@/data/departments';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Package,
  Plus,
  Calendar,
  Tag,
  Percent,
  ShoppingCart,
} from 'lucide-react';

// Mock packages
const mockPackages = [
  {
    id: '1',
    name: 'Plano Banho Mensal',
    description: '4 banhos por mês com desconto',
    serviceName: 'Banho',
    quantity: 4,
    validityDays: 30,
    originalPrice: 200,
    discountedPrice: 160,
    active: true,
  },
  {
    id: '2',
    name: 'Plano Banho + Tosa Premium',
    description: '4 banhos com tosa por mês',
    serviceName: 'Banho + Tosa',
    quantity: 4,
    validityDays: 30,
    originalPrice: 480,
    discountedPrice: 400,
    active: true,
  },
  {
    id: '3',
    name: 'Pacote Adestramento',
    description: '8 sessões de adestramento',
    serviceName: 'Sessão de Adestramento',
    quantity: 8,
    validityDays: 60,
    originalPrice: 960,
    discountedPrice: 800,
    active: true,
  },
];

// Mock sold packages
const mockSoldPackages = [
  {
    id: '1',
    packageName: 'Plano Banho Mensal',
    ownerName: 'Maria Silva',
    petName: 'Thor',
    remainingUses: 2,
    totalUses: 4,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    packageName: 'Plano Banho + Tosa Premium',
    ownerName: 'João Santos',
    petName: 'Luna',
    remainingUses: 3,
    totalUses: 4,
    expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Packages() {
  const { isDepartmentEnabled } = useSettings();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);

  const enabledDepartments = departments.filter((dept) =>
    isDepartmentEnabled(dept.id)
  );

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              Pacotes de Serviços
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie planos mensais e pacotes promocionais
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSellOpen} onOpenChange={setIsSellOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Vender Pacote
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vender Pacote</DialogTitle>
                  <DialogDescription>
                    Selecione o pacote e o cliente para realizar a venda
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Pacote</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o pacote" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPackages.filter(p => p.active).map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - R$ {pkg.discountedPrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tutor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Maria Silva</SelectItem>
                        <SelectItem value="2">João Santos</SelectItem>
                        <SelectItem value="3">Ana Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o pet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Thor</SelectItem>
                        <SelectItem value="2">Luna</SelectItem>
                        <SelectItem value="3">Bob</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSellOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsSellOpen(false)}>
                    Confirmar Venda
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Pacote
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Pacote</DialogTitle>
                  <DialogDescription>
                    Configure um novo pacote de serviços com desconto
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">Nome do Pacote</Label>
                    <Input id="packageName" placeholder="Ex: Plano Banho Mensal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Departamento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input id="quantity" type="number" placeholder="4" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validity">Validade (dias)</Label>
                      <Input id="validity" type="number" placeholder="30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Preço Original</Label>
                      <Input id="originalPrice" type="number" placeholder="200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Preço com Desconto</Label>
                      <Input id="discountedPrice" type="number" placeholder="160" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsCreateOpen(false)}>
                    Criar Pacote
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Available Packages */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Pacotes Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPackages.map((pkg) => {
              const discount = Math.round(
                ((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100
              );
              return (
                <Card
                  key={pkg.id}
                  variant="elevated"
                  className="hover:shadow-lg transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <Badge variant="success" className="gap-1">
                        <Percent className="h-3 w-3" />
                        {discount}% OFF
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Válido por {pkg.validityDays} dias</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{pkg.quantity}x {pkg.serviceName}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground line-through">
                            R$ {pkg.originalPrice.toFixed(2)}
                          </p>
                          <p className="text-xl font-bold text-success">
                            R$ {pkg.discountedPrice.toFixed(2)}
                          </p>
                        </div>
                        <Button size="sm" className="gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          Vender
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Active Customer Packages */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-accent" />
            Pacotes Ativos dos Clientes
          </h2>
          <div className="grid gap-4">
            {mockSoldPackages.map((sold) => (
              <Card key={sold.id} variant="elevated">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{sold.packageName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sold.ownerName} • {sold.petName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {sold.remainingUses}/{sold.totalUses}
                        </p>
                        <p className="text-xs text-muted-foreground">usos restantes</p>
                      </div>
                      <Badge variant="outline">
                        Expira em{' '}
                        {Math.ceil(
                          (new Date(sold.expiresAt).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        dias
                      </Badge>
                      <Button variant="outline" size="sm">
                        Usar Crédito
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
