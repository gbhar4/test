/** @module htmlMethods
 * @summary exposes methods for rendering server-side HTML.
 *
 * @author Ben
 */
import {getPipe} from 'util/pipe';
import serialize from 'serialize-javascript';
import {ENV_VARS} from '../config/envVariables';

export const HTML_METHODS = {
  getBasicPageHtml,
  getLegacyHeaderPageHtml,
  getLegacyFooterPageHtml
};

function getBasicPageHtml (variables) {
  return initPipeline(variables)
  .pipe(addStandardHeadAndBodyParts)
  .pipe(variables.isMobile ? addMobileHeadAndBodyParts : addDesktopHeadAndBodyParts)
  .pipe(addStandardMetaTags)
  .pipe(generateHtml)
  .result;
}

function getLegacyHeaderPageHtml (variables) {
  let {CSS_HOST_DOMAIN} = ENV_VARS;

  return `
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/base-styles-header.min.css" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/d-page-legacy-header.min.css" />
    <div id="tcp-global-header">${variables.reactHtmlString}</div>
  `;
}

function getLegacyFooterPageHtml (variables) {
  let { CSS_HOST_DOMAIN, JS_HOST_DOMAIN } = ENV_VARS;

  return `
    <div id="tcp-global-footer">${variables.reactHtmlString}</div>
    <script>
      window.__PRELOADED_STATE__ = ${serialize(variables.state, {isJSON: true})};
    </script>

    <script src="${JS_HOST_DOMAIN}/wcsstore/static/js/legacy.js" async></script>
    <script src="${JS_HOST_DOMAIN}/wcsstore/GlobalSAS/javascript/tcp/espots.js"></script>
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/base-styles-footer.min.css" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/base-styles-overlays.min.css" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/d-page-legacy-footer.min.css" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/d-page-legacy-overlays.min.css" />
  `;
}

function addStandardHeadAndBodyParts (currentParts) {
  let { CSS_HOST_DOMAIN, JS_HOST_DOMAIN } = ENV_VARS;
  let {htmlHeadParts, htmlBodyParts, variables} = currentParts;

  htmlHeadParts.push(`
    <meta charset="utf-8" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/base-styles.min.css" />
    <link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/GlobalSAS/css/tcp/bootstrap-grid-custom.css" />
    <script type="text/javascript" src="${variables.apiKeys.DTM}"></script>
  `);

  htmlBodyParts.push(`
    <div id="tcp">${variables.reactHtmlString}</div>
    <script>
      window.__PRELOADED_STATE__ = ${serialize(variables.state, {isJSON: true})};
    </script>
    <script type="text/javascript" src="${JS_HOST_DOMAIN}/wcsstore/static/js/app.js"></script>
    <script type="text/javascript">_satellite.pageBottom();</script>
    <script type="text/javascript" src="${JS_HOST_DOMAIN}/wcsstore/GlobalSAS/javascript/tcp/espots.js"></script>
    <script type="text/javascript" src="${JS_HOST_DOMAIN}/wcsstore/GlobalSAS/javascript/tcp/TCPMotionPoint.js"></script>
  `);

  return currentParts;
}

function addStandardMetaTags (currentParts) {
  let {htmlHeadParts, variables} = currentParts;

  htmlHeadParts.push(`
    <title>${variables.title}</title>
    <meta name="description" content="${variables.description}" />
    <link rel="canonical" href="${variables.canonicalUrl}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@childrensplace" />
    <meta name="twitter:title" content="${variables.title}" />
    <meta name="twitter:description" content="${variables.description}" />

    <meta name="og:title" content="${variables.title}" />
    <meta name="og:description" content="${variables.description}" />
    <meta name="og:url" content="${variables.canonicalUrl}" />
  `);

  if (variables.imageUrl) {
    htmlHeadParts.push(`<meta name="twitter:image:src" content="${variables.imageUrl}" />
      <meta name="og:image" content="${variables.imageUrl}" />
    `);
  }

  if (variables.langs) {
    htmlHeadParts.push(variables.langs.map((lang) => `<link rel="alternate" hreflang='${lang.id}' href="${lang.canonicalUrl}" />`).join(''));
  }

  if (variables.robots) {
    htmlHeadParts.push(`<meta name="robots" content="${variables.robots}" />`);
  }

  if (variables.prev) {
    htmlHeadParts.push(`<link rel="prev" href="${variables.prev}" />`);
  }

  if (variables.next) {
    htmlHeadParts.push(`<link rel="next" href="${variables.next}" />`);
  }

  return currentParts;
}

function addDesktopHeadAndBodyParts (currentParts) {
  let { CSS_HOST_DOMAIN } = ENV_VARS;

  currentParts.htmlHeadParts.push('<meta name="viewport" content="width=1024" />');
  currentParts.htmlHeadParts.push(`<link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/d-page-checkout.min.css" />`);
  return currentParts;
}

function addMobileHeadAndBodyParts (currentParts) {
  let { CSS_HOST_DOMAIN } = ENV_VARS;

  currentParts.htmlHeadParts.push('<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, target-densitydpi=device-dpi" />');
  currentParts.htmlHeadParts.push(`<link rel="stylesheet" href="${CSS_HOST_DOMAIN}/wcsstore/static/css/m-page-checkout.min.css" />`);
  return currentParts;
}

function initPipeline (variables) {
  return getPipe({
    htmlHeadParts: [],
    htmlBodyParts: [],
    variables
  });
}

function generateHtml (currentParts) {
  return '<!DOCTYPE html><html lang="en">\n\t<head>\n' +
    currentParts.htmlHeadParts.join('') +
    '\t</head>\n\t<body>' +
    currentParts.htmlBodyParts.join('') +
    '\t</body>\n</html>';
}
