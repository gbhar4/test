/**
 * @author Agu
 */
import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {MyBagContainer} from 'views/components/shoppingCart/MyBagContainer.jsx';
import {AuthModalContainer} from 'views/components/login/AuthModalContainer.js';
import {ContentSlotModalsRendererContainer} from 'views/components/common/contentSlot/ContentSlotModalsRendererContainer';

export class CartPage extends React.Component {
  render () {
    return (
      <div>
        <HeaderGlobalSticky isMobile={this.props.isMobile} />

        <main className="main-section-container checkout-container">
          <MyBagContainer />
        </main>

        <ContentSlotModalsRendererContainer />
        <AuthModalContainer />
      </div>
    );
  }
}
