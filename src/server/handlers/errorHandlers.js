/** @module errorHandlers
 * @summary error handlers for all server-side page requests
 *
 * @author Ben
 */

export function errorLogger (err, req, res, next) {
  // depending on who trigger and what it triggers we get different '404' statuses
  // maybe we should add something to generic error so that this guy always gets networkStatusCode
  // but that's major refactoring. Do we want to do that at this point?
  if (err.networkStatusCode !== 404 && err.code !== 'ENOTFOUND' && err.statusCode !== 404) {
    console.error(`error serving url: '${req.url}'`, err);
    console.error(`- - - - - - - - - - - - - - - - - - - - - - - -`);
  }
  next();
}

export function errorHandlerFallback (err, req, res, next) {  // eslint-disable-line handle-callback-err
  if (err.networkStatusCode !== 404 && err.code !== 'ENOTFOUND' && err.statusCode !== 404) {
    console.error(`fallback error serving url: '${req.url}'`, err);
    console.error(`- - - - - - - - - - - - - - - - - - - - - - - -`);
  }

  res
  .set('X-Content-Type-Options', 'nosniff')
  .set('Cache-Control', 'no-cache')
  .status(404).send(getFallbackHtml(res));
}

/**
 * If NodeJs fails due coding error or API's fail this section will be returned to the user.
 */
function getFallbackHtml (res) {
  // We may want to reach out to creative on this so that we can just use a static HTML file on the node server. PS: Akamia has their own shingle in case Nodejs goes down.
  let state = res.locals.store.getState();

  let bodyCopy = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script type="text/javascript" src="${state.mutable.apiHelper.configOptions.apiKeys.DTM}"></script>
      </head>
      <body>
        <img src="/wcsstore/static/images/404.jpg" alt="Looking for something? We\'re sorry, the address you entered isn\'t a functioning page on The Children\'s Place website. Details regarding this error have been logged and sent to our technical support team." />
      </body>
    </html>`;

  /* We can use this as a template to serve up when the site is down
    let serverErrorPageTemplateData = {
      isMobile: res.locals.isMobile,
      reactHtmlString: '',
      apiKeys: state.mutable.apiHelper.configOptions.apiKeys,
      state: state,
      title: 'We\'ll Be Back Soon',
      description: 'We\'ll Be Back Soon',
      canonicalUrl: 'We\'ll Be Back Soon'
    };
    let template = HTML_METHODS.getBasicPageHtml(serverErrorPageTemplateData);
    return template;
  */

  return bodyCopy;
}
