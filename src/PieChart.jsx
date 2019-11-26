import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import d3 from 'd3';

import Chart from './Chart';
import Tooltip from './Tooltip';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import AccessorMixin from './AccessorMixin';
import TooltipMixin from './TooltipMixin';

const { string, array, number, bool, func, any } = PropTypes;

const Wedge = createReactClass({
    propTypes: {
        d: string.isRequired,
        fill: string.isRequired
    },

    render() {
        const { fill, d, data, onMouseEnter, onMouseLeave } = this.props;

        return (
            <path
                fill={fill}
                d={d}
                onMouseMove={evt => onMouseEnter(evt, data)}
                onMouseLeave={evt => onMouseLeave(evt)}
            />
        );
    }
});

const DataSet = createReactClass({
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

    getDefaultProps() {
        return {
            strokeWidth: 2,
            stroke: '#000',
            fill: 'none',
            opacity: 0.3,
            hideLabels: false
        };
    },

    renderLabel(wedge, previous, index, ycoord, xcoord) {
        const {
            arc,
            outerArc,
            radius,
            strokeWidth,
            stroke,
            fill,
            opacity,
            x,
            y
        } = this.props;
        const direction = this.midAngle(wedge) < Math.PI ? 1 : -1;
        const labelPos = outerArc.centroid(wedge);
        labelPos[0] = radius * direction;

        const linePos = outerArc.centroid(wedge);
        linePos[0] = radius * 0.95 * direction;

        const textAnchor = this.midAngle(wedge) < Math.PI ? 'start' : 'end';

        if (index != 0) {
            if (Math.abs(xcoord[index - 1] - labelPos[0]) < 0.1) {
                const distance = Math.abs(labelPos[1] - ycoord[index - 1]) - 40;
                if (direction == 1 && (labelPos[1] < ycoord[index - 1] || distance < 0.0) ||
                    direction == -1 && (labelPos[1] > ycoord[index - 1] || distance < 0.0)) {
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

        return (
            <g>
                <polyline
                    opacity={opacity}
                    strokeWidth={strokeWidth}
                    stroke={stroke}
                    fill={fill}
                    points={[
                        arc.centroid(wedge),
                        outerArc.centroid(wedge),
                        linePos
                    ]}
                />
                <circle
                cx={labelPos[0]}
                cy={labelPos[1]}
                r={3}
                strokeWidth={2}
                fill={wedge.data.color}
                className="circle" />
                <text
                    dy=".35em"
                    x={labelPos[0]}
                    y={labelPos[1] + 15}
                    textAnchor={textAnchor}
                    className="total"
                >
                    {wedge.data.symbol + y(wedge.data).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                </text>

                <text
                    dy=".35em"
                    x={labelPos[0]}
                    y={labelPos[1] + 30}
                    textAnchor={textAnchor}
                    className="title"
                >
                    {x(wedge.data)}
                </text>
            </g>
        );
    },

    render() {
        const {
            pie,
            arc,
            colorScale,
            x,
            y,
            onMouseEnter,
            onMouseLeave,
            hideLabels
        } = this.props;

        const ycoord = [];
        const xcoord = [];
        let myindex = 0;
        const wedges = pie.map((e, index) => {
            const labelFits = e.endAngle - e.startAngle >= 0 * Math.PI / 180;
            let previous;
            if (index > 0) {
                previous = pie[index - 1];
            }

            return (
                <g key={`${x(e.data)}.${y(e.data)}.${index}`} className="arc">
                    <Wedge
                        data={e.data}
                        fill={colorScale(x(e.data))}
                        d={arc(e)}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    {!hideLabels &&
                        !!e.value &&
                        labelFits &&
                        this.renderLabel(e, previous, myindex++, ycoord, xcoord)}
                </g>
            );
        });

        return <g>{wedges}</g>;
    },

    midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
});

const PieChart = createReactClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, AccessorMixin, TooltipMixin],

    propTypes: {
        innerRadius: number,
        outerRadius: number,
        labelRadius: number,
        padRadius: string,
        cornerRadius: number,
        sort: any,
        hideLabels: bool
    },

    getDefaultProps() {
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

    _tooltipHtml(d) {
        const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        return [html, 0, 0];
    },

    render() {
        const {
            data,
            width,
            height,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            padRadius,
            cornerRadius,
            sort,
            x,
            y,
            values,
            hideLabels
        } = this.props;

        let { innerRadius, outerRadius, labelRadius } = this.props;

        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;

        let pie = d3.layout.pie().value(e => y(e));

        if (typeof sort !== 'undefined') {
            pie = pie.sort(sort);
        }

        const radius = Math.min(innerWidth, innerHeight) / 2;
        if (!innerRadius) {
            innerRadius = radius * 0.8;
        }

        if (!outerRadius) {
            outerRadius = radius * 0.4;
        }

        if (!labelRadius) {
            labelRadius = radius * 0.9;
        }

        const arc = d3.svg
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .padRadius(padRadius)
            .cornerRadius(cornerRadius);

        const outerArc = d3.svg
            .arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const pieData = pie(values(data));

        const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

        return (
            <div>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
                >
                    <g transform={translation}>
                        <DataSet
                            width={innerWidth}
                            height={innerHeight}
                            colorScale={colorScale}
                            pie={pieData}
                            arc={arc}
                            outerArc={outerArc}
                            radius={radius}
                            x={x}
                            y={y}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            hideLabels={hideLabels}
                        />
                    </g>
                    {this.props.children}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

export default PieChart;
