# 📦 Bota Fora do Carlão

Uma plataforma moderna e elegante desenvolvida para facilitar a venda de itens de desapego. O sistema conta com um painel administrativo completo, vitrine responsiva, notificações em tempo real e integração com Inteligência Artificial.

## 🚀 Funcionalidades Principais

### 🛍️ Vitrine (Frontend)
- **Design Premium**: Interface limpa, moderna e totalmente responsiva, focada na melhor experiência de visualização dos produtos.
- **⚡ Atualizações em Tempo Real**: Implementação de renderização dinâmica (`force-dynamic`) e revalidação de cache instantânea. Quando um item é vendido, a vitrine atualiza imediatamente para todos os usuários.
- **📊 Ordenação Inteligente**: Os produtos são organizados automaticamente para exibir itens **Disponíveis** primeiro, seguidos de **Reservados**, e por fim os **Vendidos** ao final da lista.
- **Roteamento Inteligente**: URLs amigáveis baseadas em Slugs (ex: `/products/mesa-gamer`) para melhor SEO e compartilhamento.
- **🤝 Sistema de Ofertas**: Permite que usuários enviem propostas personalizadas. O sistema notifica o administrador por e-mail via Resend.

### 📱 Prova Social (Social Proof)
- **Toasts Dinâmicos**: Sistema de notificações aleatórias que simula atividade no site ("André está olhando este item", "5 pessoas vendo agora"), criando um senso de urgência e comunidade.
- **Filtro de Admin**: As notificações são exibidas apenas para visitantes, mantendo o painel administrativo limpo e focado.

### 🔐 Painel Administrativo
- **Gestão de Inventário**: CRUD completo de produtos com suporte a múltiplas imagens.
- **Painel de Pedidos**: Gerenciamento de status de vendas e reservas com visualização de comprovantes PIX.
- **🚀 Gestão de Ofertas**: Aba dedicada para gerenciar propostas recebidas, com integração automática ao status do produto.
- **Segurança**: Acesso protegido via Admin Token configurável.

### 🤖 Inteligência Artificial (Google Gemini)
- **Gerador de Descrições**: Integração nativa com a API do Gemini para gerar automaticamente descrições persuasivas e detalhadas a partir do título do produto.

### 🖼️ Sistema de Imagens e Performance
- **Compressão Agressiva**: Processamento no cliente que redimensiona e otimiza imagens (800px, JPEG 0.6) para garantir carregamento ultra-rápido e compatibilidade com limites do MongoDB.
- **Fallback Robusto**: Sistema de tratamento de erros para garantir que a vitrine nunca quebre por falhas de carregamento de mídia.

## 🛠️ Tecnologias Utilizadas
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Estilização**: Tailwind CSS & Lucide React
- **Banco de Dados**: MongoDB (Mongoose)
- **IA**: Google Generative AI (Gemini Flash)
- **E-mail**: Resend (Notificações transacionais)

---

## 🛠️ Configuração e Instalação

1. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na raiz:
   ```env
   # Banco de Dados
   MONGODB_URI=seu_link_do_mongodb

   # Admin
   ADMIN_TOKEN=seu_token_de_acesso
   ADMIN_EMAIL=seu_email_para_receber_notificacoes
   ADMIN_PHONE=seu_whatsapp_para_contato

   # E-mail (Resend)
   RESEND_API_KEY=sua_chave_da_resend
   RESEND_FROM_EMAIL="Nome <email@seu-dominio.com>"

   # Inteligência Artificial
   GEMINI_API_KEY=sua_chave_da_google_ai

   # Público
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_PIX_KEY=sua_chave_pix
   ```

2. **Instalar e Rodar:**
   ```bash
   yarn install
   yarn dev
   ```

---
Desenvolvido com ❤️ para o Bota Fora do Carlão.
