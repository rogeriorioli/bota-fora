import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const formattedProducts = await getProducts();
    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
