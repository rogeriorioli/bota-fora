export type ProductStatus = 'disponível' | 'reservado' | 'vendido';

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  status: ProductStatus;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'monitor-4k-dell-ultrasharp',
    title: 'Monitor 4K Dell UltraSharp',
    price: 2499.00,
    description: 'Monitor profissional de 27 polegadas com precisão de cores incrível. Ideal para designers e editores de vídeo.',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'],
    status: 'disponível',
  },
  {
    id: '2',
    slug: 'cadeira-ergonomica-herman-miller',
    title: 'Cadeira Ergonômica Herman Miller',
    price: 8500.00,
    description: 'Aeron Size B em perfeito estado. Ajustes completos e suporte lombar.',
    images: ['https://images.unsplash.com/photo-1505797149-43b007662c11?auto=format&fit=crop&q=80&w=800'],
    status: 'reservado',
  },
  {
    id: '3',
    slug: 'macbook-pro-m2-16',
    title: 'MacBook Pro M2 16"',
    price: 15400.00,
    description: '32GB RAM, 1TB SSD. Menos de 50 ciclos de bateria. Praticamente novo.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'],
    status: 'disponível',
  },
  {
    id: '4',
    slug: 'teclado-mecanico-keychron-k2',
    title: 'Teclado Mecânico Keychron K2',
    price: 650.00,
    description: 'Switches Gateron Brown, retroiluminação RGB e conexão Bluetooth/USB.',
    images: ['https://images.unsplash.com/photo-1595225403016-041830232231?auto=format&fit=crop&q=80&w=800'],
    status: 'vendido',
  },
  {
    id: '5',
    slug: 'luminaria-de-mesa-pixar',
    title: 'Luminária de Mesa Pixar',
    price: 120.00,
    description: 'Estilo clássico industrial, braço articulado e base pesada.',
    images: ['https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800'],
    status: 'disponível',
  },
  {
    id: '6',
    slug: 'kindle-paperwhite-11a-geracao',
    title: 'Kindle Paperwhite 11ª Geração',
    price: 580.00,
    description: 'Tela de 6.8", luz quente ajustável e resistente à água.',
    images: ['https://images.unsplash.com/photo-1592492159418-39f319320569?auto=format&fit=crop&q=80&w=800'],
    status: 'disponível',
  },
];
