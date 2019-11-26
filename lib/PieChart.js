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

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

var _DefaultPropsMixin = _interopRequireDefault(require("./DefaultPropsMixin"));

var _HeightWidthMixin = _interopRequireDefault(require("./HeightWidthMixin"));

var _AccessorMixin = _interopRequireDefault(require("./AccessorMixin"));

var _TooltipMixin = _interopRequireDefault(require("./TooltipMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var string = _propTypes.default.string,
    array = _propTypes.default.array,
    number = _propTypes.default.number,
    bool = _propTypes.default.bool,
    func = _propTypes.default.func,
    any = _propTypes.default.any;
var Wedge = (0, _createReactClass.default)({
  displayName: "Wedge",
  propTypes: {
    d: string.isRequired,
    fill: string.isRequired
  },
  render: function render() {
    var _this$props = this.props,
        fill = _this$props.fill,
        d = _this$props.d,
        data = _this$props.data,
        onMouseEnter = _this$props.onMouseEnter,
        _onMouseLeave = _this$props.onMouseLeave;
    return _react.default.createElement("path", {
      fill: fill,
      d: d,
      onMouseMove: function onMouseMove(evt) {
        return onMouseEnter(evt, data);
      },
      onMouseLeave: function onMouseLeave(evt) {
        return _onMouseLeave(evt);
      }
    });
  }
});
var DataSet = (0, _createReactClass.default)({
  displayName: "DataSet",
  propTypes: {
    pie: array.isRequired,
    arc: func.isRequired,
    outerArc: func.isRequired,
    colorScale: func.isRequired,
    radius: number.isRequired,
    strokeWidth: number,
    stroke: string,
    fill: string,
    opacity: number,
    x: func.isRequired,
    hideLabels: bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      strokeWidth: 2,
      stroke: '#000',
      fill: 'none',
      opacity: 0.3,
      hideLabels: false
    };
  },
  renderLabel: function renderLabel(wedge, previous, index, ycoord, xcoord) {
    var _this$props2 = this.props,
        arc = _this$props2.arc,
        outerArc = _this$props2.outerArc,
        radius = _this$props2.radius,
        strokeWidth = _this$props2.strokeWidth,
        stroke = _this$props2.stroke,
        fill = _this$props2.fill,
        opacity = _this$props2.opacity,
        x = _this$props2.x,
        y = _this$props2.y;
    var direction = this.midAngle(wedge) < Math.PI ? 1 : -1;
    var labelPos = outerArc.centroid(wedge);
    labelPos[0] = radius * direction;
    var linePos = outerArc.centroid(wedge);
    linePos[0] = radius * 0.95 * direction;
    var textAnchor = this.midAngle(wedge) < Math.PI ? 'start' : 'end';

    if (index != 0) {
      if (Math.abs(xcoord[index - 1] - labelPos[0]) < 0.1) {
        var distance = Math.abs(labelPos[1] - ycoord[index - 1]) - 40;

        if (direction == 1 && (labelPos[1] < ycoord[index - 1] || distance < 0.0) || direction == -1 && (labelPos[1] > ycoord[index - 1] || distance < 0.0)) {
          linePos[1] = ycoord[index - 1] + 45 * direction;
        }
      }

      labelPos[1] = linePos[1];
      ycoord[index] = labelPos[1];
      xcoord[index] = labelPos[0];
    } else {
      ycoord[0] = labelPos[1];
      xcoord[0] = labelPos[0];
    }

    return _react.default.createElement("g", null, _react.default.createElement("polyline", {
      opacity: opacity,
      strokeWidth: strokeWidth,
      stroke: stroke,
      fill: fill,
      points: [arc.centroid(wedge), outerArc.centroid(wedge), linePos]
    }), _react.default.createElement("circle", {
      cx: labelPos[0],
      cy: labelPos[1],
      r: 3,
      strokeWidth: 2,
      fill: wedge.data.color,
      className: "circle"
    }), _react.default.createElement("text", {
      dy: ".35em",
      x: labelPos[0],
      y: labelPos[1] + 15,
      textAnchor: textAnchor,
      className: "total"
    }, wedge.data.symbol + y(wedge.data).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')), _react.default.createElement("text", {
      dy: ".35em",
      x: labelPos[0],
      y: labelPos[1] + 30,
      textAnchor: textAnchor,
      className: "title"
    }, x(wedge.data)));
  },
  render: function render() {
    var _this = this;

    var _this$props3 = this.props,
        pie = _this$props3.pie,
        arc = _this$props3.arc,
        colorScale = _this$props3.colorScale,
        x = _this$props3.x,
        y = _this$props3.y,
        onMouseEnter = _this$props3.onMouseEnter,
        onMouseLeave = _this$props3.onMouseLeave,
        hideLabels = _this$props3.hideLabels;
    var ycoord = [];
    var xcoord = [];
    var myindex = 0;
    var wedges = pie.map(function (e, index) {
      var labelFits = e.endAngle - e.startAngle >= 0 * Math.PI / 180;
      var previous;

      if (index > 0) {
        previous = pie[index - 1];
      }

      return _react.default.createElement("g", {
        key: "".concat(x(e.data), ".").concat(y(e.data), ".").concat(index),
        className: "arc"
      }, _react.default.createElement(Wedge, {
        data: e.data,
        fill: colorScale(x(e.data)),
        d: arc(e),
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave
      }), !hideLabels && !!e.value && labelFits && _this.renderLabel(e, previous, myindex++, ycoord, xcoord));
    });
    return _react.default.createElement("g", null, wedges);
  },
  midAngle: function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
});
var PieChart = (0, _createReactClass.default)({
  displayName: "PieChart",
  mixins: [_DefaultPropsMixin.default, _HeightWidthMixin.default, _AccessorMixin.default, _TooltipMixin.default],
  propTypes: {
    innerRadius: number,
    outerRadius: number,
    labelRadius: number,
    padRadius: string,
    cornerRadius: number,
    sort: any,
    hideLabels: bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      innerRadius: null,
      outerRadius: null,
      labelRadius: null,
      padRadius: 'auto',
      cornerRadius: 0,
      sort: undefined,
      hideLabels: false
    };
  },
  _tooltipHtml: function _tooltipHtml(d) {
    var html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));
    return [html, 0, 0];
  },
  render: function render() {
    var _this$props4 = this.props,
        data = _this$props4.data,
        width = _this$props4.width,
        height = _this$props4.height,
        margin = _this$props4.margin,
        viewBox = _this$props4.viewBox,
        preserveAspectRatio = _this$props4.preserveAspectRatio,
        colorScale = _this$props4.colorScale,
        padRadius = _this$props4.padRadius,
        cornerRadius = _this$props4.cornerRadius,
        sort = _this$props4.sort,
        x = _this$props4.x,
        y = _this$props4.y,
        values = _this$props4.values,
        hideLabels = _this$props4.hideLabels;
    var _this$props5 = this.props,
        innerRadius = _this$props5.innerRadius,
        outerRadius = _this$props5.outerRadius,
        labelRadius = _this$props5.labelRadius;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;

    var pie = _d.default.layout.pie().value(function (e) {
      return y(e);
    });

    if (typeof sort !== 'undefined') {
      pie = pie.sort(sort);
    }

    var radius = Math.min(innerWidth, innerHeight) / 2;

    if (!innerRadius) {
      innerRadius = radius * 0.8;
    }

    if (!outerRadius) {
      outerRadius = radius * 0.4;
    }

    if (!labelRadius) {
      labelRadius = radius * 0.9;
    }

    var arc = _d.default.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);

    var outerArc = _d.default.svg.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    var pieData = pie(values(data));
    var translation = "translate(".concat(innerWidth / 2, ", ").concat(innerHeight / 2, ")");
    return _react.default.createElement("div", null, _react.default.createElement(_Chart.default, {
      height: height,
      width: width,
      margin: margin,
      viewBox: viewBox,
      preserveAspectRatio: preserveAspectRatio
    }, _react.default.createElement("g", {
      transform: translation
    }, _react.default.createElement(DataSet, {
      width: innerWidth,
      height: innerHeight,
      colorScale: colorScale,
      pie: pieData,
      arc: arc,
      outerArc: outerArc,
      radius: radius,
      x: x,
      y: y,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      hideLabels: hideLabels
    })), this.props.children), _react.default.createElement(_Tooltip.default, this.state.tooltip));
  }
});
var _default = PieChart;
exports.default = _default;