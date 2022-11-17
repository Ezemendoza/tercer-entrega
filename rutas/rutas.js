import {auth} from "../middleware/auth.js"
import {compraUser, enviarMail} from "../utils/EnvioMails.js"
import {comprarWhatsapp, enviarwhatsapp} from "../utils/EnvioWhatsapp.js"
import {getDateId, buscarProducto} from "../middleware/datos.js"
import {app,passport} from "../middleware/express.js"
import {Productos, User }from "../src/models/User.js"
import bcrypt from "bcrypt"
let carrito= []

app.get("/register",(req,res)=>{res.render("register")})

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
      const registros =  await Productos.find().lean()
      const datosUsuario = getDateId(req.user._id)
      res.render("inicio",{datos:datosUsuario, productos:registros})
})


app.post("/inicio", async (req,res)=>{res.render("inicio",{datos:datosUsuario, productos:registros})})

app.get("/:navbar", auth,async (req,res)=>{ 
  const si = await Productos.find().lean()
  const dale = await si.filter(el=>el.categoria === req.params.navbar)
  const datosUsuario = await getDateId(req.user._id)
    res.render("inicio",{datos:datosUsuario, productos:dale})
})


app.get("/checkout/carrito", auth,async (req,res)=>{ 
  const datosUsuario = getDateId(req.user._id)
  res.render("carrito",{datos:datosUsuario,productos:carrito})
})



app.post("/checkout/carrito/finalizar", auth, async (req,res)=>{
  const datosUsuario = getDateId(req.user._id)
comprarWhatsapp(req.body,datosUsuario)
compraUser(req.body,datosUsuario)
})

app.get("/logout",(req,res)=>{ req.logout(function(err){
   if(err){
      return next(err)} res.redirect("login")})}
      )


export default app