/**
 * @module CheckoutProgressListContainer
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * Exports the container component for the CheckoutProgressIndicator component,
 * connecting state to it's props.
 */
import {CheckoutProgressIndicatorConnect} from '../checkoutProgressIndicator/CheckoutProgressIndicatorConnect.js';
import {CheckoutProgressList} from './CheckoutProgressList.jsx';

let CheckoutProgressListContainer = CheckoutProgressIndicatorConnect(CheckoutProgressList);

export {CheckoutProgressListContainer};
