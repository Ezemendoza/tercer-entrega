import cookieParser from "cookie-parser"
import express from "express"
import handlebars from"express-handlebars"
import passport from "passport";
import User, { Productos } from "./src/models/User.js"
import session from "express-session"
import bcrypt from "bcrypt"
import { Strategy } from "passport-local";
import path from "path";
import "./db/config.js"
import {auth} from "./middleware/auth.js"
import nodemailer from "nodemailer"
import twilio from "twilio";
import Handlebars from "handlebars"
import multer from "multer";

const accountSid = 'AC4a8038a29096cdb228cdeb74b95a12e7'; 
const authToken = 'b08513e286ea6feca9c9e6dfbdc09c9e'; 
const client = twilio(accountSid, authToken);
const LocalStrategy = Strategy;
const app = express();
const navbar = Handlebars.compile('./views/navbar.hbs').toString('utf-8');
Handlebars.registerPartial('navbar', navbar);

const enviarMail =async (email)=>{
  const config = {
    host:"smtp.gmail.com",
    port:"587",
    auth:{
      user:"ezequielmendoza99@gmail.com",
      pass:"qrgyujtzixarpthz"
    }
  }
  const mensaje = {
    from:"ezequielmendoza99@gmail.com",
    to:"ezequielmendoza99@gmail.com",
    subject:"Nuevo registro",
    text :`Se creo una nueva cuenta con el mail ${email}`
  }
  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje)
}

const compraMail =async (productos,datos)=>{
  try {
    const message = await client.messages.create({
      body:`Se realizo una compra con el email ${datos.email} a entregar a ${datos.direccion}, los productos que se compro fue ${productos.titulo} con ${productos.cantidad}  a ${productos.precio} c/u`, 
      from: 'whatsapp:+14155238886',    
      to: 'whatsapp:+5491121664682',
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
}


const compraUser =async (productos,datos)=>{

  const config = {
    host:"smtp.gmail.com",
    port:"587",
    auth:{
      user:"ezequielmendoza99@gmail.com",
      pass:"qrgyujtzixarpthz"
    }
  }
  const mensaje = {
    from:"ezequielmendoza99@gmail.com",
    to:"ezequielmendoza99@gmail.com",
    subject:"Nuevo compra",
    text :`Se realizo una compra con el email ${datos.email} a entregar a ${datos.direccion}, los productos que se compro fue ${productos.titulo} con ${productos.cantidad}  a ${productos.precio} c/u`
  }
  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje)
}

const enviarwhatsapp =async (email)=>{
  try {
    const message = await client.messages.create({
      body: `Se creo una nueva cuenta con el siguiente mail: ${email}`, 
      from: 'whatsapp:+14155238886',    
      to: 'whatsapp:+5491121664682',
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
}
 let carrito= []

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

  const { email , password, nombre,direccion,edad,phone,  image} = req.body
  console.log(image)
  User.findOne({email}, async (err, user)=>{

    if(err) console.log(err);
    if(user) res.render("register-error")
    if(!user){
      const hashedPass= await bcrypt.hash(password, 8)
      const newUser = new User({
        email:email, 
        password:hashedPass,
        nombre:nombre,
        direccion:direccion,
        edad:edad,
        phone:phone,
        image:image
      })

      await newUser.save()
      enviarMail(email)
      enviarwhatsapp(email)
      res.redirect("login")
    }
  })
})
app.get("/loginerror", (req, res) => {
  res.render("loginerror");
});

app.get("/login", (req,res)=>{
    res.render("login")
})
app.post( "/login", 
passport.authenticate("local", { failureRedirect: "loginerror" }), 
(req, res) => {

    res.redirect("inicio");
  }
);


app.get("/inicio", 
auth,
 async (req,res)=>{
  let registros = await Productos.find().lean()

    const datosUsuario = await User.findById(req.user._id).lean()
      res.render("inicio",
      {
        datos:datosUsuario, 
        productos:registros})
})


app.post("/inicio", 

 async (req,res)=>{
  console.log(req)
      res.render("inicio",
      {
        datos:datosUsuario, 
        productos:registros})
})

app.get("/:navbar", 

auth,
 async (req,res)=>{
  const si = await Productos.find(
    { categoria: "celulares" }
).lean()
const dale = si.filter(el=>el.categoria === req.params.navbar)
    const datosUsuario = await User.findById(req.user._id).lean()
res.render("inicio",
{
  datos:datosUsuario, 
  productos:dale})

    
})


app.post("/:navbar", 

auth,
 async (req,res)=>{
console.log(req.params.navbar)

    
})
app.get("/checkout/carrito", 
auth,
 async (req,res)=>{

    const datosUsuario = await User.findById(req.user._id).lean()
      res.render("carrito",
      {
        datos:datosUsuario, 
        productos:carrito})
    
})


app.post("/checkout/carrito", 
auth,
 async (req,res)=>{
  console.log(carrito)
carrito.push(req.body)
  console.log(req.body)
})

app.post("/checkout/carrito/finalizar", 
auth,
 async (req,res)=>{
  const datosUsuario = await User.findById(req.user._id).lean()
compraMail(req.body,datosUsuario)
compraUser(req.body,datosUsuario)
})

app.get("/logout",(req,res)=>{
  req.logout(function(err){
    if(err){
      return next(err)
    }
    res.redirect("login")
  })
    
        })



app.listen(8080)



