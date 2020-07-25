import interval from "./interval.js";
import diff from "./diff.js";

var hour = interval(function(dateTime) {
  return dateTime.with({ minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ hours: -step });
  return dateTime.plus({ hours: step });
}, function(start, end) {
  return diff(start, end, 'hours');
}, function(dateTime) {
  return dateTime.hour;
});

export default hour;
export var hours = hour.range;
