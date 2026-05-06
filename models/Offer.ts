import mongoose, { Schema, model, models } from 'mongoose';

const OfferSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'O ID do produto é obrigatório'],
  },
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
  },
  phone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
  },
  amount: {
    type: Number,
    required: [true, 'O valor da oferta é obrigatório'],
  },
  status: {
    type: String,
    enum: ['pendente', 'aceito', 'recusado'],
    default: 'pendente',
  },
}, {
  timestamps: true,
});

if (mongoose.connection && mongoose.models.Offer) {
  delete mongoose.models.Offer;
}

const Offer = model('Offer', OfferSchema);

export default Offer;
