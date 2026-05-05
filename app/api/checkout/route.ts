import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import resend from '@/lib/resend';
import { cleanBase64 } from '@/lib/image-utils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { 
      productId, 
      buyerName, 
      buyerEmail, 
      buyerPhone, 
      tipoAcao, // 'compra' or 'reserva'
      pixProof, 
      amountPaid 
    } = body;

    // 1. Verificação de Disponibilidade
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    if (product.status !== 'disponível') {
      return NextResponse.json({ error: 'Produto não está mais disponível' }, { status: 400 });
    }

    // 2. Limpeza da Imagem Base64
    const cleanedPixProof = cleanBase64(pixProof);

    // 3. Lógica de Transação e Status
    const newStatus = tipoAcao === 'compra' ? 'vendido' : 'reservado';
    product.status = newStatus;
    await product.save();

    // 4. Criação da Reserva/Pedido
    const order = await Order.create({
      productId,
      buyerName,
      buyerEmail,
      buyerPhone,
      type: tipoAcao,
      pixProof: cleanedPixProof,
      amountPaid,
    });

    // 5. Orquestração de E-mails (Resend)
    const adminEmail = process.env.ADMIN_EMAIL || 'carlosorioli@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Bota Fora <onboarding@resend.dev>';
    const adminPhoneRaw = process.env.ADMIN_PHONE || '554899999999';
    const adminPhoneClean = adminPhoneRaw.replace(/\D/g, ''); // Garante que só existam números
    const whatsappLink = `https://wa.me/${adminPhoneClean}`;

    // Disparos simultâneos
    await Promise.all([
      // E-mail Vendedor (Carlão)
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `🔔 Novo ${tipoAcao === 'compra' ? 'Pagamento' : 'Reserva'}: ${product.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Nova Venda/Reserva!</h2>
            <p><strong>Produto:</strong> ${product.title}</p>
            <p><strong>Valor do Item:</strong> R$ ${product.price.toFixed(2)}</p>
            <p><strong>Valor Pago:</strong> R$ ${amountPaid.toFixed(2)}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <h3 style="color: #555;">Dados do Comprador:</h3>
            <p><strong>Nome:</strong> ${buyerName}</p>
            <p><strong>E-mail:</strong> ${buyerEmail}</p>
            <p><strong>Telefone:</strong> ${buyerPhone}</p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; color: #666;">
              O comprovante PIX foi enviado em anexo a este e-mail.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `comprovante-${order._id}.png`,
            content: cleanedPixProof,
          },
        ],
      }),

      // E-mail Comprador
      resend.emails.send({
        from: fromEmail,
        to: buyerEmail,
        subject: `✅ Seu comprovante foi recebido: ${product.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
            <h2 style="color: #28a745;">Tudo certo, ${buyerName}!</h2>
            <p style="font-size: 16px; color: #555;">Recebemos o seu comprovante de <strong>${tipoAcao === 'compra' ? 'pagamento' : 'reserva'}</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
              <p><strong>Item:</strong> ${product.title}</p>
              <p><strong>Valor Pago:</strong> R$ ${amountPaid.toFixed(2)}</p>
              ${tipoAcao === 'reserva' ? `<p style="color: #d9534f;"><strong>Valor Pendente:</strong> R$ ${(product.price - amountPaid).toFixed(2)}</p>` : ''}
            </div>

            <p style="color: #666; margin-bottom: 25px;">Para combinar a retirada ou tirar qualquer dúvida, clique no botão abaixo:</p>
            
            <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 15px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              Falar com Carlão no WhatsApp
            </a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999;">Obrigado por comprar no Bota Fora do Carlão!</p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
