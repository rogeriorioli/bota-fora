import dbConnect from '../lib/mongodb';
import Product from '../models/Product';
import { slugify } from '../lib/utils';

async function migrateSlugs() {
  try {
    await dbConnect();
    console.log('Conectado ao MongoDB para migração...');

    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Encontrados ${products.length} produtos sem slug.`);

    for (const product of products) {
      const slug = slugify(product.title);
      product.slug = slug;
      await product.save();
      console.log(`Slug gerado para "${product.title}": ${slug}`);
    }

    console.log('Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro na migração:', error);
    process.exit(1);
  }
}

migrateSlugs();
