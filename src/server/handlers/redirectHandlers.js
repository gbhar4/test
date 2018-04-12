/**
 * @author Agu
 * Redirect handlers
 */
import {routingConstants} from 'routing/routingConstants.js';
import {RES_LOCALS_FIELD_NAMES} from './requestHandler';

export function countryRedirectHandler (req, res, next) {
  let siteId = getSiteId(req.params.siteId);

  res.locals[RES_LOCALS_FIELD_NAMES.siteId] = siteId;
  res.locals[RES_LOCALS_FIELD_NAMES.language] = getLanguageByDomain(req.hostname);
  res.locals[RES_LOCALS_FIELD_NAMES.currency] = siteId === routingConstants.siteIds.ca ? 'CAD' : 'USD';
  next();
}

function getSiteId (countryOrId) {
  countryOrId = (countryOrId || 'us').toLowerCase();
  return (countryOrId === 'ca' || countryOrId === '10152') ? routingConstants.siteIds.ca : routingConstants.siteIds.us;
}

function getLanguageByDomain (domain) {
  let langCode = domain.substr(0, 2).toLowerCase();

  // FIXME: backend should return this somehow, if not possible we need to complete this list
  return (langCode === 'es' || langCode === 'en' || langCode === 'fr') ? langCode : 'en';
}
