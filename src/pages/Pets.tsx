import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PawPrint,
  Plus,
  Search,
  AlertTriangle,
  Heart,
  Camera,
  User,
  Calendar,
  Ruler,
} from 'lucide-react';

// Mock pets data
const mockPets = [
  {
    id: '1',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    size: 'large',
    birthDate: '2020-05-15',
    ownerName: 'Maria Silva',
    ownerPhone: '(11) 99999-9999',
    photoUrl: '',
    allergies: ['Shampoo comum'],
    behaviors: [{ type: 'friendly', notes: 'Muito dócil' }],
    notes: 'Adora brincar com água',
  },
  {
    id: '2',
    name: 'Luna',
    species: 'dog',
    breed: 'Shih Tzu',
    size: 'small',
    birthDate: '2021-08-20',
    ownerName: 'João Santos',
    ownerPhone: '(11) 98888-8888',
    photoUrl: '',
    allergies: [],
    behaviors: [{ type: 'fears_dryer', notes: 'Fica ansiosa com secador' }],
    notes: 'Precisa de paciência durante a tosa',
  },
  {
    id: '3',
    name: 'Bob',
    species: 'dog',
    breed: 'Labrador',
    size: 'large',
    birthDate: '2019-02-10',
    ownerName: 'Ana Costa',
    ownerPhone: '(11) 97777-7777',
    photoUrl: '',
    allergies: ['Carrapatos'],
    behaviors: [{ type: 'calm', notes: '' }],
    notes: '',
  },
  {
    id: '4',
    name: 'Mia',
    species: 'cat',
    breed: 'Persa',
    size: 'small',
    birthDate: '2022-01-05',
    ownerName: 'Pedro Oliveira',
    ownerPhone: '(11) 96666-6666',
    photoUrl: '',
    allergies: [],
    behaviors: [{ type: 'anxious', notes: 'Não gosta de barulho' }],
    notes: 'Manter em ambiente calmo',
  },
];

const behaviorLabels: Record<string, { label: string; color: string }> = {
  bites: { label: 'Morde', color: 'destructive' },
  fears_dryer: { label: 'Medo de secador', color: 'warning' },
  aggressive: { label: 'Agressivo', color: 'destructive' },
  anxious: { label: 'Ansioso', color: 'warning' },
  calm: { label: 'Calmo', color: 'success' },
  friendly: { label: 'Amigável', color: 'success' },
};

const sizeLabels: Record<string, string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
  giant: 'Gigante',
};

const speciesLabels: Record<string, string> = {
  dog: 'Cachorro',
  cat: 'Gato',
  bird: 'Pássaro',
  other: 'Outro',
};

export default function Pets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPets = mockPets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <PawPrint className="h-8 w-8 text-primary" />
              Pets
            </h1>
            <p className="text-muted-foreground mt-1">
              Prontuário digital de todos os pets
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Pet</DialogTitle>
                <DialogDescription>
                  Preencha as informações do pet para criar o prontuário digital
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petName">Nome do Pet</Label>
                    <Input id="petName" placeholder="Nome" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="species">Espécie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Cachorro</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                        <SelectItem value="bird">Pássaro</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça</Label>
                    <Input id="breed" placeholder="Raça do pet" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Porte</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                        <SelectItem value="giant">Gigante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Input id="allergies" placeholder="Separe por vírgula" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="behaviors">Comportamentos</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar comportamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bites">Morde</SelectItem>
                      <SelectItem value="fears_dryer">Medo de secador</SelectItem>
                      <SelectItem value="anxious">Ansioso</SelectItem>
                      <SelectItem value="calm">Calmo</SelectItem>
                      <SelectItem value="friendly">Amigável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" placeholder="Informações adicionais sobre o pet" />
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
                placeholder="Buscar por nome do pet, raça ou tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
            <Card
              key={pet.id}
              variant="elevated"
              className="hover:shadow-lg transition-all cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    {pet.photoUrl ? (
                      <AvatarImage src={pet.photoUrl} alt={pet.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        <PawPrint className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {speciesLabels[pet.species]}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {sizeLabels[pet.size]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{pet.ownerName}</span>
                </div>

                {/* Allergies */}
                {pet.allergies.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 text-sm text-destructive mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Alergias:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pet.allergies.map((allergy, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Behaviors */}
                {pet.behaviors.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {pet.behaviors.map((behavior, idx) => {
                        const info = behaviorLabels[behavior.type];
                        return (
                          <Badge
                            key={idx}
                            variant={info?.color as any}
                            className="text-xs"
                          >
                            {info?.label || behavior.type}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {pet.notes && (
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    "{pet.notes}"
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Camera className="h-3 w-3" />
                    Fotos
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Heart className="h-3 w-3" />
                    Histórico
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
