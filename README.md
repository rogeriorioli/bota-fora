# 📦 Bota Fora do Carlão

Uma plataforma moderna e elegante desenvolvida para facilitar a venda de itens de desapego. O sistema conta com um painel administrativo completo, vitrine responsiva e integração com Inteligência Artificial.

## 🚀 Funcionalidades Principais

### 🛍️ Vitrine (Frontend)
- **Design Premium**: Interface limpa, moderna e totalmente responsiva, focada na melhor experiência de visualização dos produtos.
- **Roteamento Inteligente**: URLs amigáveis baseadas em Slugs (ex: `/products/mesa-gamer`) para melhor SEO e compartilhamento.
- **Galeria de Imagens**: Visualizador de imagens dinâmico para cada produto.
- **Fluxo de Reserva**: Modal de checkout intuitivo para reserva ou compra de itens.

### 🔐 Painel Administrativo
- **Gestão de Inventário**: CRUD completo (Criação, Leitura, Atualização e Exclusão) de produtos.
- **Painel de Pedidos**: Visualização em tempo real dos pedidos realizados com controle de status (Pendente, Pago, Cancelado).
- **Segurança**: Acesso protegido via Admin Token.

### 🤖 Inteligência Artificial (Google Gemini)
- **Gerador de Descrições**: Integração nativa com a API do Gemini para gerar automaticamente descrições persuasivas e otimizadas para venda a partir do título do produto.

### 🖼️ Sistema de Imagens Inteligente
- **Compressão Automática**: Sistema de processamento de imagem no cliente que redimensiona e comprime fotos pesadas (até 800px) antes do upload, garantindo performance e respeitando os limites do banco de dados (MongoDB).
- **Fallback de Imagens**: Tratamento robusto para imagens corrompidas ou inexistentes.

### 🛠️ Tecnologias Utilizadas
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS & Lucide React (Ícones)
- **Banco de Dados**: MongoDB (Mongoose)
- **IA**: Google Generative AI (Gemini Flash)
- **Email**: Resend (Integração de notificações)

---

## 🛠️ Configuração e Instalação

1. **Clonar o repositório:**
   ```bash
   git clone <repo-url>
   ```

2. **Instalar dependências:**
   ```bash
   yarn install
   ```

3. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na raiz com as seguintes chaves:
   ```env
   MONGODB_URI=seu_link_do_mongodb
   ADMIN_TOKEN=seu_token_de_acesso
   GEMINI_API_KEY=sua_chave_da_google_ai
   RESEND_API_KEY=sua_chave_da_resend (opcional)
   ```

4. **Rodar em desenvolvimento:**
   ```bash
   yarn dev
   ```

5. **Gerar Build de produção:**
   ```bash
   yarn build
   ```

---
Desenvolvido com ❤️ para o Bota Fora do Carlão.
