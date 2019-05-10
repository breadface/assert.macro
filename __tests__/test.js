const path = require("path");
const pluginTester = require("babel-plugin-tester");
const plugin = require("babel-plugin-macros").default;

pluginTester({
  plugin,
  pluginName: "Babel plugin macros",
  snapshot: true,
  tests: withFilename([
    `
      import assert from '../assert.macro'
      assert(2 !== 4, "2 is not equal to 4");
    `
  ])
});

/*
 * This adds the filename to each test so you can do require/import relative
 * to this test file.
 */
function withFilename(tests) {
  return tests.map(t => {
    const test = { babelOptions: { filename: __filename } };
    if (typeof t === "string") {
      test.code = t;
    } else {
      Object.assign(test, t);
    }
    return test;
  });
}
