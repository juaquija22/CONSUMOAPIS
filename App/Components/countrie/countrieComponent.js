// Los componentes se cargan directamente desde index.html
export class countrieComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/countrie/countrieStyle.css";
      </style>
      <div class="tabs">
        <button class="tab active" data-verocultar='["#regcountrie",["#lstcountrie"]]'>Registrar País</button>
        <button class="tab" data-verocultar='["#lstcountrie",["#regcountrie"]]'>Listado de Países</button>
      </div>
    <div class="container" id="regcountrie" style="display:block;">
        <reg-countrie></reg-countrie>
    </div>
    <div class="container" id="lstcountrie" style="display:none;">
        <lst-countrie></lst-countrie>
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

customElements.define("countrie-component", countrieComponent);