import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'O slug é obrigatório'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
  },
  description: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
  },
  images: {
    type: [String], // Array of Base64 strings
    required: [true, 'Pelo menos uma imagem é obrigatória'],
    validate: [(val: string[]) => val.length > 0, 'O produto deve ter pelo menos uma imagem'],
  },
  status: {
    type: String,
    enum: ['disponível', 'reservado', 'vendido'],
    default: 'disponível',
  },
}, {
  timestamps: true,
});

// Forçar a deleção do modelo se estiver em cache para evitar erros de validação com esquemas antigos
if (mongoose.connection && mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = model('Product', ProductSchema);

export default Product;
