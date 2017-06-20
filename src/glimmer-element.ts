import Application from '@glimmer/application';
import { templateFactory } from '@glimmer/runtime';
import { TemplateMeta } from '@glimmer/wire-format';
import { Simple } from '@glimmer/interfaces';
import CustomElementComponentManager from './custom-element-component-manager';
import CustomElementComponentDefinition from './custom-element-component-definition';

export interface GlimmerElement extends HTMLElement {
  constructor: GlimmerElementConstructor;
}

export interface GlimmerElementConstructor extends Function {
  prototype: HTMLElement;
}

export interface GlimmerElementFactoryOptions {
  app: Application,
  componentName: string
}

function glimmerElementFactory({ app, componentName }: GlimmerElementFactoryOptions): GlimmerElementConstructor {
  const GlimmerElement: GlimmerElementConstructor = (function() {
    return function GlimmerElement(): GlimmerElement {
      return Reflect.construct(HTMLElement, [], GlimmerElement);
    };
  })();

  let propertyDescriptorMap: PropertyDescriptorMap = {
    constructor: { value: GlimmerElement },

    connectedCallback: {
      value: function connectedCallback(this: GlimmerElement): void {
        let shadowRoot = this.attachShadow({ mode: 'open' });

        app.renderComponent(componentName, shadowRoot);
      }
    }
  };

  GlimmerElement.prototype = Object.create(HTMLElement.prototype, propertyDescriptorMap);

  return GlimmerElement;
}

export default glimmerElementFactory;
