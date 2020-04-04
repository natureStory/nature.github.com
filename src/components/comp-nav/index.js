class CompNav extends HTMLElement {
    static get template() {
        return `
             <nav id="">
                <span>nature's Blog</span>
                <a href="index.asp">Home</a>
                <a href="html5_meter.asp">Previous</a>
                <a href="html5_noscript.asp">Next</a>
            </nav>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompNav.template;
    }
}

window.customElements.define('comp-nav', CompNav);