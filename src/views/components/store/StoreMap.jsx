/** @module StoreMap
 * @summary a map that shows the location of one store using the Google Maps
 *  Javascript API (https://developers.google.com/maps/documentation/javascript/)
 *
 * Any extra props (i.e., other than <code>coordinates/code>),
 * e.g., <code>className</code>, passed to this component will be passed along
 * to the rendered <code>div</code> that works as the map container.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {requireNamedOnlineModule} from 'util/resourceLoader';

/* global google */      // this comment prevents linting errors

const MAP_DEFAULT_ZOOM_LEVEL = 15;
const MAP_MIN_ZOOM_LEVEL = 3;
const MAP_DEFAULT_LAT_LNG = {lat: 40.963784, lng: -97.2160505};
const METERS_TO_MILES_CONVERTION_RATIO = 0.000621371192;
const CUSTOM_ZOOM_STORES_LIMIT = 100;

class StoreMap extends React.Component {

  static propTypes = {
    /** Stores information */
    storesList: PropTypes.arrayOf(
      PropTypes.shape({
        basicInfo: PropTypes.shape({
          /** store id identifier */
          id: PropTypes.string.isRequired,
          /** store Name */
          storeName: PropTypes.string.isRequired,
          coordinates: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            long: PropTypes.number.isRequired
          })
        }).isRequired
      })
    ).isRequired,
    /**
     * Function to call when the marker for a store is clicked. The funcion
     * will receive one parameter with the store id.
     */
    onStoreMarkerClick: PropTypes.func,
    /** callback to load the stores near certain coordinates */
    loadStoresByLatLng: PropTypes.func,
    /** id of the store on which to center the map */
    centeredStoreId: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.map = null;
    this.markers = [];
    this.refToContainerElement = null;
    this.zoomChangedCounter = 0;
    this.zoomChangedListener = null;
    this.attachToContainerRef = this.attachToContainerRef.bind(this);
    this.updateStoresMarkers = this.updateStoresMarkers.bind(this);
    this.removeStoresMarkers = this.removeStoresMarkers.bind(this);
    this.handleStoreMarkerClick = this.handleStoreMarkerClick.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
  }

  componentWillUpdate (nextProps) {
    if (!this.map) return;

    if (this.props.storesList !== nextProps.storesList) {
      this.removeStoresMarkers();
      this.updateStoresMarkers(nextProps, this.zoomChangedCounter > 0);
    }
  }

  render () {
    let {
      //  not used, but here to prevent inclusion in ...otherProps
      storesList, onStoreMarkerClick, centeredStoreId, loadStoresByLatLng, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    return (
      <div {...otherProps} ref={this.attachToContainerRef}></div>
    );
  }

  // --------------- private methods --------------- //

  getGoogleMapsConfigObject (initialCenterLatLng) {
    return {
      center: initialCenterLatLng,
      scrollwheel: false,
      zoom: MAP_DEFAULT_ZOOM_LEVEL,
      streetViewControl: false,
      mapTypeControl: false
    };
  }

  attachToContainerRef (refToContainerElement) {
    this.refToContainerElement = refToContainerElement;       // remember the DOM element of the map div container

    if (refToContainerElement !== null) {    // can be null for example when React unmounts this components
      requireNamedOnlineModule('google.maps')
      .then(() => {
        let mapsConfig = this.getGoogleMapsConfigObject();
        this.map = new google.maps.Map(refToContainerElement, mapsConfig);
        this.zoomChangedListener = this.map.addListener('zoom_changed', this.handleZoomChanged);
        this.updateStoresMarkers(this.props, false);
      }).catch((err) => {
        console.log('Google Maps Init Failed:', err);
      });
    }
  }

  updateStoresMarkers (props, keepMapZoomAndPosition) {
    let {storesList, centeredStoreId} = props;
    let mapBounds = new google.maps.LatLngBounds();

    // Avoid calling the handleZoomChanged because of programmatic zoom changes
    google.maps.event.removeListener(this.zoomChangedListener);

    // Its possible that no stores are found or on page load the user has his location blocked
    if (storesList.length === 0) {
      this.map.setCenter(MAP_DEFAULT_LAT_LNG);
      this.map.setZoom(MAP_MIN_ZOOM_LEVEL);
      return;
    }

    storesList.forEach((store, index) => {
      let {id, coordinates, storeName} = store.basicInfo;
      let latLngLiteral = {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.long)
      };

      // By default, accomodate only the first 5 nearest stores in the map
      if (index < 5) {
        mapBounds.extend(latLngLiteral);
      }

      let mapMarker = new google.maps.Marker({
        map: this.map,
        position: latLngLiteral,
        title: storeName,
        icon: {
          url: '/wcsstore/static/images/icon-map-pin.png',
          size: new google.maps.Size(33, 50),
          scaledSize: new google.maps.Size(33, 50)
        }
      });

      this.markers.push({
        storeId: id,
        marker: mapMarker
      });

      mapMarker.addListener('click', (event) => {
        event.stop();
        this.handleStoreMarkerClick(id);
      });
    });

    if (!keepMapZoomAndPosition) {
      // Fit the map to only show the stores within bounds, or just center it if
      // there is only one store to show (to avoid too much zoom-in).
      if (storesList.length > 1) {
        this.map.fitBounds(mapBounds);
      } else {
        this.map.setCenter(mapBounds.getCenter());
        this.map.setZoom(MAP_DEFAULT_ZOOM_LEVEL);
      }

      if (centeredStoreId) {
        let centeredStore = storesList.find((store) => store.basicInfo.id === centeredStoreId);
        if (!centeredStore) return;
        let centerCoords = centeredStore.basicInfo.coordinates;
        let latLngLiteral = {
          lat: Number(centerCoords.lat),
          lng: Number(centerCoords.long)
        };
        this.map.setCenter(latLngLiteral);
      }
    }

    this.zoomChangedListener = this.map.addListener('zoom_changed', this.handleZoomChanged);
  }

  removeStoresMarkers () {
    this.markers.forEach((markerItem) => markerItem.marker.setMap(null));
    this.markers.length = 0;
  }

  handleStoreMarkerClick (storeId) {
    this.props.onStoreMarkerClick && this.props.onStoreMarkerClick(storeId);
  }

  handleZoomChanged () {
    if (!this.props.loadStoresByLatLng) {
      return;
    }
    // This fields holds a counter to know whether the storesList has changed due
    // to a zoom change by the user. It's a counter instead of a flag to support
    // rapid multiple changes on the zoom level.
    this.zoomChangedCounter++;
    this.props.loadStoresByLatLng(Promise.resolve(this.map.getCenter()), CUSTOM_ZOOM_STORES_LIMIT, this.getMilesRadius())
      .then(() => this.zoomChangedCounter--).catch(() => this.zoomChangedCounter--);
  }

  getMilesRadius () {
    let bounds = this.map.getBounds();
    let diagonalMeters = google.maps.geometry.spherical.computeDistanceBetween(bounds.getSouthWest(), bounds.getNorthEast());
    let diagonalMiles = diagonalMeters * METERS_TO_MILES_CONVERTION_RATIO;
    return diagonalMiles / 2;
  }

  // --------------- end of private methods --------------- //
}

export {StoreMap};
