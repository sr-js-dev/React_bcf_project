import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table          from '@material-ui/core/Table';
import TableBody      from '@material-ui/core/TableBody';
import TableHead      from '@material-ui/core/TableHead';
import TableRow       from '@material-ui/core/TableRow';

import CustomTableCell from 'components/shared/CustomTableCell';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1)
  },
});

class SCVReportsView extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withStyles(styles)(SCVReportsView);
