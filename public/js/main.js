const socket = io.connect()
user = true

//-------------------------

function validateEmail(email) {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if(email.match(mailformat)) {
    return true
  } else {
    alert("You have entered an invalid email address!");
    return false
  }
}


function validateProducto(producto) { // retorna true si hay algun campo vacio
  return Object.values(producto).includes('')
}



//-------------------------------------------------
//------------------ FORMULARIO
// se muestra formulario si el usuario es administrador
if (user) {

  const htmlNewProductForm = templateForm()
 
  document.querySelector('#soloAdministrador').innerHTML = htmlNewProductForm

  //--- Nuevo producto
  const formulario = document.getElementById('formulario')
  formulario.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formulario[0].value,
        description: formulario[1].value,
        code: formulario[2].value,
        price: formulario[3].value,
        stock: formulario[4].value,
        thumbnail: formulario[5].value
    }
    if (validateProducto(producto)){
      alert('Complete todos los datos del producto')
    
    } else {
      socket.emit('update', producto)
      
    }
  })

}


//--- PRODUCTOS Y CARRITOS en HTML
socket.on('productos', productos => { 
  document.querySelector('#productos').innerHTML = templateProductos( productos )  
})

socket.on('carritos', carritos => {
  document.querySelector('#carritos').innerHTML = templateCarritos( carritos )
})



//----------------------------------------------


const idProdNew = document.getElementById("idProdNew")
const idProdCartNew = document.getElementById("idProdCartNew")
const idCartList = document.getElementById("idCartList")
const idCartDel = document.getElementById("idCartDel")
const idProdDel = document.getElementById("idProdDel")
const idProdCartDel = document.getElementById("idProdCartDel")

//--- Nuevo carrito 
document.getElementById("newCartBtn").addEventListener("click", ev => {
  fetch('http://localhost:8080/api/carrito/', {
    method: 'POST'
  })
    .then((response) => response.text())
    .then((text) => {
      alert('Se ha creado carrito con id: ' + text)
      socket.emit('newCart')
    })
})

//-- Agregar producto en carrito
document.getElementById("newItemCartBtn").addEventListener("click", ev => {
  fetch(`http://localhost:8080/api/carrito/${idProdCartNew.value}/productos/${idProdNew.value}`, {
    method: 'POST'
  })
    .then((response) => response.text())
    .then((text) => {
      alert(text)
      idProdNew.value = ''
    })
})

//-- Listar productos del carrito
document.getElementById("listItemCartBtn").addEventListener("click", ev => {
  fetch(`http://localhost:8080/api/carrito/${idCartList.value}/productos/`, {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('#itemCartList').innerHTML = templateListaProductos( data )
      idCartList.value = ''
    })
})

//-- Borrar carrito
document.getElementById("deleteCartBtn").addEventListener("click", ev => {
  fetch(`http://localhost:8080/api/carrito/${idCartDel.value}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .then((response) => response.text())
    .then((text) => {
      alert('Carrito ' + idCartDel.value + ' borrado.')
      idCartDel.value = ''
      socket.emit('newCart')
    })
})

//-- Borrar elemento de carrito
document.getElementById("deleteItemCartBtn").addEventListener("click", ev => {
  fetch(`http://localhost:8080/api/carrito/${idProdCartDel.value}/productos/${idProdDel.value}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .then((response) => response.text())
    .then((text) => {
      console.log(text)
      idProdDel.value = ''
    })
})


