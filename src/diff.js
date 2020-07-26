const { Temporal } = require("proposal-temporal");

export default function diff(start, end, field, largestUnit = 'days') {
  var comp = Temporal.DateTime.compare(start, end),
    swap = comp > 0,
    dt1 = swap ? end : start,
    dt2 = swap ? start : end,
    value = dt2.difference(dt1, { largestUnit })[field];
  return value * (swap ? -1 : 1);
}
