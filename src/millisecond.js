import interval from "./interval.js";
import diff from "./diff.js";

var millisecond = interval(function(dateTime) {
  return dateTime.with({ microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ milliseconds: -step });
  return dateTime.plus({ milliseconds: step });
}, function(start, end) {
  return diff(start, end, 'milliseconds');
});

export default millisecond;
export var milliseconds = millisecond.range;
