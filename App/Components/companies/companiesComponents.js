// Los componentes se cargan directamente desde index.html

export class CompaniesComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="tabs">
        <button class="tab active" data-verocultar='["#regcompanies",["#lstcompanies"]]'>Registrar Empresa</button>
        <button class="tab" data-verocultar='["#lstcompanies",["#regcompanies"]]'>Listado de Empresas</button>
      </div>
    <div class="container" id="regcompanies" style="display:block;">
        <reg-companies></reg-companies>
    </div>
    <div class="container" id="lstcompanies" style="display:none;">
        <lst-companies></lst-companies>
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

customElements.define("companies-component", CompaniesComponent);