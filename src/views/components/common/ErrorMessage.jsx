import React from 'react';
import {PropTypes} from 'prop-types';

export const ERROR_FORM_NAME_DATA_ATTRIBUTE = 'data-48618adc-error-message-form';

export class ErrorMessage extends React.Component {
  static propTypes = {
    /** The error message (if any) to display */
    error: PropTypes.string,
    /** the CSS class name to use for the containing div */
    className: PropTypes.string,
    /** the name of the form this error message relates to */
    formName: PropTypes.string,
    /**
     * Flags if to not include the ERROR_FORM_NAME_DATA_ATTRIBUTE.
     * This is usually set to <code>true</code> only if this error message is attached to a field which carries this attribute instead;
     */
    withoutErrorDataAttribute: PropTypes.bool,

    /** Unique ID needed to connect the error message with its error input. Accessibility requirement. DT-30852 */
    errorId: PropTypes.string
  }

  render () {
    let {className, formName, withoutErrorDataAttribute, errorId, error} = this.props;

    let optionalAttributes = errorId ? {id: errorId} : {};
    let dataAttributes = withoutErrorDataAttribute
      ? {}
      : { [ERROR_FORM_NAME_DATA_ATTRIBUTE]: (formName || '') };

    return (
      <div className="ghost-error-container" aria-live="polite" {...optionalAttributes}>
        {/* Above wrapper is needed due to an accessibility issue, to have a container that is always shown, even when message is not render. DT-30852 */}
        {error &&
          <div className={className || 'error-box'} {...dataAttributes} tabIndex="-1">
           <i className="error-icon">Error: </i>
           {this.props.children || error}
         </div>
        }
    </div>);
  }

}
