export class NavMenu extends HTMLElement{
    constructor(){
        super();
        this.render();
    }
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
        this.querySelectorAll(".nav-link").forEach((val, id) => {
          val.addEventListener("click", (e)=>{
              let data = JSON.parse(e.target.dataset.verocultar);
              let mainContent = document.querySelector('#mainContent');
              mainContent.innerHTML = "";
              
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
              
              e.stopImmediatePropagation();
              e.preventDefault();
          })
      });
    }
}
customElements.define("nav-menu", NavMenu);