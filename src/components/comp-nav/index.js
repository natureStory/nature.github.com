class CompNav extends HTMLElement {
    static get template() {
        return `
             <nav id="comp-nav" class="default-primary-color">
                <span class="nav-title text-primary-color">nature's Blog</span>
                <span class="blog-title secondary-text-color">5000 万以上资产的投资理财小技巧</span>
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

    get scrollTop() {
        return document.documentElement.scrollTop;
    }

    connectedCallback() {
        document.addEventListener("scroll", this.render);
    }

    disconnectedCallback() {
        document.removeEventListener("scroll", this.render);
    }

    render = () => {
        if (this.scrollTop > 300) {
            document.querySelector('#comp-nav').className = 'default-primary-color active';
        } else {
            document.querySelector('#comp-nav').className = 'default-primary-color';
        }
    }
}

window.customElements.define('comp-nav', CompNav);