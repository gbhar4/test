/**
 * @module GlobalNavigationMenu
 * @author Oliver Ramírez
 * @author Miguel Alvarez Igarzábal
 * Presentational component that renders a single entry of L1 navigation (such
 * as Girl, or Accessories) and it's associated L2 navigation.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ToggleMenuButton} from './ToggleMenuButton.jsx';

const KEYCODES = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40
};

// FIXME: Talk to B about this component

export class GlobalNavigationMenu extends React.Component {

  static propTypes = {
    /**
     * Text to appear in the menu name (such as 'Accessories'). Note that this
     * may also be a react component, to allow us to display a text with an
     * image (something like PLACE SHOPS where the image is not a character in
     * a special font)
     */
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,

    /**
     * Is the title of the popup L2 menu (such as 'Sizes 4-18').
     */
    description: PropTypes.string,

    /**
     * Name of the content slot displayed on the left of the popup (e.g., the
     * image of a girl).
     */
    primaryContentSlotName: PropTypes.string,

    /**
     * Used to render the bottom promotional bar in the popup.
     */
    secondaryContentSlotName: PropTypes.string,

    /**
     * Array describing the L2 links. Every entry in this array represents a
     * single L2 column. Each column is an array of pairs, and each pair
     * contains a link's text and URL.
     */
    menuItems: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }))).isRequired,

    /**
     * Id of the category of the L1 menu item.
     */
    categoryId: PropTypes.string.isRequired,

    /**
     * Href url for the L1 menu link.
     */
    url: PropTypes.string,

    /**
     * Whether the L1 menu item is the active one (i.e., we are on a page
     * corresponding to this category).
     */
    selected: PropTypes.bool,

    /**
     * Url of an optional icon to show at the left of the L1 item text. When
     * this is specified, the left-icon class will be applied to the link.
     */
    iconUrl: PropTypes.string,

    /**
     * Whether we are being rendered for mobile.
     */
    isMobile: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context);

    let isBrowser = typeof window !== 'undefined';
    let {selected, isSubMenuVisible} = this.props;
    let isActive = selected || isSubMenuVisible;

    this.state = {
      enableRedirect: !isBrowser || !('ontouchstart' in window) || isActive,
      activeL3Menu: null,
      renderToggleButton: false
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTouchClick = this.handleTouchClick.bind(this);
    this.handleOpenLevel3 = this.handleOpenLevel3.bind(this);
    this.handleCloseLevel3 = this.handleCloseLevel3.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleL2KeyDown = this.handleL2KeyDown.bind(this);
    this.handleLevel1Focus = this.handleLevel1Focus.bind(this);
    this.captureContainerRef = this.captureContainerRef.bind(this);
  }

  captureContainerRef (ref) {
    this.container = ref;
  }

  handleOpenLevel3 (event) {
    event.preventDefault();

    this.setState({
      activeL3Menu: event.target.attributes['data-id'].value
    });
  }

  handleCloseLevel3 (event) {
    setTimeout(() => {
      var focusedElement = document.activeElement;
      if (!focusedElement || !focusedElement.closest('.navigation-bar')) {
        this.setState({
          activeL3Menu: null
        });
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    let isBrowser = typeof window !== 'undefined';
    let {selected, isSubMenuVisible} = nextProps;
    let isActive = selected || isSubMenuVisible;

    let wasSelected = this.props.selected;
    let wasSubMenuVisible = this.props.isSubMenuVisible;
    let wasActive = wasSelected || wasSubMenuVisible;

    this.setState({
      enableRedirect: !isBrowser || !('ontouchstart' in window) || (wasActive && isActive)
    });
  }

  handleToggleClick (event) {
    let {selected, isSubMenuVisible} = this.props;
    let isActive = selected || isSubMenuVisible;

    if (isActive) {
      this.props.onFocus(event, null);
    } else {
      this.props.onFocus(event, this.props.categoryId);
    }
  }

  handleFocus (event) {
    let {isMobile} = this.props;

    if (isMobile) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.onFocus(event, this.props.categoryId);
  }

  handleLevel1Focus () {
    // Only add the button to the DOM when L1 receives focus
    // Fix for using shift-tab to move through navigation
    this.setState({
      renderToggleButton: true
    });
  }

  handleBlur (event) {
    if (this.state.activeL3Menu !== null) {
      this.handleCloseLevel3();
    } else {
      this.props.onBlur(event, this.props.categoryId);
    }

    // If focus is moving outside of the menu, remove the button from the DOM
    // Fix for using shift-tab to move through navigation
    if (!this.container.contains(event.relatedTarget)) {
      this.setState({
        renderToggleButton: false
      });
    }
  }

  handleTouchClick (event) {
    let {isMobile} = this.props;
    let {enableRedirect} = this.state;

    if (!enableRedirect || isMobile) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!enableRedirect) {
      this.setState({
        enableRedirect: true
      });
    }
  }

  handleL2KeyDown (event) {
    switch (event.keyCode) {
      case KEYCODES.RIGHT:
      case KEYCODES.DOWN:
        let nextLi = event.target.parentNode.nextSibling;
        let nextAnchor = nextLi ? nextLi.childNodes : [];
        let nextColumnLi = event.target.parentNode.parentNode.nextSibling;
        let nextAnchorColumn = nextColumnLi ? nextColumnLi.childNodes : [];

        if (nextAnchor.length) {
          nextAnchor[0].focus();
        } else if (nextAnchorColumn.length) {
          nextAnchorColumn[0].childNodes[0].tagName === 'A' && nextAnchorColumn[0].childNodes[0].focus();
        }
        break;

      case KEYCODES.LEFT:
      case KEYCODES.UP:
        let prevLi = event.target.parentNode.previousSibling;
        let prevAnchor = prevLi ? prevLi.childNodes : [];
        let prevColumnLi = event.target.parentNode.parentNode.previousSibling;
        let prevAnchorColumn = prevColumnLi ? prevColumnLi.childNodes : [];

        if (prevAnchor.length) {
          prevAnchor[0].focus();
        } else if (prevAnchorColumn.length) {
          prevAnchorColumn[prevAnchorColumn.length - 1].childNodes[prevAnchorColumn[0].childNodes.length - 1].focus();
        }
        break;

      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  render () {
    let {categoryId, title, url, menuItems, description,
        primaryContentSlotName, secondaryContentSlotName, iconUrl, selected,
        isMobile, isSubMenuVisible} = this.props;

    let {renderToggleButton} = this.state;

    let isActive = selected || isSubMenuVisible;

    let containerClassName = cssClassName(
      'navigation-level-one ',
      {'sub-menu-visible': isSubMenuVisible}
    );

    let level1LinkClassName = cssClassName(
      'navigation-level-one-link ',
      {
        'left-icon ': iconUrl && !isMobile,
        'active': selected
      });

    let subMenuClassName = cssClassName(
      'sub-menu ',
      {'active': isActive}
    );

    return (
      <li key={categoryId} className={containerClassName} ref={this.captureContainerRef} onBlur={this.handleBlur} role="none">
        <a href={url} className={level1LinkClassName} onFocus={this.handleLevel1Focus} onClick={!isMobile ? this.handleTouchClick : this.handleFocus} role="menuitem"> {/* NOTE: Visible link at global top menu */}
          {iconUrl && <figure className="navigation-level-one-image icon">
            <img src={iconUrl} alt="icon" />
          </figure>}
          {title}
          {isMobile && <span className="mobile-l1-description-submenu">{description}</span>}
        </a>
        {!isMobile && renderToggleButton && <ToggleMenuButton isExpanded={isActive} onClick={this.handleToggleClick} onFocus={this.handleBlur} />}

        <div className={subMenuClassName} aria-hidden={!isActive} role="menu">
          <div className="header-sub-menu" onClick={isMobile ? this.handleBlur : null}>
            <h3 className="title-submenu sub-menu-chevron">{title}</h3>
            <span className="description-submenu">{description}</span>
          </div>

          {(primaryContentSlotName && !isMobile) && <ContentSlot contentSlotName={primaryContentSlotName} className="img-category" />}

          {menuItems.map((eachCategory, index) => {
            let navigationLength = menuItems.length;

            let level2LinkClassName = cssClassName(
              'container-navigation-level-two ',
              {
                'only ': navigationLength === 1,
                'subcategory-primary-menu ': index === 0,
                'subcategory-secondary-menu ': index !== 0
              });

            return (
              <ul className={level2LinkClassName} key={index} role="none">
                {eachCategory.map((list) => {
                  let {categoryId, name, url, menuItems, description} = list;

                  let {activeL3Menu} = this.state;
                  let isActive = activeL3Menu === categoryId;
                  let l3SubMenuClassName = cssClassName(
                    'sub-menu ',
                    {'active': isActive}
                  );

                  return (
                    <li className="navigation-level-two" key={categoryId} role="none">
                      <a data-id={categoryId} className="navigation-level-two-link" href={url}
                        onKeyDown={!isMobile ? this.handleL2KeyDown : null}
                        onClick={isMobile && menuItems && menuItems.length && menuItems.length > 1 ? this.handleOpenLevel3 : null} role="menuitem">{name}</a>

                      {isMobile && menuItems && menuItems.length > 0 &&
                        <div className={l3SubMenuClassName} aria-hidden={!isActive} role="none">
                          <div className="header-sub-menu" onClick={this.handleCloseLevel3} role="none">
                            <h3 className="title-submenu sub-menu-chevron">{name}</h3>
                          </div>
                          <ul className={level2LinkClassName} role="menu">
                            <li className="navigation-level-two" role="none">
                              <a className="navigation-level-two-link" href={url} role="menuitem">Shop All</a>
                            </li>
                            {menuItems.map((item) => {
                              let {categoryId, name, url} = item;

                              return (<li className="navigation-level-two" key={categoryId} role="none">
                                <a className="navigation-level-two-link" href={url} role="menuitem">{name}</a>
                              </li>);
                            })}
                          </ul>
                        </div>
                      }
                    </li>
                  );
                })}
              </ul>
            );
          })}

          {(secondaryContentSlotName && !isMobile) && <ContentSlot contentSlotName={secondaryContentSlotName} className="submenu-banner" />}
        </div>
      </li>
    );
  }
}
