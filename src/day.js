import interval from "./interval.js";
import diff from "./diff.js";

var day = interval(function(dateTime) {
  return dateTime.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ days: -step });
  return dateTime.plus({ days: step });
}, function(start, end) {
  return diff(start, end, 'days');
}, function(dateTime) {
  return dateTime.day - 1;
});

export default day;
export var days = day.range;
