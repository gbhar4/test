/**
 * A utility function to format time to am/pm format.
 *
 * @author Agu
 * @example formatTime(parseDate("2017-03-16 17:21:49.994")) === 05:21 pm
**/
import {parseDate} from 'util/parseDate';

export default function formatTime (date) {
  if (!date) {
    return null;
  }

  if (typeof date === 'string') {
    date = parseDate(date);
  }

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
}
