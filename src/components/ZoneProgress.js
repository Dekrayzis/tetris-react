import React, { Component } from 'react';
import styled from 'styled-components';

const SVGComponent = styled.svg`
    float: right;
    margin: 2rem 0.5rem 0 0;
;`

const CircleBackground = styled.circle`
    fill: none;
    stroke: #ddd;
`;

const CircleProgress = styled.circle`
    fill: none;
    stroke: ${props => props.zoneColor ? props.zoneColor : 'red' };
    stroke-linecap: round;
    stroke-linejoin: round;
`;

const CircleText = styled.text`
    font-size: 1.2em;
    font-weight: bold;
    fill: white;
`;

class CircularProgressBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        // Size of the enclosing square
        const sqSize = this.props.sqSize;

        // SVG centers the stroke width on the radius, subtract out so circle fits in square
        const radius = (this.props.sqSize - this.props.strokeWidth) / 2;

        // Enclose cicle in a circumscribing square
        const viewBox = `0 0 ${sqSize} ${sqSize}`;

        // Arc length at 100% coverage is the circle circumference
        const dashArray = radius * Math.PI * 2;

        // Scale 100% coverage overlay with the actual percent
        const dashOffset = dashArray - dashArray * this.props.percentage / 100;

        let percentage = this.props.percentage;
        if (percentage > 100){
            percentage = 100;
        }

        return (

            <SVGComponent
                width={this.props.sqSize}
                height={this.props.sqSize}
                viewBox={viewBox}>
                <CircleBackground
                    cx={this.props.sqSize / 2}
                    cy={this.props.sqSize / 2}
                    r={radius}
                    strokeWidth={`${this.props.strokeWidth}px`} />
                <CircleProgress zoneColor={this.props.color}
                    cx={this.props.sqSize / 2}
                    cy={this.props.sqSize / 2}
                    r={radius}
                    strokeWidth={`${this.props.strokeWidth}px`}
                    // Start progress marker at 12 O'Clock
                    transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset
                    }} />
                <CircleText
                    x="50%"
                    y="50%"
                    dy=".3em"
                    textAnchor="middle">
                    {this.props.percentage >= 100 ? "MAX" : "ZONE"}
                </CircleText>
            </SVGComponent>
        );
    }
}

CircularProgressBar.defaultProps = {
    sqSize: 100,
    percentage: 25,
    strokeWidth: 1
};

class ZoneWrapper extends Component {

    render() {
        return (

            <CircularProgressBar
                strokeWidth="10"
                sqSize="100"
                percentage={this.props.percentage ? this.props.percentage : 0}
                color={this.props.color} />

        );
    }
}

export default ZoneWrapper;