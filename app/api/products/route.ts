import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    // Mapear _id para id e normalizar imagens para compatibilidade com o frontend
    const formattedProducts = products.map(p => {
      const obj = p.toObject() as any;
      return {
        ...obj,
        id: p._id.toString(),
        images: obj.images || (obj.imageUrl ? [obj.imageUrl] : []),
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
