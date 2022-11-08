import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image:  {
    data: Buffer,
    contentType: String
}
});

export default mongoose.model("User", UserSchema);