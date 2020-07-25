import interval from "./interval.js";

const { Temporal } = require("proposal-temporal");

var month = interval(function(dateTime) {
  return dateTime.with({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
}, function(dateTime, step) {
  if (step < 0) return dateTime.minus({ months: -step });
  return dateTime.plus({ months: step });
}, function(start, end) {
  var comp = Temporal.DateTime.compare(start, end),
    swap = comp > 0,
    dt1 = swap ? end : start,
    dt2 = swap ? start : end,
    diff = dt2.difference(dt1, { largestUnit: 'months' }).months;
  return diff * (swap ? -1 : 1);
}, function(dateTime) {
  return dateTime.month - 1;
});

export default month;
export var months = month.range;
