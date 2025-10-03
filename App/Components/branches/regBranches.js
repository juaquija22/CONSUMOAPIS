import {BranchesApi} from '../../../Apis/api.js';
import {CitiesApi, CompaniesApi} from '../../../Apis/api.js';
import branchModel from '../../../Models/branchesModel.js';

export class RegBranches extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.eventoEditar();
    this.eventoEliminar();
    this.disableFrm(true);
    this.loadCities();
    this.loadCompanies();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Registro de Sucursales <span class="badge rounded-pill text-bg-primary" id="idView"></span>
            </div>
            <div class="card-body">
                <form id="frmDatabranches">
                    <div class="row">
                        <div class="col">
                            <label for="numberComercial" class="form-label">Número Comercial</label>
                            <input type="text" class="form-control" id="numberComercial" name="numberComercial" required>
                        </div>
                        <div class="col">
                            <label for="contactName" class="form-label">Nombre de Contacto</label>
                            <input type="text" class="form-control" id="contactName" name="contactName" required>
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
                            <label for="phone" class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="phone" name="phone" required>
                        </div>
                        <div class="col">
                            <label for="cityId" class="form-label">Ciudad</label>
                            <select class="form-control" id="cityId" name="cityId" required>
                                <option value="">Seleccionar ciudad...</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="companyId" class="form-label">Empresa</label>
                            <select class="form-control" id="companyId" name="companyId" required>
                                <option value="">Seleccionar empresa...</option>
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

  async loadCompanies() {
    try {
      const companies = await CompaniesApi.getAll();
      const select = this.querySelector('#companyId');
      select.innerHTML = '<option value="">Seleccionar empresa...</option>' +
        companies.map(company => `<option value="${company.id}">${company.name}</option>`).join('');
    } catch (error) {
      console.error('Error al cargar empresas:', error);
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
      const frmRegistro = document.querySelector('#frmDatabranches');
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      // Validar que el número comercial no esté vacío
      if (!datos.numberComercial || datos.numberComercial.trim() === '') {
          alert('El número comercial es obligatorio y no puede estar vacío');
          return;
      }
      
      // Validar que el nombre de contacto no esté vacío
      if (!datos.contactName || datos.contactName.trim() === '') {
          alert('El nombre de contacto es obligatorio y no puede estar vacío');
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
      
      // Validar que el teléfono no esté vacío
      if (!datos.phone || datos.phone.trim() === '') {
          alert('El teléfono es obligatorio y no puede estar vacío');
          return;
      }
      
      // Verificar que cityId y companyId no estén vacíos
      if (!datos.cityId || datos.cityId === '') {
          alert('Por favor selecciona una ciudad');
          return;
      }
      if (!datos.companyId || datos.companyId === '') {
          alert('Por favor selecciona una empresa');
          return;
      }
      
      BranchesApi.update(id, datos)
      .then(responseData => {
          alert('Sucursal actualizada exitosamente');
          this.resetIdView();
          this.disableFrm(true);
          this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
      })
      .catch(error => {
          console.error('Error al actualizar sucursal:', error.message);
          alert('Error al actualizar sucursal');
      });
  }

  delData = () =>{
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      if (confirm('¿Está seguro de eliminar esta sucursal?')) {
          BranchesApi.delete(id)
          .then(responseData => {
              alert('Sucursal eliminada exitosamente');
              this.resetIdView();
              this.disableFrm(true);
              this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
          })
          .catch(error => {
              console.error('Error al eliminar sucursal:', error.message);
              alert('Error al eliminar sucursal');
          });
      }
  }

  saveData = () =>{
          const frmRegistro = document.querySelector('#frmDatabranches');
          document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
              e.preventDefault(); // Prevenir reinicio de página
              e.stopImmediatePropagation();
              
              const datos = Object.fromEntries(new FormData(frmRegistro).entries());
              
              // Validar que el número comercial no esté vacío
              if (!datos.numberComercial || datos.numberComercial.trim() === '') {
                  alert('El número comercial es obligatorio y no puede estar vacío');
                  return;
              }
              
              // Validar que el nombre de contacto no esté vacío
              if (!datos.contactName || datos.contactName.trim() === '') {
                  alert('El nombre de contacto es obligatorio y no puede estar vacío');
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
              
              // Validar que el teléfono no esté vacío
              if (!datos.phone || datos.phone.trim() === '') {
                  alert('El teléfono es obligatorio y no puede estar vacío');
                  return;
              }
              
              // Verificar que cityId y companyId no estén vacíos
              if (!datos.cityId || datos.cityId === '') {
                  alert('Por favor selecciona una ciudad');
                  return;
              }
              if (!datos.companyId || datos.companyId === '') {
                  alert('Por favor selecciona una empresa');
                  return;
              }
              
              BranchesApi.create(datos)
              .then(responseData => {
                  alert('Sucursal creada exitosamente');
                  this.viewData(responseData.id);
                  this.disableFrm(true);
                  this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
              })
              .catch(error => {
                  console.error('Error al crear sucursal:', error.message);
                  alert('Error al crear sucursal');
              });
              
              this.ctrlBtn(e.target.dataset.ed);
          })
  }

  viewData = (id)=>{
      const idView = document.querySelector('#idView');
      idView.innerHTML = id;
  }

  disableFrm = (estado) =>{
          const frmRegistro = document.querySelector('#frmDatabranches');
          let myFrm = new FormData();
          Object.entries(branchModel).forEach(([key, value]) => myFrm.append(key, value));
          myFrm.forEach((value, key) => {
               if (frmRegistro.elements[key]) {
                   frmRegistro.elements[key].value = value;
                   frmRegistro.elements[key].disabled = estado;
               }
          })
      }
}

customElements.define("reg-branches", RegBranches);