'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Users, Eye, HandCoins, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAMES = [
  'André', 'Renan', 'Felipe', 'Juliana', 'Marcos', 'Fernanda', 'Ricardo', 
  'Beatriz', 'Lucas', 'Camila', 'Gustavo', 'Patrícia', 'Thiago', 'Aline',
  'Bruno', 'Carla', 'Diego', 'Elaine', 'Fabio', 'Gisele'
];

const ACTIONS = [
  { type: 'viewing', icon: Eye, text: 'está olhando este item agora' },
  { type: 'offer', icon: HandCoins, text: 'mandou uma oferta para' },
  { type: 'browsing', icon: Users, text: 'pessoas estão olhando este item' }
];

interface Product {
  id: string;
  title: string;
  slug: string;
}

export function SocialProof() {

  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentToast, setCurrentToast] = useState<{
    id: number;
    message: React.ReactNode;
    icon: any;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.filter(p => p.status === 'disponível'));
        }
      })
      .catch(err => console.error('Error fetching products for social proof:', err));
  }, []);

  const generateRandomToast = useCallback(() => {
    if (products.length === 0) return;

    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    
    let message: React.ReactNode;
    let icon = action.icon;

    if (action.type === 'browsing') {
      const count = Math.floor(Math.random() * 8) + 3;
      message = (
        <span className="text-sm text-zinc-600">
          <strong className="text-zinc-900">{count} pessoas</strong> estão olhando <strong className="text-zinc-900">{product.title}</strong> agora
        </span>
      );
    } else if (action.type === 'offer') {
      message = (
        <span className="text-sm text-zinc-600">
          <strong className="text-zinc-900">{name}</strong> acabou de mandar uma oferta para <strong className="text-zinc-900">{product.title}</strong>
        </span>
      );
    } else {
      message = (
        <span className="text-sm text-zinc-600">
          <strong className="text-zinc-900">{name}</strong> está interessado em <strong className="text-zinc-900">{product.title}</strong> agora
        </span>
      );
    }

    setCurrentToast({
      id: Date.now(),
      message,
      icon
    });
    setIsVisible(true);

    // Hide toast after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [products]);

  useEffect(() => {
    // Initial delay
    const initialTimeout = setTimeout(() => {
      generateRandomToast();
    }, 3000);

    // Set interval for subsequent toasts
    const interval = setInterval(() => {
      if (!isVisible) {
        generateRandomToast();
      }
    }, 15000 + Math.random() * 10000); // Between 15-25 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [generateRandomToast, isVisible]);

  if (!currentToast) return null;

  const Icon = currentToast.icon;
  const message = currentToast.message;

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-6 z-50 max-w-[320px] transition-all duration-500 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl shadow-zinc-200 border border-zinc-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 pr-2">
          {message}
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
