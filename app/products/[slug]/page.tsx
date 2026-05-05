import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/db';
import { MOCK_PRODUCTS } from '@/lib/data';
import { ProductDetail } from '@/components/ProductDetail';

export default async function ProductPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  
  let product = await getProductBySlug(slug);
  
  if (!product) {
    // Fallback to mock for development/demo
    const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug);
    if (mockProduct) {
      product = { 
        ...mockProduct, 
        images: (mockProduct as any).images || [(mockProduct as any).imageUrl],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any;
    }
  }

  if (!product) {
    notFound();
  }

  const initialAction = !!sParams.action;

  return (
    <ProductDetail 
      product={product} 
      initialAction={initialAction} 
    />
  );
}
