import {CompaniesApi} from '../../../Apis/api.js';
import {CitiesApi} from '../../../Apis/api.js';

export class LstCompanies extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.loadCompanies();
    this.cities = [];
    this.loadCities();
  }

  async loadCities() {
    try {
      this.cities = await CitiesApi.getAll();
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
    }
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Listado de Empresas
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Email</th>
                                <th>Ciudad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="companiesTableBody">
                            <tr>
                                <td colspan="6" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>     
      `
  }

  async loadCompanies() {
    try {
      // Asegurar que las ciudades estén cargadas primero
      await this.loadCities();
      const companies = await CompaniesApi.getAll();
      this.renderTable(companies);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      this.renderError();
    }
  }

  renderTable(companies) {
    const tbody = this.querySelector('#companiesTableBody');
    if (companies.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay empresas registradas</td></tr>';
      return;
    }

    tbody.innerHTML = companies.map(company => {
      const city = this.cities.find(c => c.id == company.cityId);
      return `
        <tr>
          <td>${company.id}</td>
          <td>${company.name}</td>
          <td>${company.address}</td>
          <td>${company.email}</td>
          <td>${city ? city.name : 'N/A'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="editCompany('${company.id}', '${company.name}', '${company.address}', '${company.email}', '${company.cityId}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCompany('${company.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');

    // Agregar métodos globales para los botones
    window.editCompany = (id, name, ukniu, address, email, cityId) => this.editCompany(id, name, ukniu, address, email, cityId);
    window.deleteCompany = (id) => this.deleteCompany(id);
  }

  renderError() {
    const tbody = this.querySelector('#companiesTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar empresas</td></tr>';
  }

  editCompany(id, name, address, email, cityId) {
    // Encontrar el componente de registro
    const regComponent = document.querySelector('reg-companies');
    if (regComponent) {
      // Llenar el formulario
      const form = regComponent.querySelector('#frmDatacompanies');
      form.elements['name'].value = name;
      form.elements['address'].value = address;
      form.elements['email'].value = email;
      form.elements['cityId'].value = cityId;
      
      // Mostrar el ID
      const idView = regComponent.querySelector('#idView');
      idView.innerHTML = id;
      
      // Habilitar formulario
      regComponent.disableFrm(false);
      
      // Cambiar a la pestaña de registro
      const regTab = document.querySelector('button[data-verocultar*="regcompanies"]');
      if (regTab) regTab.click();
      
      // Configurar botones para edición
      regComponent.ctrlBtn('[["#btnEditar"],["#btnGuardar","#btnCancelar","#btnNuevo","#btnEliminar"]]');
    }
  }

  async deleteCompany(id) {
    if (confirm('¿Está seguro de eliminar esta empresa?')) {
      try {
        await CompaniesApi.delete(id);
        alert('Empresa eliminada exitosamente');
        this.loadCompanies(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
        alert('Error al eliminar empresa');
      }
    }
  }
}

customElements.define("lst-companies", LstCompanies);