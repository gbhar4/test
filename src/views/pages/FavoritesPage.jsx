/**
* @author Gabriel Gomez
* @summary this is the page that renders all wishlist items and its functionalities.
* The page taxonomy is as follows:
  FavoritesPage:
  Global Header
  Favorites
    Favorites-toolbar
      Favorites-bar-top-read-only (WL Name)
      Favortite-bar-top (WL Name, WL switching, WL creation and some sharing functionality)
        - WL dropdown
        - Gear Button (Edits/Deletes current selected WL)
        - Share dropdown
      Favortite-bar-bottom (Products: filtering and sorting)
        - Filters
        - # WL items
        - Sort By dropdown
    A. Empty-state: e-spot
    B. Wishlist (It gets information about filter and sort and it renders a list of WL item(s))
      - WL Item (reusing Item from PLP + reuse functionality from QV)
      Low level component that wraps
        - Create WL modal (Generic Modal: Title + Close + Content) - Which render a create WL Form
        - Update WL modal

  Recommendations (Won't be available until Adobe integration is concluded)
  Global Footer
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {FavoritesContainer} from 'views/components/favorites/FavoritesContainer';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';

export class FavoritesPage extends React.Component {

  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** flag to show whether the page is loading */
    isLoading: PropTypes.bool.isRequired
  };

  render () {
    let {isMobile, isLoading} = this.props;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <FavoritesContainer />

        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }
}
