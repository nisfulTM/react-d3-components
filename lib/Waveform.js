"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _Chart = _interopRequireDefault(require("./Chart"));

var _Bar = _interopRequireDefault(require("./Bar"));

var _DefaultPropsMixin = _interopRequireDefault(require("./DefaultPropsMixin"));

var _HeightWidthMixin = _interopRequireDefault(require("./HeightWidthMixin"));

var _ArrayifyMixin = _interopRequireDefault(require("./ArrayifyMixin"));

var _StackAccessorMixin = _interopRequireDefault(require("./StackAccessorMixin"));

var _StackDataMixin = _interopRequireDefault(require("./StackDataMixin"));

var _DefaultScalesMixin = _interopRequireDefault(require("./DefaultScalesMixin"));

var _TooltipMixin = _interopRequireDefault(require("./TooltipMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var array = _propTypes.default.array,
    func = _propTypes.default.func; // receive array and return a subsampled array of size n
//
// a= the array;
// n= number of sample you want output

var subSample = function subSample(a, n) {
  var returnArray = [];
  var m = a.length;
  var samplingRatio = m / n; //just round down for now in case of comma separated

  for (var i = 0; i < m;) {
    returnArray.push(a[Math.floor(i)]);
    i += samplingRatio;
  }

  return returnArray;
};

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
        yScale = _this$props.yScale,
        colorScale = _this$props.colorScale,
        values = _this$props.values,
        label = _this$props.label,
        y = _this$props.y,
        x0 = _this$props.x0,
        onMouseEnter = _this$props.onMouseEnter,
        onMouseLeave = _this$props.onMouseLeave;
    var height = yScale(yScale.domain()[0]);
    var bars = data.map(function (stack) {
      return values(stack).map(function (e, index) {
        // maps the range [0,1] to the range [0, yDomain]
        var yValue = height * y(e); // center vertically to have upper and lower part of the waveform

        var vy = height / 2 - yValue / 2; //position x(e) * width * 2 because we want equal sapce.

        var vx = 2 * x0 * index;
        return _react.default.createElement(_Bar.default, {
          key: "".concat(label(stack), ".").concat(index),
          width: x0,
          height: yValue,
          x: vx,
          y: vy,
          fill: colorScale(Math.floor(vx)),
          data: e,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave
        });
      });
    });
    return _react.default.createElement("g", null, bars);
  }
});
var Waveform = (0, _createReactClass.default)({
  displayName: "Waveform",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _ArrayifyMixin.default, _StackAccessorMixin.default, _StackDataMixin.default, _DefaultScalesMixin.default, _TooltipMixin.default],
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  _tooltipHtml: function _tooltipHtml(d) {
    var _ref = [this._xScale, this._yScale],
        xScale = _ref[0],
        yScale = _ref[1];
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
        height = _this$props2.height,
        width = _this$props2.width,
        margin = _this$props2.margin,
        colorScale = _this$props2.colorScale,
        values = _this$props2.values,
        label = _this$props2.label,
        y = _this$props2.y,
        y0 = _this$props2.y0,
        x = _this$props2.x;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var preserveAspectRatio = 'none';
    var viewBox = "0 0 ".concat(width, " ").concat(height); // there are two options, if the samples are less than the space available
    // we'll stretch the width of bar and inbetween spaces.
    // Otherwise we just subSample the dataArray.

    var barWidth;

    if (data[0].values.length > innerWidth / 2) {
      data[0].values = subSample(data[0].values, innerWidth / 2);
      barWidth = 1;
    } else {
      barWidth = innerWidth / 2 / data[0].values.length;
    }

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
      label: label,
      values: values,
      x: x,
      y: y,
      y0: y0,
      x0: barWidth,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }, this.props.children)));
  }
});
var _default = Waveform;
exports.default = _default;