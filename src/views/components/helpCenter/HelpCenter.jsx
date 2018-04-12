/**
* @module Help Center
* @summary
* @author Oliver Ramirez
* @author Agu
**/

import React from 'react';
import {PropTypes} from 'prop-types';
// import {HelpCenterNavigationContainer} from 'views/components/helpCenter/menu/HelpCenterNavigationContainer.js';
// import {SearchHelpCenter} from 'views/components/helpCenter/SearchHelpCenter.jsx';
import {ContactUs} from 'views/components/helpCenter/ContactUs.jsx';
// import {HelpCenterTopicList} from 'views/components/helpCenter/HelpCenterTopicList.jsx';
import {ContentSlotList} from 'views/components/common/contentSlot/ContentSlotList.jsx';
import {DOMAccordionToggleTrigger} from 'views/components/accordion/DOMAccordionToggleTrigger.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {isClient} from 'routing/routingHelper';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';

const CONTENT_SLOTS_MEMBERS = [
  {contentSlotName: 'help_center'}
];

if (DESKTOP) { // eslint-disable-line
  require('views/components/helpCenter/menu/_d.help-center-navigation.scss');
  require('./_d.help-center.scss');
} else {
  require('views/components/helpCenter/menu/_m.help-center-navigation.scss');
  require('./_m.help-center.scss');
}

/**
 * helper method to locate the section and subsection specified in the url
 **/
function getSectionAndSubsectionFromURL () {
  let sectionId = (document.location.hash || '').split('#').pop();
  let subSectionElement = document.querySelector('section #' + sectionId);

  if (subSectionElement) {
    // locate section
    let subSectionId = sectionId;
    let sectionElement = subSectionElement;
    while (sectionElement && sectionElement.className.indexOf('container-info-topic') < 0) {
      sectionElement = sectionElement.parentNode;
    }

    return {
      sectionId: sectionElement.id,
      subSectionId
    };
  } else {
    return {
      sectionId: sectionId,
      subSectionId: null
    };
  }
}

export class HelpCenter extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context);

    this.activateSection = this.activateSection.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);

    if (isClient()) {
      window.addEventListener('hashchange', this.handleHashChange, true);
      this.handleHashChange();
    }
  }

  componentWillUnmount () {
    if (isClient()) {
      window.removeEventListener('hashchange', this.handleHashChange, true);
    }
  }

  componentDidMount () {
    if (isClient()) {
      this.handleHashChange();
    }
  }

  handleHashChange () {
    if (document.location.hash && document.getElementById(document.location.hash.split('#').pop())) {
      this.activateSection(getSectionAndSubsectionFromURL());
    } else {
      let activeElement = document.querySelector('.help-center-section .container-info-topic');
      activeElement && this.activateSection({
        sectionId: activeElement.id
      });
    }
  }

  activateSection ({sectionId, subSectionId}) {
    [].forEach.call(document.querySelectorAll('.help-center-section .hc-link'), (linkElement) => {
      linkElement.className = 'hc-link';
    });

    [].forEach.call(document.querySelectorAll(".help-center-section [href='#" + sectionId + "']"), (linkElement) => {
      if (linkElement.className.indexOf('hc-link') > -1) {
        linkElement.className = 'hc-link hc-link-selected';
      }
    });

    [].forEach.call(document.querySelectorAll('.help-center-section .container-info-topic'), (section) => {
      section.className = 'container-info-topic';
    });

    document.getElementById(sectionId).className = 'container-info-topic container-info-topic-active';
    subSectionId && this.activateSubSection(subSectionId);
  }

  activateSubSection (subSectionId) {
    let expandedSections = document.getElementsByClassName('accordion-expanded');

    if (expandedSections.length) {
      for (let index in Object.keys(expandedSections)) {
        if (expandedSections[index]) {
          expandedSections[index].className = 'accordion';
        }
      }
    }

    document.querySelector('#' + subSectionId + ' > .accordion').className = 'accordion accordion-expanded';
  }

  render () {
    let {isMobile} = this.props;
    let headerClassName = cssClassName(
      'help-center-content ',
      {'viewport-container ': !isMobile}
    );

    let viewportClassName = cssClassName(
      {'viewport-container ': !isMobile}
    );

    return (
      <div ref={this.captureContainerDivRef} className="help-center-section">
        <div className="header-hc help-center-header">
          <div className={headerClassName}>
            {!isMobile && <HyperLink destination={PAGES.homePage} className="continue-shopping continue-shopping-link">Continue Shopping</HyperLink>}
            <h1 className="title-help title-help-center">Help Center</h1>
            {/* <SearchHelpCenter /> */}
          </div>
        </div>

        <DOMAccordionToggleTrigger />
        <LocationChangeTrigger onLocationChange={this.handleHashChange} />
        <ContentSlotList className={viewportClassName} contentSlots={CONTENT_SLOTS_MEMBERS} />

        {/*
        <div>
          <ul className="hc-navigation">
            <li className="help-center-item"><a className="hc-link" href="#" title="help-with-my-order">Help with my Order</a>
            </li>
            <li className="help-center-item"><a className="hc-link hc-link-selected" href="#" title="online-ordering">Online Ordering</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="my-place-rewards">My Place Rewards</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="policies">Policies</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="shipping-to-the-us">Shipping to the U.S.</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="ordering-from-canada">Ordering from Canada</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="my-place-credit-card">My Place Credit Card</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="coupons-and-promotions">Coupons and Promotions</a>
            </li>
            <li className="help-center-item"><a className="hc-link" href="#" title="contact-us">Contact us</a>
            </li>
          </ul>

          <section className="container-info-topic">
            <ul className="container-topics">
              <li>
                <div className="accordion">
                  <h4 data-accordion-toggle="true">
                    Shopping Bag
                    <button className="accordion-toggle" title="Toggle Shopping Bag"></button>
                  </h4>

                  <section className="accordion-element">FPO CONTENT TO TEST ACCORDION SUPPORT</section>
                </div>
              </li>

              <li>
                <div className="accordion accordion-expanded">
                  <h4 data-accordion-toggle="true">
                    Login/password issues
                    <button className="accordion-toggle" title="Toggle Shopping Bag"></button>
                  </h4>

                  <section className="accordion-element">FPO CONTENT TO TEST ACCORDION SUPPORT</section>
                </div>
              </li>
            </ul>
          </section>
        </div> */}

        <ContactUs className={viewportClassName} />
      </div>
    );
  }
}
