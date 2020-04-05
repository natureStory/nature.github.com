class CompFooter extends HTMLElement {
    static get template() {
        return `
            <div id="comp-footer">
                <div class="my-like">高山仰止，景行行止，虽不能至，然心向往之————『诗经·小雅· 车舝』</div>
                <div class="secondary-text-color">© 2018</div>
                <div class="secondary-text-color">Powered by <a target="_blank" href="https://github.com/natureStory">NatureStory</a>.</div>
            </div>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompFooter.template;
    }
}

window.customElements.define('comp-footer', CompFooter);