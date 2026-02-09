import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, PawPrint, Briefcase, CreditCard } from 'lucide-react';
import type { TransactionWithDetails } from '@/hooks/useTransactions';

const categoryLabels: Record<string, string> = {
  service: 'Serviço',
  product: 'Produto',
  package: 'Pacote',
  commission: 'Comissão',
  other: 'Outros',
};

const paymentMethodLabels: Record<string, string> = {
  debito: 'Débito',
  credito: 'Crédito',
  pix: 'Pix',
  dinheiro: 'Dinheiro',
};

interface TransactionDetailCardProps {
  transaction: TransactionWithDetails;
  onClose: () => void;
}

export default function TransactionDetailCard({ transaction, onClose }: TransactionDetailCardProps) {
  const appointment = transaction.appointments;
  const petName = appointment?.pets?.name;
  const ownerName = appointment?.owners?.name;
  const serviceName = appointment?.services?.name;
  const employeeName = transaction.employees?.name;

  return (
    <Card variant="elevated" className="border-primary/20 animate-fade-in">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Detalhes da Transação</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ownerName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tutor:</span>
            <span className="font-medium text-foreground">{ownerName}</span>
          </div>
        )}
        {petName && (
          <div className="flex items-center gap-2 text-sm">
            <PawPrint className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Pet:</span>
            <span className="font-medium text-foreground">{petName}</span>
          </div>
        )}
        {serviceName && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-medium text-foreground">{serviceName}</span>
          </div>
        )}
        {employeeName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Funcionário:</span>
            <span className="font-medium text-foreground">{employeeName}</span>
          </div>
        )}
        {transaction.payment_method && (
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Pagamento:</span>
            <Badge variant="secondary">
              {paymentMethodLabels[transaction.payment_method] || transaction.payment_method}
            </Badge>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Categoria:</span>
          <Badge variant="outline">
            {categoryLabels[transaction.category] || transaction.category}
          </Badge>
        </div>
        {!appointment && (
          <p className="text-xs text-muted-foreground italic">
            Transação sem agendamento vinculado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
