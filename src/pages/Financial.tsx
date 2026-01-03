import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactions, useFinancialSummary } from '@/hooks/useTransactions';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Financial() {
  const [period, setPeriod] = useState('month');

  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) };
      case 'month':
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [period]);

  const { data: transactions, isLoading: loadingTransactions } = useTransactions();
  const { data: summary, isLoading: loadingSummary } = useFinancialSummary(
    dateRange.start.toISOString(),
    dateRange.end.toISOString()
  );

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
    });
  }, [transactions, dateRange]);

  // Calculate revenue by category
  const revenueByCategory = useMemo(() => {
    const categories: Record<string, { revenue: number; count: number }> = {};
    filteredTransactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        const category = t.category;
        if (!categories[category]) {
          categories[category] = { revenue: 0, count: 0 };
        }
        categories[category].revenue += Number(t.amount);
        categories[category].count += 1;
      });
    return Object.entries(categories).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [filteredTransactions]);

  const categoryLabels: Record<string, string> = {
    service: 'Serviços',
    product: 'Produtos',
    package: 'Pacotes',
    commission: 'Comissões',
    other: 'Outros',
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;

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
        {loadingSummary ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-success text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>{filteredTransactions.filter(t => t.type === 'income').length} transações</span>
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
                      R$ {(revenueByCategory.find(c => c.category === 'service')?.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {revenueByCategory.find(c => c.category === 'service')?.count || 0} serviços
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
                    <p className="text-sm text-muted-foreground">Receita Pacotes</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      R$ {(revenueByCategory.find(c => c.category === 'package')?.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {revenueByCategory.find(c => c.category === 'package')?.count || 0} pacotes vendidos
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
                      R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
        )}

        {/* Revenue Breakdown */}
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueByCategory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma transação no período selecionado
                  </p>
                ) : (
                  <div className="space-y-4">
                    {revenueByCategory.map((item, idx) => {
                      const percentage = totalIncome > 0 
                        ? Math.round((item.revenue / totalIncome) * 100)
                        : 0;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {categoryLabels[item.category] || item.category}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {item.count} transações
                              </Badge>
                            </div>
                            <span className="font-semibold text-foreground">
                              R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Últimas Transações</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTransactions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma transação no período selecionado
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredTransactions.slice(0, 20).map((transaction) => (
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
                              <ArrowUpRight className="h-4 w-4 text-success" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(transaction.date), "d 'de' MMMM", {
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
                          {Number(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
