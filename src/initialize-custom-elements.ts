import Application from '@glimmer/application';

export default function initializeCustomElements(app: Application, customElementDefinitions: string[]): void {
  customElementDefinitions.forEach((name) => {
    initializeCustomElement(app, name);
  });
}

function initializeCustomElement(app: Application, name: string): void {
  function GlimmerElement() {
    return Reflect.construct(HTMLElement, [], GlimmerElement);
  }
  GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
    constructor: { value: GlimmerElement },
    connectedCallback: {
      value: function connectedCallback() {
        let placeholder = document.createTextNode('');
        let parent = this.parentNode;

        parent.insertBefore(placeholder, this);
        parent.removeChild(this);

        app.renderComponent(name, parent, placeholder);
      }
    }
  });

  window.customElements.define(name, GlimmerElement);
}
