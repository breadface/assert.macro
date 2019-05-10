"use strict";

var t = require("babel-types");

var _require = require("babel-plugin-macros"),
    createMacro = _require.createMacro;

function checkAssertArguments(file, node) {
  var args = node.arguments;
  if (args.length !== 2) {
    throw file.buildCodeFrameError(node, "The `assert` function takes exactly two arguments!");
  }

  if (!t.isBinaryExpression(args[0])) {
    throw file.buildCodeFrameError(node, "The first argument to `assert` must be a conditional expression");
  }
  if (!t.isStringLiteral(args[1])) {
    throw file.buildCodeFrameError(node, "The second argument to `assert` must be a string");
  }
}

function buildAssert(args, state) {
  var predicate = args[0];
  var message = args[1];

  return t.ifStatement(predicate, t.throwStatement(message));
}

var assert_transform = function assert_transform(path, state) {
  var node = path.node;
  checkAssertArguments(state.file, path.node);
  path.replaceWith(buildAssert(node.arguments, state));
};

module.exports = createMacro(function (_ref) {
  var references = _ref.references,
      state = _ref.state;

  references.forEach(function (reference) {
    if (t.isCallExpression(reference.parentPath)) {
      assert_transform(referencePath.parentPath, state);
    } else {
      throw Error("assert.macro can only be used a function, and can not be passed around as an argument.");
    }
  });
});