import Application from '@glimmer/application';
import initializeCustomElements from '../src/initialize-custom-elements';
import { Option } from "@glimmer/util";

const { module, test } = QUnit;

let containerElement: HTMLDivElement;

module('initializeCustomElements with async render', {
  before() {
    let app = setupApp();
    initializeCustomElements(app as Application, { 'hello-world-async': 'HelloWorld' });
  },

  beforeEach() {
    containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
  },

  afterEach() {
    containerElement.remove();
    containerElement = null;
  }
});

test('leaves surrounding content intact', function(assert) {
  assert.expect(2);

  appendElements('article', 'hello-world-async', 'section');

  var done = assert.async();
  requestAnimationFrame(() => {
    let glimmerComponentElement = document.getElementsByTagName('aside').item(0);
    let precedingElement = document.getElementsByTagName('article').item(0);

    assert.equal(glimmerComponentElement.nextElementSibling.tagName, 'SECTION', 'following content is left untouched');
    assert.equal(precedingElement.nextElementSibling.tagName, 'ASIDE', 'preceding content is left untouched');
    done();
  });
});

function setupApp(): object {
  return {
    _rendering: true,

    renderComponent(name, parent, placeholder): void {
      requestAnimationFrame(() => {
        let glimmerComponentElement = document.createElement('aside');
        parent.insertBefore(glimmerComponentElement, placeholder);
        this._rendering = false;
      });
    }
  };
}

function appendElements(...tagNames): void {
  tagNames.forEach(tagName => {
    let tag = document.createElement(tagName);
    containerElement.appendChild(tag);
  });
}
