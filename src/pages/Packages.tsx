import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { useServices } from '@/hooks/useServices';
import { useOwners } from '@/hooks/useOwners';
import { usePets } from '@/hooks/usePets';
import {
  useServicePackages,
  useCustomerPackages,
  useCreateServicePackage,
  useSellPackage,
} from '@/hooks/usePackages';
import {
  Package,
  Plus,
  Calendar,
  Tag,
  Percent,
  ShoppingCart,
  Loader2,
} from 'lucide-react';

export default function Packages() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  
  // Form states for create
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    service_id: '',
    quantity: 4,
    validity_days: 30,
    original_price: 0,
    discounted_price: 0,
    active: true,
  });
  
  // Form states for sell
  const [sellForm, setSellForm] = useState({
    package_id: '',
    owner_id: '',
    pet_id: '',
  });

  const { data: services } = useServices();
  const { data: owners } = useOwners();
  const { data: pets } = usePets();
  const { data: servicePackages, isLoading: loadingPackages } = useServicePackages();
  const { data: customerPackages, isLoading: loadingCustomer } = useCustomerPackages();
  
  const createPackageMutation = useCreateServicePackage();
  const sellPackageMutation = useSellPackage();

  // Filter pets by selected owner
  const filteredPets = sellForm.owner_id 
    ? (pets || []).filter(p => p.owner_id === sellForm.owner_id)
    : [];

  const handleCreatePackage = async () => {
    if (!newPackage.name || !newPackage.service_id) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await createPackageMutation.mutateAsync(newPackage);
      toast.success('Pacote criado com sucesso!');
      setIsCreateOpen(false);
      setNewPackage({
        name: '',
        description: '',
        service_id: '',
        quantity: 4,
        validity_days: 30,
        original_price: 0,
        discounted_price: 0,
        active: true,
      });
    } catch (error) {
      toast.error('Erro ao criar pacote');
    }
  };

  const handleSellPackage = async () => {
    if (!sellForm.package_id || !sellForm.owner_id || !sellForm.pet_id) {
      toast.error('Preencha todos os campos');
      return;
    }

    const selectedPackage = servicePackages?.find(p => p.id === sellForm.package_id);
    if (!selectedPackage) return;

    try {
      await sellPackageMutation.mutateAsync({
        package_id: sellForm.package_id,
        owner_id: sellForm.owner_id,
        pet_id: sellForm.pet_id,
        remaining_uses: selectedPackage.quantity,
        expires_at: new Date(Date.now() + selectedPackage.validity_days * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast.success('Pacote vendido com sucesso!');
      setIsSellOpen(false);
      setSellForm({ package_id: '', owner_id: '', pet_id: '' });
    } catch (error) {
      toast.error('Erro ao vender pacote');
    }
  };

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
                    <Select
                      value={sellForm.package_id}
                      onValueChange={(v) => setSellForm({ ...sellForm, package_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o pacote" />
                      </SelectTrigger>
                      <SelectContent>
                        {(servicePackages || []).filter(p => p.active).map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - R$ {Number(pkg.discounted_price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tutor</Label>
                    <Select
                      value={sellForm.owner_id}
                      onValueChange={(v) => setSellForm({ ...sellForm, owner_id: v, pet_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {(owners || []).map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pet</Label>
                    <Select
                      value={sellForm.pet_id}
                      onValueChange={(v) => setSellForm({ ...sellForm, pet_id: v })}
                      disabled={!sellForm.owner_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={sellForm.owner_id ? "Selecione o pet" : "Selecione um tutor primeiro"} />
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSellOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSellPackage}
                    disabled={sellPackageMutation.isPending}
                  >
                    {sellPackageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
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
                    <Input 
                      id="packageName" 
                      placeholder="Ex: Plano Banho Mensal" 
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descrição do pacote..." 
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Serviço</Label>
                    <Select
                      value={newPackage.service_id}
                      onValueChange={(v) => setNewPackage({ ...newPackage, service_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {(services || []).filter(s => s.active).map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {Number(service.price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        placeholder="4" 
                        value={newPackage.quantity}
                        onChange={(e) => setNewPackage({ ...newPackage, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validity">Validade (dias)</Label>
                      <Input 
                        id="validity" 
                        type="number" 
                        placeholder="30" 
                        value={newPackage.validity_days}
                        onChange={(e) => setNewPackage({ ...newPackage, validity_days: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Preço Original</Label>
                      <Input 
                        id="originalPrice" 
                        type="number" 
                        placeholder="200" 
                        value={newPackage.original_price}
                        onChange={(e) => setNewPackage({ ...newPackage, original_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Preço com Desconto</Label>
                      <Input 
                        id="discountedPrice" 
                        type="number" 
                        placeholder="160" 
                        value={newPackage.discounted_price}
                        onChange={(e) => setNewPackage({ ...newPackage, discounted_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreatePackage}
                    disabled={createPackageMutation.isPending}
                  >
                    {createPackageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
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
          
          {loadingPackages ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (servicePackages || []).length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum pacote cadastrado
              </h3>
              <p className="text-muted-foreground">
                Crie seu primeiro pacote de serviços clicando em "Novo Pacote"
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(servicePackages || []).map((pkg) => {
                const discount = pkg.original_price > 0 
                  ? Math.round(((Number(pkg.original_price) - Number(pkg.discounted_price)) / Number(pkg.original_price)) * 100)
                  : 0;
                return (
                  <Card
                    key={pkg.id}
                    variant="elevated"
                    className="hover:shadow-lg transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        {discount > 0 && (
                          <Badge variant="success" className="gap-1">
                            <Percent className="h-3 w-3" />
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Válido por {pkg.validity_days} dias</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>{pkg.quantity}x {pkg.services?.name || 'Serviço'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div>
                            {Number(pkg.original_price) > Number(pkg.discounted_price) && (
                              <p className="text-sm text-muted-foreground line-through">
                                R$ {Number(pkg.original_price).toFixed(2)}
                              </p>
                            )}
                            <p className="text-xl font-bold text-success">
                              R$ {Number(pkg.discounted_price).toFixed(2)}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            className="gap-1"
                            onClick={() => {
                              setSellForm({ ...sellForm, package_id: pkg.id });
                              setIsSellOpen(true);
                            }}
                          >
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
          )}
        </div>

        {/* Active Customer Packages */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-accent" />
            Pacotes Ativos dos Clientes
          </h2>
          
          {loadingCustomer ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (customerPackages || []).length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum pacote vendido
              </h3>
              <p className="text-muted-foreground">
                Os pacotes vendidos aos clientes aparecerão aqui
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {(customerPackages || []).map((sold) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(sold.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                const isExpired = daysUntilExpiry < 0;
                
                return (
                  <Card key={sold.id} variant="elevated">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {sold.service_packages?.name || 'Pacote'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {sold.owners?.name || 'Tutor'} • {sold.pets?.name || 'Pet'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                              {sold.remaining_uses}/{sold.service_packages?.quantity || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">usos restantes</p>
                          </div>
                          <Badge variant={isExpired ? "destructive" : "outline"}>
                            {isExpired 
                              ? 'Expirado'
                              : `Expira em ${daysUntilExpiry} dias`
                            }
                          </Badge>
                          <Button variant="outline" size="sm" disabled={isExpired || sold.remaining_uses === 0}>
                            Usar Crédito
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
