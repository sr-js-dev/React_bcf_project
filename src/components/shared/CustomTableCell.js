import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const CustomTableCell = withStyles(theme => ({
  head: {
    color: theme.palette.common.white,
  }
}))(TableCell);

export default CustomTableCell;
