/**
 * @module StoreLocatorListItem
 * TODO
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {
  StoreTitle,
  StoreAddress,
  StorePhone,
  StoreFeatures,
  ViewStoreDetailsButton,
  SetAsFavoriteButton,
  DistanceFromMe,
  DirectionsLink
} from 'views/components/store/detail/StoreSummaryComponents.jsx';
import {StoreOpenHours} from 'views/components/store/detail/StoreOpenHours.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import formatTime from 'util/formatTime.js';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';

export const STORE_ID_DATA_ATTRIBUTE = 'data-store-id';

export class StoreLocatorListItem extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /** Indicates the "set as defailt store" feature is enabled or not */
    isEnableSetAsDefault: PropTypes.bool,
    /** The whole information of the store. */
    store: STORE_SUMMARY_PROP_TYPES_SHAPE,
    /** Flags if the store should be shown as the selected one */
    isSelected: PropTypes.bool.isRequired,
    /** Flags if we are in mobile */
    isMobile: PropTypes.bool.isRequired,
    /**
     * Function to call to set the store as the default one for the user. The
     * called function will receive one parameter, the id of the store.
     */
    onSetAsFavorite: PropTypes.func.isRequired,
    /**
     * Function to call when the store is clicked. The called function will
     * receive one parameter, the id of the clicked store.
     */
    onClick: PropTypes.func,

    /** Flags if the store is the user's favorite one */
    isFavoriteStore: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.state = {isExpandedDetails: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleSetAsDefault = this.handleSetAsDefault.bind(this);
    this.handleExpandedDetails = () => { this.setState({isExpandedDetails: !this.state.isExpandedDetails}); };
    this.setError = getSetErrorInStateMethod(this);
  }

  handleClick () {
    let {onClick, store: {basicInfo: {id: storeId}}} = this.props;
    onClick && onClick(storeId);
  }

  handleSetAsDefault () {
    let {onSetAsFavorite, store: {basicInfo: {id: storeId}}} = this.props;
    onSetAsFavorite && onSetAsFavorite(storeId).then(() => this.setError()).catch((err) => this.setError(err));
  }

  renderOpenHours () {
    let {store: {hours}, isMobile} = this.props;
    let {isExpandedDetails} = this.state;
    isExpandedDetails = isMobile ? isExpandedDetails : false;
    let title = isMobile ? null : (hours.regularHours[0] && hours.regularHours[0].isClosed ? 'Closed' : 'See store hours');

    return (
      <div className="time-schedules">
        <StoreOpenHours isCardItem isInitiallyExpanded={false} isSelfExpandable={!isMobile}
          isMobile={isMobile}
          isExpandedDetails={isExpandedDetails} title={title}
          openHours={hours.regularHours} sectionClassName="regular-time-schedules" />
      </div>
    );
  }

  renderDesktop (className) {
    let {store: {basicInfo, distance, features}, isFavoriteStore, isMobile, isEnableSetAsDefault} = this.props;
    let {error} = this.state;
    let dataAttributes = {[STORE_ID_DATA_ATTRIBUTE]: basicInfo.id};

    return (
      <div className={className} itemScope itemType="http://schema.org/ClothingStore" {...dataAttributes} >
        <StoreTitle basicInfo={basicInfo} />

        {error && <ErrorMessage error={error} />}
        {/** removing isGuest verification as per DT-25648 but I feel this will eventually be updated again */}
        {isEnableSetAsDefault && <SetAsFavoriteButton isFavoriteStore={isFavoriteStore} isMobile={isMobile} onSetAsFavorite={this.handleSetAsDefault} />}
        <div className="content-direction">
          <DistanceFromMe distance={distance} />
          <StoreAddress basicInfo={basicInfo} />
          <DirectionsLink basicInfo={basicInfo} />
        </div>
        <div className="content-store-detail">
          <StoreFeatures features={features} />
          <StorePhone basicInfo={basicInfo} />
          <ViewStoreDetailsButton basicInfo={basicInfo} />
        </div>
        {this.renderOpenHours()}
      </div>
    );
  }

  renderMobile (className) {
    let {store: {basicInfo, distance, features}, isFavoriteStore, isMobile, isEnableSetAsDefault} = this.props;
    let {isExpandedDetails} = this.state;
    let buttonExpandedClass = cssClassName('button-expanded-details ', {'expanded': isExpandedDetails});
    let {error} = this.state;
    let dataAttributes = {[STORE_ID_DATA_ATTRIBUTE]: basicInfo.id};

    return (
      <div className={className} itemScope itemType="http://schema.org/ClothingStore" {...dataAttributes} >
        <StoreTitle basicInfo={basicInfo} isMobile />

        {error && <ErrorMessage error={error} />}
        <DistanceFromMe distance={distance} />
        <StoreAddress basicInfo={basicInfo} />
        {isExpandedDetails && <DirectionsLink basicInfo={basicInfo} />}
        {this.renderOpenHours()}
        <StoreFeatures features={features} />

        {isExpandedDetails && <div className="container-more-details">
          <StorePhone basicInfo={basicInfo} />
          <ViewStoreDetailsButton basicInfo={basicInfo} />
        </div>}

        {/* same issue that Desktop, DT-27094 */}
        {isExpandedDetails && isEnableSetAsDefault && <SetAsFavoriteButton isFavoriteStore={isFavoriteStore} isMobile={isMobile} onSetAsFavorite={this.handleSetAsDefault} />}

        {!isExpandedDetails
          ? <button onClick={this.handleExpandedDetails} className={buttonExpandedClass}>View details</button>
          : <button onClick={this.handleExpandedDetails} className={buttonExpandedClass}>Hide details</button>}
      </div>
    );
  }

  render () {
    let {isMobile, isSelected} = this.props;
    let className = cssClassName('store-info-data-detailed-list-item', {' selected': isSelected});

    return (
      <div className="store-info-content" onClick={this.handleClick}>
        {/** TODO: style selected store */}
        {isMobile
          ? this.renderMobile(className)
          : this.renderDesktop(className)
        }
      </div>
    );
  }
}
