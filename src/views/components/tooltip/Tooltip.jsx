/**

Component description: Wrapping for all tooltips

Usage:
import {Tooltip} from 'views/components/pages/Tooltip.jsx';
<Tooltip title="[string]">
	[html content]
</Tooltip>

Component Props description/enumaration:
  Title: el titulo a mostrar en el header del tooltip

Style (ClassName) Elements description/enumeration
	.tooltip-container: wrap de todo el tooltip(incluido el background en fixed)
	.tooltip-content: wrap solo del contenido que va a tener un tooltip especifico
	.button-tooltip-close: es la clase utilizada para el boton que cierra el tooltip
*/

import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName';

export class Tooltip extends React.Component {

  constructor (props) {
    super(props);
    this.captureDialogRef = this.captureDialogRef.bind(this);
  }

  focusTooltip () {
    // Only focus if ref was successfully set
    if (this.dialog) {
      this.dialog.focus();
    }
  }

  captureDialogRef (ref) {
    this.dialog = ref;
    this.focusTooltip();
  }

  render () {
    let {directionClass, children, title} = this.props;
    let containerBoxClass = cssClassName('tooltip-container ', (title ? 'tooltip-container-with-title ' : ''), directionClass);
    let accessibleLabel = title ? `${title} Tooltip` : 'Tooltip';

    return (
      <div role="region" className={containerBoxClass} aria-label={accessibleLabel} tabIndex="0" ref={this.captureDialogRef}>
        <div className="tooltip-content">
          {title && <h3>{title}</h3>}
          {children}
          <div>
            <button className="button-tooltip-close" aria-label="Close tooltip" />
          </div>
        </div>
      </div>

    );
  }
}
