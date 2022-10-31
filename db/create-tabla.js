const { options } = require("./productos");
const knex = require("knex")(options);

  knex.schema
  .createTable("mibase", (table) => {
    table.string("nombre");
    table.string("talle");
    table.integer("id");
    table.string("agregado")
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
