import interval from "./interval.js";
import diff from "./diff.js";

var month = interval(function(dateTime) {
  return dateTime.with({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ months: -step });
  return dateTime.plus({ months: step });
}, function(start, end) {
  return diff(start, end, 'months');
}, function(dateTime) {
  return dateTime.month - 1;
});

export default month;
export var months = month.range;
