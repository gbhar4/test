export function isScrollable (elem) {
  var style = window.getComputedStyle(elem);

  // NOTE: checking for overflow AND height prevents a miscaculation issue
  // in case the css is not as pretty as one would like
  // for instance, using margin-bottom on the last child element
  // which causes browsers to miscalculate offsetHeight
  // (padding-bottom should be used instead)
  return !((elem.offsetHeight === elem.scrollHeight || (
    style.overflow !== 'scroll' &&
    style.overflow !== 'auto' &&
    style.overflowY !== 'scroll' &&
    style.overflowY !== 'auto')
  ));
}
