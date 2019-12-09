import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  expiry: { type: String, required: true },
  token: { type: String, required: true },
});

export default mongoose.model("Cards", cardSchema);
