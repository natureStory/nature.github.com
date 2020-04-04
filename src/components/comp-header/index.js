class CompHeader extends HTMLElement {
    static get template() {
        return `
            <header id="comp-header" class="default-primary-color">
                <comp-progress></comp-progress>
                <div class="header-title default-primary-color text-primary-color">
                    Keep It Simple Do It Well
                </div>
            </header>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompHeader.template;
    }
}

window.customElements.define('comp-header', CompHeader);