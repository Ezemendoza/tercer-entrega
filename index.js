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
import nodemailer from "nodemailer"

const LocalStrategy = Strategy;
const app = express();

enviarMail =async (email)=>{
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
app.post( "/login", passport.authenticate("local", { failureRedirect: "loginerror" }), (req, res) => {

    res.redirect("inicio");
  }
);


app.get("/inicio", auth, async (req,res)=>{

      const datosUsuario = await User.findById(req.user._id).lean()

      res.render("inicio",{datos:datosUsuario})
    
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



