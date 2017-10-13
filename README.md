# @glimmer/web-component [![Build Status](https://secure.travis-ci.org/glimmerjs/glimmer-web-component.svg?branch=master)](http://travis-ci.org/glimmerjs/glimmer-web-component)

## Installation

Add this package to your project with Yarn:

```
yarn add --dev @glimmer/web-component
```

Or alternatively with npm:

```
npm install --save-dev @glimmer/web-component
```

## Usage

Add this import to your `src/index.ts` or wherever you are instantiating your Glimmer app:

```ts
import initializeCustomElements from '@glimmer/web-component';
```

And then after `app.boot()`:

```ts
initializeCustomElements(app, {
  'button-list': 'ButtonList',
  'x-button': 'Button'
});
```

This will register custom elements for each of the items defined in the hash passed to `initializeCustomElements` and will replace the custom element with your Glimmer component once the custom element connects. For example, if you provide the hash `{ 'foo-bar': 'FooBar' }`, you can then use the custom element `<foo-bar>` anywhere in the DOM and have your `<FooBar>` Glimmer component render in its place.

## Browser Support

Browser support for the `WebComponents` spec is not [not great yet](http://caniuse.com/#feat=custom-elementsv1).  If you want to use `customElements.define` where it is not yet supported natively, you'll need to install the [polyfill](https://github.com/webcomponents/custom-elements).

## License

MIT License.
