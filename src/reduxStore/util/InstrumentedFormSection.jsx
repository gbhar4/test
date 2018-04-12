/** @module InstrumentedFormSection
 * a redux-forms FormSection component that knows its full name, as well as has access to a <code>change</code>
 * method from the enclosing redux-form.
 *
 * Note: when inheriting from this component make sure that you constructor looks like this:
 * @example
 *    constructor (props, context) { super(props, context);  // rest of constructor goes here }
 */
import {PropTypes} from 'prop-types';
import {FormSection} from 'redux-form';

export class InstrumentedFormSection extends FormSection {

  constructor (props, context) {
    super(props, context);

    this.changeSectionField = this.changeSectionField.bind(this);
    this.changeFormField = this.changeFormField.bind(this);
    this.getSectionFullName = this.getSectionFullName.bind(this);
  }

  changeFormField (field, value) {
    return this.context._reduxForm.dispatch(this.context._reduxForm.change(field, value));
  }

  changeSectionField (field, value) {
    return this.context._reduxForm.dispatch(this.context._reduxForm.change(
      this.getSectionFullName() + '.' + field, value)
    );
  }

  getSectionFullName () {
    return this.context._reduxForm.sectionPrefix
    ? this.context._reduxForm.sectionPrefix + '.' + this.props.name
    : this.props.name;
  }

  // ------------- private members ----------------------

  // declare interest in having access to the React context
  static contextTypes = {
    _reduxForm: PropTypes.object
  }
}
