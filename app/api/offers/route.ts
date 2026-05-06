import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Product from '@/models/Product';
import resend from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { productId, name, email, phone, amount } = body;

    if (!productId || !name || !email || !phone || !amount) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const offer = await Offer.create({
      productId,
      name,
      email,
      phone,
      amount
    });

    // Enviar e-mail de notificação
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Bota Fora <onboarding@resend.dev>',
          to: 'carlosorioli@gmail.com', // E-mail fixo do Carlão (baseado no context) ou configurável
          subject: `Nova Oferta: ${product.title}`,
          html: `
            <h1>Nova Oferta Recebida!</h1>
            <p><strong>Produto:</strong> ${product.title}</p>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Valor da Oferta:</strong> R$ ${Number(amount).toFixed(2)}</p>
            <br/>
            <p>Acesse o painel administrativo para aceitar ou recusar.</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email Sending Error:', emailError);
      // Não trava a requisição se o e-mail falhar, o registro no DB é mais importante
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Offer POST Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar oferta' }, { status: 500 });
  }
}
