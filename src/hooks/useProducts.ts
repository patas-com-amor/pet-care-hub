import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSale {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  owner_id: string | null;
  pet_id: string | null;
  employee_id: string | null;
  payment_method: string | null;
  notes: string | null;
  transaction_id: string | null;
  created_at: string;
}

export interface ProductSaleWithDetails extends ProductSale {
  products: { name: string; category: string } | null;
  owners: { name: string } | null;
  pets: { name: string } | null;
  employees: { name: string } | null;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as Product[];
    },
  });
}

export function useProductSales() {
  return useQuery({
    queryKey: ['product_sales'],
    queryFn: async (): Promise<ProductSaleWithDetails[]> => {
      const { data, error } = await supabase
        .from('product_sales')
        .select(`
          *,
          products (name, category),
          owners (name),
          pets (name),
          employees (name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ProductSaleWithDetails[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto cadastrado com sucesso!');
    },
    onError: (error) => toast.error('Erro ao cadastrar produto: ' + error.message),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => toast.error('Erro ao atualizar produto: ' + error.message),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto removido com sucesso!');
    },
    onError: (error) => toast.error('Erro ao remover produto: ' + error.message),
  });
}

export function useCreateProductSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sale: {
      product_id: string;
      quantity: number;
      unit_price: number;
      total_amount: number;
      owner_id?: string | null;
      pet_id?: string | null;
      employee_id?: string | null;
      payment_method: string;
      notes?: string;
      product_name: string;
    }) => {
      // 1. Create the transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          type: 'income' as const,
          category: 'product' as const,
          description: `Venda: ${sale.quantity}x ${sale.product_name}`,
          amount: sale.total_amount,
          payment_method: sale.payment_method,
          employee_id: sale.employee_id || null,
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Create the sale record
      const { data: saleData, error: saleError } = await supabase
        .from('product_sales')
        .insert({
          product_id: sale.product_id,
          quantity: sale.quantity,
          unit_price: sale.unit_price,
          total_amount: sale.total_amount,
          owner_id: sale.owner_id || null,
          pet_id: sale.pet_id || null,
          employee_id: sale.employee_id || null,
          payment_method: sale.payment_method,
          notes: sale.notes || null,
          transaction_id: transaction.id,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 3. Update stock
      const { error: stockError } = await supabase.rpc('update_product_stock' as any, {
        _product_id: sale.product_id,
        _quantity: sale.quantity,
      });

      // If RPC doesn't exist, update directly
      if (stockError) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', sale.product_id)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stock_quantity: Math.max(0, (product as any).stock_quantity - sale.quantity) })
            .eq('id', sale.product_id);
        }
      }

      return saleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product_sales'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Venda registrada com sucesso!');
    },
    onError: (error) => toast.error('Erro ao registrar venda: ' + error.message),
  });
}
