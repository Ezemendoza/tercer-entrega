import { Productos, User } from "../src/models/User.js"

async function getDateId(dato) {
    await User.findById(dato).lean();
    return dato;
  }
  async function buscarProducto() {
    return  await Productos.find().lean()
  } 

  export  {getDateId, buscarProducto}
