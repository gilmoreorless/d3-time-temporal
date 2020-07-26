import intervalFactory from "./intervalFactory.js";

var day = intervalFactory('day', function(dateTime) {
  return dateTime.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});

export default day;
export var days = day.range;
