// react
import React, { useState } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button
} from "@material-ui/core";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";

const AccordianList = ({ justifications, handleJustificationSelect }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <React.Fragment>
      {justifications.map((justification, i) => {
        return (
          <Accordion
            key={i}
            onChange={(event, isExpanded) => {
              handleJustificationSelect(
                event,
                isExpanded,
                justification.package,
                i
              );
              setExpanded(isExpanded ? i : false);
            }}
            expanded={expanded === i}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{justification.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{justification.body}</Typography>
              <Button href={justification.link}>READ MORE</Button>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </React.Fragment>
  );
};

AccordianList.propTypes = {
  justifications: PropTypes.shape({
    title: PropTypes.string.isRequired,
    package: PropTypes.string.isRequired,
    body: PropTypes.string,
    link: PropTypes.string
  }),
  cardBody: PropTypes.element
};

export default AccordianList;
