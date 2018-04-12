/**
 * @module NavigationFooter
 * @author Florencia Acosta
 * @author Miguel Alvarez Igarzábal
 * Renders the footer navigation menu, including the SignInToNewsletter
 * component.
 *
 * Usage:
 *  var NavigationFooter = require("./navigationFooter.jsx");
 *
 *  <NavigationFooter footerNavigation=[arrayOf(object)] isMobile=[bool] />
 *
 * Style (ClassName) Elements description/enumeration
 *  footer-navigation
 *
 * Uses:
 *  <TrackOrderContainer />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {TrackOrderContainer} from 'views/components/trackorder/TrackOrderContainer.js';
import {TrackReservationContainer} from 'views/components/trackorder/TrackReservationContainer.js';
import {NewsletterSignupFormContainer} from './NewsletterSignupFormContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.footer-navigation.scss');
}

class NavigationFooter extends React.Component {
  static propTypes = {
    /**
     * Array with footer menu links.
     */
    footerNavigation: PropTypes.arrayOf(PropTypes.shape({
      activeNavigation: PropTypes.bool.isRequired,
      titleList: PropTypes.string.isRequired,
      image: PropTypes.string,
      imghref: PropTypes.string,
      links: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        classAttr: PropTypes.string,
        href: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      })).isRequired
    })).isRequired,

    /**
     * whether the component should render targeting mobile.
     */
    isMobile: PropTypes.bool,

    globalSignalsOperator: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);

    this.handleToggleCategory = this.handleToggleCategory.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleLoginDrawer = this.handleLoginDrawer.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleWishlistLoginDrawer = this.handleWishlistLoginDrawer.bind(this);
  }

  handleToggleCategory (e) {
    e.target.classList.toggle('list-navigation-open');
  }

  handleCreateAccount () {
    this.props.globalSignalsOperator.openCreateAccountDrawer();
  }

  handleLoginDrawer () {
    this.props.globalSignalsOperator.openLoginDrawer();
  }

  handleLogout () {
    this.props.onSubmitLogout();
  }

  handleWishlistLoginDrawer () {
    this.props.globalSignalsOperator.openWishlistLoginDrawer();
  }

  render () {
    let {footerNavigation, isMobile} = this.props;

    return (
      <nav className="footer-navigation container-viewport" >

        {isMobile && <NewsletterSignupFormContainer isMobile />}

        {footerNavigation.map((submenu, index) => {
          let { id, titleList, image, links, imghref } = submenu;
          let containerClassName = cssClassName(
            'list-navigation ',
            {
              'navigation-with-promo': image
            });

          id = id || titleList.replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, '');

          return (
            <div key={id} className={containerClassName}>
              <h4 className={isMobile ? 'title-item-category' : ''} onClick={isMobile ? this.handleToggleCategory : null}>{titleList}</h4>

              <div className="container-navigation">
                {image && <a href={imghref} aria-label={titleList}>
                  <img className="navigation-with-promo-image" alt="" src={image} />
                </a>}

                {links.map((link) => {
                  let {classAttr, id, title, href} = link;

                  id = id || title.replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, '');

                  if (classAttr === 'track-order') {
                    return <TrackOrderContainer key={id} title={title} isMobile={isMobile} />;
                  } else if (classAttr === 'log-out') {
                    return <button onClick={this.handleLogout} key={id} data-id={id} title={title} className={'item-navigation-link ' + classAttr} >{title}</button>;
                  } else if (classAttr === 'track-reservation') {
                    return <TrackReservationContainer key={id} title={title} isMobile={isMobile} modalTitle="Track Reservation" modalSubtitle="Enter your email address and you reservation number" orderNumberLabel="Reservation number" />;
                  } else if (classAttr === 'create-account') {
                    return <button onClick={this.handleCreateAccount} key={id} data-id={id} title={title} className={'item-navigation-link ' + classAttr} >{title}</button>;
                  } else if (classAttr === 'check-point-balance' || classAttr === 'redeem-rewards' || classAttr === 'my-account') {
                    return <button onClick={this.handleLoginDrawer} key={id} data-id={id} title={title} className={'item-navigation-link ' + classAttr} >{title}</button>;
                  } else if (classAttr === 'wishlist') {
                    return <button onClick={this.handleWishlistLoginDrawer} key={id} data-id={id} title={title} className={'item-navigation-link'} >{title}</button>;
                  } else {
                    return <a key={id} data-id={id} href={href} title={title} className={'item-navigation-link ' + (classAttr || '')}>{title}</a>;
                  }
                })}
              </div>
            </div>
          );
        })}

        {!isMobile && <NewsletterSignupFormContainer isMobile={isMobile} />}
      </nav>
    );
  }
}

export {NavigationFooter};
