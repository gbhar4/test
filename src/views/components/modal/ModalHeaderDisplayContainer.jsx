/** @module ModalHeaderDisplayContainer
 * @summary Header for modal with title and close button.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {isMobileConnect} from 'views/components/common/containers/isMobileConnect';

if (DESKTOP) { // eslint-disable-line
  require('./_d.modal-header-display.scss');
} else {
  require('./_m.modal-header-display.scss');
}

class _ModalHeaderDisplay extends React.Component {
  static propTypes = {
    /* Flag to know if viewport is mobile */
    isMobile: PropTypes.bool,

    /* Name of container class if needed */
    className: PropTypes.string,

    /* Title of header */
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),

    /* Subtitle of header */
    subtitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),

    /* Handler for clicks on the close-modal button */
    onCloseClick: PropTypes.func.isRequired,

    hiddenTitle: PropTypes.bool
  }

  onCloseClick (object) {

  }

  render () {
    let {className, isMobile, title, subtitle, children, hiddenTitle, onCloseClick} = this.props;
    let modalContainerClass = cssClassName('modal-header ', {'modal-back-button ': children}, className);
    let modalTitleClass = cssClassName('modal-title ', {'modal-only-title ': isMobile});

    return (
      <header className={modalContainerClass}>
        {title && <h2 className={modalTitleClass} hidden={hiddenTitle}>{title}</h2>}
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        {children}
        <button type="button" className="button-modal-close" aria-label="Close this modal" onClick={onCloseClick}></button>
      </header>
    );
  }
}

let ModalHeaderDisplayContainer = isMobileConnect(_ModalHeaderDisplay);
export {ModalHeaderDisplayContainer};
