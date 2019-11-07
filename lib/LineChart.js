"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _d = _interopRequireDefault(require("d3"));

var _Chart = _interopRequireDefault(require("./Chart"));

var _Axis = _interopRequireDefault(require("./Axis"));

var _Path = _interopRequireDefault(require("./Path"));

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

var _DefaultPropsMixin = _interopRequireDefault(require("./DefaultPropsMixin"));

var _HeightWidthMixin = _interopRequireDefault(require("./HeightWidthMixin"));

var _ArrayifyMixin = _interopRequireDefault(require("./ArrayifyMixin"));

var _AccessorMixin = _interopRequireDefault(require("./AccessorMixin"));

var _DefaultScalesMixin = _interopRequireDefault(require("./DefaultScalesMixin"));

var _TooltipMixin = _interopRequireDefault(require("./TooltipMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var array = _propTypes.default.array,
    func = _propTypes.default.func,
    string = _propTypes.default.string;
var DataSet = (0, _createReactClass.default)({
  displayName: "DataSet",
  propTypes: {
    data: array.isRequired,
    line: func.isRequired,
    colorScale: func.isRequired
  },
  render: function render() {
    var _this$props = this.props,
        width = _this$props.width,
        height = _this$props.height,
        data = _this$props.data,
        line = _this$props.line,
        strokeWidth = _this$props.strokeWidth,
        strokeLinecap = _this$props.strokeLinecap,
        strokeDasharray = _this$props.strokeDasharray,
        colorScale = _this$props.colorScale,
        values = _this$props.values,
        label = _this$props.label,
        onMouseEnter = _this$props.onMouseEnter,
        _onMouseLeave = _this$props.onMouseLeave;
    var sizeId = width + 'x' + height;
    var lines = data.map(function (stack, index) {
      return _react.default.createElement(_Path.default, {
        key: "".concat(label(stack), ".").concat(index),
        className: 'line',
        d: line(values(stack)),
        stroke: colorScale(label(stack)),
        strokeWidth: typeof strokeWidth === 'function' ? strokeWidth(label(stack)) : strokeWidth,
        strokeLinecap: typeof strokeLinecap === 'function' ? strokeLinecap(label(stack)) : strokeLinecap,
        strokeDasharray: typeof strokeDasharray === 'function' ? strokeDasharray(label(stack)) : strokeDasharray,
        data: values(stack),
        onMouseEnter: onMouseEnter,
        onMouseLeave: _onMouseLeave,
        style: {
          clipPath: "url(#lineClip_".concat(sizeId, ")")
        }
      });
    });
    /*
     The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
     Not sure if this should be used.
     */

    return _react.default.createElement("g", null, _react.default.createElement("defs", null, _react.default.createElement("clipPath", {
      id: "lineClip_".concat(sizeId)
    }, _react.default.createElement("rect", {
      width: width,
      height: height
    }))), lines, _react.default.createElement("rect", {
      width: width,
      height: height,
      fill: 'none',
      stroke: 'none',
      style: {
        pointerEvents: 'all'
      },
      onMouseMove: function onMouseMove(evt) {
        onMouseEnter(evt, data);
      },
      onMouseLeave: function onMouseLeave(evt) {
        _onMouseLeave(evt);
      }
    }));
  }
});
var LineChart = (0, _createReactClass.default)({
  displayName: "LineChart",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _ArrayifyMixin.default, _AccessorMixin.default, _DefaultScalesMixin.default, _TooltipMixin.default],
  propTypes: {
    interpolate: string,
    defined: func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      interpolate: 'linear',
      defined: function defined() {
        return true;
      },
      shape: 'circle',
      shapeColor: null,
      showCustomLine: false,
      lineStructureClassName: 'dot',
      customPointColor: 'blue',
      customPointShape: 'circle'
    };
  },

  /*
   The code below supports finding the data values for the line closest to the mouse cursor.
   Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
   For now I don't want to use this method.
   */
  _tooltipHtml: function _tooltipHtml(data, position) {
    var _this$props2 = this.props,
        x = _this$props2.x,
        y = _this$props2.y,
        values = _this$props2.values,
        label = _this$props2.label;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var xValueCursor = xScale.invert(position[0]);
    var yValueCursor = yScale.invert(position[1]);

    var xBisector = _d.default.bisector(function (e) {
      return x(e);
    }).left;

    var valuesAtX = data.map(function (stack) {
      var idx = xBisector(values(stack), xValueCursor);
      var indexRight = idx === values(stack).length ? idx - 1 : idx;
      var valueRight = x(values(stack)[indexRight]);
      var indexLeft = idx === 0 ? idx : idx - 1;
      var valueLeft = x(values(stack)[indexLeft]);
      var index;

      if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
        index = indexRight;
      } else {
        index = indexLeft;
      }

      return {
        label: label(stack),
        value: values(stack)[index]
      };
    });
    valuesAtX.sort(function (a, b) {
      return y(a.value) - y(b.value);
    });

    var yBisector = _d.default.bisector(function (e) {
      return y(e.value);
    }).left;

    var yIndex = yBisector(valuesAtX, yValueCursor);
    var yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
    var yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;
    var yValueRight = y(valuesAtX[yIndexRight].value);
    var yValueLeft = y(valuesAtX[yIndexLeft].value);
    var index;

    if (Math.abs(yValueCursor - yValueRight) < Math.abs(yValueCursor - yValueLeft)) {
      index = yIndexRight;
    } else {
      index = yIndexLeft;
    }

    this._tooltipData = valuesAtX[index];
    var html = this.props.tooltipHtml(valuesAtX[index].label, valuesAtX[index].value);
    var xPos = xScale(valuesAtX[index].value.x);
    var yPos = yScale(valuesAtX[index].value.y);
    return [html, xPos, yPos];
  },

  /*
  _tooltipHtml(data, position) {
      let {x, y0, y, values, label} = this.props;
      let [xScale, yScale] = [this._xScale, this._yScale];
       let xValueCursor = xScale.invert(position[0]);
      let yValueCursor = yScale.invert(position[1]);
       let xBisector = d3.bisector(e => { return x(e); }).left;
      let xIndex = xBisector(data, xScale.invert(position[0]));
       let indexRight = xIndex == data.length ? xIndex - 1 : xIndex;
      let valueRight = x(data[indexRight]);
       let indexLeft = xIndex == 0 ? xIndex : xIndex - 1;
      let valueLeft = x(data[indexLeft]);
       let index;
      if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
          index = indexRight;
      } else {
          index = indexLeft;
      }
       let yValue = y(data[index]);
      let cursorValue = d3.round(yScale.invert(position[1]), 2);
       return this.props.tooltipHtml(yValue, cursorValue);
  },
   */

  /*
           stroke,
           strokeWidth,
           strokeLinecap,
           strokeDasharray,
   */
  render: function render() {
    var _this = this;

    var _this$props3 = this.props,
        height = _this$props3.height,
        width = _this$props3.width,
        margin = _this$props3.margin,
        viewBox = _this$props3.viewBox,
        preserveAspectRatio = _this$props3.preserveAspectRatio,
        colorScale = _this$props3.colorScale,
        interpolate = _this$props3.interpolate,
        defined = _this$props3.defined,
        stroke = _this$props3.stroke,
        values = _this$props3.values,
        label = _this$props3.label,
        x = _this$props3.x,
        y = _this$props3.y,
        xAxis = _this$props3.xAxis,
        yAxis = _this$props3.yAxis,
        shape = _this$props3.shape,
        shapeColor = _this$props3.shapeColor,
        showCustomLine = _this$props3.showCustomLine,
        lineStructureClassName = _this$props3.lineStructureClassName,
        customPointColor = _this$props3.customPointColor,
        customPointShape = _this$props3.customPointShape;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var xIntercept = this._xIntercept;
    var yIntercept = this._yIntercept;

    var line = _d.default.svg.line().x(function (e) {
      return xScale(x(e));
    }).y(function (e) {
      return yScale(y(e));
    }).interpolate(interpolate).defined(defined);

    var tooltipSymbol = null,
        points = null;

    if (!this.state.tooltip.hidden) {
      var symbol = _d.default.svg.symbol().type(shape);

      var symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);
      var translate = this._tooltipData ? "translate(".concat(xScale(x(this._tooltipData.value)), ", ").concat(yScale(y(this._tooltipData.value)), ")") : '';
      tooltipSymbol = this.state.tooltip.hidden ? null : _react.default.createElement("path", {
        className: "dot",
        d: symbol(),
        transform: translate,
        fill: symbolColor,
        onMouseEnter: function onMouseEnter(evt) {
          return _this.onMouseEnter(evt, data);
        },
        onMouseLeave: function onMouseLeave(evt) {
          return _this.onMouseLeave(evt);
        }
      });
    }

    if (showCustomLine) {
      var translatePoints = function translatePoints(point) {
        return "translate(".concat(xScale(x(point)), ", ").concat(yScale(y(point)), ")");
      };

      points = data.map(function (d) {
        return d.values.map(function (p, i) {
          return _react.default.createElement("path", {
            key: i,
            className: lineStructureClassName,
            d: _d.default.svg.symbol().type(customPointShape)(),
            transform: translatePoints(p),
            fill: customPointColor,
            onMouseEnter: function onMouseEnter(evt) {
              return _this.onMouseEnter(evt, data);
            },
            onMouseLeave: function onMouseLeave(evt) {
              return _this.onMouseLeave(evt);
            }
          });
        });
      });
    }

    return _react.default.createElement("div", null, _react.default.createElement(_Chart.default, {
      height: height,
      width: width,
      margin: margin,
      viewBox: viewBox,
      preserveAspectRatio: preserveAspectRatio
    }, _react.default.createElement(_Axis.default, _extends({
      className: "x axis",
      orientation: "bottom",
      scale: xScale,
      height: innerHeight,
      width: innerWidth,
      zero: yIntercept
    }, xAxis)), _react.default.createElement(_Axis.default, _extends({
      className: "y axis",
      orientation: "left",
      scale: yScale,
      height: innerHeight,
      width: innerWidth,
      zero: xIntercept
    }, yAxis)), _react.default.createElement(DataSet, _extends({
      height: innerHeight,
      width: innerWidth,
      data: data,
      line: line,
      colorScale: colorScale,
      values: values,
      label: label,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }, stroke)), this.props.children, tooltipSymbol, points), _react.default.createElement(_Tooltip.default, this.state.tooltip));
  }
});
var _default = LineChart;
exports.default = _default;