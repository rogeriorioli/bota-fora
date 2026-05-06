'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Loader2,
  DollarSign,
  User,
  Phone,
  Image as ImageIcon,
  Upload,
  ArrowLeft,
  Sparkles,
  Edit2,
  Trash2,
  HandCoins,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileToBase64, compressImage } from '@/lib/image-utils';

export default function AdminPage() {
  const formatImageSrc = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    // Assume it's a cleaned base64 if it doesn't have a header
    return `data:image/jpeg;base64,${src}`;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'new-product' | 'offers'>('orders');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState<{
    title: string;
    price: string;
    description: string;
    images: string[];
    status: string;
  }>({
    title: '',
    price: '',
    description: '',
    images: [],
    status: 'disponível'
  });

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('admin-token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchData(savedToken);
    }
  }, []);

  const fetchData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes, offersRes] = await Promise.all([
        fetch('/api/admin/orders', { headers: { 'x-admin-token': authToken } }),
        fetch('/api/products'),
        fetch('/api/admin/offers', { headers: { 'x-admin-token': authToken } })
      ]);

      if (ordersRes.status === 401 || offersRes.status === 401) {
        handleLogout();
        return;
      }

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const offersData = await offersRes.json();
      
      // Normalizar imagens para o Admin (fallback imageUrl -> images)
      const normalizedProducts = productsData.map((p: any) => ({
        ...p,
        images: p.images || (p.imageUrl ? [p.imageUrl] : [])
      }));

      setOrders(ordersData);
      setProducts(normalizedProducts);
      setOffers(offersData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin-token', token);
    setIsLoggedIn(true);
    fetchData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
    setToken('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
      const method = editingProductId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price)
        })
      });

      if (res.ok) {
        setNewProduct({ title: '', price: '', description: '', images: [], status: 'disponível' });
        setEditingProductId(null);
        setActiveTab('products');
        fetchData(token);
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      alert('Erro na requisição');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });

      if (res.ok) {
        fetchData(token);
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao excluir produto');
      }
    } catch (error) {
      alert('Erro na requisição');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (product: any) => {
    setNewProduct({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      images: product.images || [],
      status: product.status || 'disponível'
    });
    setEditingProductId(product.id || product._id);
    setActiveTab('new-product');
  };

  const handleUpdateProductStatus = async (productId: string, newStatus: string) => {
    if (!confirm(`Confirmar alteração do status para ${newStatus}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData(token);
      }
    } catch (error) {
      alert('Erro ao atualizar status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Confirmar alteração do status para ${newStatus}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ orderId, newStatus })
      });

      if (res.ok) {
        fetchData(token);
      }
    } catch (error) {
      alert('Erro ao atualizar status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, newStatus: string) => {
    if (!confirm(`Confirmar alteração do status para ${newStatus}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ offerId, newStatus })
      });

      if (res.ok) {
        fetchData(token);
      }
    } catch (error) {
      alert('Erro ao atualizar oferta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/offers?id=${offerId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });

      if (res.ok) {
        fetchData(token);
      }
    } catch (error) {
      alert('Erro ao excluir oferta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiDescription = async () => {
    if (!newProduct.title) {
      alert('Digite um título primeiro para a IA se basear.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ title: newProduct.title })
      });

      if (res.ok) {
        const data = await res.json();
        setNewProduct({ ...newProduct, description: data.description });
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao gerar descrição');
      }
    } catch (error) {
      alert('Erro na conexão com a IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      try {
        const newImages = [...newProduct.images];
        for (let i = 0; i < files.length; i++) {
          if (newImages.length >= 6) break;
          
          try {
            // Comprimir agressivamente para garantir que caiba no limite de 16MB do MongoDB
            const compressed = await compressImage(files[i], 800, 800, 0.6);
            newImages.push(compressed);
          } catch (e) {
            console.error('Erro ao processar imagem:', e);
          }
        }
        setNewProduct({ ...newProduct, images: newImages });
      } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao carregar imagens. Verifique se o arquivo é uma imagem válida.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...newProduct.images];
    newImages.splice(index, 1);
    setNewProduct({ ...newProduct, images: newImages });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl shadow-zinc-200">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-zinc-900">Admin Carlão</h2>
            <p className="mt-2 text-zinc-500">Insira seu token de acesso para gerenciar o bota-fora.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input
              type="password"
              required
              className="block w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 focus:border-zinc-900 focus:outline-none transition-all"
              placeholder="Admin Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl bg-zinc-900 py-4 font-bold text-white hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Entrar no Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-zinc-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8">
        {/* Stats Row (Optional, simplified for now) */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Total Pedidos</p>
            <p className="mt-2 text-3xl font-black text-zinc-900">{orders.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Produtos Ativos</p>
            <p className="mt-2 text-3xl font-black text-zinc-900">{products.filter(p => p.status === 'disponível').length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Status</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-zinc-900 uppercase">Sistema Online</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-2xl bg-zinc-200/50 p-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              activeTab === 'orders' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <ShoppingBag className="h-4 w-4" /> Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              activeTab === 'products' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <Package className="h-4 w-4" /> Inventário
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              activeTab === 'offers' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <HandCoins className="h-4 w-4" /> Ofertas
            {offers.filter(o => o.status === 'pendente').length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                {offers.filter(o => o.status === 'pendente').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => {
              setEditingProductId(null);
              setNewProduct({ title: '', price: '', description: '', images: [], status: 'disponível' });
              setActiveTab('new-product');
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              activeTab === 'new-product' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <Plus className="h-4 w-4" /> {editingProductId ? 'Editando Item' : 'Novo Item'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-zinc-200" />
                  <p className="mt-4 text-zinc-500">Nenhum pedido recebido ainda.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  return (
                    <div key={order._id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                            {product?.images?.[0] && <img src={formatImageSrc(product.images[0])} className="h-full w-full object-cover" alt="" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                order.type === 'compra' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              )}>
                                {order.type}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <h3 className="mt-1 text-lg font-bold text-zinc-900">{product?.title || 'Produto Removido'}</h3>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                              <span className="flex items-center gap-1 font-medium"><User className="h-3 w-3" /> {order.buyerName}</span>
                              <span className="flex items-center gap-1 font-medium"><Phone className="h-3 w-3" /> {order.buyerPhone}</span>
                              <span className="flex items-center gap-1 font-bold text-zinc-900"><DollarSign className="h-3 w-3" /> R$ {order.amountPaid.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-zinc-50 pt-6 lg:border-0 lg:pt-0">
                          {order.pixProof && (
                            <a 
                              href={formatImageSrc(order.pixProof)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-bold text-zinc-900 hover:bg-zinc-200 transition-all"
                            >
                              <ExternalLink className="h-4 w-4" /> Ver PIX
                            </a>
                          )}
                          <button 
                            onClick={() => handleUpdateOrderStatus(order._id, 'vendido')}
                            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all"
                          >
                            <CheckCircle className="h-4 w-4" /> Confirmar
                          </button>
                          <button 
                            onClick={() => handleUpdateOrderStatus(order._id, 'disponível')}
                            className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all"
                          >
                            <XCircle className="h-4 w-4" /> Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id || product._id} className="group relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
                  <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-100 relative">
                    <img src={formatImageSrc(product.images?.[0]) || 'https://via.placeholder.com/400'} className="h-full w-full object-cover" alt="" />
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-900 shadow-sm hover:bg-zinc-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id || product._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm hover:bg-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-zinc-900 line-clamp-1">{product.title}</h3>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        product.status === 'disponível' ? "bg-emerald-100 text-emerald-800" : 
                        product.status === 'reservado' ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      )}>
                        {product.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-bold text-zinc-900">R$ {product.price.toFixed(2)}</p>
                      
                      <div className="flex gap-1">
                        {product.status === 'vendido' ? (
                          <button 
                            onClick={() => handleUpdateProductStatus(product.id || product._id, 'disponível')}
                            className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 hover:bg-zinc-200 transition-all"
                          >
                            <ArrowLeft className="h-3 w-3" /> Reativar
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateProductStatus(product.id || product._id, 'vendido')}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-100 transition-all"
                          >
                            <CheckCircle className="h-3 w-3" /> Vender
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="py-20 text-center">
                  <HandCoins className="mx-auto h-12 w-12 text-zinc-200" />
                  <p className="mt-4 text-zinc-500">Nenhuma oferta recebida ainda.</p>
                </div>
              ) : (
                offers.map((offer) => {
                  const product = products.find(p => p.id === offer.productId || p._id === offer.productId);
                  return (
                    <div key={offer._id} className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                            {product?.images?.[0] && <img src={formatImageSrc(product.images[0])} className="h-full w-full object-cover" alt="" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                offer.status === 'pendente' ? "bg-amber-100 text-amber-800" : 
                                offer.status === 'aceito' ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"
                              )}>
                                {offer.status}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(offer.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <h3 className="mt-1 text-lg font-bold text-zinc-900">
                              Oferta para: {product?.title || 'Produto Removido'}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                              <span className="flex items-center gap-1 font-medium"><User className="h-3 w-3" /> {offer.name}</span>
                              <span className="flex items-center gap-1 font-medium"><Phone className="h-3 w-3" /> {offer.phone}</span>
                              <span className="flex items-center gap-1 font-black text-zinc-900 underline decoration-zinc-200 underline-offset-4">
                                Proposta: R$ {Number(offer.amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-zinc-50 pt-6 lg:border-0 lg:pt-0">
                          {offer.status === 'pendente' && (
                            <>
                              <button 
                                onClick={() => handleUpdateOfferStatus(offer._id, 'aceito')}
                                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-all"
                              >
                                <CheckCircle className="h-4 w-4" /> Aceitar
                              </button>
                              <button 
                                onClick={() => handleUpdateOfferStatus(offer._id, 'recusado')}
                                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all"
                              >
                                <XCircle className="h-4 w-4" /> Recusar
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDeleteOffer(offer._id)}
                            className="flex items-center gap-2 rounded-xl border border-zinc-100 p-2.5 text-zinc-300 hover:bg-rose-50 hover:text-rose-600 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'new-product' && (
            <div className="mx-auto max-w-2xl">
              <form onSubmit={handleSaveProduct} className="space-y-6 rounded-3xl bg-white p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4 mb-4">
                   <button 
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      setEditingProductId(null);
                      setNewProduct({ title: '', price: '', description: '', images: [], status: 'disponível' });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900"
                   >
                    <ArrowLeft className="h-5 w-5" />
                   </button>
                   <h2 className="text-xl font-bold text-zinc-900">
                    {editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                   </h2>
                </div>

                <div className="grid gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-700 ml-1">Título do Item</label>
                    <input
                      type="text"
                      required
                      className="mt-2 w-full rounded-2xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-all"
                      placeholder="Ex: Monitor 4K Dell UltraSharp"
                      value={newProduct.title}
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-700 ml-1">Preço (R$)</label>
                      <input
                        type="number"
                        required
                        className="mt-2 w-full rounded-2xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-all"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-700 ml-1">Status</label>
                      <select
                        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold text-zinc-900 focus:border-zinc-900 focus:outline-none transition-all appearance-none"
                        value={newProduct.status}
                        onChange={e => setNewProduct({...newProduct, status: e.target.value})}
                      >
                        <option value="disponível">Disponível</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-700">Descrição</label>
                      <button 
                        type="button"
                        onClick={handleAiDescription}
                        disabled={isLoading || !newProduct.title}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-3 w-3" /> Gerar com IA
                      </button>
                    </div>
                    <textarea
                      required
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none transition-all resize-none"
                      placeholder="Detalhes sobre o estado do item, tempo de uso, etc."
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-700 ml-1">Imagens do Produto (Mín 1, Máx 6)</label>
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {newProduct.images.map((img, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 shadow-sm group">
                          <img src={formatImageSrc(img)} className="h-full w-full object-cover" alt="" />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      {newProduct.images.length < 6 && (
                        <div 
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all hover:border-zinc-900 hover:bg-white"
                        >
                          <Plus className="h-6 w-6 text-zinc-400" />
                          <p className="mt-1 text-[10px] font-bold uppercase text-zinc-400">Adicionar</p>
                        </div>
                      )}
                    </div>
                    <input 
                      id="image-upload"
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || newProduct.images.length === 0}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-900 py-5 text-lg font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : editingProductId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
