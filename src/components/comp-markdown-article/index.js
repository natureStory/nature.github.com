import '../../assets/js/showdown.min.js';
class CompMarkdownArticle extends HTMLElement {
    static get template() {
        return `
            <div id="comp-markdown-article">
            加载中……
            </div>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompMarkdownArticle.template;
    }

    async connectedCallback() {
        const pageName = this.getAttribute('pageName');
        const article = await fetch(`../data/articles/${pageName}.md?v=${Math.random()}`).then(data => data.text());
        const converter = new showdown.Converter();
        const html = converter.makeHtml(article);
        this.querySelector('#comp-markdown-article').innerHTML = html;
    }
}

window.customElements.define('comp-markdown-article', CompMarkdownArticle);