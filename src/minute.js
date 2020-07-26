import intervalFactory from "./intervalFactory.js";

var minute = intervalFactory('minute', function(dateTime) {
  return dateTime.with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});

export default minute;
export var minutes = minute.range;
