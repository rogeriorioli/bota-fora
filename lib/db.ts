import { cache } from 'react';
import dbConnect from './mongodb';
import Product from '@/models/Product';

export const getProducts = cache(async () => {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return products.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    price: p.price,
    description: p.description,
    images: p.images || [],
    status: p.status,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));
});

export const getProductBySlug = cache(async (slug: string) => {
  await dbConnect();
  
  // Tenta buscar por slug primeiro
  let product = await Product.findOne({ slug }).lean() as any;
  
  // Se não encontrar e for um ID válido, tenta por ID
  if (!product && /^[0-9a-fA-F]{24}$/.test(slug)) {
    product = await Product.findById(slug).lean() as any;
  }
  
  if (!product) return null;
  
  return {
    id: product._id.toString(),
    title: product.title,
    slug: product.slug,
    price: product.price,
    description: product.description,
    images: product.images || [],
    status: product.status,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
});
