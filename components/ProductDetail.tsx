'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CheckoutModal } from '@/components/CheckoutModal';

interface ProductDetailProps {
  product: any;
  initialAction?: boolean;
}

export function ProductDetail({ product, initialAction }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState<string>(product.images?.[0] || '');
  const [isModalOpen, setIsModalOpen] = useState(initialAction || false);

  const formatImageSrc = (src: string) => {
    if (!src) return 'https://via.placeholder.com/400';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `data:image/jpeg;base64,${src}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 py-4">
        <div className="mx-auto flex max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Voltar para a vitrine
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-3xl bg-zinc-100 shadow-sm border border-zinc-100">
              <img 
                src={formatImageSrc(activeImage)} 
                alt={product.title} 
                className="h-full w-full object-cover animate-in fade-in duration-500"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-2xl bg-zinc-100 border-2 transition-all",
                      activeImage === img ? "border-zinc-900 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={formatImageSrc(img)} className="h-full w-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                {product.status}
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">{product.title}</h1>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-zinc-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
              </div>
            </div>

            <div className="mb-10 border-y border-zinc-100 py-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Descrição</h3>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center rounded-2xl bg-zinc-900 py-5 text-lg font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
              >
                Comprar Agora (100%)
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center rounded-2xl border-2 border-zinc-200 py-5 text-lg font-bold text-zinc-900 transition-all hover:border-zinc-900 active:scale-[0.98]"
              >
                Reservar Item (50%)
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-zinc-100 pt-12">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50">
                  <ShieldCheck className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Compra Segura</h4>
                  <p className="text-xs text-zinc-500">Garantia bota-fora Carlão</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50">
                  <Truck className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Retirada Agendada</h4>
                  <p className="text-xs text-zinc-500">Combine a melhor data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
      />
    </div>
  );
}
