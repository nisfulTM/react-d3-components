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
    node = _propTypes.default.node;
var Tooltip = (0, _createReactClass.default)({
  displayName: "Tooltip",
  propTypes: {
    top: number.isRequired,
    left: number.isRequired,
    html: node,
    translate: number
  },
  getDefaultProps: function getDefaultProps() {
    return {
      top: 150,
      left: 100,
      html: '',
      translate: 50
    };
  },
  render: function render() {
    var _this$props = this.props,
        top = _this$props.top,
        left = _this$props.left,
        hidden = _this$props.hidden,
        html = _this$props.html,
        translate = _this$props.translate;
    var style = {
      display: hidden ? 'none' : 'block',
      position: 'fixed',
      top: top,
      left: left,
      transform: "translate(-".concat(translate, "%, 0)"),
      pointerEvents: 'none'
    };
    return _react.default.createElement("div", {
      className: "tooltip",
      style: style
    }, html);
  }
});
var _default = Tooltip;
exports.default = _default;