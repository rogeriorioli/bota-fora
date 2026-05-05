import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { validateAdminToken } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    // Se o título mudar, atualiza o slug também
    if (body.title) {
      body.slug = slugify(body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Admin Product PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error: any) {
    console.error('Admin Product DELETE Error:', error);
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 });
  }
}
