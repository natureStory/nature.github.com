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
        const article = await fetch(`../data/articles/${pageName}/index.md?v=${Math.random()}`).then(data => data.text());
        const converter = new showdown.Converter();
        let html = converter.makeHtml(article);
        html = html.replace(/<img src="\.\//g, `<img src="../../src/data/articles/${pageName}/`);
        this.querySelector('#comp-markdown-article').innerHTML = html;
    }
}

window.customElements.define('comp-markdown-article', CompMarkdownArticle);