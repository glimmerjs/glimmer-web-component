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
initializeCustomElements(app, /* array of component names */);
```

This will register custom elements for each of the component names you give to `initializeCustomElements` and will replace the custom element with your Glimmer component once the custom element connects. For example, if you provide the component name `'foo-bar'` you can now use the custom element `<foo-bar>` anywhere in the DOM and have your `foo-bar` component render in its place.

## License

MIT License.
