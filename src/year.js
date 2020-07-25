import interval from "./interval.js";
import diff from "./diff.js";

var year = interval(function(dateTime) {
  return dateTime.with({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ years: -step });
  return dateTime.plus({ years: step });
}, function(start, end) {
  return diff(start, end, 'years');
}, function(dateTime) {
  return dateTime.year;
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : interval(function(dateTime) {
    return dateTime.with({
      year: Math.floor(dateTime.year / k) * k,
      month: 1, day: 1,
      hour: 0, minute: 0, second: 0,
      millisecond: 0, microsecond: 0, nanosecond: 0,
    });
  }, function(dateTime, step) {
    return dateTime.with({ year: dateTime.year + step * k });
  });
};

export default year;
export var years = year.range;
