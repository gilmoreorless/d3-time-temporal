# d3-time-temporal

A conversion of [d3-time](https://github.com/d3/d3-time) to use the in-progress [Temporal proposal](https://github.com/tc39/proposal-temporal) instead of the legacy `Date` object.

:warning: **This is purely an experiment to test out the viability of the Temporal API. DO NOT USE THIS IN PRODUCTION.** :warning:

In most places I've attempted to make the minimum amount of changes to make it work, and preserve the d3 code style. The one big deviation from that goal was the creation of a factory method to make most definitions much simpler. This was only possible after converting everything to `Temporal.DateTime`, at which point the method definitions were much more similar and repetitive.

## Differences from `d3-time`

- All `d3-time` methods have been altered to _only_ take and return `Temporal.DateTime` objects. These are abstract, immutable objects with no fixed time zone. No raw numbers representing milliseconds, no legacy `Date` objects.
- Due to the abstract nature of `Temporal.DateTime`, all `utc*` methods (`d3.time.utcYear()`, `d3.time.utcMonth()`, etc.) have been made aliases of the non-UTC versions. To use `Temporal.DateTime` with UTC or local time (or any other time zone), call the [`.toAbsolute(timeZone)` method](https://tc39.es/proposal-temporal/docs/datetime.html#toAbsolute).

See the [full list of commits](https://github.com/gilmoreorless/d3-time-temporal/compare/master...temporal-datetime) for step-by-step conversion details.
