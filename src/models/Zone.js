import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String },
  highlights: [{ type: String }],
  wildlife: [{
    name: { type: String },
    description: { type: String },
    image: { type: String }
  }],
  isOpen: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  foreignerPrice: { type: Number, default: 0 },
  closureNotice: { type: String },
  pricing: [{
    category: { type: String },
    entryFee: { type: String },
    jeepHire: { type: String }
  }]
}, { timestamps: true });

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
