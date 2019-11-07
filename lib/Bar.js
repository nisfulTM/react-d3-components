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
    string = _propTypes.default.string,
    array = _propTypes.default.array,
    object = _propTypes.default.object,
    func = _propTypes.default.func,
    oneOfType = _propTypes.default.oneOfType;
var Bar = (0, _createReactClass.default)({
  displayName: "Bar",
  propTypes: {
    width: number.isRequired,
    height: number.isRequired,
    x: number.isRequired,
    y: number.isRequired,
    fill: string.isRequired,
    data: oneOfType([array, object]).isRequired,
    onMouseEnter: func,
    onMouseLeave: func
  },
  render: function render() {
    var _this$props = this.props,
        x = _this$props.x,
        y = _this$props.y,
        width = _this$props.width,
        height = _this$props.height,
        fill = _this$props.fill,
        data = _this$props.data,
        onMouseEnter = _this$props.onMouseEnter,
        _onMouseLeave = _this$props.onMouseLeave;
    return _react.default.createElement("rect", {
      className: "bar",
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      onMouseMove: function onMouseMove(e) {
        return onMouseEnter(e, data);
      },
      onMouseLeave: function onMouseLeave(e) {
        return _onMouseLeave(e);
      }
    });
  }
});
var _default = Bar;
exports.default = _default;