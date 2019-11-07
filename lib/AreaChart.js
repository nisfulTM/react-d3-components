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

var _StackAccessorMixin = _interopRequireDefault(require("./StackAccessorMixin"));

var _StackDataMixin = _interopRequireDefault(require("./StackDataMixin"));

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
    area: func.isRequired,
    line: func.isRequired,
    colorScale: func.isRequired,
    stroke: func.isRequired
  },
  render: function render() {
    var _this$props = this.props,
        data = _this$props.data,
        area = _this$props.area,
        colorScale = _this$props.colorScale,
        values = _this$props.values,
        label = _this$props.label,
        onMouseEnter = _this$props.onMouseEnter,
        onMouseLeave = _this$props.onMouseLeave;
    var areas = data.map(function (stack, index) {
      return _react.default.createElement(_Path.default, {
        key: "".concat(label(stack), ".").concat(index),
        className: "area",
        stroke: "none",
        fill: colorScale(label(stack)),
        d: area(values(stack)),
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        data: data
      });
    });
    return _react.default.createElement("g", null, areas);
  }
});
var AreaChart = (0, _createReactClass.default)({
  displayName: "AreaChart",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _ArrayifyMixin.default, _StackAccessorMixin.default, _StackDataMixin.default, _DefaultScalesMixin.default, _TooltipMixin.default],
  propTypes: {
    interpolate: string,
    stroke: func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      interpolate: 'linear',
      stroke: _d.default.scale.category20()
    };
  },
  _tooltipHtml: function _tooltipHtml(d, position) {
    var _this$props2 = this.props,
        x = _this$props2.x,
        y0 = _this$props2.y0,
        y = _this$props2.y,
        values = _this$props2.values,
        label = _this$props2.label;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var xValueCursor = xScale.invert(position[0]);

    var xBisector = _d.default.bisector(function (e) {
      return x(e);
    }).right;

    var xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
    xIndex = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
    var xIndexRight = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
    var xValueRight = x(values(d[0])[xIndexRight]);
    var xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
    var xValueLeft = x(values(d[0])[xIndexLeft]);

    if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
      xIndex = xIndexRight;
    } else {
      xIndex = xIndexLeft;
    }

    var yValueCursor = yScale.invert(position[1]);

    var yBisector = _d.default.bisector(function (e) {
      return y0(values(e)[xIndex]) + y(values(e)[xIndex]);
    }).left;

    var yIndex = yBisector(d, yValueCursor);
    yIndex = yIndex == d.length ? yIndex - 1 : yIndex;
    var yValue = y(values(d[yIndex])[xIndex]);
    var yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);
    var xValue = x(values(d[yIndex])[xIndex]);
    var xPos = xScale(xValue);
    var yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);
    return [this.props.tooltipHtml(yValue, yValueCumulative, xValue, label(d[yIndex])), xPos, yPos];
  },
  render: function render() {
    var _this$props3 = this.props,
        height = _this$props3.height,
        width = _this$props3.width,
        margin = _this$props3.margin,
        viewBox = _this$props3.viewBox,
        preserveAspectRatio = _this$props3.preserveAspectRatio,
        colorScale = _this$props3.colorScale,
        interpolate = _this$props3.interpolate,
        stroke = _this$props3.stroke,
        values = _this$props3.values,
        label = _this$props3.label,
        x = _this$props3.x,
        y = _this$props3.y,
        y0 = _this$props3.y0,
        xAxis = _this$props3.xAxis,
        yAxis = _this$props3.yAxis,
        yOrientation = _this$props3.yOrientation;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;

    var line = _d.default.svg.line().x(function (e) {
      return xScale(x(e));
    }).y(function (e) {
      return yScale(y0(e) + y(e));
    }).interpolate(interpolate);

    var area = _d.default.svg.area().x(function (e) {
      return xScale(x(e));
    }).y0(function (e) {
      return yScale(yScale.domain()[0] + y0(e));
    }).y1(function (e) {
      return yScale(y0(e) + y(e));
    }).interpolate(interpolate);

    return _react.default.createElement("div", null, _react.default.createElement(_Chart.default, {
      height: height,
      width: width,
      margin: margin,
      viewBox: viewBox,
      preserveAspectRatio: preserveAspectRatio
    }, _react.default.createElement(DataSet, {
      data: data,
      line: line,
      area: area,
      colorScale: colorScale,
      stroke: stroke,
      label: label,
      values: values,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }), _react.default.createElement(_Axis.default, _extends({
      className: "x axis",
      orientation: "bottom",
      scale: xScale,
      height: innerHeight,
      width: innerWidth
    }, xAxis)), _react.default.createElement(_Axis.default, _extends({
      className: "y axis",
      orientation: yOrientation ? yOrientation : 'left',
      scale: yScale,
      height: innerHeight,
      width: innerWidth
    }, yAxis)), this.props.children), _react.default.createElement(_Tooltip.default, this.state.tooltip));
  }
});
var _default = AreaChart;
exports.default = _default;