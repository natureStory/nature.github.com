class CompNav extends HTMLElement {
    static get template() {
        return `
             <nav id="comp-nav">
                <span class="nav-title text-primary-color">natureStory's Blog</span>
                <span class="blog-title secondary-text-color">我的博客</span>
                <div class="header-nav-list">
                    <a href="/">主页</a>
                    <a target="_blank" href="../../pages/aboutme.html">关于我</a>
                    <a target="_blank" href="http://github.com/natureStory">GitHub</a>
                </div>
                <div class="skin-btn-box">
                    <div class="kite-line default-primary-color"></div>
                    <div class="kite">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </nav>
        `;
    }

    constructor() {
        super();
        this._totalSkinNum = 7;
        this.changeSkin();
        this.innerHTML = CompNav.template;
    }

    get scrollTop() {
        return document.documentElement.scrollTop;
    }

    connectedCallback() {
        this.querySelector('.blog-title').innerText = document.title;
        document.addEventListener("scroll", this.render);
        this.querySelector('.kite').addEventListener("click", this.kiteClick);
    }

    disconnectedCallback() {
        document.removeEventListener("scroll", this.render);
        document.removeEventListener("click", this.kiteClick);
    }

    kiteClick = () => {
        this.querySelector('.skin-btn-box').className = "skin-btn-box active";
        this.changeSkin();
        setTimeout(() => {
            this.querySelector('.skin-btn-box').className = "skin-btn-box";
        }, 500);
    };

    changeSkin = () => {
        const skinNum = window.localStorage.getItem('skinNum');
        let tempSkinNum = `${Math.ceil(Math.random() * this._totalSkinNum)}`;
        if (skinNum === tempSkinNum) {
            if (skinNum< this._totalSkinNum) {
                tempSkinNum = `${parseInt(tempSkinNum) + 1}`
            } else {
                tempSkinNum = `${parseInt(tempSkinNum) - 1}`
            }
        }
        window.localStorage.setItem('skinNum', tempSkinNum);
        document.body.className = `skin${tempSkinNum}`;
    };

    render = () => {
        if (this.scrollTop > 240) {
            this.querySelector('#comp-nav').className = 'active';
        } else {
            this.querySelector('#comp-nav').className = '';
        }
    }
}

window.customElements.define('comp-nav', CompNav);