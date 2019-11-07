"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var number = _propTypes.default.number,
    shape = _propTypes.default.shape;
var Chart = (0, _createReactClass.default)({
  displayName: "Chart",
  propTypes: {
    height: number.isRequired,
    width: number.isRequired,
    margin: shape({
      top: number,
      bottom: number,
      left: number,
      right: number
    }).isRequired
  },
  render: function render() {
    var _this$props = this.props,
        width = _this$props.width,
        height = _this$props.height,
        margin = _this$props.margin,
        viewBox = _this$props.viewBox,
        preserveAspectRatio = _this$props.preserveAspectRatio,
        children = _this$props.children;
    return _react.default.createElement("svg", {
      ref: "svg",
      width: width,
      height: height,
      viewBox: viewBox,
      preserveAspectRatio: preserveAspectRatio
    }, _react.default.createElement("g", {
      transform: "translate(".concat(margin.left, ", ").concat(margin.top, ")")
    }, children));
  }
});
var _default = Chart;
exports.default = _default;