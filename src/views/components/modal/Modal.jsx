/** @module Modal
 *  @summary Wrapper component for react-modal.
 * We need some additional behavior when opening and closing modals
 * (scrolling to the position the user was on - mobile issue)
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import BaseModal from 'react-modal';
import {findFirstScrollableParent} from 'util/viewUtil/scrollingAndFocusing.js';

export class Modal extends React.Component {
  static propTypes = {
    /**
     * We're passing all props unmodified to react-modal
     */
    ...BaseModal.propTypes,

    /**
     * Indicates that when the modal closes, the scrolling ancestor
     * of the trigger element should scroll to the position where it was.
     * This is helpful in case of mobile (for instance) as when
     * a fullscreen modal opens the body gets hidden (because of double scroll issue)
     */
    shouldScrollParentOnClose: PropTypes.bool,

    /**
     * DT-31929
     * Indicates whether to capture the submit event and prevent it from bubbling outside the modal
     */
    preventEventBubbling: PropTypes.bool
  }

  static defaultProps = {
    shouldScrollParentOnClose: true
  }

  constructor (props, context) {
    super(props, context);

    this.restoreScrollAndFocus = this.restoreScrollAndFocus.bind(this);
    this.saveScrollAndFocus = this.saveScrollAndFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    if (this.props.isOpen) {
      this.saveScrollAndFocus();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOpen && !this.props.isOpen) {
      this.saveScrollAndFocus();
    } else if (!nextProps.isOpen && this.props.isOpen) {
      this.restoreScrollAndFocus();
    }
  }

  componentWillUnmount () {
    this.restoreScrollAndFocus();
  }

  // stores references to:
  // - the active element (to return focus)
  // - the scrolling parent (to return scroll)
  // - the scrolling offset of the parent (to return scroll)
  saveScrollAndFocus () {
    this.activeElement = document.activeElement; // returning focus from ReactModal is not working properly, so storing a reference in here to return it
    this.scrollingParent = document.activeElement && findFirstScrollableParent(document.activeElement) || window;
    this.scrollTop = this.scrollingParent.pageYOffset || this.scrollingParent.scrollTop || 0; // for window it's pageYOffset, for other elements it's scrollTop
  }

  restoreScrollAndFocus () {
    // NOTE: componentWillUnmount is fired just before destroying the component,
    // or the modal could be closed with timeout. We need to do scrollTo after it closes
    // so we need a timeout
    let {scrollingParent, scrollTop, activeElement} = this;
    let {shouldScrollParentOnClose} = this.props;

    setTimeout(() => {
      activeElement && activeElement.focus();

      if (shouldScrollParentOnClose && scrollTop > 0) {
        if (scrollingParent === window) {
          scrollingParent.scrollTo(0, scrollTop);
        } else {
          scrollingParent.scrollTop = scrollTop;
        }
      }
    }, this.props.closeTimeoutMS + 1);
  }

  /**
   * DT-31929
   * Due to React 16 portal event bubbling, when modals that contain forms are nested within another form
   * submitting the child form will also submit the parent form.
   * Decoupling the forms will require a major refactor.
   * Quick fix is to capture the submit event in here and prevent it from bubbling outside the Modal.
   * https://reactjs.org/docs/portals.html#event-bubbling-through-portals
   */
  handleSubmit(event) {
    if (this.props.preventEventBubbling) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render () {
    let {children, ...otherProps} = this.props;

    return (
      <div onSubmit={this.handleSubmit}>
        <BaseModal {...otherProps}>
          {children}
        </BaseModal>
      </div>
    );
  }
}
