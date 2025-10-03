const API_BASE_URL = 'http://localhost:3000';

/**
 * Cliente API genérico para todas las entidades
 */
class ApiClient {
    constructor(entity) {
        this.entity = entity;
    }
    
    /**
     * Obtener todos los registros
     */
    async getAll() {
        return await this.makeRequest(`/${this.entity}`);
    }
    
    /**
     * Obtener un registro por ID
     */
    async getById(id) {
        return await this.makeRequest(`/${this.entity}/${id}`);
    }
    
    /**
     * Crear un nuevo registro
     */
    async create(data) {
        return await this.makeRequest(`/${this.entity}`, 'POST', data);
    }
    
    /**
     * Actualizar un registro existente
     */
    async update(id, data) {
        return await this.makeRequest(`/${this.entity}/${id}`, 'PUT', data);
    }
    
    /**
     * Eliminar un registro
     */
    async delete(id) {
        return await this.makeRequest(`/${this.entity}/${id}`, 'DELETE');
    }
    
    /**
     * Método base para realizar peticiones HTTP
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            // Para DELETE, retornar true en lugar de JSON
            if (method === 'DELETE') {
                return true;
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en ${method} ${endpoint}:`, error);
            throw error;
        }
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
