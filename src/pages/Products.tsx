import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProductSales,
  useCreateProductSale,
  Product,
} from '@/hooks/useProducts';
import { useOwners } from '@/hooks/useOwners';
import { usePets } from '@/hooks/usePets';
import { useEmployees } from '@/hooks/useEmployees';
import {
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  Loader2,
  Package,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const productCategories = [
  'Alimentação',
  'Higiene',
  'Acessórios',
  'Brinquedos',
  'Medicamentos',
  'Roupas',
  'Camas e Casas',
  'Outros',
];

const paymentMethods = [
  { value: 'pix', label: 'Pix' },
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'dinheiro', label: 'Dinheiro' },
];

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const { data: sales, isLoading: loadingSales } = useProductSales();
  const { data: owners } = useOwners();
  const { data: pets } = usePets();
  const { data: employees } = useEmployees();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createSale = useCreateProductSale();

  const [search, setSearch] = useState('');
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Outros',
    price: '',
    stock_quantity: '',
  });
  const [saleForm, setSaleForm] = useState({
    product_id: '',
    quantity: '1',
    owner_id: '',
    pet_id: '',
    employee_id: '',
    payment_method: 'pix',
    notes: '',
  });

  const filteredProducts = (products || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const resetProductForm = () => {
    setProductForm({ name: '', category: 'Outros', price: '', stock_quantity: '' });
    setEditingProduct(null);
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price) {
      toast.error('Preencha nome e valor do produto');
      return;
    }
    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock_quantity: Number(productForm.stock_quantity) || 0,
      });
    } else {
      await createProduct.mutateAsync({
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock_quantity: Number(productForm.stock_quantity) || 0,
        active: true,
      });
    }
    setProductDialogOpen(false);
    resetProductForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const selectedSaleProduct = (products || []).find(p => p.id === saleForm.product_id);
  const saleTotal = selectedSaleProduct
    ? selectedSaleProduct.price * Number(saleForm.quantity || 0)
    : 0;

  const filteredSalePets = saleForm.owner_id
    ? (pets || []).filter(p => p.owner_id === saleForm.owner_id)
    : [];

  const handleSaleSubmit = async () => {
    if (!saleForm.product_id || !saleForm.payment_method) {
      toast.error('Selecione o produto e forma de pagamento');
      return;
    }
    const product = (products || []).find(p => p.id === saleForm.product_id);
    if (!product) return;

    await createSale.mutateAsync({
      product_id: saleForm.product_id,
      quantity: Number(saleForm.quantity),
      unit_price: product.price,
      total_amount: saleTotal,
      owner_id: saleForm.owner_id || null,
      pet_id: saleForm.pet_id || null,
      employee_id: saleForm.employee_id || null,
      payment_method: saleForm.payment_method,
      notes: saleForm.notes || undefined,
      product_name: product.name,
    });
    setSaleDialogOpen(false);
    setSaleForm({
      product_id: '',
      quantity: '1',
      owner_id: '',
      pet_id: '',
      employee_id: '',
      payment_method: 'pix',
      notes: '',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Produtos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie produtos e registre vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Nova Venda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Venda</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Produto *</Label>
                    <Select value={saleForm.product_id} onValueChange={(v) => setSaleForm(f => ({ ...f, product_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                      <SelectContent>
                        {(products || []).filter(p => p.active).map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} - R$ {Number(p.price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={saleForm.quantity}
                      onChange={(e) => setSaleForm(f => ({ ...f, quantity: e.target.value }))}
                    />
                  </div>
                  {selectedSaleProduct && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total:</p>
                      <p className="text-2xl font-bold text-foreground">
                        R$ {saleTotal.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Forma de Pagamento *</Label>
                    <Select value={saleForm.payment_method} onValueChange={(v) => setSaleForm(f => ({ ...f, payment_method: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tutor (opcional)</Label>
                    <Select value={saleForm.owner_id} onValueChange={(v) => setSaleForm(f => ({ ...f, owner_id: v, pet_id: '' }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                      <SelectContent>
                        {(owners || []).map(o => (
                          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {filteredSalePets.length > 0 && (
                    <div className="space-y-2">
                      <Label>Pet (opcional)</Label>
                      <Select value={saleForm.pet_id} onValueChange={(v) => setSaleForm(f => ({ ...f, pet_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                        <SelectContent>
                          {filteredSalePets.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Vendedor (opcional)</Label>
                    <Select value={saleForm.employee_id} onValueChange={(v) => setSaleForm(f => ({ ...f, employee_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                      <SelectContent>
                        {(employees || []).filter(e => e.active).map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Observações da venda..."
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSaleSubmit}
                    disabled={createSale.isPending}
                  >
                    {createSale.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                    Registrar Venda - R$ {saleTotal.toFixed(2)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={productDialogOpen} onOpenChange={(open) => { setProductDialogOpen(open); if (!open) resetProductForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={productForm.category} onValueChange={(v) => setProductForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {productCategories.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estoque</Label>
                      <Input
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleProductSubmit}
                    disabled={createProduct.isPending || updateProduct.isPending}
                  >
                    {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card variant="elevated">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum produto cadastrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} variant="elevated" className="relative">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                          <Badge variant="secondary" className="mt-1 text-xs">{product.category}</Badge>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditProduct(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            R$ {Number(product.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estoque: {product.stock_quantity}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => {
                            setSaleForm(f => ({ ...f, product_id: product.id }));
                            setSaleDialogOpen(true);
                          }}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Vender
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sales">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSales ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !sales || sales.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma venda registrada</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Qtd</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Tutor</TableHead>
                          <TableHead>Vendedor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(sale.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{sale.products?.name}</p>
                                <p className="text-xs text-muted-foreground">{sale.products?.category}</p>
                              </div>
                            </TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell className="font-semibold text-success">
                              R$ {Number(sale.total_amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {{ pix: 'Pix', debito: 'Débito', credito: 'Crédito', dinheiro: 'Dinheiro' }[sale.payment_method || ''] || sale.payment_method}
                              </Badge>
                            </TableCell>
                            <TableCell>{sale.owners?.name || '-'}</TableCell>
                            <TableCell>{sale.employees?.name || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
