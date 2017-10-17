import Application from '@glimmer/application';

export default function initializeCustomElements(app: Application, customElementDefinitions: { [key: string]: string; }): void {
  for(let customElementName in customElementDefinitions) {
    let glimmerComponentName = customElementDefinitions[customElementName];

    initializeCustomElement(app, customElementName, glimmerComponentName);
  }
}

function initializeCustomElement(app: Application, customElementName: string, glimmerComponentName: string): void {
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

        app.renderComponent(glimmerComponentName, parent, placeholder);

        whenRendered(app, () => {
          let customElement = this as Element;
          let glimmerElement = placeholder.previousElementSibling;

          placeholder.remove();
          assignAttributes(customElement, glimmerElement);
        });
      }
    }
  });

  window.customElements.define(customElementName, GlimmerElement);
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
