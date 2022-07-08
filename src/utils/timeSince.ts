/**
 * Get the time between now and a date in a string format.
 *
 * @param date
 */
export default function timeSince(date: Date) {
  const startTime = new Date();
  const seconds = Math.floor((startTime.valueOf() - date.valueOf()) / 1000);

  let interval = seconds / 3.154e7;

  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " year" + (num !== 1 ? "s" : "");
  }
  interval = seconds / 2.628e6;
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
