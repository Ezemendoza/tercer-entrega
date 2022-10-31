const faker = require("@faker-js/faker")

const socket = io.connect();

socket.on("mensaje", (info) =>{
  mostrarMensajes(info).then((html)=>{
    document.getElementById("mensajes").innerHTML=html

  })
});

socket.on("listaProducto", (data) =>{
  mostrarProductos(data).then((html)=>{
    document.getElementById("listaProductos").innerHTML=html
  })
});


function mostrarMensajes(info){
  return fetch("./inicio.hbs")
  .then((respuesta)=> respuesta.text())
  .then((plantilla)=>{
    const template = Handlebars.compile(plantilla)
  const html = template({info})
  return html
  })
}


function mostrarProductos(data){
  console.log(data)
  return fetch("./inicio.hbs")
  .then((respuesta)=> respuesta.text())
  .then((plantilla)=>{
    const template = Handlebars.compile(plantilla)
  const html = template({data})
  return html
  })
}

function addMessage(e) {
e.preventDefault()
  const mensaje = {
    nombre: document.getElementById("nombre").value,
    talle: document.getElementById("talle").value,
    id: document.getElementsByClassName("tabla").length + 1,
    agregado: socket.id,
  };

  socket.emit("new-listaProducto", mensaje);
  return false;
}  




function agregarMensaje(e) {
  console.log("hola")
  e.preventDefault()
  const mensaje = {
    autor: {
      nombre: faker.name.firstName(),
      apellido:faker.name.lastName(),
      edad:faker.commerce.price(18, 50),
      email:faker.internet.email(nombre,apellido),
      avatar:faker.internet.avatar(),
    },
    texto:document.getElementById("texto").value,
    horario: new Date().toString()
  };
  console.log(mensaje)
  socket.emit("mensaje", mensaje);
  return false;
}