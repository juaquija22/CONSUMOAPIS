// Los componentes se cargan directamente desde index.html

export class BranchesComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="tabs">
        <button class="tab active" data-verocultar='["#regbranches",["#lstbranches"]]'>Registrar Sucursal</button>
        <button class="tab" data-verocultar='["#lstbranches",["#regbranches"]]'>Listado de Sucursales</button>
      </div>
    <div class="container" id="regbranches" style="display:block;">
        <reg-branches></reg-branches>
    </div>
    <div class="container" id="lstbranches" style="display:none;">
        <lst-branches></lst-branches>
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

customElements.define("branches-component", BranchesComponent);