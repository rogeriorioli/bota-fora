import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formattedProduct = await getProductBySlug(slug);

    if (!formattedProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error('Fetch product detail error:', error);
    return NextResponse.json({ error: 'Erro ao buscar detalhe do produto' }, { status: 500 });
  }
}
