const t = require("babel-types");
const { createMacro } = require("babel-plugin-macros");

function checkAssertArguments(file, node) {
  let args = node.arguments;
  if (args.length !== 2) {
    throw file.buildCodeFrameError(
      node,
      "The `assert` function takes exactly two arguments!"
    );
  }

  if (!t.isBinaryExpression(args[0])) {
    throw file.buildCodeFrameError(
      node,
      "The first argument to `assert` must be a conditional expression"
    );
  }
  if (!t.isStringLiteral(args[1])) {
    throw file.buildCodeFrameError(
      node,
      "The second argument to `assert` must be a string"
    );
  }
}

function buildAssert(args, state) {
  let predicate = args[0];
  let message = args[1];

  return t.ifStatement(predicate, t.throwStatement(message));
}

let assert_transform = (path, state) => {
  let node = path.node;
  checkAssertArguments(state.file, path.node);
  path.replaceWith(buildAssert(node.arguments, state));
};

module.exports = createMacro(({ references, state }) => {
  references.forEach(reference => {
    if (t.isCallExpression(reference.parentPath)) {
      assert_transform(referencePath.parentPath, state);
    } else {
      throw Error(
        `assert.macro can only be used a function, and can not be passed around as an argument.`
      );
    }
  });
});
