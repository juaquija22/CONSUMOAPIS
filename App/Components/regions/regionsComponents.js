// Los componentes se cargan directamente desde index.html

export class RegionsComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="tabs">
        <button class="tab active" data-verocultar='["#regregions",["#lstregions"]]'>Registrar Región</button>
        <button class="tab" data-verocultar='["#lstregions",["#regregions"]]'>Listado de Regiones</button>
      </div>
    <div class="container" id="regregions" style="display:block;">
        <reg-regions></reg-regions>
    </div>
    <div class="container" id="lstregions" style="display:none;">
        <lst-regions></lst-regions>
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

customElements.define("regions-component", RegionsComponent);