/**
* @module AddGiftCardForm
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* @TODO: mapToProps, confirm with Ben about balance
*/
import {AddGiftCardFormConnect} from './AddGiftCardFormConnect.js';
import {AddGiftCardForm} from './AddGiftCardForm.jsx';

let AddGiftCardFormContainer = AddGiftCardFormConnect(AddGiftCardForm);

export {AddGiftCardFormContainer};
