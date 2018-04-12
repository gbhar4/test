/** @module Router
 * @summary A replacement for Router in react-router.
 *
 * Note: never use the react-router Router component! Use this component instead.
 * See the <code>Route</code> component in this folder for more info on why we need this.
 *
 * This component injects a method to read the current location and route into context.router.
 *
 * @author Ben
 */
import {Router as BlockableRouter} from 'react-router';

export class Router extends BlockableRouter {

  getChildContext () {
    return {
      router: {
        ...super.getChildContext().router,
        getAncestorRoute: () => ({
          location: this.props.history.location,
          match: this.state.match
        })
      }
    };
  }

}
