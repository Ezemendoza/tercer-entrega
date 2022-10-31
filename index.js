import cookieParser from "cookie-parser"
import express from "express"
import handlebars from"express-handlebars"
import passport from "passport";
import User from "./src/models/User.js"
import session from "express-session"
import bcrypt from "bcrypt"
import { Strategy } from "passport-local";
import path from "path";
import "./db/config.js"
import {auth} from "./middleware/auth.js"
import compression from "compression";
import  Log4js  from "log4js";
import { Server as HTTPSServer } from "https";
import { Server as IOServer } from "socket.io";
const LocalStrategy = Strategy;
const app = express();

const httpServer = new HTTPSServer(app);
const io = new IOServer(httpServer);
app.use(express.static("public"));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

Log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    warn: { type: "file", filename: "warn.log" },
    error: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["warn"], level: "warn" },
    info: { appenders: ["miLoggerConsole"], level: "info" },
    warn: { appenders: ["miLoggerConsole","warn"], level: "warn" },
    error: { appenders: ["miLoggerConsole", "error"], level: "error" },
  },
});

passport.use(new LocalStrategy({ usernameField: 'email',passwordField: 'password'},function(email, password, done) {
  
    User.findOne({ email: email }, function(err, user) {
    if (err) console.log(err);
    if (!user) return done(null, false);

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));

passport.serializeUser((user, done) => {

  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  return done(null, user);
});



app.engine(
  ".hbs",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views")),
    extname: ".hbs",
  })
);
  app.set("view engine", "hbs");
    app.set("views", "./views");
    
    app.use(express.urlencoded({ extended: true}));
    app.use(express.json());




app.get("/register",(req,res)=>{
  res.render("register")
})
app.post("/register", (req,res)=>{
  const { email , password} = req.body
  User.findOne({email}, async (err, user)=>{

    if(err) console.log(err);
    if(user) {

    const loggerArchivo = Log4js.getLogger("info");
    loggerArchivo.info(`Error de registro`);
    res.render("register-error") }
    if(!user){
      const hashedPass= await bcrypt.hash(password, 8)
      const newUser = new User({
        email, 
        password:hashedPass
      })
      const loggerArchivo = Log4js.getLogger("info");
    loggerArchivo.info(`Ha iniciado sesion`);
      await newUser.save()
      res.redirect("login")
    }
  })
})
app.get("/loginerror", (req, res) => {
  
const loggerArchivo = Log4js.getLogger("info");
loggerArchivo.info(`Error en el login`);

  res.render("loginerror");
});

app.get("/login", (req,res)=>{
    res.render("login")
})
app.post( "/login", passport.authenticate("local", { failureRedirect: "loginerror" }), (req, res) => {

  const loggerArchivo = Log4js.getLogger("info");
    loggerArchivo.info(`Logueado`);
    res.redirect("inicio");
  }
);


app.get("/inicio", auth, async (req,res)=>{

      const datosUsuario = await User.findById(req.user._id).lean()
      const loggerArchivo = Log4js.getLogger("info");
      loggerArchivo.info(`Inicio de sesion`);
     
const listaProducto = [  ]

const mensajes = []

io.on("connection", function (socket) {

  socket.emit("listaProducto", listaProducto);

  socket.emit("mensaje", mensajes);

  socket.on("mensaje", (info) => {

    const loggerArchivo = Log4js.getLogger("error");
    loggerArchivo.error(`${info}`);
    mensajes.push(info);
    io.sockets.emit("mensaje", mensajes);
  });

  socket.on("new-listaProducto", (data) => {
    const loggerArchivo = Log4js.getLogger("error");
    loggerArchivo.error(`${data}`);
    listaProducto.push(data);
   agregarProductos(listaProducto)

    io.sockets.emit("listaProducto", listaProducto);
  });
});

      res.render("inicio",{datos:datosUsuario})
    
})

app.get("*", (req, res) => {
  const { url} = req;

const loggerArchivo = Log4js.getLogger("warn");
  loggerArchivo.warn(`Ruta ${url} inexistente`);
  res.send(`Ruta ${url} inexistente`);
});




app.get("/logout",(req,res)=>{
  req.logout(function(err){
    if(err){
      return next(err)
    }
    res.redirect("login")
    const loggerArchivo = Log4js.getLogger("info");
    loggerArchivo.info(`Deslogueado`);
  })
    
        })


        

app.listen(8081)



