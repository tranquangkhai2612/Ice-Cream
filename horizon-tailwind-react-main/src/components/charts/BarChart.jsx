import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default BarChart;
