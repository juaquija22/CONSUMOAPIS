import {BranchesApi} from '../../../Apis/api.js';
import {CitiesApi, CompaniesApi} from '../../../Apis/api.js';

export class LstBranches extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.loadBranches();
    this.cities = [];
    this.companies = [];
    this.loadCities();
    this.loadCompanies();
  }

  async loadCities() {
    try {
      this.cities = await CitiesApi.getAll();
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
    }
  }

  async loadCompanies() {
    try {
      this.companies = await CompaniesApi.getAll();
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">
                Listado de Sucursales
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nº Comercial</th>
                                <th>Contacto</th>
                                <th>Dirección</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Ciudad</th>
                                <th>Empresa</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="branchesTableBody">
                            <tr>
                                <td colspan="9" class="text-center">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>     
      `
  }

  async loadBranches() {
    try {
      // Asegurar que las ciudades y empresas estén cargadas primero
      await this.loadCities();
      await this.loadCompanies();
      const branches = await BranchesApi.getAll();
      this.renderTable(branches);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      this.renderError();
    }
  }

  renderTable(branches) {
    const tbody = this.querySelector('#branchesTableBody');
    if (branches.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay sucursales registradas</td></tr>';
      return;
    }

    tbody.innerHTML = branches.map(branch => {
      const city = this.cities.find(c => c.id == branch.cityId);
      const company = this.companies.find(comp => comp.id == branch.companyId);
      return `
        <tr>
          <td>${branch.id}</td>
          <td>${branch.numberComercial}</td>
          <td>${branch.contactName}</td>
          <td>${branch.address}</td>
          <td>${branch.email}</td>
          <td>${branch.phone}</td>
          <td>${city ? city.name : 'N/A'}</td>
          <td>${company ? company.name : 'N/A'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="editBranch('${branch.id}', '${branch.numberComercial}', '${branch.contactName}', '${branch.address}', '${branch.email}', '${branch.phone}', '${branch.cityId}', '${branch.companyId}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBranch('${branch.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');

    // Agregar métodos globales para los botones
    window.editBranch = (id, numberComercial, contactName, address, email, phone, cityId, companyId) => this.editBranch(id, numberComercial, contactName, address, email, phone, cityId, companyId);
    window.deleteBranch = (id) => this.deleteBranch(id);
  }

  renderError() {
    const tbody = this.querySelector('#branchesTableBody');
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error al cargar sucursales</td></tr>';
  }

  editBranch(id, numberComercial, contactName, address, email, phone, cityId, companyId) {
    // Encontrar el componente de registro
    const regComponent = document.querySelector('reg-branches');
    if (regComponent) {
      // Llenar el formulario
      const form = regComponent.querySelector('#frmDatabranches');
      form.elements['numberComercial'].value = numberComercial;
      form.elements['contactName'].value = contactName;
      form.elements['address'].value = address;
      form.elements['email'].value = email;
      form.elements['phone'].value = phone;
      form.elements['cityId'].value = cityId;
      form.elements['companyId'].value = companyId;
      
      // Mostrar el ID
      const idView = regComponent.querySelector('#idView');
      idView.innerHTML = id;
      
      // Habilitar formulario
      regComponent.disableFrm(false);
      
      // Cambiar a la pestaña de registro
      const regTab = document.querySelector('button[data-verocultar*="regbranches"]');
      if (regTab) regTab.click();
      
      // Configurar botones para edición
      regComponent.ctrlBtn('[["#btnEditar"],["#btnGuardar","#btnCancelar","#btnNuevo","#btnEliminar"]]');
    }
  }

  async deleteBranch(id) {
    if (confirm('¿Está seguro de eliminar esta sucursal?')) {
      try {
        await BranchesApi.delete(id);
        alert('Sucursal eliminada exitosamente');
        this.loadBranches(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        alert('Error al eliminar sucursal');
      }
    }
  }
}

customElements.define("lst-branches", LstBranches);