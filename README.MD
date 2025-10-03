# 🏢 Gestor de Compañías

Una aplicación web moderna para la gestión de empresas, países, regiones, ciudades y sucursales. Desarrollada con tecnologías web nativas utilizando Custom Elements (Web Components) y una API REST simulada con JSON Server.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [API](#-api)
- [Componentes](#-componentes)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

- **Gestión Completa de Entidades**: Administra países, regiones, ciudades, empresas y sucursales
- **Interfaz Moderna**: Diseño responsive con CSS moderno y componentes reutilizables
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar registros
- **Validación de Datos**: Validaciones del lado del cliente para asegurar integridad
- **Navegación Intuitiva**: Sistema de pestañas y navegación por menú
- **API REST**: Comunicación con backend simulado usando JSON Server
- **Web Components**: Arquitectura basada en Custom Elements nativos

## 🛠 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidades avanzadas y async/await
- **Web Components**: Custom Elements para componentes reutilizables
- **Fetch API**: Comunicación con el servidor

### Backend Simulado
- **JSON Server**: Servidor REST simulado para desarrollo
- **JSON**: Base de datos en formato JSON

## 📁 Estructura del Proyecto

```
CONSUMOAPIS/
├── Apis/
│   └── api.js                 # Cliente API genérico
├── App/
│   └── components/
│       ├── branches/          # Componentes de sucursales
│       ├── cities/           # Componentes de ciudades
│       ├── companies/        # Componentes de empresas
│       ├── countrie/         # Componentes de países
│       ├── navMenu/          # Menú de navegación
│       └── regions/          # Componentes de regiones
├── css/
│   └── style.css            # Estilos principales
├── Models/
│   ├── branchesModel.js     # Modelo de datos de sucursales
│   ├── citieModel.js        # Modelo de datos de ciudades
│   ├── companieModel.js     # Modelo de datos de empresas
│   ├── countrieModel.js     # Modelo de datos de países
│   └── regionModel.js       # Modelo de datos de regiones
├── db.json                  # Base de datos JSON
├── index.html              # Página principal
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd CONSUMOAPIS
   ```

2. **Instalar JSON Server globalmente**
   ```bash
   npm install -g json-server
   ```

3. **Iniciar el servidor de base de datos**
   ```bash
json-server --watch db.json --port 3000
   ```

4. **Abrir la aplicación**
   - Abre el archivo `index.html` en tu navegador web
   - O usa un servidor local como Live Server en VS Code

## 💻 Uso

### Navegación Principal
La aplicación cuenta con un menú de navegación que permite acceder a las diferentes secciones:

- **Países**: Gestión de países
- **Regiones**: Gestión de regiones (pertenecen a países)
- **Ciudades**: Gestión de ciudades (pertenecen a regiones)
- **Empresas**: Gestión de empresas (ubicadas en ciudades)
- **Sucursales**: Gestión de sucursales (pertenecen a empresas)

### Operaciones Disponibles

#### Para cada entidad:
- **Crear**: Registrar nuevos elementos
- **Listar**: Ver todos los registros en tabla
- **Editar**: Modificar registros existentes
- **Eliminar**: Remover registros del sistema

### Flujo de Trabajo Típico

1. **Configurar Ubicaciones**:
   - Crear países
   - Crear regiones (asignando país)
   - Crear ciudades (asignando región)

2. **Gestionar Empresas**:
   - Registrar empresas (asignando ciudad)
   - Editar información de empresas
   - Eliminar empresas si es necesario

3. **Administrar Sucursales**:
   - Crear sucursales (asignando empresa)
   - Gestionar información de sucursales

## 🔌 API

### Endpoints Disponibles

La aplicación utiliza JSON Server que expone los siguientes endpoints:

#### Países
- `GET /countries` - Obtener todos los países
- `GET /countries/:id` - Obtener país por ID
- `POST /countries` - Crear nuevo país
- `PUT /countries/:id` - Actualizar país
- `DELETE /countries/:id` - Eliminar país

#### Regiones
- `GET /regions` - Obtener todas las regiones
- `GET /regions/:id` - Obtener región por ID
- `POST /regions` - Crear nueva región
- `PUT /regions/:id` - Actualizar región
- `DELETE /regions/:id` - Eliminar región

#### Ciudades
- `GET /cities` - Obtener todas las ciudades
- `GET /cities/:id` - Obtener ciudad por ID
- `POST /cities` - Crear nueva ciudad
- `PUT /cities/:id` - Actualizar ciudad
- `DELETE /cities/:id` - Eliminar ciudad

#### Empresas
- `GET /companies` - Obtener todas las empresas
- `GET /companies/:id` - Obtener empresa por ID
- `POST /companies` - Crear nueva empresa
- `PUT /companies/:id` - Actualizar empresa
- `DELETE /companies/:id` - Eliminar empresa

#### Sucursales
- `GET /branches` - Obtener todas las sucursales
- `GET /branches/:id` - Obtener sucursal por ID
- `POST /branches` - Crear nueva sucursal
- `PUT /branches/:id` - Actualizar sucursal
- `DELETE /branches/:id` - Eliminar sucursal

### Cliente API

El archivo `Apis/api.js` contiene un cliente genérico que proporciona métodos CRUD para todas las entidades:

```javascript
// Ejemplo de uso
import { CompaniesApi } from './Apis/api.js';

// Obtener todas las empresas
const companies = await CompaniesApi.getAll();

// Crear nueva empresa
const newCompany = await CompaniesApi.create({
  name: 'Mi Empresa',
  address: 'Dirección 123',
  email: 'contacto@miempresa.com',
  cityId: '014e'
});
```

## 🧩 Componentes

### Arquitectura de Componentes

La aplicación utiliza Web Components (Custom Elements) para crear una arquitectura modular y reutilizable:

#### Componentes Principales
- **NavMenu**: Menú de navegación principal
- **CompaniesComponent**: Contenedor para gestión de empresas
- **CountrieComponent**: Contenedor para gestión de países

#### Componentes de Listado
- **LstCompanies**: Lista y tabla de empresas
- **Lstcountrie**: Lista y tabla de países
- **LstRegions**: Lista y tabla de regiones
- **LstCities**: Lista y tabla de ciudades
- **LstBranches**: Lista y tabla de sucursales

#### Componentes de Registro
- **RegCompanies**: Formulario de registro/edición de empresas
- **Regcountrie**: Formulario de registro/edición de países
- **RegRegions**: Formulario de registro/edición de regiones
- **RegCities**: Formulario de registro/edición de ciudades
- **RegBranches**: Formulario de registro/edición de sucursales

### Funcionalidades de Componentes

#### Sistema de Pestañas
Cada sección principal cuenta con pestañas para alternar entre:
- Vista de registro/edición
- Vista de listado

#### Validación de Formularios
- Validación de campos obligatorios
- Validación de formato de email
- Mensajes de error descriptivos

#### Control de Estados
- Botones dinámicos según el estado (nuevo, editar, eliminar)
- Habilitación/deshabilitación de formularios
- Feedback visual para el usuario

## 📊 Modelos de Datos

### Estructura de Datos

#### País
```javascript
{
  id: string,    // Identificador único
  name: string   // Nombre del país
}
```

#### Región
```javascript
{
  id: string,        // Identificador único
  name: string,      // Nombre de la región
  countryId: string  // ID del país al que pertenece
}
```

#### Ciudad
```javascript
{
  id: string,      // Identificador único
  name: string,    // Nombre de la ciudad
  regionId: string // ID de la región a la que pertenece
}
```

#### Empresa
```javascript
{
  id: string,      // Identificador único
  name: string,    // Nombre de la empresa
  address: string, // Dirección de la empresa
  email: string,   // Email de contacto
  cityId: string   // ID de la ciudad donde está ubicada
}
```

#### Sucursal
```javascript
{
  id: string,         // Identificador único
  name: string,       // Nombre de la sucursal
  address: string,    // Dirección de la sucursal
  phone: string,      // Teléfono de contacto
  companyId: string   // ID de la empresa a la que pertenece
}
```

## 🎨 Estilos y Diseño

### Características del Diseño
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Moderno**: Uso de CSS Grid y Flexbox
- **Consistente**: Paleta de colores y tipografía uniforme
- **Accesible**: Contraste adecuado y navegación por teclado

### Clases CSS Principales
- `.container`: Contenedor principal con ancho máximo
- `.card`: Tarjetas con sombra y bordes redondeados
- `.btn`: Botones con diferentes variantes (primary, success, warning, danger)
- `.table`: Tablas con estilos modernos
- `.form-control`: Campos de formulario estilizados

## 🔧 Desarrollo

### Estructura de Archivos por Componente

Cada entidad sigue la siguiente estructura:
```
entidad/
├── entidadComponentes.js    # Componente contenedor principal
├── lstentidad.js           # Componente de listado
├── regentidad.js           # Componente de registro
└── entidadModel.js         # Modelo de datos
```

### Patrones Utilizados

#### Event Delegation
Los componentes utilizan event delegation para manejar eventos de manera eficiente.

#### Async/Await
Todas las operaciones de API utilizan async/await para manejo asíncrono.

#### Error Handling
Implementación consistente de manejo de errores con try/catch y mensajes al usuario.

