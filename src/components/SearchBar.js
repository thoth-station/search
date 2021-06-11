// material ui
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  bar: {
      margin: theme.spacing(3),
  },
}));

const SearchBar = ({keyword, setKeyword}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="outlined"
        label="Filter dependencies"
        className={classes.bar}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
}

export default SearchBar
