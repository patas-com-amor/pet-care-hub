import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock financial data
const mockServiceRevenue = [
  { department: 'Estética', revenue: 8500, services: 85 },
  { department: 'Saúde', revenue: 4200, services: 28 },
  { department: 'Educação', revenue: 1800, services: 15 },
  { department: 'Estadia', revenue: 2400, services: 30 },
  { department: 'Logística', revenue: 520, services: 13 },
];

const mockProductRevenue = [
  { category: 'Rações', revenue: 3200, quantity: 45 },
  { category: 'Petiscos', revenue: 1100, quantity: 88 },
  { category: 'Acessórios', revenue: 850, quantity: 32 },
  { category: 'Medicamentos', revenue: 1500, quantity: 24 },
  { category: 'Higiene', revenue: 620, quantity: 41 },
];

const mockTransactions = [
  {
    id: '1',
    type: 'income',
    category: 'service',
    description: 'Banho + Tosa - Thor',
    amount: 120,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'income',
    category: 'product',
    description: 'Ração Golden - 15kg',
    amount: 189,
    date: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'expense',
    category: 'commission',
    description: 'Comissão - Carlos Silva',
    amount: 45,
    date: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'income',
    category: 'package',
    description: 'Plano Banho Mensal - Maria Silva',
    amount: 160,
    date: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '5',
    type: 'income',
    category: 'service',
    description: 'Consulta Veterinária - Luna',
    amount: 150,
    date: subDays(new Date(), 1).toISOString(),
  },
];

const totalServiceRevenue = mockServiceRevenue.reduce((sum, item) => sum + item.revenue, 0);
const totalProductRevenue = mockProductRevenue.reduce((sum, item) => sum + item.revenue, 0);
const totalRevenue = totalServiceRevenue + totalProductRevenue;
const totalExpenses = mockTransactions
  .filter((t) => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);

export default function Financial() {
  const [period, setPeriod] = useState('month');

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-success" />
              Financeiro
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral das receitas e despesas
            </p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    R$ {totalRevenue.toLocaleString('pt-BR')}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+12% vs. mês anterior</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Serviços</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    R$ {totalServiceRevenue.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {mockServiceRevenue.reduce((sum, i) => sum + i.services, 0)} serviços
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Produtos</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    R$ {totalProductRevenue.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {mockProductRevenue.reduce((sum, i) => sum + i.quantity, 0)} itens vendidos
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10">
                  <ShoppingBag className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Despesas</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    R$ {totalExpenses.toLocaleString('pt-BR')}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>Comissões + Custos</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Receita por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServiceRevenue.map((item, idx) => {
                    const percentage = Math.round((item.revenue / totalServiceRevenue) * 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.department}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.services} serviços
                            </Badge>
                          </div>
                          <span className="font-semibold text-foreground">
                            R$ {item.revenue.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Receita por Categoria de Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProductRevenue.map((item, idx) => {
                    const percentage = Math.round((item.revenue / totalProductRevenue) * 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.category}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.quantity} vendidos
                            </Badge>
                          </div>
                          <span className="font-semibold text-foreground">
                            R$ {item.revenue.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Últimas Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === 'income'
                              ? 'bg-success/10'
                              : 'bg-destructive/10'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <ArrowUpRight
                              className="h-4 w-4 text-success"
                            />
                          ) : (
                            <ArrowDownRight
                              className="h-4 w-4 text-destructive"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.date), "d 'de' MMMM 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          transaction.type === 'income'
                            ? 'text-success'
                            : 'text-destructive'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'} R${' '}
                        {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
