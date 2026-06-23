import mongoose from 'mongoose';

const ticketPriceSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "Indian Nationals", "Foreign Nationals"
  entryFee: { type: String, required: true }, // e.g., "₹150"
  jeepHire: { type: String, required: true }, // e.g., "₹2,500"
  order: { type: Number, default: 0 }
}, { timestamps: true });

const TicketPrice = mongoose.model('TicketPrice', ticketPriceSchema);

export default TicketPrice;
