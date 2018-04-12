import {isClient} from 'routing/routingHelper';

export const setCookie = function (args) {
  let {key, value, daysAlive} = args;
  let isBrowser = isClient();

  if (isBrowser && window._satellite) {
    window._satellite.setCookie(key, value, daysAlive);
  } else if (isBrowser) {
    let date = new Date();
    date.setTime(date.getTime() + (daysAlive * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/`;
  }
};

export const readCookie = function (key) {
  let isBrowser = isClient();

  if (isBrowser && window._satellite) {
    return window._satellite.readCookie(key);
  } else if (isBrowser) {
    let name = key + '=';
    let decodedCookie = decodeURIComponent(document.cookie).split(';');

    for (let i = 0; i < decodedCookie.length; i++) {
      let c = decodedCookie[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
};
