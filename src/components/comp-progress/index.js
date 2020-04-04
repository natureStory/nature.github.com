const template = `
    <style>
        .progress-content {
            height: 20px;
        }
    </style>
    <div class="progress-content dark-primary-color">
        <div>
            
        </div>
    </div>
`;

class CompProgress extends HTMLElement {
    // 只要my-attr属性变化，就会触发attributeChangedCallback。
    static get observedAttributes() {
        return ['my-attr'];
    }

    // 元素创建但还没附加到document时执行，通常用来初始化状态，事件监听，创建影子DOM。
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = template;
    }

    // 元素被插入到DOM时执行，通常用来获取数据，设置默认属性。
    connectedCallback() {
        console.log('connected!');
    }

    // 元素从DOM移除时执行，通常用来做清理工作，例如取消事件监听和定时器。
    disconnectedCallback() {
        console.log('disconnected!');
    }

    // 元素关注的属性变化时执行，如果监听属性变化呢？
    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} changed!`);
    }

    // 自定义元素被移动到新的document时执行。
    adoptedCallback() {
        console.log('adopted!');
    }

    render() {

    }
}

window.customElements.define('comp-progress', CompProgress);