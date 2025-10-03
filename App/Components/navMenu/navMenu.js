/**
 * Componente de navegación principal de la aplicación
 * Maneja la navegación entre diferentes secciones del sistema
 */
export class NavMenu extends HTMLElement{
    /**
     * Constructor del componente de navegación
     * Inicializa el componente y renderiza el menú
     */
    constructor(){
        super();
        this.render();
    }
    
    /**
     * Renderiza el menú de navegación con todos los enlaces
     * Configura los event listeners para cada enlace del menú
     */
    render(){
        this.innerHTML = /* html */ `
          <nav class="navbar">
            <ul class="navbar-nav">
              <li><a class="nav-link active" href="#" data-verocultar='["countries"]'>Países</a></li>
              <li><a class="nav-link" href="#" data-verocultar='["regions"]'>Regiones</a></li>
              <li><a class="nav-link" href="#" data-verocultar='["cities"]'>Ciudades</a></li>
              <li><a class="nav-link" href="#" data-verocultar='["companies"]'>Empresas</a></li>
              <li><a class="nav-link" href="#" data-verocultar='["branches"]'>Sucursales</a></li>
            </ul>
          </nav>        
        `;
        
        // Configurar event listeners para cada enlace del menú
        this.querySelectorAll(".nav-link").forEach((val, id) => {
          val.addEventListener("click", (e)=>{
              // Obtener el tipo de componente a cargar desde el atributo data
              let data = JSON.parse(e.target.dataset.verocultar);
              let mainContent = document.querySelector('#mainContent');
              mainContent.innerHTML = "";
              
              // Cargar el componente correspondiente según la sección seleccionada
              switch (data[0]){
                case 'countries':
                  mainContent.innerHTML = "<countrie-component></countrie-component>";
                  break;
                case 'regions':
                  mainContent.innerHTML = "<regions-component></regions-component>";
                  break;
                case 'cities':
                  mainContent.innerHTML = "<cities-component></cities-component>";
                  break;
                case 'companies':
                  mainContent.innerHTML = "<companies-component></companies-component>";
                  break;
                case 'branches':
                  mainContent.innerHTML = "<branches-component></branches-component>";
                  break;
                default:
                  console.log("Componente no encontrado");
              }
              
              // Prevenir el comportamiento por defecto del enlace
              e.stopImmediatePropagation();
              e.preventDefault();
          })
      });
    }
}
customElements.define("nav-menu", NavMenu);