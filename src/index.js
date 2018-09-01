class CompositeComponent {
    constructor(element) {
        this.currentElement = element;
        this.renderedChildren = [];
        this.node = null;
    }

    getPublicInstance() {
        return this.node;
    }

    receive() {
        const previousComponent = this.renderedComponent;
        const nextRenderedElement = this.publicInstance.render();

        previousComponent.receive(nextRenderedElement);
    }

    mount() {
        const { type: Type } = this.currentElement;

        this.publicInstance = new Type();
        this.publicInstance._reactInternalInstance = this;

        const renderedElement = this.publicInstance.render();

        this.renderedComponent = new DOMComponent(renderedElement);
        return this.renderedComponent.mount();
    }
}

class DOMComponent {
    constructor(element) {
        this.currentElement = element;
        this.renderedChildren = [];
        this.node = null;
    }

    getPublicInstance() {
        return this.node;
    }

    receive(nextElemnt) {
        const node = this.node;

        const nextComponent = new DOMComponent(nextElemnt);
        const nextNode = nextComponent.mount();

        node.parentNode.replaceChild(nextNode, node);
        this.node = nextNode;
    }

    mount() {
        const element = this.currentElement;

        if (['string', 'number'].includes(typeof element)) {
            return document.createTextNode(element);
        }

        const { type, props: { children, ...attributes } } = element;

        const node = document.createElement(type);

        this.node = node;

        Object.keys(attributes).forEach(propName => {
            if (propName !== 'children') {
                node.setAttribute(propName, attributes[propName]);
            }
        });

        const renderedChildren = children.map(child => new DOMComponent(child));
        this.renderedChildren = renderedChildren;

        const childNodes = renderedChildren.map(child => child.mount());
        childNodes.forEach(childNode => node.appendChild(childNode));

        return node;
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children,
        },
    };
}

class Component {
    setState(nextState) {
        const reactComponent = this._reactInternalInstance;

        this.state = Object.assign({}, this.state, nextState);

        reactComponent.receive(this.render(nextState));
    }
}

window.React = {
    createElement,
    Component,
};

function renderOld(element, container) {
    const rootComponent = new DOMComponent(element);
    const node = rootComponent.mount();

    container.appendChild(node);
}

function render(element, container) {
    const rootComponent = new CompositeComponent(element);
    const node = rootComponent.mount();

    container.appendChild(node);
}

window.ReactDOM = {
    render,
};
