import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  image: { type: String },
  gallery: [{ type: String }],
  description: { type: String, default: 'Comfortable rooms, close to park entry points, and guided safari pickup options.' },
  category: { type: String, enum: ['luxury', 'mid-range', 'budget', 'camp'], default: 'mid-range' },
  freeCancellation: { type: Boolean, default: true },
  breakfastIncluded: { type: Boolean, default: true },
  facilities: [{ type: String }],
  policies: [{ type: String }],
  mapUrl: { type: String },
  mapImage: { type: String },
  rooms: [{
    type: { type: String, required: true },
    image: { type: String },
    originalPrice: { type: Number },
    discountPrice: { type: Number },
    taxes: { type: Number, default: 0 },
    features: [{ type: String }],
    mealPlans: [{
      label: { type: String },
      isIncluded: { type: Boolean, default: false }
    }],
    checkIn: { type: String, default: "12:00 PM" },
    checkOut: { type: String, default: "11:00 AM" }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


hotelSchema.index({ name: 1 });
hotelSchema.index({ location: 1, isActive: 1 });
hotelSchema.index({ category: 1, isActive: 1 });
hotelSchema.index({ price: 1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
