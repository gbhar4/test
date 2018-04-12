/** @module TabedDrawers
 * @summary A presentational component for rendering a modal (usin React-modal) with a navigation bar with links
 * to select the content displayed in a content pane beneath the navigation bar.
 *
 * Each link and its associated content are called a `tab`.
 *
 * Note that this component does not directly perform the navigation between tabs.
 * Instead, whenever a link is clicked, it only calls the onLinkClick callback with the id of the associated tab.
 * It is then the responsibility of the callback to change the activeTabId prop of this component to effect
 * the change in content.
 * The reason for this convoluted mechanism is so that the displayed tab can also be specified from the outside,
 * i.e., not by interacting with the navigation bar.
 *
 * The same mechanism is used for closing this modal. I.e., when the close button is clicked this callback is invoked,
 * and it is up to it to close this modal by setting the isOpen prop to false.
 *
 * Note that any extra props (i.e., other than <code>tabs, activeTabId</code>),
 * e.g., <code>className, contentLabel</code>, that are passed to this component will be passed along to the rendered react-modal.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

export class TabedDrawers extends React.Component {
  static propTypes = {
    /** A list of tabs to present the user with */
    tabs: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        /** The id of the tab (used to select this tab) */
        id: PropTypes.string.isRequired,
        /** prop that contain the title of tab */
        title: PropTypes.string.isRequired,
        /**
         * The React component class to be used to render the link to this tab in the navigation bar.
         * This component is assumed to accept an onClick prop, and an id prop.
         * When an element of this component is clicked, it should call the onClick callback,
         * and pass to it it tweo parameters: the click event and the id of this tab.
         */
        LinkComponent: PropTypes.func.isRequired,
        /**
         * The React component class to be used to render the content of the tab.
         * Note that this component is optional, and if it is falsy then the link is
         * assumed to have no associated tab, and it handles its own click events (e.g.,
         * to navigate to some other URL outside the current page)
         */
        ContentComponent: PropTypes.func,
        /** optional props to pass to the rendered LinkComponent */
        linkProps: PropTypes.object,
        /** optional props to pass to the rendered ContentComponent */
        contentProps: PropTypes.object
      }),
      /** tabs of this type are fake, and only have links that (usually) redirect to other pages */
      PropTypes.shape({
        /** The id of the tab (used only as a key for React) */
        id: PropTypes.string.isRequired,
        /** a link component that has no associated content (and custom onClick behavior) */
        LinkComponent: PropTypes.func.isRequired,
        /** optional props to pass to the rendered LinkComponent */
        linkProps: PropTypes.object
      })
    ])),

    /** the id of the currently open tab */
    activeTabId: PropTypes.string.isRequired,

    /** the name of the currently open tab */
    activeFormName: PropTypes.string.isRequired,

    /**
     * A callback for clicks on the navigation bar links.
     * it accepts a click event and the id of the clikced tab.
     */
    onLinkClick: PropTypes.func.isRequired,
    /** an event handler for clicks on the close button - it accepts a click event */
    onCloseClick: PropTypes.func.isRequired
  }

  // constructor(props) {
  //   super(props);
  // }

  getActiveTab () {
    return this.props.tabs.find((tab) => tab.id === this.props.activeTabId);
  }

  getModalClassName (activeTab, isMobile) {
    let type = activeTab ? activeTab.title.replace(' ', '-').toLowerCase() : '';
    let className = cssClassName(
      ' overlay-container ',
      {'mobile-tabed-drawers-container ': isMobile, 'desktop-tabed-drawers-container ': !isMobile},
      {'tabed-drawers-': type !== ''},
      type
    );

    return className;
  }

  render () {
    let {isMobile, tabs, activeTabId, onLinkClick, onCloseClick, activeFormName, ...otherProps} = this.props;
    let activeTab = this.getActiveTab();
    let ActiveTabComponent = activeTab && activeTab.ContentComponent;
    let modalClassName = this.getModalClassName(activeTab, isMobile);

    if (!activeTab) {
      return null;
    }

    return (
      <Modal {...otherProps} className={modalClassName}>
        {isMobile
          ? <ModalHeaderDisplayContainer title={activeFormName} onCloseClick={onCloseClick} hiddenTitle={isMobile && activeTab.id === DRAWER_IDS.MY_ACCOUNT} />
          : <header className="overlay-header-desktop">
            <button className="button-overlay-close" aria-label="close this modal" onClick={onCloseClick}></button>
            {tabs.map((tab) => {
              let LinkComponent = tab.LinkComponent;
              return tab.ContentComponent
                ? <LinkComponent key={tab.id} id={tab.id} isActive={tab.id === activeTabId} onClick={onLinkClick} {...tab.linkProps} />
                : <LinkComponent key={tab.id} {...tab.linkProps} />;
            })}
          </header>
        }

        <div className="overlay-content">
          {ActiveTabComponent && <ActiveTabComponent {...activeTab.contentProps} />}
        </div>
      </Modal>
    );
  }

}
