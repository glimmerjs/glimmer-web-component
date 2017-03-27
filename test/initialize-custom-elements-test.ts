import Application from '@glimmer/application';
import initializeCustomElements from '../src/initialize-custom-elements';
import { Option } from "@glimmer/util";

const { module, test } = QUnit;

let containerElement: HTMLDivElement;

module('initializeCustomElements', {
  beforeEach() {
    containerElement = document.createElement('div');
    containerElement.setAttribute('id', 'container');
    document.body.appendChild(containerElement);
  },

  afterEach() {
    containerElement.remove();
    containerElement = null;
  }
});

test('renders a root in place of a custom element', function(assert) {
  assert.expect(4);

  let app = setupApp();

  initializeCustomElements(app as Application, ['hello-world']);

  assert.equal(document.getElementsByTagName('aside').length, 0, 'glimmer component not inserted yet');

  appendCustomElementWithSibling('hello-world', 'section');

  assert.equal(document.getElementsByTagName('hello-world').length, 0, 'custom element connected and removed');
  assert.equal(document.getElementsByTagName('aside').length, 1, 'glimmer component rendered in place of custom element');
  assert.equal(document.getElementsByTagName('aside').item(0).nextElementSibling.tagName, 'SECTION', 'glimmer component inserted in correct spot');
});

function setupApp(): object {
  return {
    renderComponent(name, parent, placeholder) {
      let glimmerComponentElement = document.createElement('aside');

      parent.insertBefore(glimmerComponentElement, placeholder);
    }
  };
}

function appendCustomElementWithSibling(customTagName, siblingTagName): void {
  let customElement = document.createElement(customTagName);
  containerElement.appendChild(customElement);

  let referenceElement = document.createElement(siblingTagName);
  containerElement.appendChild(referenceElement);
}
