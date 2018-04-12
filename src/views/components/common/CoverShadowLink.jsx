import React from 'react'; // eslint-disable-line no-unused-vars
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.cover-shadow-link.scss');
} else {
  require('./_m.cover-shadow-link.scss');
}

export function CoverShadowLink (props) {
  let {children, redirectLink, isMobile} = props;
  let className = cssClassName(isMobile ? 'regular-item-link ' : 'cover-shadow-link ', props.className);

  return (
    <a className={className} href={redirectLink}>
      <div className="cover-shadow-content">
        {children}
      </div>
    </a>
  );
}
