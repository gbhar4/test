import { matchPath } from 'react-router';
import { PAGES } from 'routing/routes/pages';

export function getPageByUrl (pagePath) {
  for (let key in PAGES) {
    if (matchPath(pagePath, { path: PAGES[key].pathPattern })) {
      return PAGES[key];
    }
  }

  return {};
}
