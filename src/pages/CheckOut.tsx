import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import {
  LogOut,
  Search,
  PawPrint,
  Clock,
  User,
  Camera,
  Upload,
  Send,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock appointments in progress
const mockInProgress = [
  {
    id: '1',
    petName: 'Thor',
    petBreed: 'Golden Retriever',
    ownerName: 'Maria Silva',
    ownerWhatsapp: '5511999999999',
    service: 'Banho + Tosa',
    department: 'estetica',
    checkInAt: new Date(Date.now() - 3600000).toISOString(),
    price: 120,
  },
  {
    id: '3',
    petName: 'Bob',
    petBreed: 'Labrador',
    ownerName: 'Ana Costa',
    ownerWhatsapp: '5511977777777',
    service: 'Daycare',
    department: 'estadia',
    checkInAt: new Date(Date.now() - 7200000).toISOString(),
    price: 80,
  },
];

export default function CheckOut() {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockInProgress[0] | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAppointments = mockInProgress.filter(
    (apt) =>
      apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedAppointment) return;
    
    setIsProcessing(true);

    try {
      // Send notification via n8n webhook
      const response = await fetch(settings.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'checkout',
          petName: selectedAppointment.petName,
          ownerName: selectedAppointment.ownerName,
          ownerWhatsapp: selectedAppointment.ownerWhatsapp,
          service: selectedAppointment.service,
          afterPhoto: afterPhoto,
          notes: notes,
          checkoutAt: new Date().toISOString(),
        }),
      });

      toast.success(`Check-out realizado para ${selectedAppointment.petName}!`, {
        description: 'Notificação enviada ao tutor via WhatsApp.',
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      toast.success(`Check-out realizado para ${selectedAppointment.petName}!`, {
        description: 'Notificação via WhatsApp não pôde ser enviada.',
      });
    }

    setIsProcessing(false);
    setSelectedAppointment(null);
    setAfterPhoto(null);
    setNotes('');
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <LogOut className="h-8 w-8 text-accent" />
            Check-out
          </h1>
          <p className="text-muted-foreground mt-1">
            Finalize o atendimento e notifique o tutor
          </p>
        </div>

        {/* Search */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do pet ou tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Em Atendimento ({filteredAppointments.length})
          </h2>

          {filteredAppointments.length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum atendimento em andamento
              </h3>
              <p className="text-muted-foreground">
                Não há pets aguardando check-out no momento
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  variant="elevated"
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-accent/20">
                          <AvatarFallback className="bg-accent/10 text-accent">
                            <PawPrint className="h-7 w-7" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {appointment.petName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.petBreed}
                          </p>
                          <Badge variant={appointment.department as any} className="mt-1">
                            {appointment.service}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{appointment.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Check-in às{' '}
                              {format(new Date(appointment.checkInAt), 'HH:mm', {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">
                            R$ {appointment.price.toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="accent"
                          size="lg"
                          className="gap-2"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Camera className="h-4 w-4" />
                          Check-out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Check-out Dialog */}
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Check-out - {selectedAppointment?.petName}</DialogTitle>
              <DialogDescription>
                Faça upload da foto do pet e envie uma notificação ao tutor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Photo Upload */}
              <div className="space-y-3">
                <Label>Foto do Pet (Depois do Banho)</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                {afterPhoto ? (
                  <div className="relative">
                    <img
                      src={afterPhoto}
                      alt="Foto do pet"
                      className="w-full h-64 object-cover rounded-lg border-2 border-primary/20"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Trocar Foto
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para fazer upload da foto
                    </span>
                  </button>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Alguma observação sobre o atendimento..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="font-medium">{selectedAppointment?.service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tutor:</span>
                  <span className="font-medium">{selectedAppointment?.ownerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-semibold text-success">
                    R$ {selectedAppointment?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Finalizar e Notificar
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
