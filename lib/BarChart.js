"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _Chart = _interopRequireDefault(require("./Chart"));

var _Axis = _interopRequireDefault(require("./Axis"));

var _Bar = _interopRequireDefault(require("./Bar"));

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

var _DefaultPropsMixin = _interopRequireDefault(require("./DefaultPropsMixin"));

var _HeightWidthMixin = _interopRequireDefault(require("./HeightWidthMixin"));

var _ArrayifyMixin = _interopRequireDefault(require("./ArrayifyMixin"));

var _StackAccessorMixin = _interopRequireDefault(require("./StackAccessorMixin"));

var _StackDataMixin = _interopRequireDefault(require("./StackDataMixin"));

var _DefaultScalesMixin = _interopRequireDefault(require("./DefaultScalesMixin"));

var _TooltipMixin = _interopRequireDefault(require("./TooltipMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var array = _propTypes.default.array,
    func = _propTypes.default.func;
var DataSet = (0, _createReactClass.default)({
  displayName: "DataSet",
  propTypes: {
    data: array.isRequired,
    xScale: func.isRequired,
    yScale: func.isRequired,
    colorScale: func.isRequired,
    values: func.isRequired,
    label: func.isRequired,
    x: func.isRequired,
    y: func.isRequired,
    y0: func.isRequired
  },
  render: function render() {
    var _this$props = this.props,
        data = _this$props.data,
        xScale = _this$props.xScale,
        yScale = _this$props.yScale,
        colorScale = _this$props.colorScale,
        values = _this$props.values,
        label = _this$props.label,
        x = _this$props.x,
        y = _this$props.y,
        y0 = _this$props.y0,
        onMouseEnter = _this$props.onMouseEnter,
        onMouseLeave = _this$props.onMouseLeave,
        groupedBars = _this$props.groupedBars,
        colorByLabel = _this$props.colorByLabel;
    var bars;

    if (groupedBars) {
      bars = data.map(function (stack, serieIndex) {
        return values(stack).map(function (e, index) {
          var yVal = y(e) < 0 ? yScale(0) : yScale(y(e));
          return _react.default.createElement(_Bar.default, {
            key: "".concat(label(stack), ".").concat(index),
            width: xScale.rangeBand() / data.length,
            height: Math.abs(yScale(0) - yScale(y(e))),
            x: xScale(x(e)) + xScale.rangeBand() * serieIndex / data.length,
            y: yVal,
            fill: colorScale(label(stack)),
            data: e,
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave
          });
        });
      });
    } else {
      bars = data.map(function (stack) {
        return values(stack).map(function (e, index) {
          var color = colorByLabel ? colorScale(label(stack)) : colorScale(x(e));
          var yVal = y(e) < 0 ? yScale(y0(e)) : yScale(y0(e) + y(e));
          return _react.default.createElement(_Bar.default, {
            key: "".concat(label(stack), ".").concat(index),
            width: xScale.rangeBand(),
            height: Math.abs(yScale(y0(e) + y(e)) - yScale(y0(e))),
            x: xScale(x(e)),
            y: yVal,
            fill: color,
            data: e,
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave
          });
        });
      });
    }

    return _react.default.createElement("g", null, bars);
  }
});
var BarChart = (0, _createReactClass.default)({
  displayName: "BarChart",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _ArrayifyMixin.default, _StackAccessorMixin.default, _StackDataMixin.default, _DefaultScalesMixin.default, _TooltipMixin.default],
  getDefaultProps: function getDefaultProps() {
    return {
      colorByLabel: true
    };
  },
  _tooltipHtml: function _tooltipHtml(d) {
    var xScale = this._xScale;
    var yScale = this._yScale;
    var html = this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d));
    var midPoint = xScale.rangeBand() / 2;
    var xPos = midPoint + xScale(this.props.x(d));
    var topStack = this._data[this._data.length - 1].values;
    var topElement = null; // TODO: this might not scale if dataset is huge.
    // consider pre-computing yPos for each X

    for (var i = 0; i < topStack.length; i++) {
      if (this.props.x(topStack[i]) === this.props.x(d)) {
        topElement = topStack[i];
        break;
      }
    }

    var yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));
    return [html, xPos, yPos];
  },
  render: function render() {
    var _this$props2 = this.props,
        xAxis = _this$props2.xAxis,
        yAxis = _this$props2.yAxis,
        height = _this$props2.height,
        width = _this$props2.width,
        margin = _this$props2.margin,
        viewBox = _this$props2.viewBox,
        preserveAspectRatio = _this$props2.preserveAspectRatio,
        colorScale = _this$props2.colorScale,
        values = _this$props2.values,
        label = _this$props2.label,
        y = _this$props2.y,
        y0 = _this$props2.y0,
        x = _this$props2.x,
        groupedBars = _this$props2.groupedBars,
        colorByLabel = _this$props2.colorByLabel,
        tickFormat = _this$props2.tickFormat;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var yIntercept = this._yIntercept;
    return _react.default.createElement("div", null, _react.default.createElement(_Chart.default, {
      height: height,
      width: width,
      margin: margin,
      viewBox: viewBox,
      preserveAspectRatio: preserveAspectRatio
    }, _react.default.createElement(DataSet, {
      data: data,
      xScale: xScale,
      yScale: yScale,
      colorScale: colorScale,
      values: values,
      label: label,
      y: y,
      y0: y0,
      x: x,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      groupedBars: groupedBars,
      colorByLabel: colorByLabel
    }), _react.default.createElement(_Axis.default, _extends({
      className: "x axis",
      orientation: "bottom",
      scale: xScale,
      height: innerHeight,
      width: innerWidth,
      zero: yIntercept,
      tickFormat: tickFormat
    }, xAxis)), _react.default.createElement(_Axis.default, _extends({
      className: "y axis",
      orientation: "left",
      scale: yScale,
      height: innerHeight,
      width: innerWidth,
      tickFormat: tickFormat
    }, yAxis)), this.props.children), _react.default.createElement(_Tooltip.default, this.state.tooltip));
  }
});
var _default = BarChart;
exports.default = _default;