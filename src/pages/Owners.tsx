import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  PawPrint,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { useOwners, useCreateOwner } from '@/hooks/useOwners';
import { Skeleton } from '@/components/ui/skeleton';

export default function Owners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    cpf: '',
  });

  const { data: owners = [], isLoading } = useOwners();
  const createOwner = useCreateOwner();

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (owner.phone?.includes(searchTerm) ?? false)
  );

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    
    await createOwner.mutateAsync({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      whatsapp: formData.whatsapp || null,
      address: formData.address || null,
      cpf: formData.cpf || null,
    });
    
    setFormData({ name: '', email: '', phone: '', whatsapp: '', address: '', cpf: '' });
    setIsDialogOpen(false);
  };

  const handleWhatsApp = (whatsapp: string | null) => {
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp}`, '_blank');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Tutores
            </h1>
            <p className="text-muted-foreground mt-1">
              Cadastro de tutores e seus pets
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Tutor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Tutor</DialogTitle>
                <DialogDescription>
                  Preencha as informações do tutor
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nome Completo *</Label>
                    <Input 
                      id="ownerName" 
                      placeholder="Nome do tutor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input 
                      id="cpf" 
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    placeholder="5500000000000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    placeholder="Rua, número, bairro"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.name.trim() || createOwner.isPending}
                >
                  {createOwner.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOwners.length === 0 ? (
          <Card variant="bordered" className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'Nenhum tutor encontrado' : 'Nenhum tutor cadastrado'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente ajustar a busca' : 'Clique em "Novo Tutor" para cadastrar'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOwners.map((owner) => (
              <Card
                key={owner.id}
                variant="elevated"
                className="hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {owner.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">
                        {owner.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <PawPrint className="h-3 w-3" />
                        <span>{owner.pets?.length || 0} pet(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {owner.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                    {owner.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{owner.email}</span>
                      </div>
                    )}
                    {owner.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{owner.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Pets */}
                  {owner.pets && owner.pets.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Pets:</p>
                      <div className="flex flex-wrap gap-1">
                        {owner.pets.map((pet) => (
                          <Badge key={pet.id} variant="secondary" className="text-xs">
                            {pet.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => handleWhatsApp(owner.whatsapp)}
                      disabled={!owner.whatsapp}
                    >
                      <MessageCircle className="h-3 w-3" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
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
