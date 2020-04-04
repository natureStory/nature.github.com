class CompProgress extends HTMLElement {
    // 只要my-attr属性变化，就会触发attributeChangedCallback。
    static get observedAttributes() {
        return ['my-attr'];
    }
    static get template() {
        return `
            <div id="comp-progress" class="default-primary-color">
                <div class="progress accent-color"></div>
            </div>
        `;
    }

    // 元素创建但还没附加到document时执行，通常用来初始化状态，事件监听，创建影子DOM。
    constructor() {
        super();
        // 闭包写法
        // const shadowRoot = this.attachShadow({mode: 'open'});
        // shadowRoot.innerHTML = template;
        this.innerHTML = CompProgress.template;
    }

    get scrollTop() {
        return document.documentElement.scrollTop;
    }
    get innerHeight() {
        return window.innerHeight;
    }
    get bodyHeight() {
        return parseFloat(getComputedStyle(document.body).height);
    }

    get widthPercentage() {
        return `${this.scrollTop / (this.bodyHeight - this.innerHeight) * 100}%`;
    }

    // 元素被插入到DOM时执行，通常用来获取数据，设置默认属性。
    connectedCallback() {
        console.log('connected!!');
        document.addEventListener("scroll", this.render);
    }

    // 元素从DOM移除时执行，通常用来做清理工作，例如取消事件监听和定时器。
    disconnectedCallback() {
        console.log('disconnected!');
        document.removeEventListener("scroll", this.render);
    }

    // 元素关注的属性变化时执行，如果监听属性变化呢？
    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} changed!`);
    }

    // 自定义元素被移动到新的document时执行。
    adoptedCallback() {
        console.log('adopted!');
    }

    render = () => {
        document.querySelector('.progress').style.width = this.widthPercentage;
    }
}

window.customElements.define('comp-progress', CompProgress);