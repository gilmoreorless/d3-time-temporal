const { Temporal } = require("proposal-temporal");

export default function newInterval(floori, offseti, count, field, roundingUnit) {

  function interval(dateTime) {
    return floori(arguments.length === 0 ? Temporal.now.dateTime() : dateTime);
  }

  interval.floor = function(dateTime) {
    return floori(dateTime);
  };

  interval.ceil = function(dateTime) {
    var dt = dateTime.minus({ nanoseconds: 1 });
    return offseti(floori(dt), 1);
  };

  interval.round = function(dateTime) {
    if (roundingUnit) {
      return dateTime.round({ smallestUnit: roundingUnit });
    }
    var lower = interval(dateTime),
        upper = interval.ceil(dateTime),
        d0 = dateTime.difference(lower),
        d1 = upper.difference(dateTime);
    // NOTE: Why no Duration compare? https://github.com/tc39/proposal-temporal/issues/608
    var comp = Temporal.DateTime.compare(lower.plus(d0), lower.plus(d1));
    return comp < 0 ? lower : upper;
  };

  interval.offset = function(dateTime, step) {
    return offseti(dateTime, step == null ? 1 : Math.floor(step));
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    if (!(start instanceof Temporal.DateTime) || !(stop instanceof Temporal.DateTime)) return range;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (Temporal.DateTime.compare(start, stop) >= 0 || !(step > 0)) return range;
    previous = start;
    do {
      range.push(previous);
      previous = floori(offseti(previous, step));
    } while (Temporal.DateTime.compare(previous, stop) < 0);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(dateTime) {
      var dt = dateTime;
      while (!test(dt = floori(dt))) dt = dt.minus({ nanoseconds: 1 });
      return dt;
    }, function(dateTime, step) {
      var dt = dateTime;
      if (step < 0) while (++step <= 0) {
        while (dt = offseti(dt, -1), !test(dt)) {} // eslint-disable-line no-empty
      } else while (--step >= 0) {
        while (dt = offseti(dt, +1), !test(dt)) {} // eslint-disable-line no-empty
      }
      return dt;
    });
  };

  if (count) {
    interval.count = function(start, end) {
      return Math.floor(count(floori(start), floori(end)));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(new Temporal.DateTime(0, 1, 1), d) % step === 0; });
    };
  }

  return interval;
}
