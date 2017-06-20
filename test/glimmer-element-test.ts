import Application from '@glimmer/application';
import { initializeCustomElement, initializeCustomElements } from '../src/initialize-custom-elements';
import { Option } from "@glimmer/util";
import { didRender } from '@glimmer/application-test-helpers';
import buildApp from './test-helpers/test-app';
import { GlimmerElement } from '../src/glimmer-element';
import CustomElementComponent from '../src/custom-element-component';

const { module, test } = QUnit;

let app: Application;
let container: HTMLElement;

module('GlimmerElement', {
  afterEach() {
    container.remove();
  }
});

test('renders glimmer component as a fragment into custom element shadow dom', async function(assert) {
  assert.expect(2);

  container = document.createElement('div');

  let app = buildApp()
    .template('shadow-dom', `Hello <slot></slot>!`)
    .boot();

  initializeCustomElement({
    app,
    componentName: 'shadow-dom'
  });

  let customElement = document.createElement('shadow-dom') as GlimmerElement;
  customElement.appendChild(document.createTextNode('Roberto'));
  container.appendChild(customElement);
  document.body.appendChild(container);

  await didRender(app);

  assert.equal(customElement.outerHTML, '<shadow-dom>Roberto</shadow-dom>');
  assert.equal(customElement.shadowRoot.innerHTML, 'Hello <slot></slot>!');
});

test('properly assigns the element property in the component', function(assert) {
  let done = assert.async();
  assert.expect(2);

  let customElement = document.createElement('element-property') as GlimmerElement;
  container = document.createElement('div');

  class ElementProperty extends CustomElementComponent {
    constructor(injections) {
      super(injections);
      assert.strictEqual(this.element, customElement);
    }
    didAppendLayout() {
      assert.strictEqual(this.element, customElement);
      done();
    }
  }

  let app = buildApp()
    .template('element-property', `Hello <slot></slot>!`)
    .component('element-property', ElementProperty)
    .boot();

  initializeCustomElement({
    app,
    componentName: 'element-property'
  });

  customElement.appendChild(document.createTextNode('Roberto'));
  container.appendChild(customElement);
  document.body.appendChild(container);
});
