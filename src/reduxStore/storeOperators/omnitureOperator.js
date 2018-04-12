import { bindAllClassMethodsToThis } from 'util/bindAllClassMethodsToThis';

let previous = null;
export function getOmnitureOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new OmnitureOperator(store);
  }
  return previous;
}

class OmnitureOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  /* The omniture library is deployed and configured to the browser via DTM, a 3rd party tool managed by TCP internal team */
  get omnitureLibrary () {
    let prefill = {
      linkTrackEvents: null,
      linkTrackVars: null,
      t: () => {},
      tl: () => {}
    };

    return window.s_c_il && window.s_c_il[1] || prefill;
  }

  /* This will track custom variables while NOT incrementing page count */
  trackLink (trackingEventName = 'Custom Event Trigger') {
    this.omnitureLibrary.tl(true, 'o', trackingEventName);
    this.resetTrackingValues();
  }

  /* Page related tracking. This will increment page count. This method should be engaged ONLY on page related events. */
  trackPageEvent () {
    this.omnitureLibrary.t();
    this.resetTrackingValues();
  }

  /* This will reset the tracking params so that they wont get picked up with other params */
  resetTrackingValues () {
    this.omnitureLibrary.linkTrackEvents = 'None';
    this.omnitureLibrary.linkTrackVars = 'None';
  }
}
