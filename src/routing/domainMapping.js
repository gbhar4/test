/** Map of domain names that serve the pages, to the support domains used for static assets and api calls.
 */

const apiKeysTable = {
  prod: {
    PAYPAL: 'TBD',
    MELISSA: '63987687',
    STYLITICS: 'thechildrensplace',
    STYLITICS_HOST: 'https://widget-api.stylitics.com/api/outfits',
    DTM: '//assets.adobedtm.com/429637684b76cf4b92fab22c24d35f7d9e89348a/satelliteLib-aba365057b3fb6edb76f4760f09ade697e571f92.js',
    SNARE: 'https://mpsnare.iesnare.com/snare.js',
    BORDERS_FREE: 'https://checkout.fiftyone.com/htmlcheckout/resources/js/merchant.js',
    BORDERS_FREE_COMM: 'https://embassy.fiftyone.com/utils/empty.jsp',
    BAZAARVOICE: 'https://display.ugc.bazaarvoice.com/static/ChildrensPlace/en_US/bvapi.js',
    BAZAARVOICE_SPOTLIGHT: 'https://seo.bazaarvoice.com/childrensplace-4aee45aa2126bd8d17c1ad9d9663ed7d/Spotlights-en_US/spotlights/scout.js'
  },
  dev: {
    PAYPAL: 'TBD',
    STYLITICS: 'thechildrensplace',
    STYLITICS_HOST: 'https://widget-api-staging.stylitics.com/api/outfits',
    MELISSA: '63987687',
    DTM: '//assets.adobedtm.com/429637684b76cf4b92fab22c24d35f7d9e89348a/satelliteLib-aba365057b3fb6edb76f4760f09ade697e571f92-staging.js',
    SNARE: 'https://ci-mpsnare.iovation.com/snare.js',
    BORDERS_FREE: 'https://stagecheckout.fiftyone.com/htmlcheckout/resources/js/merchant.js',
    BORDERS_FREE_COMM: 'https://stagecheckout.fiftyone.com/utils/empty.jsp',
    BAZAARVOICE: 'https://display-stg.ugc.bazaarvoice.com/static/ChildrensPlace/en_US/bvapi.js',
    BAZAARVOICE_SPOTLIGHT: 'https://seo-stg.bazaarvoice.com/childrensplace-4aee45aa2126bd8d17c1ad9d9663ed7d/Spotlights-en_US/spotlights/scout.js'
  }
};

export const domainMapping = {

  // ------------------
  // --- Production: Non-Akamai ---
  // ------------------
  'tcp-prod.childrensplace.com': {
    apiDomain: '://tcp-prod.childrensplace.com/api/',
    assetsHost: 'https://tcp-prod.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'tcp-prod-stage.childrensplace.com': {
    apiDomain: '://tcp-prod-stage.childrensplace.com/api/',
    assetsHost: 'https://tcp-prod-stage.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'staging.childrensplace.com': {
    apiDomain: '://tcp-prod-stage.childrensplace.com/api/',
    assetsHost: 'https://tcp-prod-stage.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'origin-www.childrensplace.com': {
    apiDomain: '://tcp-prod.childrensplace.com/api/',
    assetsHost: 'https://origin-www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  // --- DR Stage --- //
  'tcp-dr-stage.childrensplace.com': {
    apiDomain: '://tcp-dr-stage.childrensplace.com/api/',
    assetsHost: 'https://tcp-dr-stage.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  // --- DR Live --- //
  'tcp-dr.childrensplace.com': {
    apiDomain: '://tcp-dr.childrensplace.com/api/',
    assetsHost: 'https://tcp-dr.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'default': {
    apiDomain: '://tcp-prod.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  // --- Production: Akamai --- //
  'www.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'fr.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'es.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'm.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'fr.m.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  'es.m.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: 'https://www.childrensplace.com',
    apiKeys: apiKeysTable.prod
  },

  // ------------------
  // ---- Stream 1 ----
  // ------------------
  // -- ENGLISH
  'int1.childrensplace.com': {
    apiDomain: '://int1.childrensplace.com/api/',
    assetsHost: 'https://int1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatlive1.childrensplace.com': {
    apiDomain: '://uatlive1.childrensplace.com/api/',
    assetsHost: 'https://uatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatstg1.childrensplace.com': {
    apiDomain: '://uatstg1.childrensplace.com/api/',
    assetsHost: 'https://uatstg1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // -- FRENCH
  'fr.int1.childrensplace.com': {
    apiDomain: '://int1.childrensplace.com/api/',
    assetsHost: 'https://int1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatlive1.childrensplace.com': {
    apiDomain: '://uatlive1.childrensplace.com/api/',
    assetsHost: 'https://uatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatstg1.childrensplace.com': {
    apiDomain: '://uatstg1.childrensplace.com/api/',
    assetsHost: 'https://uatstg1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // -- SPANISH
  'es.int1.childrensplace.com': {
    apiDomain: '://int1.childrensplace.com/api/',
    assetsHost: 'https://int1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatlive1.childrensplace.com': {
    apiDomain: '://uatlive1.childrensplace.com/api/',
    assetsHost: 'https://uatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatstg1.childrensplace.com': {
    apiDomain: '://uatstg1.childrensplace.com/api/',
    assetsHost: 'https://uatstg1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // ------------------
  // ---- Stream 2 ----
  // ------------------
  // -- ENGLISH
  'int2.childrensplace.com': {
    apiDomain: '://int2.childrensplace.com/api/',
    assetsHost: 'https://int2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatstg2.childrensplace.com': {
    apiDomain: '://uatstg2.childrensplace.com/api/',
    assetsHost: 'https://uatstg2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatlive2.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://uatlive2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  // -- FRENCH
  'fr.int2.childrensplace.com': {
    apiDomain: '://int2.childrensplace.com/api/',
    assetsHost: 'https://int2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatstg2.childrensplace.com': {
    apiDomain: '://uatstg2.childrensplace.com/api/',
    assetsHost: 'https://uatstg2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatlive2.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://uatlive2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  // -- SPANISH
  'es.int2.childrensplace.com': {
    apiDomain: '://int2.childrensplace.com/api/',
    assetsHost: 'https://int2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatstg2.childrensplace.com': {
    apiDomain: '://uatstg2.childrensplace.com/api/',
    assetsHost: 'https://uatstg2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatlive2.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://uatlive2.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  // -- MOBILE
  'muatlive1.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://muatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  'es.muatlive1.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://muatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  'fr.muatlive1.childrensplace.com': {
    apiDomain: '://uatlive2.childrensplace.com/api/',
    assetsHost: 'https://muatlive1.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },
  // ------------------
  // ---- Stream 3 ----
  // ------------------
  // -- ENGLISH
  'int3.childrensplace.com': {
    apiDomain: '://int3.childrensplace.com/api/',
    assetsHost: 'https://int3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatstg3.childrensplace.com': {
    apiDomain: '://uatstg3.childrensplace.com/api/',
    assetsHost: 'https://uatstg3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'uatlive3.childrensplace.com': {
    apiDomain: '://uatlive3.childrensplace.com/api/',
    assetsHost: 'https://uatlive3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // -- FRENCH
  'fr.int3.childrensplace.com': {
    apiDomain: '://int3.childrensplace.com/api/',
    assetsHost: 'https://int3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatstg3.childrensplace.com': {
    apiDomain: '://uatstg3.childrensplace.com/api/',
    assetsHost: 'https://uatstg3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'fr.uatlive3.childrensplace.com': {
    apiDomain: '://uatlive3.childrensplace.com/api/',
    assetsHost: 'https://uatlive3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // -- SPANISH
  'es.int3.childrensplace.com': {
    apiDomain: '://int3.childrensplace.com/api/',
    assetsHost: 'https://int3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatstg3.childrensplace.com': {
    apiDomain: '://uatstg3.childrensplace.com/api/',
    assetsHost: 'https://uatstg3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  'es.uatlive3.childrensplace.com': {
    apiDomain: '://uatlive3.childrensplace.com/api/',
    assetsHost: 'https://uatlive3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // ------------------
  // Stream PERF STAGE
  // ------------------
  'tcp-perf-stage.childrensplace.com': {
    apiDomain: '://tcp-perf-stage.childrensplace.com/api/',
    assetsHost: 'https://tcp-perf-stage.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- stream PERF LIVE --- //
  'tcp-perf.childrensplace.com': {
    apiDomain: '://tcp-perf.childrensplace.com/api/',
    assetsHost: 'https://tcp-perf.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- Skava: mobile web --- //
  'muatnext.childrensplace.com': {
    apiDomain: '://uatlive3.childrensplace.com/api/',
    assetsHost: 'https://uatlive3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- Skava: mobile web --- //
  'mpreprod.childrensplace.com': {
    apiDomain: '://uatlive3.childrensplace.com/api/',
    assetsHost: 'https://uatlive3.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- Skava: mobile web --- //
  'mperflive.childrensplace.com': {
    apiDomain: '://tcp-perf.childrensplace.com/api/',
    assetsHost: 'https://tcp-perf.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- AKAMAI Test If you updated this you must update Origin --- //
  'test.childrensplace.com': {
    apiDomain: '://test.childrensplace.com/api/',
    assetsHost: 'https://test.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- AKAMAI Origin --- //
  'origin-test.childrensplace.com': {
    apiDomain: '://uatlive1.childrensplace.com/api/',
    assetsHost: 'https://origin-test.childrensplace.com',
    apiKeys: apiKeysTable.dev
  },

  // --- local development --- //
  'local.childrensplace.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: '://www.childrensplace.com/api/',
    apiKeys: apiKeysTable.dev
  },
  'murmuring-taiga-43207.herokuapp.com': {
    apiDomain: '://www.childrensplace.com/api/',
    assetsHost: '://www.childrensplace.com/api/',
    apiKeys: apiKeysTable.dev
  }
};
