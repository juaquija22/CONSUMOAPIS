/**
 * URL base para la API del servidor JSON
 */
const API_BASE_URL = 'http://localhost:3000';

/**
 * Función genérica para hacer peticiones HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object|null} data - Datos a enviar
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) config.body = JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return method === 'DELETE' ? true : await response.json();
}

/**
 * Cliente API simplificado para una entidad específica
 */
class ApiClient {
    constructor(entity) {
        this.entity = entity;
    }
    
    async getAll() {
        return await apiRequest(`/${this.entity}`);
    }
    
    async getById(id) {
        return await apiRequest(`/${this.entity}/${id}`);
    }
    
    async create(data) {
        return await apiRequest(`/${this.entity}`, 'POST', data);
    }
    
    async update(id, data) {
        return await apiRequest(`/${this.entity}/${id}`, 'PUT', data);
    }
    
    async delete(id) {
        return await apiRequest(`/${this.entity}/${id}`, 'DELETE');
    }
}

/**
 * Factory para crear instancias de API
 */
export const createApi = (entity) => new ApiClient(entity);

/**
 * Instancias preconfiguradas para cada entidad
 */
export const CountriesApi = createApi('countries');
export const RegionsApi = createApi('regions');
export const CitiesApi = createApi('cities');
export const CompaniesApi = createApi('companies');
export const BranchesApi = createApi('branches');

/**
 * Exportar también la clase base por si se necesita crear APIs personalizadas
 */
export { ApiClient };
