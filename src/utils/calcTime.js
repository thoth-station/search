import timeSince from "utils/timeSince";

/**
 * Given either a date and time, calculated time since that date.
 * This is used to calculate how long ago an Advisor document was generated or has been generating.
 * It is specific to the document formatting
 *
 * @param {string} finished_at - for when the advise document is completed
 * @param {string} started_at - the time at which the document was started (is preceded by finished at)
 * @param {string} datetime - fallback to datetime
 * @returns {string} - English version of date
 */
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
        return (
            "Advise finished " + timeSince(new Date(datetime + "Z")) + " ago."
        );
    } else {
        return "Time started/finished not available";
    }
};
