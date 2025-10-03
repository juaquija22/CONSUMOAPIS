import {RegionsApi} from '../../../Apis/api.js';
import {CountriesApi} from '../../../Apis/api.js';
import regionModel from '../../../Models/regionModel.js';

export class RegRegions extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.eventoEditar();
    this.eventoEliminar();
    this.disableFrm(true);
    this.loadCountries();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Registro de Regiones <span class="badge rounded-pill text-bg-primary" id="idView"></span>
            </div>
            <div class="card-body">
                <form id="frmDataregions">
                    <div class="row">
                        <div class="col">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="col">
                            <label for="countryId" class="form-label">País</label>
                            <select class="form-control" id="countryId" name="countryId" required>
                                <option value="">Seleccionar país...</option>
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

  async loadCountries() {
    try {
      const countries = await CountriesApi.getAll();
      const select = this.querySelector('#countryId');
      select.innerHTML = '<option value="">Seleccionar país...</option>' +
        countries.map(country => `<option value="${country.id}">${country.name}</option>`).join('');
    } catch (error) {
      console.error('Error al cargar países:', error);
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
      const frmRegistro = document.querySelector('#frmDataregions');
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      // Validar que el nombre no esté vacío
      if (!datos.name || datos.name.trim() === '') {
          alert('El nombre de la región es obligatorio y no puede estar vacío');
          return;
      }
      
      // Verificar que countryId no esté vacío
      if (!datos.countryId || datos.countryId === '') {
          alert('Por favor selecciona un país');
          return;
      }
      
      RegionsApi.update(id, datos)
      .then(responseData => {
          alert('Región actualizada exitosamente');
          this.resetIdView();
          this.disableFrm(true);
          this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
      })
      .catch(error => {
          console.error('Error al actualizar región:', error.message);
          alert('Error al actualizar región');
      });
  }

  delData = () =>{
      const idView = document.querySelector('#idView');
      let id = idView.textContent;
      
      if (confirm('¿Está seguro de eliminar esta región?')) {
          RegionsApi.delete(id)
          .then(responseData => {
              alert('Región eliminada exitosamente');
              this.resetIdView();
              this.disableFrm(true);
              this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
          })
          .catch(error => {
              console.error('Error al eliminar región:', error.message);
              alert('Error al eliminar región');
          });
      }
  }

  saveData = () =>{
          const frmRegistro = document.querySelector('#frmDataregions');
          document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
              e.preventDefault(); // Prevenir reinicio de página
              e.stopImmediatePropagation();
              
              const datos = Object.fromEntries(new FormData(frmRegistro).entries());
              
              // Validar que el nombre no esté vacío
              if (!datos.name || datos.name.trim() === '') {
                  alert('El nombre de la región es obligatorio y no puede estar vacío');
                  return;
              }
              
              // Verificar que countryId no esté vacío
              if (!datos.countryId || datos.countryId === '') {
                  alert('Por favor selecciona un país');
                  return;
              }
              
              RegionsApi.create(datos)
              .then(responseData => {
                  alert('Región creada exitosamente');
                  this.viewData(responseData.id);
                  this.disableFrm(true);
                  this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]');
              })
              .catch(error => {
                  console.error('Error al crear región:', error.message);
                  alert('Error al crear región');
              });
              
              this.ctrlBtn(e.target.dataset.ed);
          })
  }

  viewData = (id)=>{
      const idView = document.querySelector('#idView');
      idView.innerHTML = id;
  }

  disableFrm = (estado) =>{
          const frmRegistro = document.querySelector('#frmDataregions');
          let myFrm = new FormData();
          Object.entries(regionModel).forEach(([key, value]) => myFrm.append(key, value));
          myFrm.forEach((value, key) => {
               if (frmRegistro.elements[key]) {
                   frmRegistro.elements[key].value = value;
                   frmRegistro.elements[key].disabled = estado;
               }
          })
      }
}

customElements.define("reg-regions", RegRegions);