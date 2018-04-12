import {trackLink} from './analyticsHelper';

export function removeFromBag (response, endpoint) {
  trackLink({
    linkTrackVars: 'events, eVar1',
    linkTrackEvents: 'event1',
    events: 'event1',
    event1: 'Test Event',
    eVar1: 'Test eVar'
  });
}
