import React from 'react';
import formatTime from 'util/formatTime';
import {parseDate} from 'util/parseDate.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {buildStorePageUrlSuffix} from 'reduxStore/storeViews/storesStoreView';

export function DirectionsLink (props) {
  let getDirections = 'https://maps.google.com/maps?daddr=' +
  props.basicInfo.address.addressLine1 + ',%20' +
  props.basicInfo.address.city + ',%20' +
  props.basicInfo.address.state + ',%20' +
  props.basicInfo.address.zipCode;

  return <a className="button-directions" href={getDirections} target="_blank">Get directions</a>;
}

export function DistanceAndOpenTodayUntil (props) {
  return (
    <p className="distance-and-open-information">
      <DistanceFromMe distance={props.distance} />
      <br />
      {props.hours && <OpenTodayUntil hours={props.hours} />}
    </p>
  );
}

function closingHours (storeHours, date) {
  let hours = storeHours.find((storeHour) => {
    let openingHour = parseDate(storeHour.openIntervals[0].fromHour);

    return date.getFullYear() === openingHour.getFullYear() && date.getMonth() === openingHour.getMonth() && date.getDate() === openingHour.getDate();
  });

  // It could be an interval (array.length > 1) but we don't have comps, so showing the last one
  return hours && hours.openIntervals[hours.openIntervals.length - 1].toHour;
}

export function OpenTodayUntil (props) {
  let {hours: {regularHours}} = props;

  let today = new Date();
  let closingTime = closingHours(regularHours, today);

  return ((closingTime || null) && <span className="today-schedule">Open until {formatTime(closingTime)}</span>);
}

export function OpenUntilNextTwoDays (props) {
  let {hours} = props;

  if (!hours) {
    return null;
  }

  let {regularHours} = hours;
  let today = new Date();
  let todayClosingTime = closingHours(regularHours, today);

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let tomorrowClosingTime = closingHours(regularHours, tomorrow);

  return todayClosingTime
    ? (
      <span className="extended-schedule">
        Open until {formatTime(todayClosingTime)}
        {(tomorrowClosingTime || null) && <span><br />Open tomorrow until {formatTime(tomorrowClosingTime)}</span>}
      </span>
    )
    : null;
}

export function DistanceFromMe (props) {
  let {distance} = props;
  return distance && distance !== -1
    ? <span className="distance-container">{distance} miles away from you</span>
    // note that the anchor element does nothing and should have been a spinner if the comps were better.
    // negative distance indicate that distance could not be calculated (usually since geolocation is turned off in browser)
    : distance !== -1 && <a className="calculate-distance-button">Calculate distance from me</a>;
}

export function SetAsFavoriteButton (props) {
  let {isFavoriteStore, isMobile, onSetAsFavorite} = props;
  let favoriteSelectedClass = cssClassName('favorite-store-indicator ', { 'button-secondary': isMobile });
  let setFavoriteSelectedClass = cssClassName('button-set-as-favorite ', { 'button-secondary': isMobile });
  return isFavoriteStore
    ? (<strong className={favoriteSelectedClass}>Your Favorite Store</strong>)
    : (<button className={setFavoriteSelectedClass} onClick={onSetAsFavorite}>Set as Favorite Store</button>);
}

export function StoreTitle (props) {
  let {basicInfo, isStoreNameLink, isMobile} = props;
  let storeUrlSuffix = buildStorePageUrlSuffix(basicInfo);

  let StoreNameElem = isStoreNameLink
    ? <HyperLink destination={PAGES.storeDetails} pathSuffix={storeUrlSuffix}>{basicInfo.storeName}</HyperLink>
    : basicInfo.storeName;

  return (
    isMobile
      ? <h1 className="store-name" itemProp="name">{StoreNameElem}</h1>
      : <h2 className="store-name" itemProp="name">{StoreNameElem}</h2>
  );
}

export function StoreAddress (props) {
  let {basicInfo} = props;
  return (
    <address className="store-address">
      {basicInfo.address.addressLine1} <br />
      {basicInfo.address.city}, {basicInfo.address.state}, {basicInfo.address.zipCode}
    </address>
  );
}

export function StorePhone (props) {
  return (<p className="store-phone-number">{props.basicInfo.phone}</p>);
}

export function ViewStoreDetailsButton (props) {
  let storeUrlSuffix = buildStorePageUrlSuffix(props.basicInfo);
  return (
    <HyperLink destination={PAGES.storeDetails} pathSuffix={storeUrlSuffix} className="button-see-store-details">See store details</HyperLink>
  );
}

export function StoreFeatures (props) {
  let {features} = props;
  return (
    <p className="features-store">
      <span className={`${features.storeType.toLowerCase()}-store`}>
        {features.storeType}
      </span>
    </p>
  );
}
