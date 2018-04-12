import {CHECKOUT_EVENTS} from './checkout.events';
import {BAG_EVENTS} from './bag.events';
import {GLOBAL_EVENTS} from './global.events';

export const EVENTS = {
  ...CHECKOUT_EVENTS,
  ...BAG_EVENTS,
  ...GLOBAL_EVENTS
};
