import '/App/Components/countrie/regcountrie.js';
import '/App/Components/countrie/lstcountrie.js';
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
      <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active mnucountrie" aria-current="page" href="#" data-verocultar='["#regcountrie",["#lstcountrie"]]'>Registrar Pais</a>
      </li>
      <li class="nav-item">
        <a class="nav-link mnucountrie" href="#" data-verocultar='["#lstcountrie",["#regcountrie"]]'>Listado de Paises</a>
      </li>
    </ul>
    <div class="container" id="regcountrie" style="display:block;">
        <reg-countrie></reg-countrie>
    </div>
    <div class="container" id="lstcountrie" style="display:none;">
        <lst-countrie></lst-countrie>
    </div>    
    `;
    this.querySelectorAll(".mnucountrie").forEach((val, id) => {
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