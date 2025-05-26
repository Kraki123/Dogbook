import mongoose from "mongoose";

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: String,
  age: {
    type: Number,
    set: (value) => (typeof value === "string" ? parseInt(value, 10) : value),
  },
  bio: String,
  image: String,
  present: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dog" }],
});

export default mongoose.model("Dog", dogSchema);
