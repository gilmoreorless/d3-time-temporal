import intervalFactory from "./intervalFactory.js";

var second = intervalFactory('second', function(dateTime) {
  return dateTime.with({ millisecond: 0, microsecond: 0, nanosecond: 0 });
});

export default second;
export var seconds = second.range;
