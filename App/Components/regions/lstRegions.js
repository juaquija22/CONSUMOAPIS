import {RegionsApi} from '../../../Apis/api.js';
import {CountriesApi} from '../../../Apis/api.js';

export class LstRegions extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.loadRegions();
    this.countries = [];
    this.loadCountries();
  }

  async loadCountries() {
    try {
      this.countries = await CountriesApi.getAll();
    } catch (error) {
      console.error('Error al cargar países:', error);
    }
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Listado de Regiones
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>País</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="regionsTableBody">
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

  async loadRegions() {
    try {
      // Asegurar que los países estén cargados primero
      await this.loadCountries();
      const regions = await RegionsApi.getAll();
      this.renderTable(regions);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
      this.renderError();
    }
  }

  renderTable(regions) {
    const tbody = this.querySelector('#regionsTableBody');
    if (regions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay regiones registradas</td></tr>';
      return;
    }

    tbody.innerHTML = regions.map(region => {
      const country = this.countries.find(c => c.id == region.countryId);
      return `
        <tr>
          <td>${region.id}</td>
          <td>${region.name}</td>
          <td>${country ? country.name : 'N/A'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="editRegion('${region.id}', '${region.name}', '${region.countryId}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRegion('${region.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');

    // Agregar métodos globales para los botones
    window.editRegion = (id, name, countryId) => this.editRegion(id, name, countryId);
    window.deleteRegion = (id) => this.deleteRegion(id);
  }

  renderError() {
    const tbody = this.querySelector('#regionsTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar regiones</td></tr>';
  }

  editRegion(id, name, countryId) {
    // Encontrar el componente de registro
    const regComponent = document.querySelector('reg-regions');
    if (regComponent) {
      // Llenar el formulario
      const form = regComponent.querySelector('#frmDataregions');
      form.elements['name'].value = name;
      form.elements['countryId'].value = countryId;
      
      // Mostrar el ID
      const idView = regComponent.querySelector('#idView');
      idView.innerHTML = id;
      
      // Habilitar formulario
      regComponent.disableFrm(false);
      
      // Cambiar a la pestaña de registro
      const regTab = document.querySelector('button[data-verocultar*="regregions"]');
      if (regTab) regTab.click();
      
      // Configurar botones para edición
      regComponent.ctrlBtn('[["#btnEditar"],["#btnGuardar","#btnCancelar","#btnNuevo","#btnEliminar"]]');
    }
  }

  async deleteRegion(id) {
    if (confirm('¿Está seguro de eliminar esta región?')) {
      try {
        await RegionsApi.delete(id);
        alert('Región eliminada exitosamente');
        this.loadRegions(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar región:', error);
        alert('Error al eliminar región');
      }
    }
  }
}

customElements.define("lst-regions", LstRegions);