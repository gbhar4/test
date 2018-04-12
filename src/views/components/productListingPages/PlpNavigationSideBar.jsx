/**
 * @module PLPNavigationSideBar
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {FixedBreadCrumbs} from 'views/components/common/routing/FixedBreadCrumbs.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-listing-non-empty.scss');
} else {
  require('./_m.product-listing-non-empty.scss');
}

export const BASIC_SUBCATEGORY_TREE_PROP_TYPES = PropTypes.shape({
  /** unique id to which the category is saved in the backend, it's unclear why it's saved yet */
  categoryId: PropTypes.string.isRequired,
  /** naming representation to the category */
  name: PropTypes.string.isRequired,
  /** full path to relevant page */
  plpPath: PropTypes.string.isRequired
});

export class PlpNavigationSideBar extends React.Component {
  static propTypes = {
    /**
     * Array describing the L2 links. Every entry in this array represents a
     * single L2 column. Each column is an array of pairs, and each pair
     * contains a link's text and URL.
     */
    navitagionTree: PropTypes.arrayOf(PropTypes.shape({
      BASIC_SUBCATEGORY_TREE_PROP_TYPES,
      children: PropTypes.arrayOf(BASIC_SUBCATEGORY_TREE_PROP_TYPES)
    })).isRequired,

    /** Flag use to match which is the active category to be 'opened', if it's a L3 opens its whole brach including it's father */
    activeCategoryId: PropTypes.string.isRequired,

    /** all the information required to render the breadcrums component */
    breadcrumbs: FixedBreadCrumbs.propTypes.crumbs
  };

  /** need to wrap nativation with route,  */

  /** method returns whether the category L2 is active */

  constructor (props) {
    super(props);
    this.handle = (event) => {};
    // this.handleToggleOpen = this.handleToggleOpen.bind(this);
  }

  render () {
    let {isMobile, navitagionTree, activeCategoryId} = this.props;

    if (isMobile) {
      return null; // FIXME: this is temporary for delviery of 8/6
    }

    return (
      <div className="inline-navigation-container">
        <ol className="navigation-level-one-container">
          {navitagionTree.map((item) => {
            let isActive = item.categoryId === activeCategoryId || !!item.children.find((subcategory) => subcategory.categoryId === activeCategoryId);
            let elementClassName = cssClassName('navigation-level-one-item ', { 'inline-navigation-active': isActive });

            return (<li className={elementClassName} key={item.categoryId}>
              <a href={item.plpPath}>{item.name}</a>

              {isActive && <ul className={cssClassName('navigation-level-two-container ', {'open-navigation-level-two': isActive})}>
                {item.children.map((subcategory) => {
                  let isActive = subcategory.categoryId === activeCategoryId;
                  let elementClassName = cssClassName('navigation-level-two-item ', { 'inline-subnavigation-active': isActive });
                  return (<li className={elementClassName} key={subcategory.categoryId}>
                    <a href={subcategory.plpPath}>{subcategory.name}</a>
                  </li>);
                })}
              </ul>}
            </li>);
          })}
        </ol>
      </div>
    );
  }
}
