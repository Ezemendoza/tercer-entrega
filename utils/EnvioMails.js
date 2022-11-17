import nodemailer from "nodemailer"

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

  export  {compraUser, enviarMail}
  
