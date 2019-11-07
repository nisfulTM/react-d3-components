"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var string = _propTypes.default.string,
    array = _propTypes.default.array;
var Path = (0, _createReactClass.default)({
  displayName: "Path",
  propTypes: {
    className: string,
    stroke: string.isRequired,
    strokeLinecap: string,
    strokeWidth: string,
    strokeDasharray: string,
    fill: string,
    d: string.isRequired,
    data: array.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      className: 'path',
      fill: 'none',
      strokeWidth: '2',
      strokeLinecap: 'butt',
      strokeDasharray: 'none'
    };
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        stroke = _this$props.stroke,
        strokeWidth = _this$props.strokeWidth,
        strokeLinecap = _this$props.strokeLinecap,
        strokeDasharray = _this$props.strokeDasharray,
        fill = _this$props.fill,
        d = _this$props.d,
        style = _this$props.style,
        data = _this$props.data,
        onMouseEnter = _this$props.onMouseEnter,
        _onMouseLeave = _this$props.onMouseLeave;
    return _react.default.createElement("path", {
      className: className,
      stroke: stroke,
      strokeWidth: strokeWidth,
      strokeLinecap: strokeLinecap,
      strokeDasharray: strokeDasharray,
      fill: fill,
      d: d,
      onMouseMove: function onMouseMove(evt) {
        return onMouseEnter(evt, data);
      },
      onMouseLeave: function onMouseLeave(evt) {
        return _onMouseLeave(evt);
      },
      style: style
    });
  }
});
var _default = Path;
exports.default = _default;