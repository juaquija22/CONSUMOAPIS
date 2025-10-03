// Los componentes se cargan directamente desde index.html

export class CitiesComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="tabs">
        <button class="tab active" data-verocultar='["#regcities",["#lstcities"]]'>Registrar Ciudad</button>
        <button class="tab" data-verocultar='["#lstcities",["#regcities"]]'>Listado de Ciudades</button>
      </div>
    <div class="container" id="regcities" style="display:block;">
        <reg-cities></reg-cities>
    </div>
    <div class="container" id="lstcities" style="display:none;">
        <lst-cities></lst-cities>
    </div>    
    `;
        this.querySelectorAll(".tab").forEach((val, id) => {
        val.addEventListener("click", (e)=>{
            let data = JSON.parse(e.target.dataset.verocultar);
            let cardVer = document.querySelector(data[0]);
            cardVer.style.display = 'block';
            data[1].forEach(card => {
                let cardActual = document.querySelector(card);
                cardActual.style.display = 'none';
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        })
    });
  }
}

customElements.define("cities-component", CitiesComponent);
