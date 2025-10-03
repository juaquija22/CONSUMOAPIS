import {CompaniesApi} from '../../../Apis/api.js';
import {CitiesApi} from '../../../Apis/api.js';
import companyModel from '../../../Models/companieModel.js';

export class RegCompanies extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.eventoEditar();
    this.eventoEliminar();
    this.disableFrm(true);
    this.loadCities();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Registro de Empresas <span class="badge rounded-pill text-bg-primary" id="idView"></span>
            </div>
            <div class="card-body">
                <form id="frmDatacompanies">
                    <div class="row">
                        <div class="col">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="address" class="form-label">Dirección</label>
                            <input type="text" class="form-control" id="address" name="address" required>
                        </div>
                        <div class="col">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="cityId" class="form-label">Ciudad</label>
                            <select class="form-control" id="cityId" name="cityId" required>
                                <option value="">Seleccionar ciudad...</option>
                            </select>
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
      })
      this.querySelector("#btnCancelar").addEventListener("click",(e) =>{
        e.preventDefault();
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(true);
      })
  }

  async loadCities() {
    try {
      const cities = await CitiesApi.getAll();
      const select = this.querySelector('#cityId');
      select.innerHTML = '<option value="">Seleccionar ciudad...</option>' +
        cities.map(city => `<option value="${city.id}">${city.name}</option>`).join('');
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
    }
  }

  resetIdView =() =>{
      const idView = document.querySelector('#idView');
      idView.innerHTML = '';   
  }

  eventoEditar =() =>{
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
      const frmRegistro = document.querySelector('#frmDatacompanies');
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      // Validar que el nombre no esté vacío
      if (!datos.name || datos.name.trim() === '') {
          alert('El nombre de la empresa es obligatorio y no puede estar vacío');
          return;
      }
      
      // Validar que la dirección no esté vacía
      if (!datos.address || datos.address.trim() === '') {
          alert('La dirección es obligatoria y no puede estar vacía');
          return;
      }
      
      // Validar que el email no esté vacío
      if (!datos.email || datos.email.trim() === '') {
          alert('El email es obligatorio y no puede estar vacío');
          return;
      }
      
      // Verificar que cityId no esté vacío
      if (!datos.cityId || datos.cityId === '') {
          alert('Por favor selecciona una ciudad');
          return;
      }
      
      CompaniesApi.update(id, datos)
      .then(responseData => {
          alert('Empresa actualizada exitosamente');
          this.resetIdView();
          this.disableFrm(true);
          this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
      })
      .catch(error => {
          console.error('Error al actualizar empresa:', error.message);
          alert('Error al actualizar empresa');
      });
  }

  delData = () =>{
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      if (confirm('¿Está seguro de eliminar esta empresa?')) {
          CompaniesApi.delete(id)
          .then(responseData => {
              alert('Empresa eliminada exitosamente');
              this.resetIdView();
              this.disableFrm(true);
              this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
          })
          .catch(error => {
              console.error('Error al eliminar empresa:', error.message);
              alert('Error al eliminar empresa');
          });
      }
  }

  saveData = () =>{
          const frmRegistro = document.querySelector('#frmDatacompanies');
          document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
              e.preventDefault(); // Prevenir reinicio de página
              e.stopImmediatePropagation();
              
              const datos = Object.fromEntries(new FormData(frmRegistro).entries());
              
              // Validar que el nombre no esté vacío
              if (!datos.name || datos.name.trim() === '') {
                  alert('El nombre de la empresa es obligatorio y no puede estar vacío');
                  return;
              }
              
              // Validar que la dirección no esté vacía
              if (!datos.address || datos.address.trim() === '') {
                  alert('La dirección es obligatoria y no puede estar vacía');
                  return;
              }
              
              // Validar que el email no esté vacío
              if (!datos.email || datos.email.trim() === '') {
                  alert('El email es obligatorio y no puede estar vacío');
                  return;
              }
              
              // Verificar que cityId no esté vacío
              if (!datos.cityId || datos.cityId === '') {
                  alert('Por favor selecciona una ciudad');
                  return;
              }
              
              CompaniesApi.create(datos)
              .then(responseData => {
                  alert('Empresa creada exitosamente');
                  this.viewData(responseData.id);
                  this.disableFrm(true);
                  this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
              })
              .catch(error => {
                  console.error('Error al crear empresa:', error.message);
                  alert('Error al crear empresa');
              });
              
              this.ctrlBtn(e.target.dataset.ed);
          })
  }

  viewData = (id)=>{
      const idView = document.querySelector('#idView');
      idView.innerHTML = id;
  }

  disableFrm = (estado) =>{
          const frmRegistro = document.querySelector('#frmDatacompanies');
          let myFrm = new FormData();
          Object.entries(companyModel).forEach(([key, value]) => myFrm.append(key, value));
          myFrm.forEach((value, key) => {
               if (frmRegistro.elements[key]) {
                   frmRegistro.elements[key].value = value;
                   frmRegistro.elements[key].disabled = estado;
               }
          })
      }
}

customElements.define("reg-companies", RegCompanies);