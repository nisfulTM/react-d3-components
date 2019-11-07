"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _propTypes.default.func;
var StackAccessorMixin = {
  propTypes: {
    label: func,
    values: func,
    x: func,
    y: func,
    y0: func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      label: function label(stack) {
        return stack.label;
      },
      values: function values(stack) {
        return stack.values;
      },
      x: function x(e) {
        return e.x;
      },
      y: function y(e) {
        return e.y;
      },
      y0: function y0(e) {
        return e.y0;
      }
    };
  }
};
var _default = StackAccessorMixin;
exports.default = _default;