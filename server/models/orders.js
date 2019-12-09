import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: { type: String},
  userPhoneNumber: { type: String, required: true },
  branch: {
    b_ID: {type: String, required: true},
    b_Name: {type: String, required: true},
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  items: { type: Array, required: true },
  date: { type: Date, required: true },
  totalPaid: { type: Number, required: true },
  stripe_intent_id: { type: String, required: true},
  id: { type: String, required: true},    //for api call
  status: { type: String, required: true}, //created, paid, ordered
});

export default mongoose.model('Orders', orderSchema);
