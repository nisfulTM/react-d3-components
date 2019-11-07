"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var array = _propTypes.default.array,
    func = _propTypes.default.func,
    oneOf = _propTypes.default.oneOf,
    number = _propTypes.default.number,
    string = _propTypes.default.string;
var Axis = (0, _createReactClass.default)({
  displayName: "Axis",
  propTypes: {
    tickArguments: array,
    tickValues: array,
    tickFormat: func,
    tickDirection: oneOf(['horizontal', 'vertical', 'diagonal']),
    innerTickSize: number,
    tickPadding: number,
    outerTickSize: number,
    scale: func.isRequired,
    className: string,
    zero: number,
    orientation: oneOf(['top', 'bottom', 'left', 'right']).isRequired,
    label: string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      tickArguments: [10],
      tickValues: null,
      tickFormat: null,
      tickDirection: 'horizontal',
      innerTickSize: 6,
      tickPadding: 3,
      outerTickSize: 6,
      className: 'axis',
      zero: 0,
      label: ''
    };
  },
  _getTranslateString: function _getTranslateString() {
    var _this$props = this.props,
        orientation = _this$props.orientation,
        height = _this$props.height,
        width = _this$props.width,
        zero = _this$props.zero;

    if (orientation === 'top') {
      return "translate(0, ".concat(zero, ")");
    } else if (orientation === 'bottom') {
      return "translate(0, ".concat(zero == 0 ? height : zero, ")");
    } else if (orientation === 'left') {
      return "translate(".concat(zero, ", 0)");
    } else if (orientation === 'right') {
      return "translate(".concat(zero == 0 ? width : zero, ", 0)");
    } else {
      return '';
    }
  },
  render: function render() {
    var _this$props2 = this.props,
        height = _this$props2.height,
        tickArguments = _this$props2.tickArguments,
        tickValues = _this$props2.tickValues,
        tickDirection = _this$props2.tickDirection,
        innerTickSize = _this$props2.innerTickSize,
        tickPadding = _this$props2.tickPadding,
        outerTickSize = _this$props2.outerTickSize,
        scale = _this$props2.scale,
        orientation = _this$props2.orientation,
        zero = _this$props2.zero;
    var _this$props3 = this.props,
        width = _this$props3.width,
        className = _this$props3.className,
        label = _this$props3.label;
    var tickFormat = this.props.tickFormat;
    var ticks = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues;

    if (!tickFormat) {
      if (scale.tickFormat) {
        tickFormat = scale.tickFormat.apply(scale, tickArguments);
      } else {
        tickFormat = function tickFormat(x) {
          return x;
        };
      }
    } // TODO: is there a cleaner way? removes the 0 tick if axes are crossing


    if (zero != height && zero != width && zero != 0) {
      ticks = ticks.filter(function (element) {
        return element != 0;
      });
    }

    var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;
    var sign = orientation === 'top' || orientation === 'left' ? -1 : 1;

    var range = this._d3ScaleRange(scale);

    var activeScale = scale.rangeBand ? function (e) {
      return scale(e) + scale.rangeBand() / 2;
    } : scale;
    var transform,
        x,
        y,
        x2,
        y2,
        dy,
        textAnchor,
        d,
        labelElement,
        tickRotation = 0;

    if (orientation === 'bottom' || orientation === 'top') {
      transform = 'translate({}, 0)';
      x = 0;
      y = sign * tickSpacing;
      x2 = 0;
      y2 = sign * innerTickSize;
      dy = sign < 0 ? '0em' : '.71em';
      textAnchor = 'middle';
      d = "M".concat(range[0], ", ").concat(sign * outerTickSize, "V0H").concat(range[1], "V").concat(sign * outerTickSize);

      if (tickDirection === 'vertical') {
        tickRotation = -90;
        x = -tickSpacing;
        y = -innerTickSize;
        textAnchor = 'end';
      } else if (tickDirection === 'diagonal') {
        tickRotation = -60;
        x = -tickSpacing;
        y = 0;
        textAnchor = 'end';
      }

      labelElement = _react.default.createElement("text", {
        className: "".concat(className, " label"),
        textAnchor: 'end',
        x: width,
        y: -6
      }, label);
    } else {
      transform = 'translate(0, {})';
      x = sign * tickSpacing;
      y = 0;
      x2 = sign * innerTickSize;
      y2 = 0;
      dy = '.32em';
      textAnchor = sign < 0 ? 'end' : 'start';
      d = "M".concat(sign * outerTickSize, ", ").concat(range[0], "H0V").concat(range[1], "H").concat(sign * outerTickSize);

      if (tickDirection === 'vertical') {
        tickRotation = -90;
        x -= sign * tickSpacing;
        y = -(tickSpacing + innerTickSize);
        textAnchor = 'middle';
      } else if (tickDirection === 'diagonal') {
        tickRotation = -60;
        x -= sign * tickSpacing;
        y = -(tickSpacing + innerTickSize);
        textAnchor = 'middle';
      }

      labelElement = _react.default.createElement("text", {
        className: "".concat(className, " label"),
        textAnchor: "end",
        y: 6,
        dy: orientation === 'left' ? '.75em' : '-1.25em',
        transform: "rotate(-90)"
      }, label);
    }

    var tickElements = ticks.map(function (tick, index) {
      var position = activeScale(tick);
      var translate = transform.replace('{}', position);
      return _react.default.createElement("g", {
        key: "".concat(tick, ".").concat(index),
        className: "tick",
        transform: translate
      }, _react.default.createElement("line", {
        x2: x2,
        y2: y2,
        stroke: "#aaa"
      }), _react.default.createElement("text", {
        x: x,
        y: y,
        dy: dy,
        textAnchor: textAnchor,
        transform: "rotate(".concat(tickRotation, ")")
      }, tickFormat(tick)));
    });

    var pathElement = _react.default.createElement("path", {
      className: "domain",
      d: d,
      fill: "none",
      stroke: "#aaa"
    });

    var axisBackground = _react.default.createElement("rect", {
      className: "axis-background",
      fill: "none"
    });

    return _react.default.createElement("g", {
      ref: "axis",
      className: className,
      transform: this._getTranslateString(),
      style: {
        shapeRendering: 'crispEdges'
      }
    }, axisBackground, tickElements, pathElement, labelElement);
  },
  _d3ScaleExtent: function _d3ScaleExtent(domain) {
    var start = domain[0];
    var stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },
  _d3ScaleRange: function _d3ScaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3ScaleExtent(scale.range());
  }
});
var _default = Axis;
exports.default = _default;