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
      value: function connectedCallback(): void {
        let placeholder = document.createElement('span');
        let parent = this.parentNode;

        parent.insertBefore(placeholder, this);
        parent.removeChild(this);

        app.renderComponent(name, parent, placeholder);

        whenRendered(app, () => {
          let customElement = this as Element;
          let glimmerElement = placeholder.previousElementSibling;

          placeholder.remove();
          assignAttributes(customElement, glimmerElement);
        });
      }
    }
  });

  window.customElements.define(name, GlimmerElement);
}

function assignAttributes(fromElement: Element, toElement: Element): void {
  let attributes = fromElement.attributes;

  for (let i = 0; i < attributes.length; i++) {
    let { name, value } = attributes.item(i);
    toElement.setAttribute(name, value);
  }
}

function whenRendered(app, callback) {
  if (app['_rendering']) {
    self.Promise.resolve.then(() => {
      whenRendered(app, callback);
    });
  } else {
    callback();
  }
}
