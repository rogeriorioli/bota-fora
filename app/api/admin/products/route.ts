import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { validateAdminToken } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, price, description, images } = body;

    if (!title || !price || !description || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes ou imagens inválidas' }, { status: 400 });
    }

    const slug = slugify(title);

    const newProduct = await Product.create({
      title,
      slug,
      price,
      description,
      images, 
      status: 'disponível',
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Admin Products POST Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
