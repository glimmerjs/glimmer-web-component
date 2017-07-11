import Application from '@glimmer/application';
import glimmerElementFactory from './glimmer-element';

export interface CustomElementOptions {
  app: Application;
  componentName: string;
  elementName?: string;
}

export function initializeCustomElements(app: Application, customElementDefinitions: string[]): void {
  customElementDefinitions.forEach(name => {
    initializeCustomElement({ app, componentName: name });
  });
}

export function initializeCustomElement({ app, componentName, elementName }: CustomElementOptions): void {
  if (!elementName) {
    elementName = componentName;
  }

  window.customElements.define(elementName, glimmerElementFactory({ app, componentName }));
}
