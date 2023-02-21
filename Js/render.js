"use strict";

export default class RenderData {
  constructor(data) {
    this.d = document;
    this.data = data;
    this.algorithms = this.d.getElementsByClassName("page");
    this.template = this.d.getElementById("template-post").content;
    this.templateList = this.d.getElementById("template-list").content;
    this.fragment = this.d.createDocumentFragment();
    this.content = this.d.getElementById("content");
    this.sidebarList = this.d.querySelector(".nav-links");
  }

  definedPages() {
    this.data.forEach((element) => {
      this.templateList.querySelector(".link_name").textContent = element.title;
      let $clone = this.templateList.cloneNode(true);
      this.fragment.appendChild($clone);
    });
    this.sidebarList.appendChild(this.fragment);
    const pagesToArray = Object.entries(this.algorithms);
    pagesToArray.forEach((element, index) => {
      element[1].setAttribute("id", `${index}`);
    });
  }

  render() {
    this.definedPages();
    // Aqui traemos nuestro archivo markdown con una peticion local por fetch
    this.d.addEventListener("click", (e) => {
      const target = e.target;
      let idLabel = target.id ? target.id : target.parentElement.id;

      this.data.forEach((element) => {
        if (idLabel == element.id && idLabel !== "") {
          let url = `./data/articles/${element.title}.md`;
          fetch(url)
            .then((response) =>
              response.ok ? response.text() : Promise.reject(response)
            )
            .then((liar) => {
              // Creamos un converter para converitr de .md a .html
              let converter = new showdown.Converter();
              // Convertimos nuestro .md a .html
              let codeHtml = converter.makeHtml(liar);
              this.content.innerHTML = codeHtml;
              // otra manera de resumir todo lo anterior seria :
              // $main.innerHTML = new showdown.Converter().makeHtml(liar);
            })
            .catch((error) => {
              let message = error.statusText || "Ocurrio un error";
              this.content.innerHTML = `<h2>Error ${error.status} : ${message}<h2>`;
            })
            .finally(console.warn(`Liar ready`));
        }
      });
    });
  }
}
