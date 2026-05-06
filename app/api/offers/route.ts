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
        const adminEmail = process.env.ADMIN_EMAIL || 'carlosorioli@gmail.com';
        const fromEmail = process.env.RESEND_FROM_EMAIL || '"Bota Fora <emails@mails.convertesites.com.br>"';

        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `🔔 Nova Oferta: ${product.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Nova Oferta Recebida!</h2>
              <p><strong>Produto:</strong> ${product.title}</p>
              <p><strong>Valor da Oferta:</strong> <span style="font-size: 18px; font-weight: bold; color: #6366f1;">R$ ${Number(amount).toFixed(2)}</span></p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <h3 style="color: #555;">Dados do Interessado:</h3>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <br/>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; color: #666; font-size: 14px;">
                Acesse o painel administrativo para aceitar ou recusar esta proposta.
              </p>
            </div>
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
