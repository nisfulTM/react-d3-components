"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var func = _propTypes.default.func,
    oneOf = _propTypes.default.oneOf,
    bool = _propTypes.default.bool,
    objectOf = _propTypes.default.objectOf,
    number = _propTypes.default.number;
var TooltipMixin = {
  propTypes: {
    tooltipHtml: func,
    tooltipMode: oneOf(['mouse', 'element', 'fixed']),
    tooltipContained: bool,
    tooltipOffset: objectOf(number)
  },
  getInitialState: function getInitialState() {
    return {
      tooltip: {
        hidden: true
      }
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      tooltipMode: 'mouse',
      tooltipOffset: {
        top: -35,
        left: 0
      },
      tooltipHtml: null,
      tooltipContained: false
    };
  },
  componentDidMount: function componentDidMount() {
    this._svgNode = _reactDom.default.findDOMNode(this).getElementsByTagName('svg')[0];
  },
  onMouseEnter: function onMouseEnter(e, data) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();
    var _this$props = this.props,
        margin = _this$props.margin,
        tooltipMode = _this$props.tooltipMode,
        tooltipOffset = _this$props.tooltipOffset,
        tooltipContained = _this$props.tooltipContained;
    var svg = this._svgNode;
    var position;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = e.clientX, point.y = e.clientY;
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      position = [point.x - margin.left, point.y - margin.top];
    } else {
      var rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
    }

    var _this$_tooltipHtml = this._tooltipHtml(data, position),
        _this$_tooltipHtml2 = _slicedToArray(_this$_tooltipHtml, 3),
        html = _this$_tooltipHtml2[0],
        xPos = _this$_tooltipHtml2[1],
        yPos = _this$_tooltipHtml2[2];

    var svgTop = svg.getBoundingClientRect().top + margin.top;
    var svgLeft = svg.getBoundingClientRect().left + margin.left;
    var top = 0;
    var left = 0;

    if (tooltipMode === 'fixed') {
      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else {
      // mouse
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    var translate = 50;

    if (tooltipContained) {
      var t = position[0] / svg.getBoundingClientRect().width;
      translate = lerp(t, 0, 100);
    }

    this.setState({
      tooltip: {
        top: top,
        left: left,
        hidden: false,
        html: html,
        translate: translate
      }
    });
  },
  onMouseLeave: function onMouseLeave(e) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();
    this.setState({
      tooltip: {
        hidden: true
      }
    });
  }
};
var _default = TooltipMixin;
exports.default = _default;