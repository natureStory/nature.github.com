class CompList extends HTMLElement {
    static get template() {
        return `
            <div id="comp-list">
                <div id="loading-style">
                    <div id="loading-center">
                        <div id="loading-center-absolute">
                            <div class="object default-primary-color" id="object-one"></div>
                            <div class="object default-primary-color" id="object-two"></div>
                            <div class="object default-primary-color" id="object-three"></div>
                            <div class="object default-primary-color" id="object-four"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompList.template;
    }

    async connectedCallback() {
        const listData = await fetch(`./src/data/listData.json?v=${Math.random()}`).then(data => data.json());
        this.querySelector('#comp-list').innerHTML = listData.map(item => {
            return `
                <comp-list-article
                    pageName="${item.pageName}"
                    articleTitle="${item.articleTitle}"
                    time="${item.time}"
                    content="${item.content}"
                >
                </comp-list-article>
            `
        }).join('');
    }
}

window.customElements.define('comp-list', CompList);