export default function diff(start, end, field, largestUnit = 'days') {
  var diff = end.difference(start, { largestUnit });
  return diff[field];
}
