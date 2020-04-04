class CompListArticle extends HTMLElement {
    static get template() {
        return `
            <div id="comp-list-article" class="divider-color">
                <div class="title-content">
                    <a href="/" class="articleTitle default-text-color">
                    <u class="default-primary-color"></u>
                    <u class="default-primary-color"></u>
                    <u class="default-primary-color"></u>
                    <u class="default-primary-color"></u>
                    <span></span>
                    </a>
                </div>
                <div class="article-content">
                    <div class="time-content default-primary-color default-text-color">
                        <div class="time"></div>
                        <a class="edit-tip default-primary-color text-primary-color">coding in Github</a>
                    </div>
                    <div class="content secondary-text-color"></div>
                </div>
            </div>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompListArticle.template;
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const articleTitle = this.getAttribute('articleTitle');
        const time = this.getAttribute('time');
        const content = this.getAttribute('content');
        this.querySelector('.articleTitle span').innerText = articleTitle;
        this.querySelector('.articleTitle').href = 'https://www.baidu.com';
        this.querySelector('.time').innerText = time;
        this.querySelector('.content').innerHTML = content;
    }
}

window.customElements.define('comp-list-article', CompListArticle);