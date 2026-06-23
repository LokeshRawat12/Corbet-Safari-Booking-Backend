import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  duration: { type: String },
  safari: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  description: { type: String }
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

export default Package;
