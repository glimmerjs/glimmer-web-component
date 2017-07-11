"use strict";

const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');
const buildVendorPackage = require('@glimmer/build/lib/build-vendor-package');
const path = require('path');
const funnel = require('broccoli-funnel');

module.exports = function() {
  let isTest = process.env.EMBER_ENV === 'test' || process.env.BROCCOLI_ENV === 'tests';

  let external = [];

  if (isTest) {
    external = external.concat([
      '@glimmer/application',
      '@glimmer/application-test-helpers',
      '@glimmer/compiler',
      '@glimmer/component',
      '@glimmer/di',
      '@glimmer/env',
      '@glimmer/object-reference',
      '@glimmer/reference',
      '@glimmer/resolver',
      '@glimmer/runtime',
      '@glimmer/syntax',
      '@glimmer/util',
      '@glimmer/wire-format',
    ]);
  }

  let vendorTrees = external.map(packageDist);

  vendorTrees.push(buildVendorPackage('simple-html-tokenizer'));
  vendorTrees.push(funnel(path.dirname(require.resolve('handlebars/package')), {
    include: ['dist/handlebars.amd.js']
  }));

  return build({
    vendorTrees,
    external
  });
}
