import '../../assets/js/showdown.min.js';
class CompAboutme extends HTMLElement {
    static get template() {
        return `
            <div id="comp-aboutme">
            </div>
        `;
    }

    static get aboutMeMarkDown() {
        return `
## 写在前面

行路咫尺间，思绪已千年。切莫停止思考，谨记，谨记。

## 时间之外的往诗

\`\`\`js
《汉宫春》
梅雨时节，忆江边纸鹞，如似盈蝶。
无端风雨，孕得灵秀淑媛。
长洲月华，灯初上，相映成雪。
旧光景，或因新人，得添几许美愿。
清浅小洼如镜，碎步似流萤，觅得归途。
忧怅落花终去，空余残香。
晴川历历，对江叹，何处故梦？
细思处，落庭纷瑛，无心轻挑灯花。
\`\`\`

## 个人github和博客地址

[github](https://github.com/natureStory)

[简书博客](https://www.jianshu.com/u/7ca6647c9b0e)
        `;
    }

    constructor() {
        super();
        this.innerHTML = CompAboutme.template;
    }

    async connectedCallback() {
        const converter = new showdown.Converter();
        let html = converter.makeHtml(CompAboutme.aboutMeMarkDown);
        this.querySelector('#comp-aboutme').innerHTML = html;
    }
}

window.customElements.define('comp-aboutme', CompAboutme);