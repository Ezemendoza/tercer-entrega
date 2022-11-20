import handlebars from"express-handlebars"
import path from "path";
import "./db/config.js"
import Handlebars from "handlebars"
import app from "./rutas/rutas.js"

const navbar = Handlebars.compile('./views/navbar.hbs').toString('utf-8');
Handlebars.registerPartial('navbar', navbar);

app.engine(".hbs", handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views")),
    extname: ".hbs",
  })
);
    app.set("view engine", "hbs");
    app.set("views", "./views");
    

app.listen(process.env.Port)



