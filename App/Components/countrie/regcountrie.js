import {CountriesApi} from '../../../Apis/api.js';
import countryModel from '../../../Models/countrieModel.js';
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
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>

                    </div>
                    <div class="row mt-3">
                        <div class="col">
                            <div class="container mt-4 text-center">
                                <a href="#" class="btn btn-primary"  id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                                <a href="#" class="btn btn-dark d-none" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
                                <a href="#" class="btn btn-success d-none" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar</a>
                                <a href="#" class="btn btn-warning d-none" id="btnEditar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnCancelar","#btnEditar","#btnEliminar"]]'>Editar</a>
                                <a href="#" class="btn btn-danger d-none" id="btnEliminar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Eliminar</a>
                            </div>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
      `;
      this.querySelector("#btnNuevo").addEventListener("click",(e) =>{
        e.preventDefault();
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(false);
        this.clearForm();
      })
      this.querySelector("#btnCancelar").addEventListener("click",(e) =>{
        e.preventDefault();
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(true);
      })
  }
resetIdView =() =>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = '';   
}
eventoEditar =() =>{
    const btnEditar = document.querySelector('#btnEditar');
    if (btnEditar) {
        btnEditar.addEventListener("click",(e) =>{
            console.log('Botón Editar clickeado');
            this.editData();
            e.stopImmediatePropagation();
            e.preventDefault();        
        });
    } else {
        console.error('Botón Editar no encontrado');
    }
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
        btnActual.classList.remove('d-none');
    });
    data[1].forEach(boton => {
        let btnActual = document.querySelector(boton);
        btnActual.classList.add('d-none');
    });
}
enabledBtns =() =>{
    document.querySelectorAll(".btn").forEach((val, id) => {
        this.ctrlBtn(val.dataset.ed);
    })
}
editData = () =>{
    console.log('editData ejecutándose');
    const frmRegistro = document.querySelector('#frmDatacountrie');
    const datos = Object.fromEntries(new FormData(frmRegistro).entries());
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    
    console.log('ID a editar:', id);
    console.log('Datos a enviar:', datos);
    
    // Validar que el nombre no esté vacío
    if (!datos.name || datos.name.trim() === '') {
        alert('El nombre del país es obligatorio y no puede estar vacío');
        return;
    }
    
    CountriesApi.update(id, datos)
    .then(responseData => {
        alert('País actualizado exitosamente');
        this.resetIdView();
        this.disableFrm(true);
        this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
    })
    .catch(error => {
        console.error('Error al actualizar país:', error.message);
        alert('Error al actualizar país');
    });
    
}
delData = () =>{
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    
    if (confirm('¿Está seguro de eliminar este país?')) {
        CountriesApi.delete(id)
        .then(responseData => {
            alert('País eliminado exitosamente');
            this.resetIdView();
            this.disableFrm(true);
            this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
        })
        .catch(error => {
            console.error('Error al eliminar país:', error.message);
            alert('Error al eliminar país');
        });
    }
}
  saveData = () =>{
          const frmRegistro = document.querySelector('#frmDatacountrie');
          document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
              e.preventDefault(); // Prevenir reinicio de página
              e.stopImmediatePropagation();
              
              const datos = Object.fromEntries(new FormData(frmRegistro).entries());
              
              // Validar que el nombre no esté vacío
              if (!datos.name || datos.name.trim() === '') {
                  alert('El nombre del país es obligatorio y no puede estar vacío');
                  return;
              }
              
              CountriesApi.create(datos)
              .then(responseData => {
                  alert('País creado exitosamente');
                  this.viewData(responseData.id);
                  this.disableFrm(true);
                  this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
              })
              .catch(error => {
                  console.error('Error al crear país:', error.message);
                  alert('Error al crear país');
              });
              
              this.ctrlBtn(e.target.dataset.ed);
          })
  }
viewData = (id)=>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = id;
}
  disableFrm = (estado) =>{
          const frmRegistro = document.querySelector('#frmDatacountrie');
          if (frmRegistro) {
              frmRegistro.elements['name'].disabled = estado;
          }
      }

  clearForm = () => {
          const frmRegistro = document.querySelector('#frmDatacountrie');
          if (frmRegistro) {
              frmRegistro.elements['name'].value = '';
          }
      }
}
customElements.define("reg-countrie", Regcountrie);