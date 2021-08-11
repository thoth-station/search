// utils
import { timeSince } from "utils/timeSince";

export const calcTime = (finished_at, started_at, datetime) => {
  // if status says finished
  if (finished_at) {
    return "Advise finished " + timeSince(new Date(finished_at)) + " ago.";
  }
  // if status is pending
  else if (started_at) {
    return "Advise started " + timeSince(new Date(started_at)) + " ago.";
  }
  // if status is nulled so use metadata end date
  else if (datetime) {
    return "Advise finished " + timeSince(new Date(datetime + "Z")) + " ago.";
  } else {
    return "Time started/finished not available";
  }
};
