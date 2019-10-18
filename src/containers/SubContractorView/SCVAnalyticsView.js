import React from 'react';

import PropTypes      from 'prop-types';
import Card           from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';

import { Line }         from 'react-chartjs-2';
import { MDBContainer } from 'mdbreact';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 64px - 48px - 16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graph: {
    width: '90%',
  },
});

class SCVAnalyticsView extends React.Component {
  state = {
    dataLine: {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Auguest',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(74,20,140,0.4)',
          borderColor: 'rgba(74,20,140,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(74,20,140,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(74,20,140,1)',
          pointHoverBorderColor: 'rgba(24,20,100,0.5)',
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 34, 25, 5, 37, 12, 90],
        },
        {
          label: 'My Second dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(150,100,200,0.4)',
          borderColor: 'rgba(150,100,200,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(150,100,200,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(150,100,200,1)',
          pointHoverBorderColor: 'rgba(100,50,150,0.5)',
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [12, 34, 46, 70, 56, 12, 40, 20, 31, 57, 80, 78],
        },
      ],
    },
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.root}>
        <MDBContainer className={classes.graph}>
          <Line data={this.state.dataLine} options={{ responsive: true }} />
        </MDBContainer>
      </Card>
    );
  }
}

SCVAnalyticsView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SCVAnalyticsView);
