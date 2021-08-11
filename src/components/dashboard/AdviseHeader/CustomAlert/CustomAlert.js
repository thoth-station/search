import { Button, Alert } from "@material-ui/core";

const CustomAlert = ({ info, ...props }) => {
  return (
    <Alert
      className={props.className}
      action={
        <Button color="inherit" size="small" href={info.link}>
          DETAILS
        </Button>
      }
      severity={info.type.toLowerCase()}
    >
      {info.message}
    </Alert>
  );
};

export default CustomAlert;
