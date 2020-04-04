// import listData from '../../data/listData.json';

class CompList extends HTMLElement {
    static get template() {
        return `
            <div id="comp-list">
            </div>
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompList.template;
    }

    async connectedCallback() {
        const listData = await fetch('./src/data/listData.json').then(data => data.json()).then(data => data);
        this.querySelector('#comp-list').innerHTML = listData.map(item => {
            return `
                <comp-list-article
                    id="${item.title}"
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