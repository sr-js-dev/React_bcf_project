import React          from 'react';
import { withStyles } from '@material-ui/core/styles';

const style = (theme) =>  ({
  root: {
   padding: theme.spacing(1)
  }
});

function HomeView({ classes }) {
  return (
    <div className={classes.root}>Welcome Home</div>
  )
}

export default withStyles(style)(HomeView);
