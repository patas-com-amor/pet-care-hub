import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  usePendingPayments,
  useConfirmPayment,
  type PendingPaymentAppointment,
  type PaymentMethod,
} from '@/hooks/usePendingPayments';
import {
  PawPrint,
  User,
  Scissors,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Loader2,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'debito', label: 'Débito', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'credito', label: 'Crédito', icon: <Wallet className="h-4 w-4" /> },
  { value: 'pix', label: 'Pix', icon: <Smartphone className="h-4 w-4" /> },
  { value: 'dinheiro', label: 'Dinheiro', icon: <Banknote className="h-4 w-4" /> },
];

export default function PendingPaymentCards() {
  const { data: pendingPayments, isLoading } = usePendingPayments();
  const confirmPayment = useConfirmPayment();
  const [selectedAppointment, setSelectedAppointment] = useState<PendingPaymentAppointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const handleConfirmPayment = () => {
    if (!selectedAppointment) return;
    confirmPayment.mutate(
      {
        appointmentId: selectedAppointment.id,
        price: selectedAppointment.price,
        serviceName: selectedAppointment.services?.name || 'Serviço',
        employeeId: selectedAppointment.employee_id,
        paymentMethod,
      },
      { onSuccess: () => setSelectedAppointment(null) }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!pendingPayments || pendingPayments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhum pagamento pendente
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingPayments.map((appointment) => (
          <Card key={appointment.id} className="border-warning/30 bg-warning/5">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Pagamento Pendente
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {appointment.check_out_at
                    ? format(new Date(appointment.check_out_at), "dd/MM HH:mm", { locale: ptBR })
                    : ''}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    {appointment.pets?.name || 'Pet'}
                  </span>
                  {appointment.pets?.breed && (
                    <span className="text-xs text-muted-foreground">
                      ({appointment.pets.breed})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {appointment.owners?.name || 'Tutor'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {appointment.services?.name || 'Serviço'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xl font-bold text-foreground">
                  R$ {Number(appointment.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setPaymentMethod('pix');
                  }}
                >
                  Pagamento Efetuado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Pagamento</DialogTitle>
            <DialogDescription>
              {selectedAppointment?.pets?.name} — R${' '}
              {Number(selectedAppointment?.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label className="text-sm font-medium mb-3 block">
              Forma de Pagamento
            </Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              className="grid grid-cols-2 gap-3"
            >
              {paymentMethods.map((method) => (
                <Label
                  key={method.value}
                  htmlFor={method.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-secondary/50'
                  }`}
                >
                  <RadioGroupItem value={method.value} id={method.value} />
                  {method.icon}
                  <span className="text-sm font-medium">{method.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAppointment(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={confirmPayment.isPending}
            >
              {confirmPayment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
