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
} from 'lucide-react';

// Mock owners data
const mockOwners = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    whatsapp: '5511999999999',
    address: 'Rua das Flores, 123 - Centro',
    cpf: '123.456.789-00',
    pets: ['Thor'],
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 98888-8888',
    whatsapp: '5511988888888',
    address: 'Av. Brasil, 456 - Jardins',
    cpf: '987.654.321-00',
    pets: ['Luna', 'Max'],
    createdAt: '2023-03-20',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 97777-7777',
    whatsapp: '5511977777777',
    address: 'Rua do Comércio, 789 - Vila Nova',
    cpf: '456.789.123-00',
    pets: ['Bob'],
    createdAt: '2023-05-10',
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    phone: '(11) 96666-6666',
    whatsapp: '5511966666666',
    address: 'Alameda Santos, 321 - Paulista',
    cpf: '321.654.987-00',
    pets: ['Mia', 'Nina'],
    createdAt: '2023-07-05',
  },
];

export default function Owners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredOwners = mockOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone.includes(searchTerm)
  );

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
                    <Label htmlFor="ownerName">Nome Completo</Label>
                    <Input id="ownerName" placeholder="Nome do tutor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" placeholder="5500000000000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="Rua, número, bairro" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
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

        {/* Owners Grid */}
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
                      <span>{owner.pets.length} pet(s)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{owner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{owner.address}</span>
                  </div>
                </div>

                {/* Pets */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Pets:</p>
                  <div className="flex flex-wrap gap-1">
                    {owner.pets.map((pet, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {pet}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
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
      </div>
    </MainLayout>
  );
}
