/**
 * @module GlobalNavigationBar
 * @author Oliver Ramírez
 * @author Miguel Alvarez Igarzábal
 * This component will render the menu global header menu. The rendering of each
 * menu item is delegated to the GlobalNavigationMenu component
 *
 * Style (ClassName) Elements description/enumeration
 *  header-global-navigation
 *
 * Uses:
 *  <GlobalNavigationMenu />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {GlobalNavigationMenu} from './GlobalNavigationMenu.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.header-global-navigation.scss');
} else {
  require('./_m.header-global-navigation.scss');
}

export class GlobalNavigationBar extends React.Component {

  static propTypes = {
    /**
     * Array of plain objects, Each object representing a single menu (such as
     * Girl, or Accessories).
     */
    menusList: PropTypes.arrayOf(PropTypes.shape({
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
      iconUrl: PropTypes.string
    })).isRequired, // Delegating validation of shape of each item to GlobalNavigationBarContainer

    /**
     * Whether we are being rendered for mobile.
     */
    isMobile: PropTypes.bool,

    /**
     * Whether there is any active/selected category in the menu.
     */
    containsActiveCategory: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      activeSubmenuVisible: null
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleFocus (event, categoryId) {
    this.setState({
      activeSubmenuVisible: categoryId
    });
  }

  handleBlur (event, categoryId) {
    /**
     * it needs a timeout (wait for next frame) because blur
     * triggers before focus on next element
     * FIXME: It might be better to always use focus and have a delegate on body
    **/
    setTimeout(() => {
      var focusedElement = document.activeElement;
      if (!focusedElement || !focusedElement.closest('.navigation-level-one.sub-menu-visible')) {
        this.setState({
          activeSubmenuVisible: null
        });
      }
    });
  }

  render () {
    let {menusList, isMobile, containsActiveCategory} = this.props;
    let {activeSubmenuVisible} = this.state;
    let navClassName = cssClassName(
      'header-global-navigation ',
      {'active-category ': containsActiveCategory}
    );

    return (
      <nav className={navClassName}>
        <ul className="navigation-bar" role="menubar">
          {menusList.map((category) => {
            return (
              <GlobalNavigationMenu key={category.categoryId} isMobile={isMobile} {...category}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                isSubMenuVisible={category.categoryId === activeSubmenuVisible} />
            );
          })}

          {!isMobile && <ContentSlot contentSlotName="global_header_navigation_bar_after_last_link" role="none" className="navigation-bar-content-slot" />}
        </ul>
      </nav>
    );
  }
}
