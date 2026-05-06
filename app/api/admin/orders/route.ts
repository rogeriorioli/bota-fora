import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { validateAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    // Busca pedidos populando os dados do produto
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Admin Orders GET Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { orderId, newStatus } = body; // newStatus: 'vendido' ou 'disponível' (para cancelar)

    if (!orderId) {
      return NextResponse.json({ error: 'ID do pedido é obrigatório' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    const product = await Product.findById(order.productId);
    if (!product) {
      return NextResponse.json({ error: 'Produto relacionado não encontrado' }, { status: 404 });
    }

    // Se informou um status específico, usa ele. Caso contrário, assume 'vendido'
    product.status = newStatus || 'vendido';
    await product.save();

    revalidatePath('/');
    return NextResponse.json({ 
      success: true, 
      message: `Status do produto atualizado para ${product.status}`,
      productStatus: product.status 
    });
  } catch (error: any) {
    console.error('Admin Orders PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
