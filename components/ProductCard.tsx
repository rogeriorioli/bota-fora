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

  const isSold = product.status === 'vendido';
  const isAvailable = product.status === 'disponível';
  const style = statusStyles[product.status];

  const CardWrapper = isSold ? 'div' : Link;

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all",
      !isSold && "hover:shadow-xl"
    )}>
      {/* Main Wrapper for Image and Title */}
      <CardWrapper 
        href={`/products/${product?.slug || product.id}`} 
        className={cn(
          "flex flex-col flex-1",
          isSold ? "cursor-default" : "cursor-pointer"
        )}
      >
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-zinc-100">
          <img
            src={formatImageSrc(product.images?.[0] || (product as any).imageUrl)}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Imagem+Indisponivel';
            }}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              !isSold && "group-hover:scale-110",
              isSold && "grayscale opacity-60"
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
            <h3 className={cn(
              "font-semibold text-zinc-900 transition-colors line-clamp-1",
              !isSold && "group-hover:text-zinc-600"
            )}>
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
      </CardWrapper>

      {/* Buttons Section */}
      <div className="flex flex-col gap-2 p-5 pt-0">
        {isAvailable ? (
          <>
            <div className="flex gap-2">
              <Link 
                href={`/products/${product.slug || product.id}?action=buy`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-bold uppercase tracking-tight text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
              >
                Comprar
              </Link>
              <Link 
                href={`/products/${product.slug || product.id}?action=reserve`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white py-3 text-xs font-bold uppercase tracking-tight text-zinc-900 transition-all hover:border-zinc-900 active:scale-[0.98]"
              >
                Reservar
              </Link>
            </div>
            <Link 
              href={`/products/${product.slug || product.id}?action=offer`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98]"
            >
              Fazer Oferta
            </Link>
          </>
        ) : (
          <div className="flex w-full items-center justify-center rounded-xl bg-zinc-50 py-3 text-xs font-bold uppercase tracking-tight text-zinc-400 border border-zinc-100">
            {product.status === 'vendido' ? 'Item Vendido' : 'Item Reservado'}
          </div>
        )}
      </div>
    </div>
  );
}

