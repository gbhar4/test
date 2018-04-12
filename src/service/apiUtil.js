/*
 * @desc It flats all currency amounts into its representation cents (Integer).
 * Whilst performing the operation it truncates the input to two decimals w/o rounding it;
 * @note this was changed as per Ben so return floating point and not cents
 * @param: Int/Float number represeting currency to be processed
 * @returns Int: cents expression of input
 */
export function flatCurrencyToCents (currency) {
  try {
    return parseFloat(parseFloat(currency.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]).toFixed(2));
  } catch (e) {
    throw new Error(e);
  }
}

export function extractFloat (currency) {
  try {
    return !currency ? 0 : parseFloat(parseFloat(currency.toString().match(/[+-]?\d+(\.\d+)?/g)[0]).toFixed(2));
  } catch (e) {
    return 0;
  }
}

export function capitalize (string) {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function parseBoolean (bool) {
  return bool === true || bool === '1' || (bool || '').toUpperCase() === 'TRUE';
}

export function sanitizeEntity (string) {
  return string
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&acute;/gi, '"')
    .replace(/&prime;/gi, '"')
    .replace(/&bdquo;/gi, '"')
    .replace(/&ldquot;/gi, '"')
    .replace(/\\u0027/gi, '\'')
    .replace(/&lsquot;/gi, '"')
    .replace(/%20/gi, ' ');
}

export function toTimeString (est) {
  let hh = est.getHours();
  let mm = est.getMinutes();
  let ampm = hh >= 12 ? ' pm' : ' am';

  hh = hh % 12;
  hh = (hh > 0) ? hh : 12;
  mm = mm < 10 ? '0' + mm : mm;

  if (hh === 11 && mm === 59 && ampm === ' pm') {
    return 'Midnight';
  }

  return hh + ':' + mm + ampm;
}
