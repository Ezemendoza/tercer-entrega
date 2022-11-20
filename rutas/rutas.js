import {auth} from "../middleware/auth.js"
import {compraUser, enviarMail} from "../utils/EnvioMails.js"
import {comprarWhatsapp, enviarwhatsapp} from "../utils/EnvioWhatsapp.js"
import {getDateId, buscarProducto} from "../middleware/datos.js"
import {app,passport} from "../middleware/express.js"
import {Productos, User }from "../src/models/User.js"
import bcrypt from "bcrypt"
import {loggerInfo, loggerWarn, loggerError} from "../middleware/logs.js"
let carrito= []

app.get("/register",(req,res)=>{res.render("register")})

app.post("/register", (req,res)=>{
  const { email , password, nombre,direccion,edad,phone,  image} = req.body 
  User.findOne({email}, async (err, user)=>{
    if(err) loggerError.error(err);
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
      await  newUser.save()
      // enviarMail(email)
      // enviarwhatsapp(email)
      res.redirect("login")
    }
  })
})


app.get("/loginerror", (req, res) => {res.render("loginerror");});
app.get("/login", (req,res)=>{res.render("login")})

app.post( "/login", 
passport.authenticate("local", { failureRedirect: "loginerror" }), 
(req, res) => { 
  res.redirect("inicio");}
);


app.get("/inicio", auth, async (req,res)=>{
     loggerError.info("Se inicio sesion");
      const registros =  await Productos.find().lean()
      const datosUsuario = await User.findById(req.user._id).lean();
      res.render("inicio",{datos:datosUsuario, productos:registros})
})


app.post("/inicio", async (req,res)=>{res.render("inicio",{datos:datosUsuario, productos:registros})})

app.get("/:navbar", auth,async (req,res)=>{ 
  const si = await Productos.find().lean()
  const dale = await si.filter(el=>el.categoria === req.params.navbar)
  const datosUsuario = await User.findById(req.user._id).lean();
    res.render("inicio",{datos:datosUsuario, productos:dale})
})


app.get("/checkout/carrito", auth,async (req,res)=>{ 
  const datosUsuario = User.findById(req.user._id).lean();
  res.render("carrito",{datos:datosUsuario,productos:carrito})
})



app.post("/checkout/carrito/finalizar", auth, async (req,res)=>{
  const datosUsuario = User.findById(req.user._id).lean();
console.log(datosUsuario)
comprarWhatsapp(req.body,datosUsuario)
compraUser(req.body,datosUsuario)
})

app.get("/logout",(req,res)=>{ req.logout(function(err){
   if(err){
      return next(err)
      }
      loggerInfo.info("Se ha cerrado la sesion");
       res.redirect("login")})}
      )

      app.get("*", (req, res) => {
        const { url} = req;
        loggerWarn.warn(`Ruta ${url} inexistente`);
        res.send(`Ruta ${url} inexistente`);
      });
export default app