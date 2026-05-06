'use client';

import React, { useState } from 'react';
import { X, Loader2, DollarSign, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function OfferModal({ isOpen, onClose, product }: OfferModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id || product._id,
          ...formData,
          amount: Number(formData.amount)
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao enviar oferta');
      }
    } catch (error) {
      alert('Erro na conexão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900">Oferta Enviada!</h2>
            <p className="mt-4 text-zinc-500 text-lg">
              Obrigado pela sua proposta. O Carlos recebeu seus dados e entrará em contato em breve se aceitar a oferta.
            </p>
            <button 
              onClick={onClose}
              className="mt-8 w-full rounded-2xl bg-zinc-900 py-5 font-bold text-white transition-all hover:bg-zinc-800"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-zinc-900">Fazer Oferta</h2>
              <p className="mt-2 text-zinc-500">Mande sua proposta para o item: <span className="font-bold text-zinc-900">{product?.title}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 text-zinc-900 focus:border-zinc-900 focus:outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp / Telefone"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 text-zinc-900 focus:border-zinc-900 focus:outline-none transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Seu e-mail"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 text-zinc-900 focus:border-zinc-900 focus:outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Valor da sua oferta (R$)"
                    className="w-full rounded-3xl border-2 border-zinc-900 bg-white py-6 pl-12 pr-4 text-2xl font-black text-zinc-900 focus:outline-none"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-zinc-900 py-5 text-lg font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>Enviar Proposta</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
