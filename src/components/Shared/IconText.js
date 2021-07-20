// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// react
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center"
  }
}));

const IconText = ({ text, icon, link, ...props }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${props.className}`}>
      {icon}
      <Typography href={link ? link : null} variant="body2" marginLeft>
        {text}
      </Typography>
    </div>
  );
};

export default IconText;

IconText.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  link: PropTypes.string
};
