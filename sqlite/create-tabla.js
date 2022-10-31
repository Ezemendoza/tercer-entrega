const { options } = require("./sqlite");
const knex = require("knex")(options);

const crear = ()=>{
  knex.schema
  .createTable("chat", (table) => {
    table.increments("id");
    table.string("autor");
    table.string("texto");
    table.string("horario")
  })
  .then(() => {
    console.log("Tabla");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    knex.destroy();
  });
}

module.exports= {crear}