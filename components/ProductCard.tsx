'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tag, ShoppingCart, Clock, ArrowRight } from 'lucide-react';

export type ProductStatus = 'disponível' | 'reservado' | 'vendido';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    description: string;
    images: string[];
    status: ProductStatus;
  };
}

const statusStyles: Record<ProductStatus, { label: string; container: string; icon: React.ReactNode }> = {
  'disponível': {
    label: 'Disponível',
    container: 'bg-emerald-100 text-emerald-700',
    icon: <Tag className="w-3 h-3" />,
  },
  'reservado': {
    label: 'Reservado',
    container: 'bg-amber-100 text-amber-700',
    icon: <Clock className="w-3 h-3" />,
  },
  'vendido': {
    label: 'Vendido',
    container: 'bg-rose-100 text-rose-700',
    icon: <ShoppingCart className="w-3 h-3" />,
  },
};

export function ProductCard({ product }: ProductCardProps) {
  const formatImageSrc = (src: string) => {
    if (!src) return 'https://via.placeholder.com/400';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `data:image/jpeg;base64,${src}`;
  };

  const isAvailable = product.status === 'disponível';
  const style = statusStyles[product.status];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-xl">
      {/* Main Link Wrapper for Image and Title */}
      <Link href={`/products/${product?.slug || product.id}`} className="flex flex-col flex-1">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-zinc-100">
          <img
            src={formatImageSrc(product.images?.[0] || (product as any).imageUrl)}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Imagem+Indisponivel';
            }}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
              product.status === 'vendido' && "grayscale opacity-60"
            )}
          />
          
          {/* Status Badge */}
          <div className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md",
            style.container
          )}>
            {style.icon}
            {style.label}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
            <span className="text-lg font-bold text-zinc-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </div>
          
          <p className="mb-6 text-sm text-zinc-500 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Buttons Section */}
      <div className="flex gap-2 p-5 pt-0">
        <Link 
          href={`/products/${product.id}?action=buy`}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-tight transition-all",
            isAvailable 
              ? "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
              : "pointer-events-none bg-zinc-100 text-zinc-400"
          )}
        >
          Comprar
        </Link>
        <Link 
          href={`/products/${product.id}?action=reserve`}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 py-3 text-xs font-bold uppercase tracking-tight transition-all",
            isAvailable 
              ? "bg-white text-zinc-900 hover:border-zinc-900 active:scale-[0.98]"
              : "pointer-events-none border-zinc-50 text-zinc-300"
          )}
        >
          Reservar
        </Link>
      </div>
    </div>
  );
}

