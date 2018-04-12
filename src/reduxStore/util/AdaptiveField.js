/** @module AdaptiveField
 * @summary A component that renderes a redux-form Field component that tracks and adapts
 * its props (and optionally its value) to the value(s) of other fields in the containing redux-form.
 */
 // TODO: fix getWrappedInstance
import {PropTypes} from 'prop-types';
import {getAdaptiveFormPart} from './adaptiveFormPart';
import {Field} from 'redux-form';

export let AdaptiveField = getAdaptiveFormPart(Field, 'AdaptiveField');
AdaptiveField.propTypes = {
   /** A comma separated list of field names in the containing form
    * whoe's values should be tracked and adapted to (e.g. "email, firstName").
    * Note: spaces around the commas are removed and ignored.
    */
  adaptTo: PropTypes.string.isRequired,

   /**
    * This method will be called whenever the values of the tracked form fields change.
    * It will be passed two parameters: values, state.
    *  values:  this is a plain object with the values of the tracked form fields, plus
    *           a _myValue key with the value of the wrapped Field. For example:
    *           {_myValue: "johnDear", email: "gg@gmail.com, firstName: "john"}
    *  state:   this is the state of the redux store (not needed in many simple cases).
    *
    * The return value of this method should be a simple object containing the props to be passed
    * to the component that this Field wraps. In a ddition this object can contain a _newValue
    * key who's value is a requestred new value for the field.
    */
  mapValuesToProps: PropTypes.func.isRequired,

  /**
   * Flags if a ref to the instance of the component wrapped by the Field
   * will be available by calling the method getWrappedInstance() of this component
   */
  withRef: PropTypes.bool
};
