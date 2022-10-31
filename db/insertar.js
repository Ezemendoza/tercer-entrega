const { options } = require("./productos");
const knex = require("knex")(options);

const agregarProductos = (producto)=> {
    knex("mibase").insert(producto)
    .then(() => {
    console.log("guardado")
    })
    .catch((err) => {
     console.log(err)
    })
}

module.exports= {agregarProductos}