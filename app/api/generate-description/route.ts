import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAdminToken } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!validateAdminToken(req)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'O título é necessário para gerar a descrição' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Você é um especialista em vendas de itens usados para um "Bota Fora".
      O objetivo é vender itens de qualidade porque o dono (Carlos) está se mudando.
      
      Crie uma descrição persuasiva, amigável e direta para o seguinte produto: "${title}".
      
      Diretrizes:
      1. Use um tom de "desapego" e oportunidade única.
      2. Destaque que o item está bem cuidado.
      3. Mantenha o texto entre 2 a 4 frases curtas e impactantes.
      4. Não use emojis exagerados.
      5. Escreva em Português do Brasil.
      
      Retorne APENAS o texto da descrição, sem títulos ou introduções REMOVER MARKDOWN E TAGS HTML APENAS PLAIN TEXT.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ description: text });
  } catch (error: any) {
    console.error('Gemini Generate Error:', error);
    return NextResponse.json({ error: 'Erro ao gerar descrição com IA' }, { status: 500 });
  }
}
