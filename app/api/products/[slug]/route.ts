import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    console.log('Fetching product with slug/id:', slug);
    
    // Tenta buscar por slug primeiro
    let product = await Product.findOne({ slug });
    
    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      console.log('Not found by slug, trying by ID:', slug);
      product = await Product.findById(slug);
    }

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const formattedProduct = {
      ...product.toObject(),
      id: product._id.toString(),
    };

    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error('Fetch product detail error:', error);
    return NextResponse.json({ error: 'Erro ao buscar detalhe do produto' }, { status: 500 });
  }
}
