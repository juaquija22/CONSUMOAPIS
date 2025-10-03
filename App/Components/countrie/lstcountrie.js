import {CountriesApi} from '../../../Apis/api.js';
export class Lstcountrie extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.loadCountries();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/countrie/countrieStyle.css";
      </style>
        <div class="card mt-3">
            <div class="card-header">
                Listado de Países
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="countriesTableBody">
                            <tr>
                                <td colspan="3" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>     
      `

  }

  async loadCountries() {
    try {
      const countries = await CountriesApi.getAll();
      this.renderTable(countries);
    } catch (error) {
      console.error('Error al cargar países:', error);
      this.renderError();
    }
  }

  renderTable(countries) {
    const tbody = this.querySelector('#countriesTableBody');
    if (countries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay países registrados</td></tr>';
      return;
    }

    tbody.innerHTML = countries.map(country => `
      <tr>
        <td>${country.id}</td>
        <td>${country.name}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editCountry('${country.id}', '${country.name.replace(/'/g, "\\'")}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCountry('${country.id}')">Eliminar</button>
        </td>
      </tr>
    `).join('');

    // Agregar métodos globales para los botones
    window.editCountry = (id, name) => this.editCountry(id, name);
    window.deleteCountry = (id) => this.deleteCountry(id);
  }

  renderError() {
    const tbody = this.querySelector('#countriesTableBody');
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar países</td></tr>';
  }

  editCountry(id, name) {
    // Encontrar el componente de registro
    const regComponent = document.querySelector('reg-countrie');
    if (regComponent) {
      // Llenar el formulario
      const form = regComponent.querySelector('#frmDatacountrie');
      form.elements['name'].value = name;
      
      // Mostrar el ID
      const idView = regComponent.querySelector('#idView');
      idView.innerHTML = id;
      
      // Habilitar formulario
      regComponent.disableFrm(false);
      
      // Cambiar a la pestaña de registro
      const regTab = document.querySelector('button[data-verocultar*="regcountrie"]');
      if (regTab) regTab.click();
      
      // Configurar botones para edición
      regComponent.ctrlBtn('[["#btnEditar"],["#btnGuardar","#btnCancelar","#btnNuevo","#btnEliminar"]]');
    }
  }

  async deleteCountry(id) {
    if (confirm('¿Está seguro de eliminar este país?')) {
      try {
        await CountriesApi.delete(id);
        alert('País eliminado exitosamente');
        this.loadCountries(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar país:', error);
        alert('Error al eliminar país');
      }
    }
  }
}

customElements.define("lst-countrie", Lstcountrie);