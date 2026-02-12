
-- Add 'produtos' to department_id enum
ALTER TYPE public.department_id ADD VALUE IF NOT EXISTS 'produtos';

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  price NUMERIC NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create product_sales table
CREATE TABLE public.product_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  owner_id UUID REFERENCES public.owners(id),
  pet_id UUID REFERENCES public.pets(id),
  employee_id UUID REFERENCES public.employees(id),
  payment_method TEXT,
  notes TEXT,
  transaction_id UUID REFERENCES public.transactions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view product_sales" ON public.product_sales FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert product_sales" ON public.product_sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update product_sales" ON public.product_sales FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete product_sales" ON public.product_sales FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
