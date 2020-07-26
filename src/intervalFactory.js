import interval from "./interval.js";
import diff from "./diff.js";

/**
 * A helper to de-deduplicate the common interval cases when using Temporal.DateTime
 */
export default function intervalFactory(unit, floori) {
  var unitPlural = `${unit}s`;
  var diffLargestUnit = (unit === 'year' || unit === 'month') ? unitPlural : 'days';
  var fieldOffset = (unit === 'month' || unit === 'day') ? 1 : 0;

  return interval(floori, function(dateTime, step) {
    if (step < 0) return dateTime.minus({ [unitPlural]: -step });
    return dateTime.plus({ [unitPlural]: step });
  }, function(start, end) {
    return diff(start, end, unitPlural, diffLargestUnit);
  }, function(dateTime) {
    return dateTime[unit] - fieldOffset;
  });
}
