import {postContacts,patchContacts,deleteContacts} from '../../../Apis/contact/contactApi.js';
import ContactModel from '../../../Models/countrieModel.js';
export class Regcountrie extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.eventoEditar();
    this.eventoEliminar();
    this.disableFrm(true);
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/countrie/countrieStyle.css";
      </style>
        <div class="card mt-3">
            <div class="card-header">
                Registro de paises <span class="badge rounded-pill text-bg-primary" id="idView"></span>
            </div>
            <div class="card-body">
                <form id="frmDatacountrie">
                    <div class="row">
                        <div class="col">
                            <label for="nombrecountrie" class="form-label">Name</label>
                            <input type="text" class="form-control" id="nombrecountrie" name ="nombrecountrie">
                        </div>

                    </div>
                    <div class="row mt-3">
                        <div class="col">
                            <div class="container mt-4 text-center">
                                <a href="#" class="btn btn-primary"  id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                                <a href="#" class="btn btn-dark " id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
                                <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar</a>
                                <a href="#" class="btn btn-warning" id="btnEditar" data-ed='[[],[]]'>Editar</a>
                                <a href="#" class="btn btn-danger" id="btnEliminar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Eliminar</a>
                            </div>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
      `;
      this.querySelector("#btnNuevo").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(false);
      })
      this.querySelector("#btnCancelar").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(true);
      })
  }
resetIdView =() =>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = '';   
}
eventoEditar =() =>{countries
    document.querySelector('#btnEditar').addEventListener("click",(e) =>{
        this.editData();
        e.stopImmediatePropagation();
        e.preventDefault();        
    });
}
eventoEliminar =() =>{
    document.querySelector('#btnEliminar').addEventListener("click",(e) =>{
        this.delData();
        e.stopImmediatePropagation();
        e.preventDefault();        
    });
}
ctrlBtn = (e) =>{
    let data = JSON.parse(e);
    data[0].forEach(boton => {
        let btnActual = document.querySelector(boton);
        btnActual.classList.remove('disabled');
    });
    data[1].forEach(boton => {
        let btnActual = document.querySelector(boton);
        btnActual.classList.add('disabled');
    });
}
enabledBtns =() =>{
    document.querySelectorAll(".btn").forEach((val, id) => {
        this.ctrlBtn(val.dataset.ed);
    })
}
editData = () =>{
    const frmRegistro = document.querySelector('#frmDatacountrie');
    const datos = Object.fromEntries(new FormData(frmRegistro).entries());
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    patchContacts(datos,id)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
        if (response.ok) {
            return response.json(); // Devolver la respuesta como JSON
        } else {
            // Si la respuesta no fue exitosa, lanzar una excepción
            throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
        }
    })
    .then(responseData => {
        // Hacer algo con la respuesta exitosa si es necesario
    })
    .catch(error => {
        console.error('Error en la solicitud POST:', error.message);
        // Puedes manejar el error de otra manera si es necesario
    });
    
}
delData = () =>{
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    deleteContacts(id)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
        if (response.ok) {
            return response.json(); // Devolver la respuesta como JSON
        } else {
            // Si la respuesta no fue exitosa, lanzar una excepción
            throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
        }
    })
    .then(responseData => {
        this.resetIdView();
        this.disableFrm(true);
        this.ctrlBtn(e.target.dataset.ed);
        // Hacer algo con la respuesta exitosa si es necesario
    })
    .catch(error => {
        console.error('Error en la solicitud POST:', error.message);
        // Puedes manejar el error de otra manera si es necesario
    });   
}
saveData = () =>{
        const frmRegistro = document.querySelector('#frmDatacountrie');
        document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
            const datos = Object.fromEntries(new FormData(frmRegistro).entries());
            postContacts(datos)
            .then(response => {
                // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
                if (response.ok) {
                    return response.json(); // Devolver la respuesta como JSON
                } else {
                    // Si la respuesta no fue exitosa, lanzar una excepción
                    throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                }
            })
            .then(responseData => {
                // Hacer algo con la respuesta exitosa si es necesario
                this.viewData(responseData.id);
            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error.message);
                // Puedes manejar el error de otra manera si es necesario
            });
            this.ctrlBtn(e.target.dataset.ed);
            e.stopImmediatePropagation();
            e.preventDefault();
        })
}
viewData = (id)=>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = id;
}
disableFrm = (estado) =>{
    let frm={
        nombrecountrie: '', 
        apellidocountrie: '', 
        nroCelular: '', 
        emailcountrie: '', 
        nroResidencia: ''
    }
        const frmRegistro = document.querySelector('#frmDatacountrie');
        let myFrm = new FormData();
        Object.entries(ContactModel).forEach(([key, value]) => myFrm.append(key, value));
        myFrm.forEach((value, key) => {
             frmRegistro.elements[key].value= value;
             frmRegistro.elements[key].disabled = estado;
        })
    }
}
customElements.define("reg-countrie", Regcountrie);