import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: 'String', required: true },
  lastname: { type: 'String', required: true },
  birthday: { type: 'Date'},
  email: { type: 'String', required: true },
  phoneNumber: { type: 'String', required: true },
  password: { type: 'String', required: true },
  token: {type: 'String'},
  payment: {type: 'Boolean'},
  paymentToken: { type: 'String'},
  customer_id: {type: 'String'},
  address: [],
  cards: [],
  resetPasswordToken: {type: 'String'},
  resetPasswordExpires: {type: 'Date'}
});

export default mongoose.model('User', userSchema);
