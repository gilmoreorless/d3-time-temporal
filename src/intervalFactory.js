import interval from "./interval.js";
import diff from "./diff.js";

/**
 * A helper to de-deduplicate the common interval cases when using Temporal.PlainDateTime
 */
export default function intervalFactory(unit, floori) {
  var unitPlural = `${unit}s`;
  var diffLargestUnit = (unit === 'year' || unit === 'month') ? unitPlural : 'days';
  var fieldOffset = (unit === 'month' || unit === 'day') ? 1 : 0;
  var roundingUnit = (unit === 'year' || unit === 'month') ? undefined : unit;

  return interval(floori, function(dateTime, step) {
    if (step < 0) return dateTime.subtract({ [unitPlural]: -step });
    return dateTime.add({ [unitPlural]: step });
  }, function(start, end) {
    return diff(start, end, unitPlural, diffLargestUnit);
  }, function(dateTime) {
    return dateTime[unit] - fieldOffset;
  }, roundingUnit);
}
