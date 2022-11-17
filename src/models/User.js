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

});
const productoSchema= new mongoose.Schema({
  nombre:{type: String},
  apellido:{type:String}})


export const Productos = mongoose.model("Productos" , productoSchema)

export const User =  mongoose.model("User", UserSchema);