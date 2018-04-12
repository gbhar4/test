/**
 * @author Michael Citro
 * @summary This is used when we need to know if the component as mounted on the browser. 
 *          We can not rely on window flag due to Client Hydration errors. The Child of this
 *          Component should NOT overwrite the componentDidMount funciton.
 */
import React from 'react';
import { isTouchClient, isClient } from 'routing/routingHelper';

export class ServerToClientRenderPatch extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      isTouchClient: false, // NodeJs will render First, we will not know if its touch client or not
      isBrowserClient: false // NodeJs will render First, we will not know if its Browser client or Node JS
    };
  }

  componentDidMount () {
    if (isClient() && !this.state.isBrowserClient) {
      if (isTouchClient() && !this.state.isTouchClient) {
        this.setState({ isTouchClient: true, isBrowserClient: true });
      } else {
        this.setState({ isBrowserClient: true });
      }
    }
  }

}
