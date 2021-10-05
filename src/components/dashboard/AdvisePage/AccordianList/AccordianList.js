// react
import React, { useState } from "react";

// material-ui
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box
} from "@material-ui/core";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";

const AccordianList = ({ justifications, handleJustificationSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [direct, setDirect] = useState(true);
  const [indirect, setIndirect] = useState(false);

  return (
    <Box>
      <Box>
        <Accordion onChange={() => setDirect(!direct)} expanded={direct}>
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Direct Changes</Typography>
          </AccordionSummary>

          {justifications
            ?.filter(justification => justification.direct)
            ?.map((justification, i) => {
              return (
                <Accordion
                  key={justification.package + i}
                  onChange={(event, isExpanded) => {
                    handleJustificationSelect(
                      event,
                      isExpanded,
                      justification.package,
                      i
                    );
                    setExpanded(isExpanded ? justification.package : false);
                  }}
                  expanded={expanded === justification.package}
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
        </Accordion>
      </Box>
      <Box>
        <Accordion onChange={() => setIndirect(!indirect)} expanded={indirect}>
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Indirect Changes</Typography>
          </AccordionSummary>

          {justifications
            ?.filter(justification => !justification.direct)
            ?.map((justification, i) => {
              return (
                <Accordion
                  key={justification.package + i}
                  onChange={(event, isExpanded) => {
                    handleJustificationSelect(
                      event,
                      isExpanded,
                      justification.package,
                      i
                    );
                    setExpanded(isExpanded ? justification.package : false);
                  }}
                  expanded={expanded === justification.package}
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
        </Accordion>
      </Box>
    </Box>
  );
};

export default AccordianList;
