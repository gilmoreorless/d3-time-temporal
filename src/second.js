import interval from "./interval.js";
import diff from "./diff.js";

var second = interval(function(dateTime) {
  return dateTime.with({ millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ seconds: -step });
  return dateTime.plus({ seconds: step });
}, function(start, end) {
  return diff(start, end, 'seconds');
}, function(dateTime) {
  return dateTime.second;
});

export default second;
export var seconds = second.range;
