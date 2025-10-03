import {CitiesApi} from '../../../Apis/api.js';
import {RegionsApi} from '../../../Apis/api.js';

export class LstCities extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.loadCities();
    this.regions = [];
    this.loadRegions();
  }

  async loadRegions() {
    try {
      this.regions = await RegionsApi.getAll();
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    }
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Listado de Ciudades
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Región</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="citiesTableBody">
                            <tr>
                                <td colspan="4" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>     
      `
  }

  async loadCities() {
    try {
      // Asegurar que las regiones estén cargadas primero
      await this.loadRegions();
      const cities = await CitiesApi.getAll();
      this.renderTable(cities);
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
      this.renderError();
    }
  }

  renderTable(cities) {
    const tbody = this.querySelector('#citiesTableBody');
    if (cities.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay ciudades registradas</td></tr>';
      return;
    }

    tbody.innerHTML = cities.map(city => {
      const region = this.regions.find(r => r.id == city.regionId);
      return `
        <tr>
          <td>${city.id}</td>
          <td>${city.name}</td>
          <td>${region ? region.name : 'N/A'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="editCity('${city.id}', '${city.name}', '${city.regionId}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCity('${city.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');

    // Agregar métodos globales para los botones
    window.editCity = (id, name, regionId) => this.editCity(id, name, regionId);
    window.deleteCity = (id) => this.deleteCity(id);
  }

  renderError() {
    const tbody = this.querySelector('#citiesTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar ciudades</td></tr>';
  }

  editCity(id, name, regionId) {
    // Encontrar el componente de registro
    const regComponent = document.querySelector('reg-cities');
    if (regComponent) {
      // Llenar el formulario
      const form = regComponent.querySelector('#frmDatacities');
      form.elements['name'].value = name;
      form.elements['regionId'].value = regionId;
      
      // Mostrar el ID
      const idView = regComponent.querySelector('#idView');
      idView.innerHTML = id;
      
      // Habilitar formulario
      regComponent.disableFrm(false);
      
      // Cambiar a la pestaña de registro
      const regTab = document.querySelector('button[data-verocultar*="regcities"]');
      if (regTab) regTab.click();
      
      // Configurar botones para edición
      regComponent.ctrlBtn('[["#btnEditar"],["#btnGuardar","#btnCancelar","#btnNuevo","#btnEliminar"]]');
    }
  }

  async deleteCity(id) {
    if (confirm('¿Está seguro de eliminar esta ciudad?')) {
      try {
        await CitiesApi.delete(id);
        alert('Ciudad eliminada exitosamente');
        this.loadCities(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar ciudad:', error);
        alert('Error al eliminar ciudad');
      }
    }
  }
}

customElements.define("lst-cities", LstCities);