import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'O ID do produto é obrigatório'],
  },
  buyerName: {
    type: String,
    required: [true, 'O nome do comprador é obrigatório'],
  },
  buyerEmail: {
    type: String,
    required: [true, 'O e-mail do comprador é obrigatório'],
  },
  buyerPhone: {
    type: String,
    required: [true, 'O telefone do comprador é obrigatório'],
  },
  type: {
    type: String,
    enum: ['compra', 'reserva'],
    required: [true, 'O tipo de pedido é obrigatório'],
  },
  pixProof: {
    type: String, // Base64 string
    required: [true, 'O comprovante PIX é obrigatório'],
  },
  amountPaid: {
    type: Number,
    required: [true, 'O valor pago é obrigatório'],
  },
}, {
  timestamps: true,
});

// Forçar a deleção do modelo se estiver em cache para evitar erros de validação com esquemas antigos
if (mongoose.connection && mongoose.models.Order) {
  delete mongoose.models.Order;
}

const Order = model('Order', OrderSchema);

export default Order;
