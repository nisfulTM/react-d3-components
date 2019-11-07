"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = _interopRequireDefault(require("d3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneOfType = _propTypes.default.oneOfType,
    object = _propTypes.default.object,
    array = _propTypes.default.array,
    shape = _propTypes.default.shape,
    func = _propTypes.default.func,
    number = _propTypes.default.number;
var DefaultPropsMixin = {
  propTypes: {
    data: oneOfType([object, array]).isRequired,
    height: number.isRequired,
    width: number.isRequired,
    margin: shape({
      top: number,
      bottom: number,
      left: number,
      right: number
    }),
    xScale: func,
    yScale: func,
    colorScale: func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      data: {
        label: 'No data available',
        values: [{
          x: 'No data available',
          y: 1
        }]
      },
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      xScale: null,
      yScale: null,
      colorScale: _d.default.scale.category20()
    };
  }
};
var _default = DefaultPropsMixin;
exports.default = _default;