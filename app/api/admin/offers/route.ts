import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Product from '@/models/Product';
import { validateAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    return NextResponse.json(offers);
  } catch (error: any) {
    console.error('Admin Offers GET Error:', error);
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
    const { offerId, newStatus } = body; // 'aceito' ou 'recusado'

    if (!offerId || !newStatus) {
      return NextResponse.json({ error: 'ID e novo status são obrigatórios' }, { status: 400 });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Oferta não encontrada' }, { status: 404 });
    }

    offer.status = newStatus;
    await offer.save();

    // Se aceitou a oferta, marca o produto como reservado
    if (newStatus === 'aceito') {
      const product = await Product.findById(offer.productId);
      if (product) {
        product.status = 'reservado';
        await product.save();
      }
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Admin Offers PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await Offer.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Offers DELETE Error:', error);
    return NextResponse.json({ error: 'Erro ao deletar oferta' }, { status: 500 });
  }
}
