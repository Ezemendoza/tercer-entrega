import twilio from "twilio";

const accountSid = 'AC4a8038a29096cdb228cdeb74b95a12e7'; 
const authToken = 'b08513e286ea6feca9c9e6dfbdc09c9e'; 
const client = twilio(accountSid, authToken);

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
  const comprarWhatsapp =async (productos,datos)=>{
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

  export {comprarWhatsapp, enviarwhatsapp}