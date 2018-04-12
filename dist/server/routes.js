'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;

var _serverPages = require('./serverPages');

var _requestHandler = require('./handlers/requestHandler');

var _pages = require('routing/routes/pages');

var _errorHandlers = require('./handlers/errorHandlers.js');

var _envVariables = require('./config/envVariables');

// This is not the same Object that will be on our NodeJs Server, This will be Empty initally.

/* This is the entry point for our server bundle, The app from this point on will not have access to node .env variables */
function route(app, envVariables) {

  /* Intake envVariables from the node server that is initalizing this server-bundle
  *  and replace the local object that the bundle was bundled with. 
  *  Please refer to envVariables.js on why we are needing to do it this way
  */
  for (var key in envVariables) {
    _envVariables.ENV_VARS[key] = envVariables[key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(_serverPages.SERVER_PAGES)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pageId = _step.value;
      var _SERVER_PAGES$pageId = _serverPages.SERVER_PAGES[pageId],
          routingInfo = _SERVER_PAGES$pageId.routingInfo,
          sections = _SERVER_PAGES$pageId.sections;

      if (routingInfo) {
        app.get(routingInfo.rootPathPattern || routingInfo.pathPattern, (0, _requestHandler.getRequestHandlers)(pageId));
      }

      if (sections) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(sections)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var sectionKey = _step2.value;

            app.get(sections[sectionKey].pathPattern, (0, _requestHandler.getRequestHandlers)(pageId));

            var subSections = sections[sectionKey].subSections;

            if (subSections) {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = Object.keys(subSections)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var subSectionKey = _step3.value;

                  app.get(subSections[subSectionKey].pathPattern, (0, _requestHandler.getRequestHandlers)(pageId));
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  app.get('/:siteId/global/header', (0, _requestHandler.getRequestHandlers)(_serverPages.LEGACY_HEADER_PAGE_ID));
  app.get('/:siteId/global/footer', (0, _requestHandler.getRequestHandlers)(_serverPages.LEGACY_FOOTER_PAGE_ID));
  app.post('/:siteId/checkout/review', (0, _requestHandler.getRequestHandlers)(_pages.PAGES.checkout.id)); // to handle PayPal redirect

  // DEVELOPMENT ROUTES
  if (process.env.NODE_ENV === 'development') {
    // Allow Node server to make API calls
    // FIXME: MAKE SURE WEBPACK IS NOT RUNNING IN DEV MODE!!
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // This is for local dev only to serve as a proxy to our local assets
    app.get('/wcsstore/static/*', function (req, res) {
      var file = req.url.replace('/wcsstore/static/', 'dist/client/');
      res.sendfile(file, __dirname);
    });
  }

  app.use('/:siteId?', _errorHandlers.errorLogger, (0, _requestHandler.getRequestHandlers)(_serverPages.FANCY_404_PAGE_ID), _errorHandlers.errorHandlerFallback); // error handler plus fallback for all routes above

  app.use('/:siteId?', (0, _requestHandler.getRequestHandlers)(_serverPages.FANCY_404_PAGE_ID), _errorHandlers.errorHandlerFallback); // redirect any other route to 404 page (of the correct site)
} /**
   * @author Agu
   * Router
   */