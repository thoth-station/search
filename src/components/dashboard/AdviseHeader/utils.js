export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " year" + (num !== 1 ? "s" : "");
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " month" + (num !== 1 ? "s" : "");
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " day" + (num !== 1 ? "s" : "");
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " hour" + (num !== 1 ? "s" : "");
  }
  interval = seconds / 60;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " minute" + (num !== 1 ? "s" : "");
  }
  const num = Math.floor(seconds);
  return num + " second" + (num !== 1 ? "s" : "");
}

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
