import React from 'react';
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/lib/data";

export default async function Home() {
  let products = [];
  try {
    products = await getProducts();
    if (!products || products.length === 0) {
      products = MOCK_PRODUCTS;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = MOCK_PRODUCTS;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <span className="font-bold">B</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Bota Fora do Carlão</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        {/* Hero Section */}
        <section className="mb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Novos itens adicionados hoje
          </div>
          <h2 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">
            Bota Fora do Carlão
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-500">
            Ajude o Carlos a desapegar para sua mudança. Encontre itens de qualidade com preços de desapego.
          </p>
        </section>


        {/* Product Grid Section */}
        <section id="products">
          <ProductGrid initialProducts={products} />
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-zinc-500">
          <p>&copy; 2024 bota-fora. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}


