import mongoose from "mongoose";
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  id: { type: String, required: true },
  buildingNo: { type: String },
  flatNo: { type: String },
  street: {
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },
    address: { type: String, required: true },
    postalCode: { type: String},
    seperate_address: {
      countryCode: { type: String },
      state: { type: String },
      city: { type: String },
      streetLine1: { type: String },
      streetLine2: { type: String }
    }
  },
  type: { type: String }
});

export default mongoose.model("Address", addressSchema);
