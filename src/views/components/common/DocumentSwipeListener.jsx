/**
* Component: DocumentSwipeListener
* Helper component to detect swipes on touch devices
*
* @author Agu
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {getPositionFromEvent} from 'util/viewUtil/getPositionFromEvent.js';

class DocumentSwipeListener extends React.Component {
  static propTypes = {
    // all optional, the callbacks to trigger whenever a swipe happens
    onSwipeLeft: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipeUp: PropTypes.func,
    onSwipeDown: PropTypes.func,

    swipeOffset: PropTypes.number
  }

  static defaultProps = {
    swipeOffset: 50
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      touchStartPositionX: null,
      touchStartPositionY: null,
      touchMovePositionX: null,
      touchMovePositionY: null
    };

    this.bindSwipeDetect = this.bindSwipeDetect.bind(this);
    this.clearSwipeDetect = this.clearSwipeDetect.bind(this);
    this.captureSwipe = this.captureSwipe.bind(this);
    this.detectSwipe = this.detectSwipe.bind(this);

    this.bindSwipeDetect();
  }

  componentWillUnmount () {
    this.clearSwipeDetect();
  }

  bindSwipeDetect () {
    document.addEventListener('touchstart', this.captureSwipe);
    document.addEventListener('touchmove', this.captureSwipe);
    document.addEventListener('touchend', this.detectSwipe);
  }

  clearSwipeDetect () {
    document.removeEventListener('touchstart', this.captureSwipe);
    document.removeEventListener('touchmove', this.captureSwipe);
    document.removeEventListener('touchend', this.detectSwipe);
  }

  captureSwipe (event) {
    let position = getPositionFromEvent(event);

    this.setState({
      touchStartPositionX: this.state.touchStartPositionX === null ? position.left : this.state.touchStartPositionX,
      touchStartPositionY: this.state.touchStartPositionY === null ? position.top : this.state.touchStartPositionY,
      touchMovePositionX: position.left,
      touchMovePositionY: position.top
    });
  }

  detectSwipe (event) {
    let diffX = this.state.touchStartPositionX - this.state.touchMovePositionX;
    let diffY = this.state.touchStartPositionY - this.state.touchMovePositionY;

    let isSwipeX = Math.abs(diffX) >= this.props.swipeOffset;
    let isSwipeY = Math.abs(diffY) >= this.props.swipeOffset;

    this.setState({
      touchStartPositionX: null,
      touchStartPositionY: null,
      touchMovePositionX: null,
      touchMovePositionY: null
    });

    if (isSwipeX && !isSwipeY) {
      if (diffX > 0) {
        this.props.onSwipeLeft && this.props.onSwipeLeft(diffX);
      } else {
        this.props.onSwipeRight && this.props.onSwipeRight(diffX);
      }
    } else if (!isSwipeX && isSwipeY) {
      if (diffY > 0) {
        this.props.onSwipeUp && this.props.onSwipeUp(diffY);
      } else {
        this.props.onSwipeDown && this.props.onSwipeDown(diffY);
      }
    }
    // else, not a swipe, some random movement
  }

  render () {
    return null;
  }
}

export {DocumentSwipeListener};
