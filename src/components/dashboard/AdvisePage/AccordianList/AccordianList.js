// react
import React, { useState } from "react";

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
        if (justification.type !== "INFO") {
          return (
            <Accordion
              key={i}
              onChange={(event, isExpanded) => {
                handleJustificationSelect(
                  event,
                  isExpanded,
                  justification.package_name,
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
                <Typography>{justification.message}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{justification.advisory}</Typography>
                <Button href={justification.link}>READ MORE</Button>
              </AccordionDetails>
            </Accordion>
          );
        } else return null;
      })}
    </React.Fragment>
  );
};

export default AccordianList;
