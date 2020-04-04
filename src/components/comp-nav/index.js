class CompNav extends HTMLElement {
    static get template() {
        return `
             <nav id="comp-nav" class="default-primary-color">
                <span class="nav-title text-primary-color">nature's Blog</span>
                <span class="blog-title secondary-text-color">title title title title title title</span>
                <div class="header-nav-list">
                    <a href="index.asp">主页</a>
                    <a target="_blank" href="html5_meter.asp">关于我</a>
                    <a target="_blank" href="http://github.com/natureStory">GitHub</a>
                </div>
            </nav>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompNav.template;
    }
}

window.customElements.define('comp-nav', CompNav);