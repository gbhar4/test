/** @module ContentSlotRenderer
 *
 *  @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
export class ContentSlotRenderer extends React.Component {

  static propTypes = {
    htmlContent: PropTypes.string.isRequired,         // the HTMl to render (can be any html code including scripts etc that can appear inside a div)
    isVisible: PropTypes.bool.isRequired,             // flags whether this content slot is visible or not.
    className: PropTypes.string,           // the CSS class to use for the containing div
    // if not present and isVisible is false then this element renders nothing; otherwise it renders with this CSS class instead of this.props.classname
    hiddenClassName: PropTypes.string
  }

  render () {
    let {htmlContent, isVisible, className, hiddenClassName, ...otherProps} = this.props;
    if (!isVisible && !hiddenClassName) {
      return null;      // do not render anything if invisible and no hiddenClassName is specified
    }
    let cls = {className: isVisible ? className : hiddenClassName};
    return (
      <div dangerouslySetInnerHTML={{'__html': htmlContent}} {...cls} {...otherProps} />
    );
  }

}
