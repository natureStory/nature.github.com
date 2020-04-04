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
                <div class="skin-btn-box">
                    <div class="kite-line default-primary-color"></div>
                    <div class="kite">
                        <div class="default-primary-color"></div>
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
        this.innerHTML = CompNav.template;
    }

    get scrollTop() {
        return document.documentElement.scrollTop;
    }

    connectedCallback() {
        document.addEventListener("scroll", this.render);
        document.querySelector('#comp-nav .kite').addEventListener("click", this.kiteClick);
    }

    disconnectedCallback() {
        document.removeEventListener("scroll", this.render);
        document.removeEventListener("click", this.kiteClick);
    }

    kiteClick = () => {
        document.querySelector('#comp-nav .skin-btn-box').className = "skin-btn-box active";
        this.changeSkin();
        setTimeout(() => {
            document.querySelector('#comp-nav .skin-btn-box').className = "skin-btn-box";
        }, 500);
    };

    changeSkin = () => {
        const skinNum = window.localStorage.getItem('skinNum');
        console.log(skinNum);
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
        if (this.scrollTop > 300) {
            document.querySelector('#comp-nav').className = 'default-primary-color active';
        } else {
            document.querySelector('#comp-nav').className = 'default-primary-color';
        }
    }
}

window.customElements.define('comp-nav', CompNav);