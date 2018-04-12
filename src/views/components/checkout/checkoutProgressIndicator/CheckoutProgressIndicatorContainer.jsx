/**
 * @module CheckoutProgressIndicatorContainer
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * Exports the container component for the CheckoutProgressIndicator component,
 * connecting state to it's props.
 */
import {CheckoutProgressIndicatorConnect} from './CheckoutProgressIndicatorConnect.js';
import {CheckoutProgressIndicator} from './CheckoutProgressIndicator.jsx';

let CheckoutProgressIndicatorContainer = CheckoutProgressIndicatorConnect(CheckoutProgressIndicator);

export {CheckoutProgressIndicatorContainer};
