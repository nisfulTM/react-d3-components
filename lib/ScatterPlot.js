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
    symbol: func.isRequired,
    xScale: func.isRequired,
    yScale: func.isRequired,
    colorScale: func.isRequired,
    onMouseEnter: func,
    onMouseLeave: func
  },
  render: function render() {
    var _this$props = this.props,
        data = _this$props.data,
        symbol = _this$props.symbol,
        xScale = _this$props.xScale,
        yScale = _this$props.yScale,
        colorScale = _this$props.colorScale,
        label = _this$props.label,
        values = _this$props.values,
        x = _this$props.x,
        y = _this$props.y,
        onMouseEnter = _this$props.onMouseEnter,
        _onMouseLeave = _this$props.onMouseLeave;
    var circles = data.map(function (stack) {
      return values(stack).map(function (e, index) {
        var translate = "translate(".concat(xScale(x(e)), ", ").concat(yScale(y(e)), ")");
        return _react.default.createElement("path", {
          key: "".concat(label(stack), ".").concat(index),
          className: "dot",
          d: symbol(),
          transform: translate,
          fill: colorScale(label(stack)),
          onMouseOver: function onMouseOver(evt) {
            return onMouseEnter(evt, e);
          },
          onMouseLeave: function onMouseLeave(evt) {
            return _onMouseLeave(evt);
          }
        });
      });
    });
    return _react.default.createElement("g", null, circles);
  }
});
var ScatterPlot = (0, _createReactClass.default)({
  displayName: "ScatterPlot",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _ArrayifyMixin.default, _AccessorMixin.default, _DefaultScalesMixin.default, _TooltipMixin.default],
  propTypes: {
    rScale: func,
    shape: string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      rScale: null,
      shape: 'circle'
    };
  },
  _tooltipHtml: function _tooltipHtml(d) {
    var html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

    var xPos = this._xScale(this.props.x(d));

    var yPos = this._yScale(this.props.y(d));

    return [html, xPos, yPos];
  },
  render: function render() {
    var _this$props2 = this.props,
        height = _this$props2.height,
        width = _this$props2.width,
        margin = _this$props2.margin,
        viewBox = _this$props2.viewBox,
        preserveAspectRatio = _this$props2.preserveAspectRatio,
        colorScale = _this$props2.colorScale,
        rScale = _this$props2.rScale,
        shape = _this$props2.shape,
        label = _this$props2.label,
        values = _this$props2.values,
        x = _this$props2.x,
        y = _this$props2.y,
        xAxis = _this$props2.xAxis,
        yAxis = _this$props2.yAxis;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var xIntercept = this._xIntercept;
    var yIntercept = this._yIntercept;

    var symbol = _d.default.svg.symbol().type(shape);

    if (rScale) {
      symbol = symbol.size(rScale);
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
    }, yAxis)), _react.default.createElement(DataSet, {
      data: data,
      xScale: xScale,
      yScale: yScale,
      colorScale: colorScale,
      symbol: symbol,
      label: label,
      values: values,
      x: x,
      y: y,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }), this.props.children), _react.default.createElement(_Tooltip.default, this.state.tooltip));
  }
});
var _default = ScatterPlot;
exports.default = _default;