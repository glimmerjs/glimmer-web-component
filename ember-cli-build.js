const build = require('@glimmer/build');

module.exports = function() {
  return build({
    test: {
      es5: false
    }
  });
}
