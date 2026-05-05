'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS } from '@/lib/data';

export function ProductGrid({ initialProducts }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);

  useEffect(() => {
    if (initialProducts) return;

    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error('Error fetching products, using mock:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [initialProducts]);

  return (
    <div className="w-full py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Explorar Itens</h2>
          <p className="mt-2 text-zinc-500">Encontre as melhores oportunidades no nosso bota-fora.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Skeleton placeholders or loading state
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-zinc-100" />
          ))
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))
        )}
      </div>
    </div>
  );
}
