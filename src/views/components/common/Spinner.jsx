import React from 'react'; // eslint-disable-line no-unused-vars
import cssClassName from 'util/viewUtil/cssClassName';
require('./_loading.scss');

export function Spinner (props) {
  let {children, className} = props;
  let spinnerClassName = cssClassName('general-loading ', className);

  return <div className={spinnerClassName}>
    <div className="general-loading-content">
      <CustomSpinnerIcon />
      {children || 'Loading...'}
    </div>
  </div>;
}

export function CustomSpinnerIcon (props) {
  let {className} = props;
  let iconClassName = cssClassName('custom-loading-icon ', className);
  return <i className={iconClassName}>Spinner</i>;
}

export function SpinnerIcon (props) {
  let {className} = props;
  let iconClassName = cssClassName('loading-icon ', className);
  return <i className={iconClassName}>Loading...</i>;
}
