import interval from "./interval.js";
import diff from "./diff.js";

var minute = interval(function(dateTime) {
  return dateTime.with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ minutes: -step });
  return dateTime.plus({ minutes: step });
}, function(start, end) {
  return diff(start, end, 'minutes');
}, function(dateTime) {
  return dateTime.minute;
});

export default minute;
export var minutes = minute.range;
